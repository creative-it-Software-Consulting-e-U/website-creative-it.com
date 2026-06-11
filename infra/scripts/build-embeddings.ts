#!/usr/bin/env ts-node
/**
 * Embedding-Build: liest Markdown-Quellen, chunked sie, embedded jeden Chunk
 * via Bedrock Titan v2 und schreibt eine einzige JSON-Datei.
 *
 * Aufruf:
 *   AWS_PROFILE=... npx ts-node scripts/build-embeddings.ts
 *
 * Output: infra/embeddings/embeddings.json
 */

import * as fs from "fs";
import * as path from "path";
import { createHash } from "crypto";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const REGION = process.env.AWS_REGION ?? "eu-central-1";
const EMBED_MODEL_ID = "amazon.titan-embed-text-v2:0";
const EMBED_DIMENSIONS = 1024;

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const COMPANY_INFO_DIR = path.join(REPO_ROOT, "infra", "knowledge-base");
const BLOG_DIR = path.join(REPO_ROOT, "src", "content", "blog");
const OUTPUT_DIR = path.join(REPO_ROOT, "infra", "embeddings");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "embeddings.json");

const BLOG_BASE = "https://www.creative-it.com/blog";

// Approximate token cap per chunk (Titan max 8192 tokens, but smaller chunks
// give more granular retrieval). ~3.5 chars per token rule of thumb.
const MAX_CHUNK_CHARS = 1800;

interface RawDoc {
  source: string;
  url: string;
  title: string;
  body: string;
}

interface Chunk {
  id: string;
  source: string;
  url: string;
  title: string;
  text: string;
}

interface EmbeddedChunk extends Chunk {
  vector: number[];
}

const bedrock = new BedrockRuntimeClient({ region: REGION });

function stripFrontmatter(md: string): { meta: Record<string, string>; body: string } {
  const match = md.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { meta: {}, body: md };
  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const [k, ...rest] = line.split(":");
    if (k && rest.length) meta[k.trim()] = rest.join(":").trim().replace(/^"|"$/g, "");
  }
  return { meta, body: md.slice(match[0].length) };
}

function loadCompanyDocs(): RawDoc[] {
  const docs: RawDoc[] = [];
  if (!fs.existsSync(COMPANY_INFO_DIR)) return docs;
  for (const file of fs.readdirSync(COMPANY_INFO_DIR)) {
    if (!file.endsWith(".md")) continue;
    const full = path.join(COMPANY_INFO_DIR, file);
    const raw = fs.readFileSync(full, "utf-8");
    docs.push({
      source: file,
      url: "https://www.creative-it.com",
      title: file.replace(/\.md$/, ""),
      body: raw,
    });
  }
  return docs;
}

function loadBlogDocs(): RawDoc[] {
  const docs: RawDoc[] = [];
  if (!fs.existsSync(BLOG_DIR)) return docs;
  for (const file of fs.readdirSync(BLOG_DIR)) {
    if (!file.endsWith(".md")) continue;
    const full = path.join(BLOG_DIR, file);
    const raw = fs.readFileSync(full, "utf-8");
    const { meta, body } = stripFrontmatter(raw);
    const slug = file.replace(/\.md$/, "");
    docs.push({
      source: `blog/${file}`,
      url: `${BLOG_BASE}/${slug}/`,
      title: meta.title || slug,
      body,
    });
  }
  return docs;
}

/**
 * Splits a markdown body into chunks at heading boundaries (## or ###).
 * Headings smaller than MAX_CHUNK_CHARS are kept whole; oversized sections
 * fall back to paragraph-level splitting.
 */
function chunkMarkdown(doc: RawDoc): Chunk[] {
  const sections = doc.body.split(/(?=^##\s)/m).filter((s) => s.trim().length > 0);
  const chunks: Chunk[] = [];

  for (const section of sections) {
    const headingMatch = section.match(/^##\s+(.+)$/m);
    const sectionTitle = headingMatch ? headingMatch[1].trim() : doc.title;

    if (section.length <= MAX_CHUNK_CHARS) {
      chunks.push({
        id: makeId(doc.source, sectionTitle, chunks.length),
        source: doc.source,
        url: doc.url,
        title: sectionTitle,
        text: `${doc.title} — ${sectionTitle}\n\n${section.trim()}`,
      });
      continue;
    }

    // Section too big: split by paragraphs, accumulate up to MAX_CHUNK_CHARS
    const paragraphs = section.split(/\n\n+/);
    let buffer = "";
    let partIndex = 0;
    for (const para of paragraphs) {
      if (buffer.length + para.length + 2 > MAX_CHUNK_CHARS && buffer.length > 0) {
        chunks.push({
          id: makeId(doc.source, sectionTitle, chunks.length, partIndex++),
          source: doc.source,
          url: doc.url,
          title: sectionTitle,
          text: `${doc.title} — ${sectionTitle}\n\n${buffer.trim()}`,
        });
        buffer = "";
      }
      buffer += (buffer ? "\n\n" : "") + para;
    }
    if (buffer.trim().length > 0) {
      chunks.push({
        id: makeId(doc.source, sectionTitle, chunks.length, partIndex),
        source: doc.source,
        url: doc.url,
        title: sectionTitle,
        text: `${doc.title} — ${sectionTitle}\n\n${buffer.trim()}`,
      });
    }
  }

  return chunks;
}

function makeId(source: string, title: string, index: number, part?: number): string {
  const base = `${source}:${title}:${index}${part !== undefined ? `:${part}` : ""}`;
  return createHash("sha1").update(base).digest("hex").slice(0, 16);
}

async function embed(text: string): Promise<number[]> {
  const command = new InvokeModelCommand({
    modelId: EMBED_MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      inputText: text,
      dimensions: EMBED_DIMENSIONS,
      normalize: true,
    }),
  });
  const response = await bedrock.send(command);
  const payload = JSON.parse(new TextDecoder().decode(response.body));
  if (!Array.isArray(payload.embedding)) {
    throw new Error(`Unexpected Titan response: ${JSON.stringify(payload).slice(0, 200)}`);
  }
  return payload.embedding;
}

async function main() {
  const docs = [...loadCompanyDocs(), ...loadBlogDocs()];
  if (docs.length === 0) {
    throw new Error(`No source documents found in ${COMPANY_INFO_DIR} or ${BLOG_DIR}`);
  }

  const allChunks: Chunk[] = [];
  for (const doc of docs) {
    const chunks = chunkMarkdown(doc);
    console.log(`  ${doc.source}: ${chunks.length} chunks`);
    allChunks.push(...chunks);
  }
  console.log(`Total chunks: ${allChunks.length}`);

  const embedded: EmbeddedChunk[] = [];
  for (const [i, chunk] of allChunks.entries()) {
    const vector = await embed(chunk.text);
    embedded.push({ ...chunk, vector });
    if ((i + 1) % 5 === 0 || i + 1 === allChunks.length) {
      console.log(`  embedded ${i + 1}/${allChunks.length}`);
    }
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const output = {
    version: 1,
    embeddingModel: EMBED_MODEL_ID,
    dimensions: EMBED_DIMENSIONS,
    generatedAt: new Date().toISOString(),
    chunkCount: embedded.length,
    chunks: embedded,
  };
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output));

  const sizeMB = (fs.statSync(OUTPUT_FILE).size / 1024 / 1024).toFixed(2);
  console.log(`\nWrote ${OUTPUT_FILE} (${sizeMB} MB, ${embedded.length} chunks)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

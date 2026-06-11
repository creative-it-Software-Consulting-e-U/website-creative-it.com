import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  InvokeModelWithResponseStreamCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { createHash, randomUUID } from "crypto";

const bedrock = new BedrockRuntimeClient({});
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const s3 = new S3Client({});

const TABLE_NAME = process.env.TABLE_NAME!;
const EMBEDDINGS_BUCKET = process.env.EMBEDDINGS_BUCKET!;
const EMBEDDINGS_KEY = process.env.EMBEDDINGS_KEY ?? "embeddings.json";
const MODEL_ID = process.env.MODEL_ID
  ?? "eu.anthropic.claude-sonnet-4-20250514-v1:0";
const EMBED_MODEL_ID = process.env.EMBED_MODEL_ID ?? "amazon.titan-embed-text-v2:0";
const EMBED_DIMENSIONS = 1024;
const TOP_K = 5;
const RATE_LIMIT = 20;

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

interface EmbeddedChunk {
  id: string;
  source: string;
  url: string;
  title: string;
  text: string;
  vector: number[];
}

interface EmbeddingsFile {
  version: number;
  embeddingModel: string;
  dimensions: number;
  generatedAt: string;
  chunkCount: number;
  chunks: EmbeddedChunk[];
}

let embeddingsCache: EmbeddingsFile | null = null;

async function loadEmbeddings(): Promise<EmbeddingsFile> {
  if (embeddingsCache) return embeddingsCache;
  const res = await s3.send(
    new GetObjectCommand({ Bucket: EMBEDDINGS_BUCKET, Key: EMBEDDINGS_KEY })
  );
  const body = await res.Body!.transformToString();
  embeddingsCache = JSON.parse(body) as EmbeddingsFile;
  return embeddingsCache;
}

function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

function getDateKey(): string {
  return `DATE#${new Date().toISOString().slice(0, 10)}`;
}

function buildCorsHeaders(requestOrigin?: string): Record<string, string> {
  const allowedOrigin = requestOrigin && ALLOWED_ORIGINS.includes(requestOrigin)
    ? requestOrigin
    : ALLOWED_ORIGINS[0];

  return allowedOrigin
    ? {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Methods": "POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Expose-Headers": "X-Remaining-Requests,X-Session-Id",
        Vary: "Origin",
      }
    : {};
}

async function checkRateLimit(ip: string): Promise<{ allowed: boolean; remaining: number }> {
  const pk = `RATELIMIT#CHATBOT#${hashIp(ip)}`;
  const hourTs = getDateKey();
  const ttl = Math.floor(Date.now() / 1000) + 2 * 24 * 60 * 60;

  const result = await ddb.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { pk, hour_ts: hourTs },
      UpdateExpression: "ADD #count :inc SET #ttl = if_not_exists(#ttl, :ttl)",
      ExpressionAttributeNames: { "#count": "count", "#ttl": "ttl" },
      ExpressionAttributeValues: { ":inc": 1, ":ttl": ttl },
      ReturnValues: "ALL_NEW",
    })
  );

  const count = (result.Attributes?.count as number) ?? 1;
  const remaining = Math.max(0, RATE_LIMIT - count);
  return { allowed: count <= RATE_LIMIT, remaining };
}

async function embedQuery(text: string): Promise<number[]> {
  const res = await bedrock.send(
    new InvokeModelCommand({
      modelId: EMBED_MODEL_ID,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        inputText: text,
        dimensions: EMBED_DIMENSIONS,
        normalize: true,
      }),
    })
  );
  const payload = JSON.parse(new TextDecoder().decode(res.body));
  return payload.embedding as number[];
}

function cosineSim(a: number[], b: number[]): number {
  // Vectors come pre-normalized from Titan, so dot product = cosine similarity.
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
}

function topKChunks(query: number[], chunks: EmbeddedChunk[], k: number): EmbeddedChunk[] {
  const scored = chunks.map((c) => ({ chunk: c, score: cosineSim(query, c.vector) }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k).map((s) => s.chunk);
}

function buildPrompt(question: string, contexts: EmbeddedChunk[]): string {
  const contextBlock = contexts
    .map(
      (c, i) =>
        `[Source ${i + 1}] ${c.title}\nURL: ${c.url}\n${c.text}`
    )
    .join("\n\n---\n\n");

  return `You are the AI assistant on the website of creative-it, a one-person software consultancy run by Günther Wieser in Austria (AWS serverless and agentic AI). Answer questions about the company using the provided context.

Rules:
- Be friendly, professional, and concise; plain prose, no emoji, no marketing superlatives
- Use the provided context to answer accurately; never invent statistics or claims
- creative-it is one person supported by AI coding agents and an on-demand specialist network — never describe it as a team of engineers
- If you don't know something, say so honestly and suggest writing to Günther via /contact/ — he reads every message himself
- For complex project inquiries, recommend reaching out via the contact form at /contact/
- Include relevant links to pages when applicable (e.g., /services/, /about/, /contact/)
- When your answer draws on a blog article, include a markdown link to its URL and mention that more articles are available at https://www.creative-it.com/blog/
- Keep responses focused and under 200 words

Context:
${contextBlock}

Question: ${question}`;
}

// @ts-expect-error — awslambda global type for streaming handler
export const handler = awslambda.streamifyResponse(
  async (
    event: {
      requestContext: { http: { method: string; sourceIp: string } };
      headers: Record<string, string>;
      body?: string;
      isBase64Encoded?: boolean;
    },
    responseStream: NodeJS.WritableStream
  ) => {
    const method = event.requestContext.http.method;
    const origin = event.headers?.origin ?? event.headers?.Origin;
    const corsHeaders = buildCorsHeaders(origin);

    const baseHeaders: Record<string, string> = {
      ...corsHeaders,
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    };

    if (method === "OPTIONS") {
      // @ts-expect-error — awslambda HttpResponseStream type
      responseStream = awslambda.HttpResponseStream.from(responseStream, {
        statusCode: 204,
        headers: corsHeaders,
      });
      responseStream.end();
      return;
    }

    if (method !== "POST") {
      // @ts-expect-error — awslambda HttpResponseStream type
      responseStream = awslambda.HttpResponseStream.from(responseStream, {
        statusCode: 405,
        headers: { ...baseHeaders, "Content-Type": "application/json" },
      });
      responseStream.write(JSON.stringify({ error: "Method not allowed" }));
      responseStream.end();
      return;
    }

    let question: string;
    let sessionId: string | undefined;
    try {
      const bodyStr = event.isBase64Encoded
        ? Buffer.from(event.body ?? "", "base64").toString("utf-8")
        : event.body ?? "{}";
      const data = JSON.parse(bodyStr);
      question = data.question;
      sessionId = data.sessionId;
    } catch {
      // @ts-expect-error — awslambda HttpResponseStream type
      responseStream = awslambda.HttpResponseStream.from(responseStream, {
        statusCode: 400,
        headers: { ...baseHeaders, "Content-Type": "application/json" },
      });
      responseStream.write(JSON.stringify({ error: "Invalid JSON body" }));
      responseStream.end();
      return;
    }

    if (!question || typeof question !== "string" || !question.trim()) {
      // @ts-expect-error — awslambda HttpResponseStream type
      responseStream = awslambda.HttpResponseStream.from(responseStream, {
        statusCode: 400,
        headers: { ...baseHeaders, "Content-Type": "application/json" },
      });
      responseStream.write(JSON.stringify({ error: "question is required" }));
      responseStream.end();
      return;
    }

    if (question.length > 1000) {
      // @ts-expect-error — awslambda HttpResponseStream type
      responseStream = awslambda.HttpResponseStream.from(responseStream, {
        statusCode: 400,
        headers: { ...baseHeaders, "Content-Type": "application/json" },
      });
      responseStream.write(JSON.stringify({ error: "question exceeds maximum length of 1000 characters" }));
      responseStream.end();
      return;
    }

    const ip = event.headers?.["x-forwarded-for"]?.split(",").pop()?.trim()
      ?? event.requestContext.http.sourceIp;
    const { allowed, remaining } = await checkRateLimit(ip);
    baseHeaders["X-Remaining-Requests"] = String(remaining);

    if (!allowed) {
      // @ts-expect-error — awslambda HttpResponseStream type
      responseStream = awslambda.HttpResponseStream.from(responseStream, {
        statusCode: 429,
        headers: { ...baseHeaders, "Content-Type": "application/json" },
      });
      responseStream.write(
        JSON.stringify({ error: "Rate limit exceeded. Try again tomorrow.", remaining: 0 })
      );
      responseStream.end();
      return;
    }

    try {
      const embeddings = await loadEmbeddings();
      const queryVec = await embedQuery(question);
      const topChunks = topKChunks(queryVec, embeddings.chunks, TOP_K);
      const prompt = buildPrompt(question, topChunks);
      const newSessionId = sessionId ?? randomUUID();

      // @ts-expect-error — awslambda HttpResponseStream type
      responseStream = awslambda.HttpResponseStream.from(responseStream, {
        statusCode: 200,
        headers: {
          ...baseHeaders,
          "X-Session-Id": newSessionId,
          "X-Remaining-Requests": String(remaining),
        },
      });

      const claudeRes = await bedrock.send(
        new InvokeModelWithResponseStreamCommand({
          modelId: MODEL_ID,
          contentType: "application/json",
          accept: "application/json",
          body: JSON.stringify({
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 600,
            messages: [{ role: "user", content: prompt }],
          }),
        })
      );

      if (!claudeRes.body) {
        responseStream.write(
          "I'm sorry, I couldn't process your question. Please try again or contact us at info@creative-it.com."
        );
        responseStream.end();
        return;
      }

      for await (const chunk of claudeRes.body) {
        if (!chunk.chunk?.bytes) continue;
        const event = JSON.parse(new TextDecoder().decode(chunk.chunk.bytes));
        if (event.type === "content_block_delta" && event.delta?.text) {
          responseStream.write(event.delta.text);
        }
      }

      responseStream.end();
    } catch (err) {
      console.error("Knowledge bot error:", err);
      // @ts-expect-error — awslambda HttpResponseStream type
      responseStream = awslambda.HttpResponseStream.from(responseStream, {
        statusCode: 500,
        headers: { ...baseHeaders, "Content-Type": "application/json" },
      });
      responseStream.write(
        JSON.stringify({ error: "Failed to process your question. Please try again." })
      );
      responseStream.end();
    }
  }
);

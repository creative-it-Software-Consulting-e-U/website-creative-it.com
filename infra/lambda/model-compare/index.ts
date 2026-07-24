import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";
import {
  BedrockClient,
  ListInferenceProfilesCommand,
} from "@aws-sdk/client-bedrock";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { createHash } from "crypto";

const bedrock = new BedrockRuntimeClient({});
const bedrockControl = new BedrockClient({});
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const TABLE_NAME = process.env.TABLE_NAME!;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const RATE_LIMIT = 10;
const MAX_PROMPT_LENGTH = 1000;
const MAX_TOKENS = 512;

interface CompareModel {
  id: string;
  label: string;
  vendor: string;
  pricePerKIn: number | null;
  pricePerKOut: number | null;
}

// The tool compares one model per family; the newest EU inference profile of
// each family is discovered at runtime so new generations are picked up
// without a code change. Only eu.* profiles are considered (EU data
// residency, matching the privacy policy).
const FAMILIES = [
  {
    key: "sonnet",
    vendor: "Anthropic",
    pattern: /^eu\.anthropic\.claude-sonnet-(\d[\d-]*)/,
  },
  {
    key: "haiku",
    vendor: "Anthropic",
    pattern: /^eu\.anthropic\.claude-haiku-(\d[\d-]*)/,
  },
  {
    key: "nova-lite",
    vendor: "Amazon",
    pattern: /^eu\.amazon\.nova(?:-(\d+))?-lite-/,
  },
];

// Approximate on-demand list prices (USD per 1K tokens, eu-central-1).
// Newer Anthropic models are billed via AWS Marketplace and are not in the
// AWS Price List API, so this table cannot be fetched automatically. A model
// version without an entry still runs — its cost is reported as null.
const PRICES: Record<string, { in: number; out: number }> = {
  "sonnet:4": { in: 0.003, out: 0.015 },
  "sonnet:4.5": { in: 0.003, out: 0.015 },
  "haiku:4.5": { in: 0.001, out: 0.005 },
  "nova-lite:1": { in: 0.000078, out: 0.000312 },
  "nova-lite:2": { in: 0.000429, out: 0.003597 },
};

function priceFor(key: string): { in: number; out: number } | null {
  if (key === "sonnet:5") {
    // Bedrock launch promo $2/$10 per M tokens until 2026-08-31, then $3/$15
    return Date.now() < Date.parse("2026-09-01T00:00:00Z")
      ? { in: 0.002, out: 0.01 }
      : { in: 0.003, out: 0.015 };
  }
  return PRICES[key] ?? null;
}

// Version segments are the leading 1–2 digit groups of the id remainder;
// an 8-digit date or "v1:0" suffix ends the version
// ("4-5-20251001-v1:0" → [4, 5], "5" → [5]).
function parseVersion(raw: string | undefined): number[] {
  const parts: number[] = [];
  for (const seg of (raw ?? "").split("-")) {
    if (/^\d{1,2}$/.test(seg)) parts.push(Number(seg));
    else break;
  }
  return parts.length ? parts : [1];
}

function compareVersions(a: number[], b: number[]): number {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const diff = (a[i] ?? 0) - (b[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

function buildLabel(familyKey: string, version: number[]): string {
  const v = version.join(".");
  if (familyKey === "sonnet") return `Claude Sonnet ${v}`;
  if (familyKey === "haiku") return `Claude Haiku ${v}`;
  return version[0] > 1 ? `Amazon Nova ${version[0]} Lite` : "Amazon Nova Lite";
}

// Used when profile discovery fails and no cached result exists
const FALLBACK_MODELS: CompareModel[] = [
  {
    id: "eu.anthropic.claude-sonnet-4-20250514-v1:0",
    label: "Claude Sonnet 4",
    vendor: "Anthropic",
    pricePerKIn: 0.003,
    pricePerKOut: 0.015,
  },
  {
    id: "eu.anthropic.claude-haiku-4-5-20251001-v1:0",
    label: "Claude Haiku 4.5",
    vendor: "Anthropic",
    pricePerKIn: 0.001,
    pricePerKOut: 0.005,
  },
  {
    id: "eu.amazon.nova-lite-v1:0",
    label: "Amazon Nova Lite",
    vendor: "Amazon",
    pricePerKIn: 0.000078,
    pricePerKOut: 0.000312,
  },
];

const MODEL_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
let cachedModels: CompareModel[] | null = null;
let cachedAt = 0;

async function resolveModels(): Promise<CompareModel[]> {
  if (cachedModels && Date.now() - cachedAt < MODEL_CACHE_TTL_MS) {
    return cachedModels;
  }

  try {
    const profileIds: string[] = [];
    let nextToken: string | undefined;
    do {
      const response = await bedrockControl.send(
        new ListInferenceProfilesCommand({
          maxResults: 100,
          nextToken,
          typeEquals: "SYSTEM_DEFINED",
        })
      );
      for (const p of response.inferenceProfileSummaries ?? []) {
        if (p.inferenceProfileId && p.status === "ACTIVE") {
          profileIds.push(p.inferenceProfileId);
        }
      }
      nextToken = response.nextToken;
    } while (nextToken);

    const models = FAMILIES.map((family, index) => {
      let best: { id: string; version: number[] } | null = null;
      for (const id of profileIds) {
        const match = family.pattern.exec(id);
        if (!match) continue;
        const version = parseVersion(match[1]);
        if (!best || compareVersions(version, best.version) > 0) {
          best = { id, version };
        }
      }
      if (!best) return FALLBACK_MODELS[index];
      const price = priceFor(`${family.key}:${best.version.join(".")}`);
      return {
        id: best.id,
        label: buildLabel(family.key, best.version),
        vendor: family.vendor,
        pricePerKIn: price?.in ?? null,
        pricePerKOut: price?.out ?? null,
      };
    });

    cachedModels = models;
    cachedAt = Date.now();
    return models;
  } catch (err) {
    console.error("ListInferenceProfiles failed:", err);
    return cachedModels ?? FALLBACK_MODELS;
  }
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
        "Access-Control-Expose-Headers": "X-Remaining-Requests",
        Vary: "Origin",
      }
    : {};
}

async function checkRateLimit(ip: string): Promise<{ allowed: boolean; remaining: number }> {
  const pk = `RATELIMIT#MODELCOMPARE#${hashIp(ip)}`;
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

async function runModel(
  model: CompareModel,
  prompt: string
): Promise<Record<string, unknown>> {
  const started = Date.now();
  try {
    const response = await bedrock.send(
      new ConverseCommand({
        modelId: model.id,
        messages: [{ role: "user", content: [{ text: prompt }] }],
        inferenceConfig: { maxTokens: MAX_TOKENS },
      })
    );

    const latencyMs = Date.now() - started;
    const inputTokens = response.usage?.inputTokens ?? 0;
    const outputTokens = response.usage?.outputTokens ?? 0;
    const costUsd =
      model.pricePerKIn !== null && model.pricePerKOut !== null
        ? (inputTokens / 1000) * model.pricePerKIn +
          (outputTokens / 1000) * model.pricePerKOut
        : null;
    const text = (response.output?.message?.content ?? [])
      .map((block) => block.text ?? "")
      .join("");

    return {
      type: "result",
      model: model.id,
      label: model.label,
      vendor: model.vendor,
      latencyMs,
      inputTokens,
      outputTokens,
      costUsd,
      truncated: response.stopReason === "max_tokens",
      text,
    };
  } catch (err) {
    console.error(`Converse error (${model.id}):`, err);
    return {
      type: "result",
      model: model.id,
      label: model.label,
      vendor: model.vendor,
      error: "Model call failed",
    };
  }
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
      "Content-Type": "application/x-ndjson; charset=utf-8",
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

    let prompt: string;
    try {
      const bodyStr = event.isBase64Encoded
        ? Buffer.from(event.body ?? "", "base64").toString("utf-8")
        : event.body ?? "{}";
      const data = JSON.parse(bodyStr);
      prompt = data.prompt;
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

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      // @ts-expect-error — awslambda HttpResponseStream type
      responseStream = awslambda.HttpResponseStream.from(responseStream, {
        statusCode: 400,
        headers: { ...baseHeaders, "Content-Type": "application/json" },
      });
      responseStream.write(JSON.stringify({ error: "prompt is required" }));
      responseStream.end();
      return;
    }

    if (prompt.length > MAX_PROMPT_LENGTH) {
      // @ts-expect-error — awslambda HttpResponseStream type
      responseStream = awslambda.HttpResponseStream.from(responseStream, {
        statusCode: 400,
        headers: { ...baseHeaders, "Content-Type": "application/json" },
      });
      responseStream.write(
        JSON.stringify({ error: `prompt exceeds maximum length of ${MAX_PROMPT_LENGTH} characters` })
      );
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

    // @ts-expect-error — awslambda HttpResponseStream type
    responseStream = awslambda.HttpResponseStream.from(responseStream, {
      statusCode: 200,
      headers: baseHeaders,
    });

    const models = await resolveModels();

    responseStream.write(
      JSON.stringify({
        type: "start",
        models: models.map((m) => ({ model: m.id, label: m.label, vendor: m.vendor })),
      }) + "\n"
    );

    // All models run in parallel; each result is written as one NDJSON line
    // as soon as that model finishes.
    await Promise.all(
      models.map((model) =>
        runModel(model, prompt.trim()).then((result) => {
          responseStream.write(JSON.stringify(result) + "\n");
        })
      )
    );

    responseStream.write(JSON.stringify({ type: "done" }) + "\n");
    responseStream.end();
  }
);

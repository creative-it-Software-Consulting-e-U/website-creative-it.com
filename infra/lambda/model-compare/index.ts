import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { createHash } from "crypto";

const bedrock = new BedrockRuntimeClient({});
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const TABLE_NAME = process.env.TABLE_NAME!;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const RATE_LIMIT = 10;
const MAX_PROMPT_LENGTH = 1000;
const MAX_TOKENS = 512;

// EU cross-region inference profiles with approximate on-demand list prices
// (USD per 1K tokens). Prices are shown to visitors as approximations only.
const MODELS = [
  {
    id: "eu.anthropic.claude-sonnet-4-20250514-v1:0",
    label: "Claude Sonnet 4",
    vendor: "Anthropic",
    pricePerKIn: 0.003,
    pricePerKOut: 0.015,
  },
  {
    id: "eu.anthropic.claude-3-haiku-20240307-v1:0",
    label: "Claude 3 Haiku",
    vendor: "Anthropic",
    pricePerKIn: 0.00025,
    pricePerKOut: 0.00125,
  },
  {
    id: "eu.amazon.nova-lite-v1:0",
    label: "Amazon Nova Lite",
    vendor: "Amazon",
    pricePerKIn: 0.000078,
    pricePerKOut: 0.000312,
  },
];

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
  model: (typeof MODELS)[number],
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
      (inputTokens / 1000) * model.pricePerKIn +
      (outputTokens / 1000) * model.pricePerKOut;
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

    responseStream.write(
      JSON.stringify({
        type: "start",
        models: MODELS.map((m) => ({ model: m.id, label: m.label, vendor: m.vendor })),
      }) + "\n"
    );

    // All models run in parallel; each result is written as one NDJSON line
    // as soon as that model finishes.
    await Promise.all(
      MODELS.map((model) =>
        runModel(model, prompt.trim()).then((result) => {
          responseStream.write(JSON.stringify(result) + "\n");
        })
      )
    );

    responseStream.write(JSON.stringify({ type: "done" }) + "\n");
    responseStream.end();
  }
);

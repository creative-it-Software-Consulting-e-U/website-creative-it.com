import {
  BedrockRuntimeClient,
  InvokeModelWithResponseStreamCommand,
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
const MODEL_ID = "eu.anthropic.claude-sonnet-4-20250514-v1:0";
const RATE_LIMIT = 10;

const ALLOWED_LANGUAGES: Record<string, string> = {
  de: "German", fr: "French", es: "Spanish", it: "Italian", pt: "Portuguese",
  nl: "Dutch", pl: "Polish", cs: "Czech", ro: "Romanian", sv: "Swedish",
  no: "Norwegian", da: "Danish", fi: "Finnish", hu: "Hungarian", el: "Greek",
  bg: "Bulgarian", hr: "Croatian", sk: "Slovak", uk: "Ukrainian", tr: "Turkish",
  zh: "Chinese", ja: "Japanese", ar: "Arabic", hi: "Hindi", ko: "Korean",
};

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
  const pk = `RATELIMIT#LIVE_TRANSLATION#${hashIp(ip)}`;
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

const SYSTEM_PROMPT = `Translate the following JSON array of texts to the specified language. Return ONLY a JSON array of translated strings in the exact same order. Preserve HTML entities, line breaks, and special characters. Do not add any explanation or markdown formatting — just the raw JSON array.`;

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

    let texts: string[];
    let targetLanguage: string;
    let targetLanguageName: string;
    try {
      const bodyStr = event.isBase64Encoded
        ? Buffer.from(event.body ?? "", "base64").toString("utf-8")
        : event.body ?? "{}";
      const data = JSON.parse(bodyStr);
      texts = data.texts;
      targetLanguage = data.targetLanguage;
      targetLanguageName = data.targetLanguageName;
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

    if (!Array.isArray(texts) || texts.length === 0) {
      // @ts-expect-error — awslambda HttpResponseStream type
      responseStream = awslambda.HttpResponseStream.from(responseStream, {
        statusCode: 400,
        headers: { ...baseHeaders, "Content-Type": "application/json" },
      });
      responseStream.write(JSON.stringify({ error: "texts must be a non-empty array" }));
      responseStream.end();
      return;
    }

    if (texts.length > 50) {
      // @ts-expect-error — awslambda HttpResponseStream type
      responseStream = awslambda.HttpResponseStream.from(responseStream, {
        statusCode: 400,
        headers: { ...baseHeaders, "Content-Type": "application/json" },
      });
      responseStream.write(JSON.stringify({ error: "Maximum 50 text items allowed" }));
      responseStream.end();
      return;
    }

    if (texts.some(t => typeof t !== "string" || t.length > 2000)) {
      // @ts-expect-error — awslambda HttpResponseStream type
      responseStream = awslambda.HttpResponseStream.from(responseStream, {
        statusCode: 400,
        headers: { ...baseHeaders, "Content-Type": "application/json" },
      });
      responseStream.write(JSON.stringify({ error: "Each text must be a string with max 2000 characters" }));
      responseStream.end();
      return;
    }

    if (!targetLanguage || !ALLOWED_LANGUAGES[targetLanguage]) {
      // @ts-expect-error — awslambda HttpResponseStream type
      responseStream = awslambda.HttpResponseStream.from(responseStream, {
        statusCode: 400,
        headers: { ...baseHeaders, "Content-Type": "application/json" },
      });
      responseStream.write(JSON.stringify({ error: "Invalid target language" }));
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

    const langName = targetLanguageName || ALLOWED_LANGUAGES[targetLanguage];

    try {
      const bedrockResponse = await bedrock.send(
        new InvokeModelWithResponseStreamCommand({
          modelId: MODEL_ID,
          contentType: "application/json",
          accept: "application/json",
          body: JSON.stringify({
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 4096,
            system: SYSTEM_PROMPT,
            messages: [
              {
                role: "user",
                content: `Translate to ${langName}:\n${JSON.stringify(texts)}`,
              },
            ],
          }),
        })
      );

      // @ts-expect-error — awslambda HttpResponseStream type
      responseStream = awslambda.HttpResponseStream.from(responseStream, {
        statusCode: 200,
        headers: baseHeaders,
      });

      if (bedrockResponse.body) {
        for await (const event of bedrockResponse.body) {
          if (event.chunk?.bytes) {
            const parsed = JSON.parse(new TextDecoder().decode(event.chunk.bytes));
            if (parsed.type === "content_block_delta" && parsed.delta?.text) {
              responseStream.write(parsed.delta.text);
            }
          }
        }
      }

      responseStream.end();
    } catch (err) {
      console.error("Bedrock error:", err);
      // @ts-expect-error — awslambda HttpResponseStream type
      responseStream = awslambda.HttpResponseStream.from(responseStream, {
        statusCode: 500,
        headers: { ...baseHeaders, "Content-Type": "application/json" },
      });
      responseStream.write(
        JSON.stringify({ error: "Failed to translate. Please try again." })
      );
      responseStream.end();
    }
  }
);

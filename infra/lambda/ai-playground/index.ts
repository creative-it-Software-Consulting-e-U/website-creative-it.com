import {
  BedrockRuntimeClient,
  InvokeModelWithResponseStreamCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { createHash } from "crypto";

const bedrock = new BedrockRuntimeClient({});
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const TABLE_NAME = process.env.TABLE_NAME!;
const MODEL_ID = "eu.anthropic.claude-sonnet-4-20250514-v1:0";
const RATE_LIMIT = 10;
const MAX_PROMPT_LENGTH = 2000;

function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

function getDateKey(): string {
  return `DATE#${new Date().toISOString().slice(0, 10)}`;
}

async function checkRateLimit(ip: string): Promise<{ allowed: boolean; remaining: number }> {
  const pk = `RATELIMIT#${hashIp(ip)}`;
  const hourTs = getDateKey();
  const ttl = Math.floor(Date.now() / 1000) + 2 * 24 * 60 * 60; // 2 days

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

async function getRemainingRequests(ip: string): Promise<number> {
  const pk = `RATELIMIT#${hashIp(ip)}`;
  const hourTs = getDateKey();

  const result = await ddb.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { pk, hour_ts: hourTs },
    })
  );

  const count = (result.Item?.count as number) ?? 0;
  return Math.max(0, RATE_LIMIT - count);
}

const SYSTEM_PROMPT = `You are a UI component generator for creative-it.com. Generate ONLY the HTML content for a single UI component.

Rules:
- Output ONLY HTML markup with Tailwind CSS utility classes — no explanation, no markdown, no code fences
- Use this color palette: navy (#030520), purple (#A163F1), indigo (#6363F1), cyan (#23F0C3), surface (#0F1132), off-white (#F5F5F7)
- Use dark backgrounds (bg-[#030520] or bg-[#0F1132]) with light text (text-[#F5F5F7])
- NO <script> tags, NO event handlers (onclick, onload, etc.), NO javascript: URLs
- NO external resources (images, fonts, links) — use inline SVGs for icons
- NO <html>, <head>, or <body> tags — just the component markup
- Make components visually polished with rounded corners, subtle borders, shadows, and gradients
- Use the Inter font family via Tailwind's font-sans
- When the user sends follow-up messages, they are refining the previous component. Output the COMPLETE updated component — not a diff or partial update.`;

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

    // CORS is handled by Function URL config — Lambda only sets non-CORS headers
    const baseHeaders: Record<string, string> = {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    };

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

    // Parse body
    let prompt: string;
    let messages: Array<{ role: string; content: string }> | undefined;
    try {
      const bodyStr = event.isBase64Encoded
        ? Buffer.from(event.body ?? "", "base64").toString("utf-8")
        : event.body ?? "{}";
      const data = JSON.parse(bodyStr);
      prompt = data.prompt;
      messages = data.messages;
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

    // Validate messages array if provided (max 20 messages, max 10 conversation turns)
    if (messages) {
      if (!Array.isArray(messages) || messages.length > 20) {
        // @ts-expect-error — awslambda HttpResponseStream type
        responseStream = awslambda.HttpResponseStream.from(responseStream, {
          statusCode: 400,
          headers: { ...baseHeaders, "Content-Type": "application/json" },
        });
        responseStream.write(JSON.stringify({ error: "messages must be an array with at most 20 entries" }));
        responseStream.end();
        return;
      }
      for (const msg of messages) {
        if (!msg.role || !msg.content || !["user", "assistant"].includes(msg.role)) {
          // @ts-expect-error — awslambda HttpResponseStream type
          responseStream = awslambda.HttpResponseStream.from(responseStream, {
            statusCode: 400,
            headers: { ...baseHeaders, "Content-Type": "application/json" },
          });
          responseStream.write(JSON.stringify({ error: "each message must have role (user|assistant) and content" }));
          responseStream.end();
          return;
        }
      }
    }

    // Rate limit check
    const ip = event.headers?.["cloudfront-viewer-address"]?.split(":")[0]
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

    // Bedrock streaming call
    try {
      // Build messages: use conversation history if provided, otherwise single prompt
      const bedrockMessages = messages && messages.length > 0
        ? messages
        : [{ role: "user", content: `Generate a UI component: ${prompt.trim()}` }];

      const bedrockResponse = await bedrock.send(
        new InvokeModelWithResponseStreamCommand({
          modelId: MODEL_ID,
          contentType: "application/json",
          accept: "application/json",
          body: JSON.stringify({
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 4096,
            system: SYSTEM_PROMPT,
            messages: bedrockMessages,
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
        JSON.stringify({ error: "Failed to generate component. Please try again." })
      );
      responseStream.end();
    }
  }
);

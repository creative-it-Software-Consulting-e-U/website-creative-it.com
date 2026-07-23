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
const MAX_PROMPT_LENGTH = 2000;

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
  const pk = `RATELIMIT#COSTCHECK#${hashIp(ip)}`;
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

const SYSTEM_PROMPT = `You are a senior AWS cost optimization consultant at creative-it, a software consulting company specializing in serverless architectures. Given a description of a software system, workload, or architecture, estimate realistic monthly AWS costs and show the savings potential of a serverless redesign.

Structure your response as follows:

## Assumptions
- [Each assumption you made: traffic, data volume, region eu-central-1, on-demand pricing, etc.]

## Estimated Monthly Cost (as described)
- **[Service]** — [cost driver, e.g. "2× t3.large, 24/7"] — ~$X/month
- [one bullet per service]

**Estimated total: ~$X–Y/month**

## Serverless Optimization
- **[Change]** — [what to replace with what, and why] — new estimate ~$X/month
- [one bullet per concrete change]

**Optimized total: ~$X–Y/month (≈Z% savings)**

## Caveats
- [Important caveats: free tier ignored, data transfer, reserved instances, etc.]

Rules:
- Respond in the same language as the user's description (German or English)
- Use AWS eu-central-1 on-demand list prices; state all numbers as rough ranges, never as exact promises
- Use bullet lists only — never markdown tables
- Be realistic and conservative; when information is missing, assume sensible defaults and list them under Assumptions
- If the described system is already fully serverless, say so and focus on tuning (right-sizing memory, caching, storage classes)
- Never invent customer references or case studies
- End with a single sentence noting that creative-it offers a free detailed cost analysis based on real billing data
- When handling follow-up questions, refine your estimate accordingly`;

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
      const bedrockMessages = messages && messages.length > 0
        ? messages
        : [{ role: "user", content: `Estimate the monthly AWS costs for this system and show the serverless savings potential:\n\n${prompt.trim()}` }];

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
        JSON.stringify({ error: "Failed to generate the cost estimate. Please try again." })
      );
      responseStream.end();
    }
  }
);

import {
  BedrockAgentRuntimeClient,
  RetrieveAndGenerateCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { createHash } from "crypto";

const bedrockAgent = new BedrockAgentRuntimeClient({});
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const TABLE_NAME = process.env.TABLE_NAME!;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const KNOWLEDGE_BASE_ID = process.env.KNOWLEDGE_BASE_ID!;
const MODEL_ARN = process.env.MODEL_ARN || "arn:aws:bedrock:eu-central-1::foundation-model/anthropic.claude-sonnet-4-20250514-v1:0";
const RATE_LIMIT = 20;

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
      const commandInput: Record<string, unknown> = {
        input: { text: question },
        retrieveAndGenerateConfiguration: {
          type: "KNOWLEDGE_BASE",
          knowledgeBaseConfiguration: {
            knowledgeBaseId: KNOWLEDGE_BASE_ID,
            modelArn: MODEL_ARN,
            generationConfiguration: {
              promptTemplate: {
                textPromptTemplate: `You are a helpful AI assistant for creative-it, a software consulting company based in Austria. Answer questions about the company using the provided context.

Rules:
- Be friendly, professional, and concise
- Use the provided context to answer accurately
- If you don't know something, say so honestly and suggest contacting the team
- For complex project inquiries, recommend reaching out via the contact form at /contact
- Include relevant links to pages when applicable (e.g., /services, /about, /contact)
- When your answer draws on blog article content, include a markdown link to the original article URL (found as "Original URL" in the source). Also mention that more articles are available at https://blog.creative-it.com
- Keep responses focused and under 200 words

Context: $search_results$

Question: $query$`,
              },
            },
          },
        },
      };

      if (sessionId) {
        commandInput.sessionId = sessionId;
      }

      const response = await bedrockAgent.send(
        new RetrieveAndGenerateCommand(commandInput as any)
      );

      const text = response.output?.text ?? "I'm sorry, I couldn't find an answer to that question. Please contact us at info@creative-it.com for more help.";
      const newSessionId = response.sessionId;

      // Stream the response character by character for typing effect
      // @ts-expect-error — awslambda HttpResponseStream type
      responseStream = awslambda.HttpResponseStream.from(responseStream, {
        statusCode: 200,
        headers: {
          ...baseHeaders,
          "X-Session-Id": newSessionId ?? "",
          "X-Remaining-Requests": String(remaining),
        },
      });

      // Send response in small chunks for typing effect
      const chunkSize = 3;
      for (let i = 0; i < text.length; i += chunkSize) {
        responseStream.write(text.slice(i, i + chunkSize));
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

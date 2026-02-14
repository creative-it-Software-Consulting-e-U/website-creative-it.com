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
  const pk = `RATELIMIT#AGENT#${hashIp(ip)}`;
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

const SCENARIOS: Record<string, { title: string; prompt: string }> = {
  "code-review": {
    title: "Code Review",
    prompt: `You are an AI code review agent. Simulate reviewing this TypeScript function that has several issues:

\`\`\`typescript
async function fetchUserData(userId) {
  const response = await fetch('/api/users/' + userId);
  const data = response.json();
  localStorage.setItem('user_' + usrId, JSON.stringify(data));
  if (data.role = 'admin') {
    showAdminPanel();
  }
  return data;
}
\`\`\`

Walk through your analysis step by step: identify bugs, security issues, and improvements.`,
  },
  "data-analysis": {
    title: "Data Analysis",
    prompt: `You are an AI data analysis agent. Simulate analyzing this monthly sales dataset:

| Month | Revenue | Users | Churn Rate |
|-------|---------|-------|------------|
| Jan   | $42,000 | 1,200 | 3.2%       |
| Feb   | $38,500 | 1,150 | 4.1%       |
| Mar   | $51,200 | 1,400 | 2.8%       |
| Apr   | $47,800 | 1,350 | 3.5%       |
| May   | $55,100 | 1,520 | 2.1%       |
| Jun   | $49,300 | 1,480 | 3.9%       |

Analyze trends, find anomalies, and provide actionable insights.`,
  },
  "deployment": {
    title: "Deployment Pipeline",
    prompt: `You are an AI deployment agent. Simulate planning and executing a deployment for a Node.js application to AWS. The app uses:
- Next.js 14 frontend
- PostgreSQL database
- Redis cache
- S3 for media storage

There's a database migration that adds a new column to the users table. Plan and execute the deployment with zero downtime.`,
  },
  "bug-fix": {
    title: "Bug Investigation",
    prompt: `You are an AI debugging agent. Simulate investigating this bug report:

"Users report that the shopping cart total sometimes shows the wrong amount after removing an item. It seems to happen more often when items have discounts applied. The cart works fine when adding items."

Investigate the root cause and propose a fix.`,
  },
};

const SYSTEM_PROMPT = `You are an AI agent simulator for creative-it.com. You must output your reasoning as a series of structured steps in JSON Lines format.

Each line must be a valid JSON object with this structure:
{"step": "<type>", "title": "<short title>", "content": "<detailed content>"}

The step types must appear in this exact order:
1. "think" — Your initial analysis and understanding of the problem
2. "plan" — Your step-by-step plan to solve it
3. "execute" — The actual work: code changes, commands, analysis
4. "verify" — Verification that your solution is correct
5. "result" — Final summary and outcome

Rules:
- Output EXACTLY one JSON object per line (JSON Lines format)
- Each step should have meaningful, detailed content (2-4 sentences minimum)
- The "execute" step can include code blocks using markdown backticks inside the content string
- Use \\n for newlines within content strings
- Make the simulation feel realistic and educational
- Show actual reasoning, not just placeholder text
- Do NOT output anything except the JSON lines — no introduction, no conclusion, no markdown`;

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

    let scenario: string;
    try {
      const bodyStr = event.isBase64Encoded
        ? Buffer.from(event.body ?? "", "base64").toString("utf-8")
        : event.body ?? "{}";
      const data = JSON.parse(bodyStr);
      scenario = data.scenario;
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

    if (!scenario || !SCENARIOS[scenario]) {
      // @ts-expect-error — awslambda HttpResponseStream type
      responseStream = awslambda.HttpResponseStream.from(responseStream, {
        statusCode: 400,
        headers: { ...baseHeaders, "Content-Type": "application/json" },
      });
      responseStream.write(
        JSON.stringify({ error: `Invalid scenario. Valid: ${Object.keys(SCENARIOS).join(", ")}` })
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

    try {
      const scenarioConfig = SCENARIOS[scenario];

      const bedrockResponse = await bedrock.send(
        new InvokeModelWithResponseStreamCommand({
          modelId: MODEL_ID,
          contentType: "application/json",
          accept: "application/json",
          body: JSON.stringify({
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 4096,
            system: SYSTEM_PROMPT,
            messages: [{ role: "user", content: scenarioConfig.prompt }],
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
        JSON.stringify({ error: "Failed to run scenario. Please try again." })
      );
      responseStream.end();
    }
  }
);

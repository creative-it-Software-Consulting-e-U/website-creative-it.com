import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  QueryCommand,
  UpdateCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { createHash } from "crypto";

const bedrock = new BedrockRuntimeClient({});
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const TABLE_NAME = process.env.TABLE_NAME!;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(",") ?? [];
const MODEL_ID = "eu.anthropic.claude-sonnet-4-20250514-v1:0";
const RATE_LIMIT = 30;

function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

function getDateKey(): string {
  return `DATE#${new Date().toISOString().slice(0, 10)}`;
}

async function checkRateLimit(
  ip: string
): Promise<{ allowed: boolean; remaining: number }> {
  const pk = `RATELIMIT#STORY#${hashIp(ip)}`;
  const hourTs = getDateKey();
  const ttl = Math.floor(Date.now() / 1000) + 2 * 24 * 60 * 60;

  const result = await ddb.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { pk, hour_ts: hourTs },
      UpdateExpression:
        "ADD #count :inc SET #ttl = if_not_exists(#ttl, :ttl)",
      ExpressionAttributeNames: { "#count": "count", "#ttl": "ttl" },
      ExpressionAttributeValues: { ":inc": 1, ":ttl": ttl },
      ReturnValues: "ALL_NEW",
    })
  );

  const count = (result.Attributes?.count as number) ?? 1;
  const remaining = Math.max(0, RATE_LIMIT - count);
  return { allowed: count <= RATE_LIMIT, remaining };
}

function isAllowedOrigin(origin: string): boolean {
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  try {
    const { hostname } = new URL(origin);
    if (hostname.endsWith(".vercel.app")) return true;
    if (hostname === "localhost") return true;
  } catch {}
  return false;
}

function getCorsHeaders(origin?: string): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    Vary: "Origin",
  };
  if (origin && isAllowedOrigin(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

function respond(
  statusCode: number,
  body: Record<string, unknown>,
  origin?: string
): APIGatewayProxyResultV2 {
  return {
    statusCode,
    headers: getCorsHeaders(origin),
    body: JSON.stringify(body),
  };
}

function floorToHour(date: Date): Date {
  const d = new Date(date);
  d.setUTCMinutes(0, 0, 0);
  return d;
}

const SYSTEM_PROMPT = `You are a creative writer for creative-it, a software consulting company. Given GitHub commit statistics, write a brief, engaging narrative (2-3 sentences) about what the team built today.

Rules:
- Write in creative-it's voice: professional but warm, technically competent, forward-looking
- Mention specific numbers (commits, lines changed) naturally woven into the narrative
- Focus on the human side of development — the effort, the progress, the momentum
- Don't be overly enthusiastic or use exclamation marks excessively
- If numbers are low or zero, acknowledge it gracefully (e.g., "a quiet day of planning" or "focused work behind the scenes")
- Keep it to 2-3 sentences maximum`;

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const origin = event.headers?.origin;

  if (event.requestContext.http.method !== "GET") {
    return respond(405, { error: "Method not allowed" }, origin);
  }

  const ip = event.requestContext.http.sourceIp;
  const { allowed, remaining } = await checkRateLimit(ip);

  if (!allowed) {
    return respond(
      429,
      { error: "Rate limit exceeded. Try again tomorrow.", remaining: 0 },
      origin
    );
  }

  try {
    // Read last 24h stats from DynamoDB
    const now = new Date();
    const currentHour = floorToHour(now);
    const cutoff24h = new Date(
      currentHour.getTime() - 24 * 3_600_000
    ).toISOString();

    const result = await ddb.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "pk = :pk AND hour_ts >= :since",
        ExpressionAttributeValues: { ":pk": "STATS", ":since": cutoff24h },
      })
    );

    let commits = 0;
    let lines = 0;
    for (const item of result.Items ?? []) {
      commits += (item.commits as number) ?? 0;
      lines += (item.lines as number) ?? 0;
    }

    // Call Bedrock to generate narrative
    const userPrompt = `Here are today's GitHub stats for creative-it:
- Commits in the last 24 hours: ${commits}
- Lines of code changed: ${lines}

Write a brief narrative about today's development activity.`;

    const bedrockResponse = await bedrock.send(
      new InvokeModelCommand({
        modelId: MODEL_ID,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          anthropic_version: "bedrock-2023-05-31",
          max_tokens: 256,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: userPrompt }],
        }),
      })
    );

    const responseBody = JSON.parse(
      new TextDecoder().decode(bedrockResponse.body)
    );
    const story =
      responseBody.content?.[0]?.text ?? "Our agents have been busy shipping code.";

    const headers = getCorsHeaders(origin);
    headers["X-Remaining-Requests"] = String(remaining);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ story, stats: { commits, lines } }),
    };
  } catch (err) {
    console.error("Commit story error:", err);
    return respond(
      500,
      { error: "Failed to generate story. Please try again." },
      origin
    );
  }
}

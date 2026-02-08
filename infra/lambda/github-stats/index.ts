import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const TABLE_NAME = process.env.TABLE_NAME!;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(",") ?? [];

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

// ── CORS helpers ─────────────────────────────────────────────────────────────

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
    "Cache-Control": "public, max-age=300, s-maxage=900",
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

// ── Handler ──────────────────────────────────────────────────────────────────

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const origin = event.headers?.origin;

  if (event.requestContext.http.method !== "GET") {
    return respond(405, { error: "Method not allowed" }, origin);
  }

  try {
    const now = new Date();
    const currentHour = floorToHour(now);
    const cutoff24h = new Date(
      currentHour.getTime() - 24 * 3_600_000
    ).toISOString();
    const cutoff7d = new Date(
      currentHour.getTime() - 7 * 24 * 3_600_000
    ).toISOString();

    const result = await ddb.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "pk = :pk AND hour_ts >= :since",
        ExpressionAttributeValues: { ":pk": "STATS", ":since": cutoff7d },
      })
    );

    let commits24h = 0;
    let commits7d = 0;
    let lines24h = 0;
    let lines7d = 0;

    for (const item of result.Items ?? []) {
      const c = (item.commits as number) ?? 0;
      const l = (item.lines as number) ?? 0;
      commits7d += c;
      lines7d += l;
      if ((item.hour_ts as string) >= cutoff24h) {
        commits24h += c;
        lines24h += l;
      }
    }

    return respond(
      200,
      {
        commits_24h: commits24h,
        commits_7d: commits7d,
        lines_24h: lines24h,
        lines_7d: lines7d,
        cached_at: now.toISOString(),
      },
      origin
    );
  } catch (err) {
    console.error("Failed to read GitHub stats:", err);
    return respond(500, { error: "Failed to read GitHub stats" }, origin);
  }
}

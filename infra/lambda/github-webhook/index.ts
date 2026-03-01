import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { createHmac, timingSafeEqual } from "crypto";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  UpdateCommand,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

const TABLE_NAME = process.env.TABLE_NAME!;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET!;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const GITHUB_ORG = process.env.GITHUB_ORG!;

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

// ── Types ────────────────────────────────────────────────────────────────────

interface PushCommit {
  id: string;
  timestamp: string;
  message: string;
  added: string[];
  removed: string[];
  modified: string[];
}

interface PushPayload {
  ref: string;
  before: string;
  after: string;
  commits: PushCommit[];
  repository: {
    full_name: string;
    name: string;
  };
}

interface CompareResponse {
  total_commits: number;
  files?: { additions: number; deletions: number }[];
}

// ── Signature Verification ───────────────────────────────────────────────────

function verifySignature(payload: string, signature: string): boolean {
  const expected = Buffer.from(
    `sha256=${createHmac("sha256", WEBHOOK_SECRET).update(payload).digest("hex")}`,
    "utf8"
  );
  const actual = Buffer.from(signature, "utf8");
  if (expected.length !== actual.length) return false;
  return timingSafeEqual(expected, actual);
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function isMergeCommit(message: string): boolean {
  return /^Merge (branch|pull request|remote-tracking) /.test(message);
}

function floorToHour(date: Date): Date {
  const d = new Date(date);
  d.setUTCMinutes(0, 0, 0);
  return d;
}

function respond(
  statusCode: number,
  body: Record<string, unknown>
): APIGatewayProxyResultV2 {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

// ── Deduplication ────────────────────────────────────────────────────────────

async function isDuplicate(deliveryId: string): Promise<boolean> {
  const result = await ddb.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { pk: `WEBHOOK#${deliveryId}`, hour_ts: "DEDUP" },
    })
  );
  return !!result.Item;
}

async function markDelivery(deliveryId: string): Promise<void> {
  await ddb.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        pk: `WEBHOOK#${deliveryId}`,
        hour_ts: "DEDUP",
        ttl: Math.floor(Date.now() / 1000) + 3600, // 1 hour TTL
      },
    })
  );
}

// ── GitHub Compare API ───────────────────────────────────────────────────────

async function fetchCompareStats(
  repoFullName: string,
  before: string,
  after: string
): Promise<{ additions: number; deletions: number }> {
  const url = `https://api.github.com/repos/${repoFullName}/compare/${before}...${after}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "creative-it-webhook",
    },
  });

  if (!res.ok) {
    console.warn(`Compare API failed (${res.status}) for ${repoFullName}`);
    return { additions: 0, deletions: 0 };
  }

  const data = (await res.json()) as CompareResponse;
  let additions = 0;
  let deletions = 0;
  for (const file of data.files ?? []) {
    additions += file.additions;
    deletions += file.deletions;
  }
  return { additions, deletions };
}

// ── DynamoDB Atomic Increment ────────────────────────────────────────────────

async function incrementHourStats(
  hourTs: string,
  commits: number,
  lines: number
): Promise<void> {
  const ttl = Math.floor(new Date(hourTs).getTime() / 1000) + 9 * 24 * 3600;
  await ddb.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { pk: "STATS", hour_ts: hourTs },
      UpdateExpression:
        "ADD commits :c, lines :l SET #ttl = if_not_exists(#ttl, :ttl)",
      ExpressionAttributeNames: { "#ttl": "ttl" },
      ExpressionAttributeValues: {
        ":c": commits,
        ":l": lines,
        ":ttl": ttl,
      },
    })
  );
}

// ── Handler ──────────────────────────────────────────────────────────────────

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  // Only accept POST
  if (event.requestContext.http.method !== "POST") {
    return respond(405, { error: "Method not allowed" });
  }

  // Verify webhook signature
  const signature = event.headers["x-hub-signature-256"];
  if (!signature || !event.body) {
    return respond(401, { error: "Missing signature or body" });
  }

  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body, "base64").toString("utf8")
    : event.body;

  if (!verifySignature(rawBody, signature)) {
    return respond(401, { error: "Invalid signature" });
  }

  // Only process push events
  const ghEvent = event.headers["x-github-event"];
  if (ghEvent !== "push") {
    return respond(200, { message: `Ignored event: ${ghEvent}` });
  }

  // Deduplicate by delivery ID
  const deliveryId = event.headers["x-github-delivery"];
  if (deliveryId) {
    if (await isDuplicate(deliveryId)) {
      return respond(200, { message: "Duplicate delivery, skipped" });
    }
    await markDelivery(deliveryId);
  }

  const payload: PushPayload = JSON.parse(rawBody);

  // Skip if no commits (e.g., branch deletion where after is all zeros)
  if (!payload.commits?.length || payload.after === "0000000000000000000000000000000000000000") {
    return respond(200, { message: "No commits to process" });
  }

  // Filter out repos not in our org
  if (!payload.repository.full_name.startsWith(`${GITHUB_ORG}/`)) {
    return respond(200, { message: "Repo not in org, skipped" });
  }

  console.log(
    `Processing push: ${payload.repository.full_name} ${payload.ref} (${payload.commits.length} commits)`
  );

  // Separate merge commits from regular commits (count all, but only
  // fetch line stats for non-merge commits to avoid inflated numbers)
  const nonMergeCommits = payload.commits.filter(
    (c) => !isMergeCommit(c.message)
  );

  // Only call Compare API if there are non-merge commits
  let totalLines = 0;
  if (nonMergeCommits.length > 0) {
    const { additions, deletions } = await fetchCompareStats(
      payload.repository.full_name,
      payload.before,
      payload.after
    );
    totalLines = additions + deletions;
  }

  // Bucket ALL commits by hour (merge commits count toward commit total)
  const buckets = new Map<string, { commits: number; lines: number }>();

  for (const commit of payload.commits) {
    const hourKey = floorToHour(new Date(commit.timestamp)).toISOString();
    const bucket = buckets.get(hourKey) ?? { commits: 0, lines: 0 };
    bucket.commits++;
    buckets.set(hourKey, bucket);
  }

  // Distribute lines only across non-merge commit hour buckets
  const nonMergeBuckets = new Map<string, number>();
  for (const commit of nonMergeCommits) {
    const hourKey = floorToHour(new Date(commit.timestamp)).toISOString();
    nonMergeBuckets.set(hourKey, (nonMergeBuckets.get(hourKey) ?? 0) + 1);
  }
  const totalNonMerge = nonMergeCommits.length;
  let linesDistributed = 0;
  const nmEntries = Array.from(nonMergeBuckets.entries());
  for (let i = 0; i < nmEntries.length; i++) {
    const [hourKey, count] = nmEntries[i];
    const bucket = buckets.get(hourKey)!;
    if (i === nmEntries.length - 1) {
      bucket.lines = totalLines - linesDistributed;
    } else {
      bucket.lines = Math.round((count / totalNonMerge) * totalLines);
      linesDistributed += bucket.lines;
    }
  }

  // Write each hour bucket with atomic increment
  const writePromises = Array.from(buckets.entries()).map(
    ([hourTs, { commits, lines }]) =>
      incrementHourStats(hourTs, commits, lines)
  );
  await Promise.all(writePromises);

  const mergeCount = payload.commits.length - nonMergeCommits.length;
  console.log(
    `Wrote ${buckets.size} hour bucket(s): ${payload.commits.length} commits (${mergeCount} merge), ${totalLines} lines`
  );

  return respond(200, {
    message: "Processed",
    commits: payload.commits.length,
    mergeCommits: mergeCount,
    lines: totalLines,
    buckets: buckets.size,
  });
}

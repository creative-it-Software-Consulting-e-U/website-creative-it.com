import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const GITHUB_ORG = process.env.GITHUB_ORG!;
const TABLE_NAME = process.env.TABLE_NAME!;

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

// ── Types ────────────────────────────────────────────────────────────────────

interface CommitNode {
  committedDate: string;
  additions: number;
  deletions: number;
}

interface HistoryConnection {
  totalCount: number;
  nodes: CommitNode[];
  pageInfo: { hasNextPage: boolean; endCursor: string };
}

interface RepoNode {
  name: string;
  defaultBranchRef: {
    target: { history: HistoryConnection };
  } | null;
}

interface OrgReposResponse {
  data: {
    organization: {
      repositories: {
        pageInfo: { hasNextPage: boolean; endCursor: string };
        nodes: RepoNode[];
      };
    };
  };
}

interface RepoHistoryPaginatedResponse {
  data: {
    organization: {
      repository: {
        defaultBranchRef: {
          target: { history: HistoryConnection };
        } | null;
      };
    };
  };
}

// ── GitHub GraphQL ───────────────────────────────────────────────────────────

async function graphql<T>(
  query: string,
  variables: Record<string, unknown>
): Promise<T> {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": "creative-it-github-stats",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("GitHub API error:", res.status, text);
    throw new Error(`GitHub API error: ${res.status}`);
  }

  const json = (await res.json()) as {
    data?: unknown;
    errors?: { message: string }[];
  };
  if (json.errors?.length) {
    console.error("GraphQL errors:", JSON.stringify(json.errors));
    throw new Error(`GraphQL error: ${json.errors[0].message}`);
  }
  return json as T;
}

const ORG_REPOS_QUERY = `
  query OrgStats($org: String!, $since: GitTimestamp!, $cursor: String) {
    organization(login: $org) {
      repositories(first: 100, after: $cursor, isArchived: false, isFork: false) {
        pageInfo { hasNextPage endCursor }
        nodes {
          name
          defaultBranchRef {
            target {
              ... on Commit {
                history(since: $since, first: 100) {
                  totalCount
                  nodes { committedDate additions deletions }
                  pageInfo { hasNextPage endCursor }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const REPO_HISTORY_QUERY = `
  query RepoHistory($org: String!, $repo: String!, $since: GitTimestamp!, $cursor: String!) {
    organization(login: $org) {
      repository(name: $repo) {
        defaultBranchRef {
          target {
            ... on Commit {
              history(since: $since, first: 100, after: $cursor) {
                nodes { committedDate additions deletions }
                pageInfo { hasNextPage endCursor }
              }
            }
          }
        }
      }
    }
  }
`;

async function fetchCommitsSince(since: Date): Promise<CommitNode[]> {
  const sinceISO = since.toISOString();
  const allCommits: CommitNode[] = [];
  const reposNeedingPagination: { name: string; cursor: string }[] = [];

  let repoCursor: string | null = null;
  do {
    const result = await graphql<OrgReposResponse>(ORG_REPOS_QUERY, {
      org: GITHUB_ORG,
      since: sinceISO,
      cursor: repoCursor,
    });

    const repos = result.data.organization.repositories;
    for (const repo of repos.nodes) {
      if (!repo.defaultBranchRef) continue;
      const history = repo.defaultBranchRef.target.history;
      allCommits.push(...history.nodes);
      if (history.pageInfo.hasNextPage) {
        reposNeedingPagination.push({
          name: repo.name,
          cursor: history.pageInfo.endCursor,
        });
      }
    }
    repoCursor = repos.pageInfo.hasNextPage ? repos.pageInfo.endCursor : null;
  } while (repoCursor);

  for (const { name, cursor } of reposNeedingPagination) {
    let nextCursor: string | null = cursor;
    while (nextCursor) {
      const result = await graphql<RepoHistoryPaginatedResponse>(
        REPO_HISTORY_QUERY,
        { org: GITHUB_ORG, repo: name, since: sinceISO, cursor: nextCursor }
      );
      const ref = result.data.organization.repository.defaultBranchRef;
      if (!ref) break;
      const history = ref.target.history;
      allCommits.push(...history.nodes);
      nextCursor = history.pageInfo.hasNextPage
        ? history.pageInfo.endCursor
        : null;
    }
  }

  return allCommits;
}

// ── Time helpers ─────────────────────────────────────────────────────────────

function floorToHour(date: Date): Date {
  const d = new Date(date);
  d.setUTCMinutes(0, 0, 0);
  return d;
}

function generateExpectedHours(from: Date, to: Date): string[] {
  const hours: string[] = [];
  for (let t = from.getTime(); t <= to.getTime(); t += 3_600_000) {
    hours.push(new Date(t).toISOString());
  }
  return hours;
}

// ── DynamoDB helpers ─────────────────────────────────────────────────────────

async function getExistingHours(since: Date): Promise<Set<string>> {
  const existing = new Set<string>();
  let lastKey: Record<string, unknown> | undefined;

  do {
    const result = await ddb.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "pk = :pk AND hour_ts >= :since",
        ExpressionAttributeValues: {
          ":pk": "STATS",
          ":since": since.toISOString(),
        },
        ProjectionExpression: "hour_ts",
        ExclusiveStartKey: lastKey,
      })
    );
    for (const item of result.Items ?? []) {
      existing.add(item.hour_ts as string);
    }
    lastKey = result.LastEvaluatedKey;
  } while (lastKey);

  return existing;
}

function bucketByHour(
  commits: CommitNode[]
): Map<string, { commits: number; lines: number }> {
  const buckets = new Map<string, { commits: number; lines: number }>();
  for (const commit of commits) {
    const hourKey = floorToHour(new Date(commit.committedDate)).toISOString();
    const bucket = buckets.get(hourKey) ?? { commits: 0, lines: 0 };
    bucket.commits++;
    bucket.lines += commit.additions + commit.deletions;
    buckets.set(hourKey, bucket);
  }
  return buckets;
}

async function writeBatch(
  records: Map<string, { commits: number; lines: number }>
): Promise<void> {
  const allItems = Array.from(records.entries()).map(([hourTs, data]) => ({
    PutRequest: {
      Item: {
        pk: "STATS",
        hour_ts: hourTs,
        commits: data.commits,
        lines: data.lines,
        ttl: Math.floor(new Date(hourTs).getTime() / 1000) + 9 * 24 * 3600,
      },
    },
  }));

  for (let i = 0; i < allItems.length; i += 25) {
    let batch = allItems.slice(i, i + 25);
    let retries = 0;

    while (batch.length > 0 && retries < 3) {
      const result = await ddb.send(
        new BatchWriteCommand({ RequestItems: { [TABLE_NAME]: batch } })
      );
      const unprocessed = result.UnprocessedItems?.[TABLE_NAME];
      if (!unprocessed?.length) break;
      batch = unprocessed as typeof batch;
      retries++;
      await new Promise((r) => setTimeout(r, 100 * 2 ** retries));
    }
  }
}

// ── Handler ──────────────────────────────────────────────────────────────────

export async function handler(): Promise<void> {
  const now = new Date();
  const currentHour = floorToHour(now);
  // The last fully completed hour
  const previousHour = new Date(currentHour.getTime() - 3_600_000);

  // We want 7 full days of hourly data up to (and including) the previous hour
  const rangeStart = new Date(
    previousHour.getTime() - (7 * 24 - 1) * 3_600_000
  );

  const expectedHours = generateExpectedHours(rangeStart, previousHour);
  const existingHours = await getExistingHours(rangeStart);
  const missingHours = expectedHours.filter((h) => !existingHours.has(h));

  if (missingHours.length === 0) {
    console.log("All hours present, nothing to do");
    return;
  }

  console.log(
    `Missing ${missingHours.length} hour(s), earliest: ${missingHours[0]}`
  );

  const fetchSince = new Date(missingHours[0]);
  const commits = await fetchCommitsSince(fetchSince);
  console.log(
    `Fetched ${commits.length} commits since ${fetchSince.toISOString()}`
  );

  const buckets = bucketByHour(commits);

  // Write only missing hours — include zero-commit hours so they're not retried
  const toWrite = new Map<string, { commits: number; lines: number }>();
  for (const hour of missingHours) {
    toWrite.set(hour, buckets.get(hour) ?? { commits: 0, lines: 0 });
  }

  await writeBatch(toWrite);
  console.log(`Wrote ${toWrite.size} hour record(s) to DynamoDB`);
}

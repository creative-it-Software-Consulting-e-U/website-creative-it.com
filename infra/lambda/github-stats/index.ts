import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const GITHUB_ORG = process.env.GITHUB_ORG!;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(",") ?? [];

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

interface CacheEntry {
  data: StatsResponse;
  timestamp: number;
}

interface StatsResponse {
  commits_24h: number;
  commits_7d: number;
  lines_24h: number;
  lines_7d: number;
  cached_at: string;
}

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
    target: {
      history: HistoryConnection;
    };
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

interface RepoHistoryResponse {
  data: {
    node: {
      history: HistoryConnection;
    };
  };
}

let cache: CacheEntry | null = null;

function getCorsHeaders(origin?: string): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Cache-Control": "public, max-age=300, s-maxage=900",
  };

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
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

async function graphql<T>(query: string, variables: Record<string, unknown>): Promise<T> {
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
    console.error("GitHub API HTTP error:", res.status, text);
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json() as { data?: unknown; errors?: { message: string }[] };

  if (json.errors?.length) {
    console.error("GitHub GraphQL errors:", JSON.stringify(json.errors));
    throw new Error(`GitHub GraphQL error: ${json.errors[0].message}`);
  }

  return json as T;
}

const ORG_REPOS_QUERY = `
  query OrgStats($org: String!, $since7d: GitTimestamp!, $cursor: String) {
    organization(login: $org) {
      repositories(first: 100, after: $cursor, isArchived: false, isFork: false) {
        pageInfo { hasNextPage endCursor }
        nodes {
          name
          defaultBranchRef {
            target {
              ... on Commit {
                history(since: $since7d, first: 100) {
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
  query RepoHistory($org: String!, $repo: String!, $since7d: GitTimestamp!, $cursor: String!) {
    organization(login: $org) {
      repository(name: $repo) {
        defaultBranchRef {
          target {
            ... on Commit {
              history(since: $since7d, first: 100, after: $cursor) {
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

interface RepoHistoryPaginatedResponse {
  data: {
    organization: {
      repository: {
        defaultBranchRef: {
          target: {
            history: HistoryConnection;
          };
        } | null;
      };
    };
  };
}

async function fetchAllCommits(): Promise<CommitNode[]> {
  const now = new Date();
  const since7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const allCommits: CommitNode[] = [];

  // Paginate through all org repos
  let repoCursor: string | null = null;
  const reposNeedingPagination: { name: string; cursor: string }[] = [];

  do {
    const result = await graphql<OrgReposResponse>(ORG_REPOS_QUERY, {
      org: GITHUB_ORG,
      since7d,
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

  // Fetch remaining commits for repos with >100 commits in 7d
  for (const { name, cursor } of reposNeedingPagination) {
    let nextCursor: string | null = cursor;

    while (nextCursor) {
      const result = await graphql<RepoHistoryPaginatedResponse>(REPO_HISTORY_QUERY, {
        org: GITHUB_ORG,
        repo: name,
        since7d,
        cursor: nextCursor,
      });

      const ref = result.data.organization.repository.defaultBranchRef;
      if (!ref) break;

      const history = ref.target.history;
      allCommits.push(...history.nodes);
      nextCursor = history.pageInfo.hasNextPage ? history.pageInfo.endCursor : null;
    }
  }

  return allCommits;
}

function aggregateStats(commits: CommitNode[]): StatsResponse {
  const now = new Date();
  const cutoff24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  let commits24h = 0;
  let commits7d = commits.length;
  let lines24h = 0;
  let lines7d = 0;

  for (const commit of commits) {
    const lines = commit.additions + commit.deletions;
    lines7d += lines;

    if (new Date(commit.committedDate) >= cutoff24h) {
      commits24h++;
      lines24h += lines;
    }
  }

  return {
    commits_24h: commits24h,
    commits_7d: commits7d,
    lines_24h: lines24h,
    lines_7d: lines7d,
    cached_at: now.toISOString(),
  };
}

async function getStats(): Promise<StatsResponse> {
  // Return cached data if still fresh
  if (cache && Date.now() - cache.timestamp < CACHE_TTL_MS) {
    return cache.data;
  }

  try {
    const commits = await fetchAllCommits();
    const stats = aggregateStats(commits);

    cache = { data: stats, timestamp: Date.now() };
    return stats;
  } catch (err) {
    // Return stale cache if available
    if (cache) {
      console.warn("GitHub API error, returning stale cache:", err);
      return cache.data;
    }
    throw err;
  }
}

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const origin = event.headers?.origin;

  if (event.requestContext.http.method !== "GET") {
    return respond(405, { error: "Method not allowed" }, origin);
  }

  try {
    const stats = await getStats();
    return respond(200, stats as unknown as Record<string, unknown>, origin);
  } catch (err) {
    console.error("Failed to fetch GitHub stats:", err);
    return respond(500, { error: "Failed to fetch GitHub stats" }, origin);
  }
}

import { createHmac } from "node:crypto";
import {
  DynamoDBClient,
  ScanCommand,
  DeleteItemCommand,
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand as DocScanCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import {
  BedrockAgentClient,
  StartIngestionJobCommand,
} from "@aws-sdk/client-bedrock-agent";

// ── Environment ──────────────────────────────────────────────────────────────

const TABLE_NAME = process.env.TABLE_NAME!;
const BUCKET_NAME = process.env.BUCKET_NAME!;
const KNOWLEDGE_BASE_ID = process.env.KNOWLEDGE_BASE_ID!;
const DATA_SOURCE_ID = process.env.DATA_SOURCE_ID!;
const HASHNODE_HOST = process.env.HASHNODE_HOST!;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET!;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const GITHUB_REPO = process.env.GITHUB_REPO!;

// ── Clients ──────────────────────────────────────────────────────────────────

const ddbRaw = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(ddbRaw);
const s3 = new S3Client({});
const bedrock = new BedrockAgentClient({});

// ── Types ────────────────────────────────────────────────────────────────────

interface BlogArticle {
  slug: string;
  hashnodeId: string;
  title: string;
  brief: string;
  publishedAt: string;
  url: string;
  coverImage: string | null;
  readTimeInMinutes: number;
  tags: string[];
  content: string;
  updatedAt: string;
}

interface HashnodeTag {
  name: string;
}

interface HashnodePost {
  id: string;
  title: string;
  slug: string;
  brief: string;
  content: { markdown: string };
  tags: HashnodeTag[];
  publishedAt: string;
  url: string;
  coverImage: { url: string } | null;
  readTimeInMinutes: number;
}

interface ApiGatewayEvent {
  headers: Record<string, string | undefined>;
  body?: string;
  isBase64Encoded?: boolean;
}

interface WebhookPayload {
  data?: {
    post?: { id: string };
    eventType?: string;
  };
}

// ── HMAC Verification ────────────────────────────────────────────────────────

function verifySignature(body: string, signatureHeader: string): boolean {
  const parts = Object.fromEntries(
    signatureHeader.split(",").map((p) => {
      const [k, ...v] = p.split("=");
      return [k, v.join("=")];
    })
  );

  const timestamp = parts["t"];
  const expectedSig = parts["v1"];
  if (!timestamp || !expectedSig) return false;

  const payload = `${timestamp}.${body}`;
  const computed = createHmac("sha256", WEBHOOK_SECRET)
    .update(payload)
    .digest("hex");

  return computed === expectedSig;
}

// ── Hashnode GraphQL ─────────────────────────────────────────────────────────

const LISTING_QUERY = `
  query Posts($host: String!, $first: Int!, $after: String) {
    publication(host: $host) {
      posts(first: $first, after: $after) {
        edges {
          node {
            id
            title
            slug
            brief
            content { markdown }
            tags { name }
            publishedAt
            url
            coverImage { url }
            readTimeInMinutes
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

const SINGLE_POST_QUERY = `
  query Post($host: String!, $slug: String!) {
    publication(host: $host) {
      post(slug: $slug) {
        id
        title
        slug
        brief
        content { markdown }
        tags { name }
        publishedAt
        url
        coverImage { url }
        readTimeInMinutes
      }
    }
  }
`;

const POST_BY_ID_QUERY = `
  query PostById($id: ID!) {
    post(id: $id) {
      id
      title
      slug
      brief
      content { markdown }
      tags { name }
      publishedAt
      url
      coverImage { url }
      readTimeInMinutes
    }
  }
`;

async function fetchPostsFromListing(): Promise<HashnodePost[]> {
  const allPosts: HashnodePost[] = [];
  let after: string | null = null;

  do {
    const res = await fetch("https://gql.hashnode.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: LISTING_QUERY,
        variables: { host: HASHNODE_HOST, first: 20, after },
      }),
    });

    if (!res.ok) {
      console.error("Hashnode listing error:", res.status, await res.text());
      break;
    }

    const json = await res.json();
    if (json.errors?.length) {
      console.error("GraphQL errors:", JSON.stringify(json.errors));
      break;
    }

    const { edges, pageInfo } = json.data.publication.posts;
    for (const edge of edges) allPosts.push(edge.node);
    after = pageInfo.hasNextPage ? pageInfo.endCursor : null;
  } while (after);

  return allPosts;
}

async function fetchPostBySlug(slug: string): Promise<HashnodePost | null> {
  try {
    const res = await fetch("https://gql.hashnode.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: SINGLE_POST_QUERY,
        variables: { host: HASHNODE_HOST, slug },
      }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data?.publication?.post ?? null;
  } catch {
    return null;
  }
}

async function fetchPostById(id: string): Promise<HashnodePost | null> {
  try {
    const res = await fetch("https://gql.hashnode.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: POST_BY_ID_QUERY,
        variables: { id },
      }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data?.post ?? null;
  } catch {
    return null;
  }
}

// ── DynamoDB Helpers ─────────────────────────────────────────────────────────

async function getAllArticles(): Promise<BlogArticle[]> {
  const items: BlogArticle[] = [];
  let lastKey: Record<string, any> | undefined;

  do {
    const result = await ddb.send(
      new DocScanCommand({
        TableName: TABLE_NAME,
        ExclusiveStartKey: lastKey,
      })
    );
    if (result.Items) items.push(...(result.Items as BlogArticle[]));
    lastKey = result.LastEvaluatedKey;
  } while (lastKey);

  return items;
}

async function findArticleByHashnodeId(
  hashnodeId: string
): Promise<BlogArticle | null> {
  const result = await ddb.send(
    new DocScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: "hashnodeId = :hid",
      ExpressionAttributeValues: { ":hid": hashnodeId },
    })
  );
  return (result.Items?.[0] as BlogArticle) ?? null;
}

function hashnodePostToArticle(post: HashnodePost): BlogArticle {
  return {
    slug: post.slug,
    hashnodeId: post.id,
    title: post.title,
    brief: post.brief,
    publishedAt: post.publishedAt,
    url: post.url,
    coverImage: post.coverImage?.url ?? null,
    readTimeInMinutes: post.readTimeInMinutes ?? 0,
    tags: post.tags.map((t) => t.name),
    content: post.content.markdown,
    updatedAt: new Date().toISOString(),
  };
}

async function putArticle(article: BlogArticle): Promise<void> {
  await ddb.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: article,
    })
  );
}

async function deleteArticle(slug: string): Promise<void> {
  await ddbRaw.send(
    new DeleteItemCommand({
      TableName: TABLE_NAME,
      Key: { slug: { S: slug } },
    })
  );
}

// ── S3 Helpers ───────────────────────────────────────────────────────────────

function postToMarkdown(article: BlogArticle): string {
  const tags = article.tags.join(", ");
  const date = new Date(article.publishedAt).toISOString().split("T")[0];

  return [
    `# ${article.title}`,
    "",
    `**Published:** ${date}`,
    tags ? `**Tags:** ${tags}` : "",
    `**Original URL:** ${article.url}`,
    "",
    "---",
    "",
    article.content,
  ]
    .filter((line) => line !== "")
    .join("\n");
}

function buildIndexMarkdown(articles: BlogArticle[]): string {
  const sorted = [...articles].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const lines = [
    "# creative-it Blog — Article Index",
    "",
    `The creative-it blog is available at https://blog.creative-it.com`,
    "",
    `There are currently ${sorted.length} published articles:`,
    "",
  ];

  for (const article of sorted) {
    const date = new Date(article.publishedAt).toISOString().split("T")[0];
    const tags = article.tags.join(", ");
    lines.push(`## ${article.title}`);
    lines.push("");
    lines.push(`- **Published:** ${date}`);
    if (tags) lines.push(`- **Tags:** ${tags}`);
    lines.push(`- **URL:** ${article.url}`);
    lines.push(`- **Summary:** ${article.brief}`);
    lines.push("");
  }

  return lines.join("\n");
}

async function writeArticleToS3(article: BlogArticle): Promise<void> {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `hashnode/${article.slug}.md`,
      Body: postToMarkdown(article),
      ContentType: "text/markdown",
    })
  );
}

async function deleteArticleFromS3(slug: string): Promise<void> {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `hashnode/${slug}.md`,
    })
  );
}

async function writeIndexToS3(articles: BlogArticle[]): Promise<void> {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: "hashnode/index.md",
      Body: buildIndexMarkdown(articles),
      ContentType: "text/markdown",
    })
  );
}

// ── KB Ingestion ─────────────────────────────────────────────────────────────

async function triggerKBIngestion(): Promise<void> {
  if (!KNOWLEDGE_BASE_ID || !DATA_SOURCE_ID) return;
  await bedrock.send(
    new StartIngestionJobCommand({
      knowledgeBaseId: KNOWLEDGE_BASE_ID,
      dataSourceId: DATA_SOURCE_ID,
    })
  );
  console.log("Started Bedrock KB ingestion job");
}

// ── GitHub Dispatch ──────────────────────────────────────────────────────────

async function triggerGitHubDispatch(
  eventType: string,
  postId: string
): Promise<void> {
  if (!GITHUB_TOKEN || !GITHUB_REPO) return;
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/dispatches`,
    {
      method: "POST",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_type: "hashnode-publish",
        client_payload: {
          source: "hashnode",
          postId,
          eventType,
          timestamp: new Date().toISOString(),
        },
      }),
    }
  );

  if (!res.ok) {
    console.error("GitHub dispatch error:", res.status, await res.text());
  } else {
    console.log("Triggered GitHub repository_dispatch");
  }
}

// ── Webhook Handler ──────────────────────────────────────────────────────────

async function handleWebhook(event: ApiGatewayEvent) {
  const signature =
    event.headers?.["x-hashnode-signature"] ??
    event.headers?.["X-Hashnode-Signature"];

  const rawBody = event.body ?? "";
  const body = event.isBase64Encoded
    ? Buffer.from(rawBody, "base64").toString("utf-8")
    : rawBody;

  if (!signature || !verifySignature(body, signature)) {
    console.warn("Invalid or missing webhook signature");
    return { statusCode: 401, body: "Unauthorized" };
  }

  let payload: WebhookPayload = {};
  try {
    payload = JSON.parse(body);
  } catch {}

  const postId = payload.data?.post?.id;
  const eventType = payload.data?.eventType;
  console.log(`Webhook received: ${eventType}, postId: ${postId}`);

  if (!postId) {
    return { statusCode: 200, body: "No post ID, skipping" };
  }

  // ── Deletion ──
  if (eventType === "post_deleted") {
    const existing = await findArticleByHashnodeId(postId);
    if (existing) {
      console.log(`Deleting article: ${existing.slug}`);
      await Promise.all([
        deleteArticle(existing.slug),
        deleteArticleFromS3(existing.slug),
      ]);
    }
  } else {
    // ── Publish / Update ──
    // Fetch post directly by ID (avoids race condition where the
    // listing API hasn't indexed the new article yet).
    console.log(`Fetching post by ID: ${postId}`);
    const post = await fetchPostById(postId);

    if (!post) {
      console.error(`Failed to fetch post by ID: ${postId}`);
      await triggerGitHubDispatch(eventType ?? "unknown", postId);
      return { statusCode: 200, body: "Post not found, rebuild triggered" };
    }

    console.log(`Fetched article: ${post.slug}`);
    const article = hashnodePostToArticle(post);
    await Promise.all([putArticle(article), writeArticleToS3(article)]);
    console.log(`Saved article: ${post.slug}`);
  }

  // Regenerate index in S3
  const allArticles = await getAllArticles();
  await writeIndexToS3(allArticles);

  // Trigger KB ingestion and GitHub dispatch
  await Promise.all([
    triggerKBIngestion(),
    triggerGitHubDispatch(eventType ?? "unknown", postId),
  ]);

  return { statusCode: 200, body: "OK" };
}

// ── Scheduled Full Reconciliation ────────────────────────────────────────────

async function handleScheduledSync() {
  console.log("Starting scheduled full reconciliation...");

  // Fetch all from Hashnode listing
  const listingPosts = await fetchPostsFromListing();
  console.log(`Listing returned ${listingPosts.length} articles`);

  // Get all known articles from DynamoDB
  const knownArticles = await getAllArticles();
  const knownBySlug = new Map(knownArticles.map((a) => [a.slug, a]));
  console.log(`DynamoDB has ${knownArticles.length} articles`);

  const listingSlugs = new Set(listingPosts.map((p) => p.slug));

  // Find articles in DynamoDB but not in listing → try slug recovery
  const missingSlugs = knownArticles
    .filter((a) => !listingSlugs.has(a.slug))
    .map((a) => a.slug);

  if (missingSlugs.length > 0) {
    console.log(
      `${missingSlugs.length} known articles missing from listing, recovering: ${missingSlugs.join(", ")}`
    );
    const recovered = await Promise.all(missingSlugs.map(fetchPostBySlug));
    for (let i = 0; i < missingSlugs.length; i++) {
      if (recovered[i]) {
        console.log(`Recovered: ${missingSlugs[i]}`);
        listingPosts.push(recovered[i]!);
      } else {
        // Truly deleted from Hashnode
        console.log(`Truly deleted: ${missingSlugs[i]}`);
        await Promise.all([
          deleteArticle(missingSlugs[i]),
          deleteArticleFromS3(missingSlugs[i]),
        ]);
        knownBySlug.delete(missingSlugs[i]);
      }
    }
  }

  // Write all current articles to DynamoDB + S3
  const articles: BlogArticle[] = [];
  for (const post of listingPosts) {
    const article = hashnodePostToArticle(post);
    articles.push(article);
    await Promise.all([putArticle(article), writeArticleToS3(article)]);
  }

  // Write index to S3
  await writeIndexToS3(articles);
  console.log(`Synced ${articles.length} articles to DynamoDB + S3`);

  // Trigger KB ingestion and GitHub dispatch
  await Promise.all([
    triggerKBIngestion(),
    triggerGitHubDispatch("scheduled_sync", "all"),
  ]);

  console.log("Scheduled sync complete");
}

// ── Entry Point ──────────────────────────────────────────────────────────────

export async function handler(event: ApiGatewayEvent | Record<string, any>) {
  // Webhook: has headers (from API Gateway)
  if ("headers" in event && event.headers) {
    return handleWebhook(event as ApiGatewayEvent);
  }

  // Scheduled or manual invocation
  await handleScheduledSync();
  return { statusCode: 200, body: "Sync complete" };
}

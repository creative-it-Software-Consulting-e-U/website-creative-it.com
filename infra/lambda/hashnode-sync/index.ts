import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import {
  BedrockAgentClient,
  StartIngestionJobCommand,
} from "@aws-sdk/client-bedrock-agent";

const BUCKET_NAME = process.env.BUCKET_NAME!;
const KNOWLEDGE_BASE_ID = process.env.KNOWLEDGE_BASE_ID!;
const DATA_SOURCE_ID = process.env.DATA_SOURCE_ID!;
const HASHNODE_HOST = process.env.HASHNODE_HOST!;

const s3 = new S3Client({});
const bedrock = new BedrockAgentClient({});

// ── Types ────────────────────────────────────────────────────────────────────

interface HashnodeTag {
  name: string;
}

interface HashnodePost {
  title: string;
  slug: string;
  brief: string;
  content: { markdown: string };
  tags: HashnodeTag[];
  publishedAt: string;
  url: string;
}

interface HashnodePageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

interface HashnodePostsResponse {
  data: {
    publication: {
      posts: {
        edges: { node: HashnodePost }[];
        pageInfo: HashnodePageInfo;
      };
    };
  };
  errors?: { message: string }[];
}

// ── Hashnode GraphQL ─────────────────────────────────────────────────────────

const POSTS_QUERY = `
  query Posts($host: String!, $first: Int!, $after: String) {
    publication(host: $host) {
      posts(first: $first, after: $after) {
        edges {
          node {
            title
            slug
            brief
            content { markdown }
            tags { name }
            publishedAt
            url
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
        title
        slug
        brief
        content { markdown }
        tags { name }
        publishedAt
        url
      }
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
        query: POSTS_QUERY,
        variables: { host: HASHNODE_HOST, first: 20, after },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Hashnode API error:", res.status, text);
      throw new Error(`Hashnode API error: ${res.status}`);
    }

    const json = (await res.json()) as HashnodePostsResponse;
    if (json.errors?.length) {
      console.error("GraphQL errors:", JSON.stringify(json.errors));
      throw new Error(`GraphQL error: ${json.errors[0].message}`);
    }

    const { edges, pageInfo } = json.data.publication.posts;
    for (const edge of edges) {
      allPosts.push(edge.node);
    }

    after = pageInfo.hasNextPage ? pageInfo.endCursor : null;
  } while (after);

  return allPosts;
}

// Fetch a single post by slug (reliable even when listing is broken)
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

// Load known slugs from existing S3 objects
async function loadKnownSlugsFromS3(): Promise<string[]> {
  try {
    const result = await s3.send(
      new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        Prefix: "hashnode/",
      })
    );
    return (result.Contents ?? [])
      .map((obj) => obj.Key ?? "")
      .filter((key) => key.endsWith(".md") && key !== "hashnode/index.md")
      .map((key) => key.replace("hashnode/", "").replace(".md", ""));
  } catch {
    return [];
  }
}

// Fetch all posts, recovering missing ones via individual slug queries
async function fetchAllPosts(): Promise<HashnodePost[]> {
  const [listingPosts, knownSlugs] = await Promise.all([
    fetchPostsFromListing(),
    loadKnownSlugsFromS3(),
  ]);

  const listingSlugs = new Set(listingPosts.map((p) => p.slug));
  const missingSlugs = knownSlugs.filter((s) => !listingSlugs.has(s));

  console.log(`Listing returned ${listingPosts.length} articles`);

  if (missingSlugs.length > 0) {
    console.log(
      `${missingSlugs.length} known articles missing from listing, fetching individually: ${missingSlugs.join(", ")}`
    );
    const recovered = await Promise.all(missingSlugs.map(fetchPostBySlug));
    const recoveredPosts = recovered.filter(
      (p): p is HashnodePost => p !== null
    );
    console.log(`Recovered ${recoveredPosts.length} articles via slug queries`);
    return [...listingPosts, ...recoveredPosts];
  }

  return listingPosts;
}

// ── S3 helpers ───────────────────────────────────────────────────────────────

function postToMarkdown(post: HashnodePost): string {
  const tags = post.tags.map((t) => t.name).join(", ");
  const date = new Date(post.publishedAt).toISOString().split("T")[0];

  return [
    `# ${post.title}`,
    "",
    `**Published:** ${date}`,
    tags ? `**Tags:** ${tags}` : "",
    `**Original URL:** ${post.url}`,
    "",
    "---",
    "",
    post.content.markdown,
  ]
    .filter((line) => line !== "")
    .join("\n");
}

async function writePostToS3(post: HashnodePost): Promise<void> {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `hashnode/${post.slug}.md`,
      Body: postToMarkdown(post),
      ContentType: "text/markdown",
    })
  );
}

function buildIndexMarkdown(posts: HashnodePost[]): string {
  const sorted = [...posts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const lines = [
    "# creative-it Blog — Article Index",
    "",
    `The creative-it blog is available at https://buildgrowmatter.hashnode.dev`,
    "",
    `There are currently ${sorted.length} published articles:`,
    "",
  ];

  for (const post of sorted) {
    const date = new Date(post.publishedAt).toISOString().split("T")[0];
    const tags = post.tags.map((t) => t.name).join(", ");
    lines.push(`## ${post.title}`);
    lines.push("");
    lines.push(`- **Published:** ${date}`);
    if (tags) lines.push(`- **Tags:** ${tags}`);
    lines.push(`- **URL:** ${post.url}`);
    lines.push(`- **Summary:** ${post.brief}`);
    lines.push("");
  }

  return lines.join("\n");
}

async function writeIndexToS3(posts: HashnodePost[]): Promise<void> {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: "hashnode/index.md",
      Body: buildIndexMarkdown(posts),
      ContentType: "text/markdown",
    })
  );
}

// ── Handler ──────────────────────────────────────────────────────────────────

export async function handler(): Promise<void> {
  console.log(`Fetching articles from ${HASHNODE_HOST}...`);
  const posts = await fetchAllPosts();
  console.log(`Found ${posts.length} published articles`);

  for (const post of posts) {
    await writePostToS3(post);
  }
  await writeIndexToS3(posts);
  console.log(`Wrote ${posts.length} articles + index to s3://${BUCKET_NAME}/hashnode/`);

  if (KNOWLEDGE_BASE_ID && DATA_SOURCE_ID) {
    await bedrock.send(
      new StartIngestionJobCommand({
        knowledgeBaseId: KNOWLEDGE_BASE_ID,
        dataSourceId: DATA_SOURCE_ID,
      })
    );
    console.log("Started Bedrock KB ingestion job");
  }

  console.log(`Hashnode sync complete: ${posts.length} articles synced`);
}

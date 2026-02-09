import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
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

async function fetchAllPosts(): Promise<HashnodePost[]> {
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

// ── Handler ──────────────────────────────────────────────────────────────────

export async function handler(): Promise<void> {
  console.log(`Fetching articles from ${HASHNODE_HOST}...`);
  const posts = await fetchAllPosts();
  console.log(`Found ${posts.length} published articles`);

  for (const post of posts) {
    await writePostToS3(post);
  }
  console.log(`Wrote ${posts.length} articles to s3://${BUCKET_NAME}/hashnode/`);

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

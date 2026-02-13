import { createHmac } from "node:crypto";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const GITHUB_REPO = process.env.GITHUB_REPO!;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET!;
const HASHNODE_HOST = process.env.HASHNODE_HOST!;

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

const POSTS_IDS_QUERY = `
  query ($host: String!) {
    publication(host: $host) {
      posts(first: 50) {
        edges { node { id } }
      }
    }
  }
`;

async function waitForPostInListing(postId: string): Promise<boolean> {
  const maxAttempts = 20; // 20 × 15s = 5 min max

  for (let i = 1; i <= maxAttempts; i++) {
    const res = await fetch("https://gql.hashnode.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: POSTS_IDS_QUERY,
        variables: { host: HASHNODE_HOST },
      }),
    });

    if (res.ok) {
      const json = await res.json();
      const ids: string[] =
        json.data?.publication?.posts?.edges?.map(
          (e: { node: { id: string } }) => e.node.id
        ) ?? [];

      if (ids.includes(postId)) {
        console.log(`Post ${postId} found in listing on attempt ${i}`);
        return true;
      }
    }

    console.log(`Attempt ${i}/${maxAttempts}: post ${postId} not in listing yet, waiting 15s...`);
    await new Promise((r) => setTimeout(r, 15_000));
  }

  console.warn(`Post ${postId} not found in listing after ${maxAttempts} attempts`);
  return false;
}

export async function handler(event: ApiGatewayEvent) {
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

  // Extract post ID from webhook payload
  let payload: WebhookPayload = {};
  try {
    payload = JSON.parse(body);
  } catch {}

  const postId = payload.data?.post?.id;
  const eventType = payload.data?.eventType;
  console.log(`Webhook received: ${eventType}, postId: ${postId}`);

  // For publish/update events, wait until the post appears in the listing
  if (postId && eventType !== "post_deleted") {
    const found = await waitForPostInListing(postId);
    if (!found) {
      console.error("Timed out waiting for post in listing, triggering rebuild anyway");
    }
  }

  // Trigger GitHub repository_dispatch
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
          postId: postId ?? "unknown",
          eventType: eventType ?? "unknown",
          timestamp: new Date().toISOString(),
        },
      }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("GitHub API error:", res.status, text);
    return { statusCode: 502, body: "GitHub API error" };
  }

  console.log("Triggered rebuild via repository_dispatch");
  return { statusCode: 200, body: "OK" };
}

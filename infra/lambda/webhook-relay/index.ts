const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const GITHUB_REPO = process.env.GITHUB_REPO!;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET!;

interface ApiGatewayEvent {
  headers: Record<string, string | undefined>;
  body?: string;
  isBase64Encoded?: boolean;
}

export async function handler(event: ApiGatewayEvent) {
  // Verify Hashnode's pre-assigned webhook secret
  const secret =
    event.headers?.["x-hashnode-webhook-secret"] ??
    event.headers?.["X-Hashnode-Webhook-Secret"];

  if (secret !== WEBHOOK_SECRET) {
    console.warn("Unauthorized webhook attempt");
    return { statusCode: 401, body: "Unauthorized" };
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

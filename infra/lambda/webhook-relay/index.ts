import { createHmac } from "node:crypto";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const GITHUB_REPO = process.env.GITHUB_REPO!;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET!;

interface ApiGatewayEvent {
  headers: Record<string, string | undefined>;
  body?: string;
  isBase64Encoded?: boolean;
}

function verifySignature(body: string, signatureHeader: string): boolean {
  // Format: t=<timestamp>,v1=<hmac_sha256_hex>
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

export async function handler(event: ApiGatewayEvent) {
  const signature =
    event.headers?.["x-hashnode-signature"] ??
    event.headers?.["X-Hashnode-Signature"];

  const rawBody = event.body ?? "";
  const body = event.isBase64Encoded
    ? Buffer.from(rawBody, "base64").toString("utf-8")
    : rawBody;

  if (!signature || !verifySignature(body, signature)) {
    console.warn("Invalid or missing webhook signature", {
      hasSignature: !!signature,
      bodyLength: body.length,
      secretLength: WEBHOOK_SECRET.length,
    });
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

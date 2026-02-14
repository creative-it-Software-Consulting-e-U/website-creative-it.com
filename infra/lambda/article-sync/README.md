# Article Sync: Hashnode -> Website Pipeline

This document describes the complete content pipeline from publishing an article on Hashnode to it appearing on the creative-it.com website.

## Architecture Overview

```
Hashnode (blog.creative-it.com)
    |
    | POST webhook (post_published / post_updated / post_deleted)
    v
API Gateway (api.<domain>/webhook/hashnode)
    |
    | HMAC-verified (x-hashnode-signature + WEBHOOK_SECRET)
    v
ArticleSync Lambda
    |
    |--- 1. Hashnode GraphQL API (gql.hashnode.com)
    |       Fetches full article content by post ID
    |
    |--- 2. DynamoDB (BlogTable)
    |       Stores article metadata + content (key: slug)
    |
    |--- 3. S3 (creative-it-knowledge-<env>/hashnode/*.md)
    |       Stores article as Markdown for Bedrock Knowledge Base
    |
    |--- 4. Bedrock Knowledge Base
    |       Triggers ingestion job to re-index S3 documents
    |
    |--- 5. GitHub API (repository_dispatch)
    |       Triggers "Rebuild Content" workflow
    |
    v
GitHub Actions (rebuild-content.yml)
    |
    |--- Scans DynamoDB BlogTable -> public/blog-slugs.json
    |--- Builds Astro site with fresh article data
    |
    v
Vercel (production deploy)
    |
    v
Website shows new article on /blog page
```

## Two Trigger Paths

### 1. Webhook (real-time, on publish/update/delete)

**Trigger:** Hashnode sends a POST to `https://api.<domain>/webhook/hashnode`
when an article is published, updated, or deleted.

**Webhook payload:**
```json
{
  "data": {
    "post": { "id": "69907a7a7f99b5d3afeceaa4" },
    "eventType": "post_published"
  }
}
```

**Security:** The request includes an `x-hashnode-signature` header with an
HMAC-SHA256 signature (`t=<timestamp>,v1=<hash>`). The Lambda verifies this
against the `WEBHOOK_SECRET` environment variable before processing.

**Flow:**

1. Lambda receives webhook with `postId` and `eventType`
2. **Publish/Update:** Fetches article directly from Hashnode by ID
   (`post(id: ...)` GraphQL query), saves to DynamoDB + S3
3. **Delete:** Looks up article in DynamoDB by `hashnodeId`, removes from
   DynamoDB + S3
4. Regenerates the S3 index file (`hashnode/index.md`)
5. Triggers Bedrock KB ingestion (re-indexes S3 documents)
6. Triggers GitHub `repository_dispatch` (event type: `hashnode-publish`)

**Why fetch by ID, not by listing?** Hashnode's listing API
(`publication.posts`) uses Stellate CDN caching. When a webhook fires
immediately after publishing, the listing may not yet include the new article.
The `post(id: ...)` query returns the article immediately without caching issues.

### 2. Scheduled Sync (daily reconciliation)

**Trigger:** EventBridge Scheduler runs the Lambda daily at 06:00 UTC
(`article-sync-daily-<env>`). No headers in the event, so the Lambda runs
the `handleScheduledSync` path.

**Flow:**

1. Fetches ALL articles from Hashnode listing API (paginated, 20 per page)
2. Scans ALL articles from DynamoDB
3. Compares the two sets:
   - **New in listing:** saved to DynamoDB + S3
   - **Missing from listing:** verified by direct ID query before deletion.
     Only deleted when BOTH listing AND ID query confirm the article is gone
     (protects against stale CDN cache causing false deletions)
4. Writes all articles to DynamoDB + S3
5. Regenerates S3 index
6. Triggers Bedrock KB ingestion + GitHub dispatch

## GitHub Actions: How the Rebuild is Triggered

The Lambda calls the GitHub API to create a `repository_dispatch` event:

```
POST https://api.github.com/repos/<GITHUB_REPO>/dispatches
{
  "event_type": "hashnode-publish",
  "client_payload": {
    "source": "hashnode",
    "postId": "<id>",
    "eventType": "<post_published|post_updated|post_deleted|scheduled_sync>",
    "timestamp": "2026-02-14T13:37:05.000Z"
  }
}
```

This is authenticated with a `GITHUB_TOKEN` (Personal Access Token stored as
Lambda environment variable, injected via CDK from `GH_PAT_SCHEDULER` secret).

### Rebuild Content Workflow (`.github/workflows/rebuild-content.yml`)

**Triggers:**
- `repository_dispatch` with type `hashnode-publish` (from Lambda)
- `workflow_dispatch` (manual trigger from GitHub UI)

**What it does:**
1. Checks out `main` branch
2. Configures **PROD** AWS credentials
3. Reads CDK stack outputs (Lambda URLs, BlogTable name)
4. Scans DynamoDB BlogTable -> writes `public/blog-slugs.json`
5. Builds Astro site with `vercel build --prod`
6. Deploys to Vercel production

**Important:** This workflow only rebuilds **PROD** (main branch, prod AWS
account). GW/dev is rebuilt by the regular Deploy workflow on push to `dev`.

### Deploy Workflow (`.github/workflows/deploy.yml`)

**Triggers:** `push` to `main` or `dev`

**What it does:**
1. **Job 1 (deploy-cdk):** Deploys CDK stack (infra changes)
2. **Job 2 (deploy-vercel):** Scans DynamoDB -> `blog-slugs.json` -> builds
   and deploys to Vercel

**Branch mapping:**
- `main` -> PROD AWS account + Vercel production
- `dev` -> GW AWS account + Vercel preview

## How the Blog Page Renders Articles

The Astro blog page (`src/components/pages/BlogPage.astro`) is a **static page
built at deploy time**. It reads `public/blog-slugs.json` (generated during CI)
and renders article cards with title, brief, cover image, tags, and a link to
the Hashnode article.

```typescript
// BlogPage.astro (build-time)
let posts = JSON.parse(readFileSync("public/blog-slugs.json", "utf-8"));
```

This means articles only appear on the website after a Vercel rebuild.

## Data Stores

| Store | Key | Purpose |
|-------|-----|---------|
| DynamoDB `BlogTable` | `slug` (partition key) | Full article data (metadata + content + hashnodeId) |
| S3 `hashnode/<slug>.md` | slug | Markdown for Bedrock Knowledge Base |
| S3 `hashnode/index.md` | - | Index of all articles for Knowledge Base |
| `public/blog-slugs.json` | - | Generated at CI time, consumed by Astro build |

## Environment Variables (Lambda)

| Variable | Description |
|----------|-------------|
| `TABLE_NAME` | DynamoDB BlogTable name |
| `BUCKET_NAME` | S3 Knowledge Base bucket |
| `KNOWLEDGE_BASE_ID` | Bedrock Knowledge Base ID |
| `DATA_SOURCE_ID` | Bedrock Data Source ID |
| `HASHNODE_HOST` | `blog.creative-it.com` |
| `WEBHOOK_SECRET` | HMAC secret for Hashnode webhook verification |
| `GITHUB_TOKEN` | GitHub PAT for repository_dispatch |
| `GITHUB_REPO` | `creative-it-Software-Consulting-e-U/website-creative-it.com` |

## Infrastructure (CDK)

Defined in `infra/lib/contact-api-stack.ts`:

- **Lambda:** `ArticleSyncHandler` (Node.js 22, ARM64, 256 MB, 120s timeout)
- **API Gateway Route:** `POST /webhook/hashnode` -> ArticleSyncHandler
- **EventBridge Schedule:** `article-sync-daily-<env>`, cron `0 6 * * ? *` (daily 06:00 UTC)
- **S3 Bucket:** `creative-it-knowledge-<env>` (also used by KnowledgeBase docs deploy)
- **DynamoDB Table:** `BlogTable` (partition key: `slug`, PAY_PER_REQUEST)

## Hashnode Webhook Configuration

The webhook must be configured in the Hashnode dashboard:
1. Go to blog.creative-it.com dashboard -> Webhooks
2. URL: `https://api.<domain>/webhook/hashnode`
3. Secret: must match `WEBHOOK_SECRET` in Lambda env
4. Events: `post_published`, `post_updated`, `post_deleted`

**Note:** The webhook is currently configured for GW (`api.gw.dev.creative-it.com`).
PROD (`api.creative-it.com`) needs its own webhook or both URLs need to be
registered in Hashnode.

## Manual Operations

**Trigger a full sync manually:**
```bash
aws lambda invoke --function-name <ArticleSyncHandler-name> --payload '{}' /tmp/out.json
```

**Trigger a PROD rebuild without code changes:**
```bash
gh workflow run rebuild-content.yml --ref main -f environment=production
```

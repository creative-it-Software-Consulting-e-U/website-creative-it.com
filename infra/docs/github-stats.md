# GitHub Activity Stats API

Live-Statistik (Commits, Lines Changed) der gesamten creative-it GitHub Org, angezeigt als Banner auf der Homepage.

## Architektur

```
Homepage (index.astro)
  -> fetch('https://api.creative-it.com/github-stats')  [client-side]
    -> AWS API Gateway HTTP API v2  (GET /github-stats)
      -> Lambda (Node.js 22, ARM64, 256MB)
        -> GitHub GraphQL API
        -> In-Memory Cache (30min TTL)
      -> Response: { commits_24h, commits_7d, lines_24h, lines_7d, cached_at }
```

## Dateien

| Datei | Beschreibung |
|---|---|
| `infra/lambda/github-stats/index.ts` | Lambda-Funktion: GraphQL-Query, Caching, CORS |
| `infra/lib/contact-api-stack.ts` | CDK Stack: Lambda + API Gateway Route |
| `src/pages/index.astro` | Frontend: Banner mit client-side Fetch |

## GitHub Token

**Fine-Grained Personal Access Token** (erstellt unter github.com > Settings > Developer settings):

- **Resource Owner:** `creative-it-Software-Consulting-e-U`
- **Repository Access:** All repositories
- **Permissions:** `Contents: Read`, `Metadata: Read`

Der Token wird als Environment Variable `GITHUB_TOKEN` beim CDK Deploy gesetzt und als Lambda-Env-Variable gespeichert.

## Deployment

```bash
# 1. AWS SSO Login
aws sso login --profile AdministratorAccess-348854311973

# 2. Deploy (aus /infra Verzeichnis)
cd infra
AWS_PROFILE=AdministratorAccess-348854311973 GITHUB_TOKEN=ghp_xxx npx cdk deploy
```

## API Response

```json
{
  "commits_24h": 12,
  "commits_7d": 87,
  "lines_24h": 1234,
  "lines_7d": 8456,
  "cached_at": "2025-01-15T10:30:00.000Z"
}
```

## Caching-Strategie

1. **Lambda In-Memory Cache:** 30min TTL. Bleibt erhalten solange die Lambda-Instanz warm ist. Bei GitHub-API-Fehlern wird der stale Cache zurueckgegeben.
2. **HTTP Cache-Control:** `public, max-age=300, s-maxage=900` — Browser cached 5min, CDN/Proxy cached 15min.

## Frontend-Verhalten

- Banner ist initial `hidden` (kein CLS/Layout-Shift)
- Client-side `fetch` zum API-Endpoint nach Page Load
- Bei Erfolg und Daten > 0: Fade-in Animation (0.5s)
- Bei Fehler oder 0 Aktivitaet: Banner bleibt unsichtbar
- Zahlen-Formatierung: 1000+ -> "1.2k", 1000000+ -> "1.2M"

## GraphQL Query

Holt alle Org-Repos (non-archived, non-fork) mit Commit-History der letzten 7 Tage in einem Call (100 Repos / 250 Commits pro Page). Repos mit >250 Commits/Woche werden per Follow-up Query paginiert. Leere Repos (`defaultBranchRef === null`) werden uebersprungen.

Die Commits werden lokal in 24h/7d Zeitfenster partitioniert. `additions + deletions` pro Commit werden fuer Lines Changed summiert.

## Troubleshooting

```bash
# Lambda Logs pruefen
AWS_PROFILE=AdministratorAccess-348854311973 aws logs tail /aws/lambda/ContactApiStack-GitHubStatsHandler806A7BE0-W7JbpAEHrgBF --since 5m

# API direkt testen
curl -s https://api.creative-it.com/github-stats | python3 -m json.tool

# CDK Stack Status
AWS_PROFILE=AdministratorAccess-348854311973 npx cdk diff
```

Haeufige Fehler:
- **401 Bad credentials:** GitHub Token abgelaufen oder ungueltig. Neuen Token erstellen und redeployen.
- **organization is null:** Token hat keinen Zugriff auf die Org. Token-Permissions pruefen.

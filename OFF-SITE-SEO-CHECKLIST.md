# Off-Site SEO / Entity-Aufbau — Checkliste

Diese Punkte kann nur der Inhaber umsetzen (eigene Accounts/Identität), nicht der
Code. Reihenfolge nach Aufwand/Wirkung. Stand: SEO-Audit 15.06.2026.

Wichtig: Auf allen Profilen exakt dieselbe NAP-Angabe verwenden
(Name: **creative-it Software Consulting e.U.**, Adresse: Am Gassl 25, 3482 Gösing
am Wagram, AT) und überall `https://www.creative-it.com` verlinken — konsistente
Signale sind für die Entity-Erkennung wichtiger als die reine Linkzahl.

## Hoch (diese Woche)

- [ ] **GitHub-Org/Profil** — Bio/Website-Feld auf `https://www.creative-it.com`
      setzen, relevante Repos (CDK-Stacks, AI-Demos) pinnen. Höchster ROI:
      followed Link von einer Domain mit sehr hoher Autorität, exakt in der Nische.
- [ ] **LinkedIn Company Page** vervollständigen, Website verifizieren, 2–4 Posts
      mit Rücklink auf Blog-Inhalte. Stärkstes Entity-Signal für „wer ist creative-it".
- [ ] **Persönliches LinkedIn-Profil** (Günther Wieser) mit Website-Link — wird für
      das Person-Schema (`sameAs`) gebraucht, das im Code noch ohne `sameAs` ist.

## Mittel (diesen Monat)

- [ ] **AWS Partner Network** (Registered Tier, kostenlos) — Spezialisierungen
      Serverless + AI/ML. Platziert die Marke autoritativ neben „AWS + Austria".
- [ ] **Vercel Partner/Agency Directory** — ehrliche Platzierung (Site läuft auf
      Vercel), relevanter Audience.
- [ ] **WKO-Mitgliedsprofil + firmen-abc.at + herold.at** — AT-Entity-Citations.
- [ ] **dev.to / Hashnode** Autorenprofil + erster Artikel mit `canonical_url` zurück
      auf die eigene Domain (SEO-Credit bleibt bei creative-it.com).
- [ ] **Crunchbase / F6S** Minimalprofil (strukturierte Entity-Daten).

## Niedrig (dieses Quartal, kostenlos)

- [ ] **XING** Company Page (DACH-Entity-Signal).
- [ ] **AWS Community Builders** bewerben (Serverless oder AI/ML) — nach 2–3
      veröffentlichten Fachartikeln; Profil auf aws.amazon.com = sehr hohe Autorität.
- [ ] **Reddit** (r/aws, r/serverless) — echte Expertise teilen, nicht werblich;
      Reddit ist eine Tier-1-Quelle für Perplexity.
- [ ] **Wikidata-Eintrag** für „creative-it Software Consulting e.U." (öffentlich
      editierbar, kein Wikipedia-Artikel nötig) — hilft ChatGPT/AI-Entity-Modellen.

## Optionale Daten-Verbesserung

- [ ] Kostenlosen **Moz-API-Key** hinterlegen (`MOZ_API_KEY`), dann liefert das
      Backlink-Audit (`/seo backlinks`) statt „INSUFFICIENT DATA" einen echten
      0–100-Score (DA/PA, Referring Domains, Anchor Text).

## Folgeschritte, die im Code vorbereitet sind und deinen Input brauchen

- [ ] **HSTS-Preload-Submission**: Der Header `Strict-Transport-Security` mit
      `preload` ist in `vercel.json` gesetzt, aber NICHT eingereicht. Erst wenn alle
      Subdomains dauerhaft HTTPS sind, unter https://hstspreload.org/ einreichen
      (semi-irreversibel).
- [ ] **Person-Schema `sameAs`**: Sobald die persönlichen Profil-URLs feststehen
      (LinkedIn-Personenprofil, ggf. persönlicher GitHub/X), in `src/layouts/Layout.astro`
      im Person-Node ergänzen.
- [ ] **Service-Pricing-Anker / Kundenfälle**: Bewusst NICHT erfunden. Wenn du echte
      Richtpreise oder (anonymisierte) Ergebniszahlen freigibst, baue ich sie in die
      Service-Seiten ein — das war laut Audit der stärkste verbleibende Conversion-Hebel.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start dev server (localhost:4321)
- `npm run build` — Production build (output: `dist/`, Vercel adapter)
- `npm run preview` — Preview production build locally

No linting or test scripts are configured.

## Architecture

Astro 5 static site with Tailwind CSS 4 (`@tailwindcss/vite` plugin, no tailwind.config — uses `@theme` in global.css) deployed to Vercel.

### Content Management

**All site content lives in `src/config/site.ts`** — this is the single source of truth. Pages import `siteConfig` and reference content by key. To change any text on the site, edit only this file.

Key sections: `name`, `tagline`, `description`, `contact`, `social`, `navigation`, `services[]`, `about` (mission/story/values/stats/whyChooseUs), `process[]`, `faq[]`, `pages.*` (per-page content), `colors` (reference).

### Gradient Text Pattern

Headlines use a three-part object for gradient styling:

```typescript
headline: { before: "Build. ", gradient: "Grow.", after: " Matter." }
```

Templates render this as:

```astro
{headline.before}<span class="gradient-text">{headline.gradient}</span>{headline.after}
```

### Design System (global.css)

Colors defined via Tailwind `@theme`: navy (`#030520`), purple (`#A163F1`), indigo (`#6363F1`), cyan (`#23F0C3`), surface (`#0F1132`), off-white (`#F5F5F7`), plus `text-secondary` and `text-muted`.

Typography: Inter font. Classes `heading-xl` / `heading-lg` / `heading-md` / `label` for heading hierarchy.

Components: `.chip` (pill badge), `.card` / `.card-elevated`, `.btn-primary` / `.btn-secondary` / `.btn-glow`, `.gradient-text`, `.divider`.

### Scroll Animations

Elements with class `reveal` fade in on scroll via Intersection Observer (configured in `Layout.astro`). Use inline `style="transition-delay: Xms"` for staggered timing.

### Layout & Components

- `Layout.astro` — Base wrapper with meta tags, ambient background glows, Navigation, Footer, and the reveal observer script
- `Navigation.astro` — Fixed header with scroll blur effect, mobile hamburger menu, active page indicator
- `Footer.astro` — 4-column grid with sitemap, contact, social links

### Pages

All four pages (`index`, `about`, `services`, `contact`) follow the same pattern: import `siteConfig`, destructure page config (`const p = siteConfig.pages.home`), render sections using config values. SVG icons are inline (no icon library).

### Known Build Warning

`@import rules must precede all rules` — CSS warning from the Google Fonts import position in global.css. Non-blocking; does not affect output.

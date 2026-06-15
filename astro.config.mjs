// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// Sitemap lastmod: real frontmatter dates for blog posts (they rarely change),
// build date for evergreen pages. Avoids the "everything modified today" anti-pattern.
const buildDate = new Date().toISOString();
const blogLastmod = /** @type {Record<string, string>} */ ({});
try {
  const blogDir = fileURLToPath(new URL('./src/content/blog', import.meta.url));
  for (const file of fs.readdirSync(blogDir)) {
    if (!file.endsWith('.md')) continue;
    const src = fs.readFileSync(path.join(blogDir, file), 'utf8');
    const updated = src.match(/^updatedAt:\s*(.+)$/m)?.[1]?.trim();
    const published = src.match(/^publishedAt:\s*(.+)$/m)?.[1]?.trim();
    const raw = (updated || published || '').replace(/^["']|["']$/g, '');
    const d = raw ? new Date(raw) : null;
    if (d && !Number.isNaN(d.getTime())) {
      blogLastmod[`https://www.creative-it.com/blog/${file.replace(/\.md$/, '')}/`] =
        d.toISOString();
    }
  }
} catch {
  // Fall back to build date for all URLs if the blog dir can't be read.
}

// Lazy-load + async-decode all markdown body images (they are below the fold).
function rehypeLazyImages() {
  return (tree) => {
    const visit = (node) => {
      if (node.type === 'element' && node.tagName === 'img') {
        node.properties = node.properties || {};
        if (!node.properties.loading) node.properties.loading = 'lazy';
        if (!node.properties.decoding) node.properties.decoding = 'async';
      }
      if (node.children) node.children.forEach(visit);
    };
    visit(tree);
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://www.creative-it.com',
  trailingSlash: 'always',

  prefetch: {
    prefetchAll: true,
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
    rehypePlugins: [rehypeLazyImages],
  },

  vite: {
    plugins: [tailwindcss()],
    build: {
      // Never inline scripts/assets into the HTML — required for the
      // strict CSP (script-src 'self' without unsafe-inline)
      assetsInlineLimit: 0,
    },
  },

  integrations: [
    sitemap({
      serialize(item) {
        item.lastmod = blogLastmod[item.url] ?? buildDate;
        return item;
      },
    }),
  ],

  adapter: vercel()
});
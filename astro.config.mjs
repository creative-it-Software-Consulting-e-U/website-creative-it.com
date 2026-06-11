// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

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
  },

  vite: {
    plugins: [tailwindcss()],
    build: {
      // Never inline scripts/assets into the HTML — required for the
      // strict CSP (script-src 'self' without unsafe-inline)
      assetsInlineLimit: 0,
    },
  },

  integrations: [sitemap()],

  adapter: vercel()
});
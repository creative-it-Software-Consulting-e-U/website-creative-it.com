import type { Locale } from '../config/site';

/** Return the other locale */
export function getAlternateLocale(locale: Locale): Locale {
  return locale === 'en' ? 'de' : 'en';
}

/**
 * Build a locale-aware path.
 * EN paths have no prefix; DE paths get /de prefix.
 */
export function localePath(path: string, locale: Locale): string {
  // Normalise: ensure path starts with /
  const normalized = path.startsWith('/') ? path : `/${path}`;

  if (locale === 'en') return normalized;
  // For DE: /de + path (but /de/ for root)
  return normalized === '/' ? '/de' : `/de${normalized}`;
}

/**
 * Generate hreflang alternate link data for the current page.
 * Returns entries for both locales + x-default (pointing to EN).
 */
export function getHreflangAlternates(pathname: string) {
  // Strip /de prefix if present to get the base path
  const basePath = pathname.startsWith('/de/') ? pathname.slice(3) : pathname === '/de' ? '/' : pathname;

  return [
    { hreflang: 'en', href: basePath },
    { hreflang: 'de', href: localePath(basePath, 'de') },
    { hreflang: 'x-default', href: basePath },
  ];
}

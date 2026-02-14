import type { Locale } from '../config/site';

const SPECIAL_ROUTES = [
  { en: '/legal', de: '/legal/de' },
  { en: '/privacy', de: '/privacy/de' },
] as const;

function normalizePath(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const trimmed = normalized.length > 1 ? normalized.replace(/\/+$/, '') : normalized;
  return trimmed || '/';
}

function splitPathAndSuffix(path: string): { base: string; suffix: string } {
  const match = path.match(/^([^?#]*)(.*)$/);
  const base = match?.[1] || '/';
  const suffix = match?.[2] || '';
  return { base, suffix };
}

function toEnglishRoute(path: string): string {
  let normalized = normalizePath(path);

  for (const route of SPECIAL_ROUTES) {
    if (normalized === route.en || normalized === route.de) return route.en;
  }

  if (normalized === '/de') return '/';
  if (normalized.startsWith('/de/')) normalized = normalized.slice(3);

  for (const route of SPECIAL_ROUTES) {
    if (normalized === route.en || normalized === route.de) return route.en;
  }

  return normalized || '/';
}

/** Return the other locale */
export function getAlternateLocale(locale: Locale): Locale {
  return locale === 'en' ? 'de' : 'en';
}

/**
 * Build a locale-aware path.
 * EN paths have no prefix; DE paths get /de prefix.
 */
export function localePath(path: string, locale: Locale): string {
  const { base, suffix } = splitPathAndSuffix(path);
  const englishRoute = toEnglishRoute(base);

  if (locale === 'en') return `${englishRoute}${suffix}`;

  const specialRoute = SPECIAL_ROUTES.find((route) => route.en === englishRoute);
  if (specialRoute) return `${specialRoute.de}${suffix}`;

  return `${englishRoute === '/' ? '/de' : `/de${englishRoute}`}${suffix}`;
}

/**
 * Generate hreflang alternate link data for the current page.
 * Returns entries for both locales + x-default (pointing to EN).
 */
export function getHreflangAlternates(pathname: string) {
  const enPath = localePath(pathname, 'en');
  const dePath = localePath(pathname, 'de');

  return [
    { hreflang: 'en', href: enPath },
    { hreflang: 'de', href: dePath },
    { hreflang: 'x-default', href: enPath },
  ];
}

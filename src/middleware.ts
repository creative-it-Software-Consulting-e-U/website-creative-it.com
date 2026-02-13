import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
  const { pathname } = context.url;

  // Only redirect on the root path
  if (pathname !== '/') return next();

  // 1. Check locale cookie
  const cookieHeader = context.request.headers.get('cookie') || '';
  const localeMatch = cookieHeader.match(/(?:^|;\s*)locale=(\w+)/);
  if (localeMatch) {
    const cookieLocale = localeMatch[1];
    if (cookieLocale === 'de') {
      return context.redirect('/de', 302);
    }
    // Cookie says 'en' — serve English (no redirect)
    return next();
  }

  // 2. Parse Accept-Language header
  const acceptLang = context.request.headers.get('accept-language') || '';
  if (prefersGerman(acceptLang)) {
    return context.redirect('/de', 302);
  }

  // 3. Default: serve English
  return next();
});

function prefersGerman(header: string): boolean {
  // Parse Accept-Language into weighted list
  const languages = header.split(',').map((part) => {
    const [lang, qPart] = part.trim().split(';');
    const q = qPart ? parseFloat(qPart.replace('q=', '')) : 1.0;
    return { lang: lang.trim().toLowerCase(), q };
  });

  // Sort by quality descending
  languages.sort((a, b) => b.q - a.q);

  // Check if any German variant appears before English
  for (const { lang } of languages) {
    if (lang.startsWith('de')) return true;
    if (lang.startsWith('en') || lang === '*') return false;
  }

  return false;
}

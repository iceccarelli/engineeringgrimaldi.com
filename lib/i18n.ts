/**
 * Route-based i18n. English is canonical at the unprefixed path
 * (https://engineeringgrimaldi.com/…), German lives under /de/….
 * middleware.ts rewrites unprefixed requests into the [lang]=en tree,
 * so `/` serves English with status 200 and /de serves German with
 * status 200 — no client-side language theater, no 404 locales.
 *
 * ES/ZH are intentionally absent: they return only after DE is proven
 * (indexed, hreflang-clean). Do not re-add languages without routes.
 */

import type { Metadata } from 'next';
import { SITE_URL } from './site';

export type Lang = 'en' | 'de';

export const LANGS: readonly Lang[] = ['en', 'de'] as const;

export function isLang(value: string): value is Lang {
  return (LANGS as readonly string[]).includes(value);
}

/** Public href for a logical path in a given language.
 *  `path` is always the unprefixed logical path ('/', '/forge/palletizer'). */
export function langHref(lang: Lang, path: string): string {
  const clean = path === '/' ? '' : path;
  return lang === 'en' ? clean || '/' : `/de${clean}` || '/de';
}

/** Canonical + hreflang set for one logical path, from one language's view. */
export function pageAlternates(lang: Lang, path: string): Metadata['alternates'] {
  return {
    canonical: `${SITE_URL}${langHref(lang, path)}`,
    languages: {
      en: `${SITE_URL}${langHref('en', path)}`,
      de: `${SITE_URL}${langHref('de', path)}`,
      'x-default': `${SITE_URL}${langHref('en', path)}`,
    },
  };
}

/** Pick a translated value from a {en, de} pair. */
export type Localized = { en: string; de: string };
export function pick(lang: Lang, value: Localized): string {
  return value[lang];
}

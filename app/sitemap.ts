import type { MetadataRoute } from 'next';
import { disciplines } from '@/lib/disciplines';
import { forgeLine } from '@/lib/forge';
import { langHref } from '@/lib/i18n';
import { SITE_URL } from '@/lib/site';

/** Logical paths (unprefixed). Each emits an en + de entry with hreflang. */
function logicalPaths(): { path: string; priority: number }[] {
  return [
    { path: '/', priority: 1 },
    { path: '/forge', priority: 0.9 },
    ...forgeLine.map((p) => ({ path: `/forge/${p.slug}`, priority: 0.9 })),
    ...disciplines.map((d) => ({ path: `/disciplines/${d.slug}`, priority: 0.7 })),
    { path: '/tools/pallet-pattern-calculator', priority: 0.9 },
    { path: '/lab', priority: 0.7 },
    { path: '/lab/grid-droop', priority: 0.8 },
    { path: '/book', priority: 0.9 },
    { path: '/impressum', priority: 0.2 },
    { path: '/datenschutz', priority: 0.2 },
  ];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return logicalPaths().flatMap(({ path, priority }) => {
    const languages = {
      en: `${SITE_URL}${langHref('en', path)}`,
      de: `${SITE_URL}${langHref('de', path)}`,
      'x-default': `${SITE_URL}${langHref('en', path)}`,
    };
    return (['en', 'de'] as const).map((lang) => ({
      url: `${SITE_URL}${langHref(lang, path)}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority,
      alternates: { languages },
    }));
  });
}

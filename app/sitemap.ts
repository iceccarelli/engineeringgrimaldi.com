import type { MetadataRoute } from 'next';
import { langHref } from '@/lib/i18n';
import { allNavPaths } from '@/lib/nav';
import { SITE_URL } from '@/lib/site';

/**
 * The sitemap derives from the five-item navigation spine plus the
 * legal pages. Parked routes still answer 200 but are noindex and are
 * deliberately not listed here.
 */
function logicalPaths(): { path: string; priority: number }[] {
  const priorityFor = (path: string): number => {
    if (path === '/') return 1;
    if (path === '/palletizer' || path === '/contact' || path === '/integrators') return 0.9;
    if (path === '/docs' || path.startsWith('/tools')) return 0.8;
    if (path.startsWith('/reference/')) return 0.6;
    return 0.7;
  };
  const paths = new Set<string>(['/', ...allNavPaths()]);
  const extras = ['/impressum', '/datenschutz'];
  return [
    ...Array.from(paths).map((path) => ({ path, priority: priorityFor(path) })),
    ...extras.map((path) => ({ path, priority: 0.2 })),
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

import type { MetadataRoute } from 'next';
import { langHref } from '@/lib/i18n';
import { allNavPaths } from '@/lib/nav';
import { SITE_URL } from '@/lib/site';
import { solutions } from '@/lib/solutions';

/**
 * The sitemap derives from the navigation spine, so a page that is in the
 * menu is in the sitemap by construction and a page in neither does not
 * silently exist. Only genuinely unlinked-but-indexable extras are added
 * explicitly below.
 */
function logicalPaths(): { path: string; priority: number }[] {
  const priorityFor = (path: string): number => {
    if (path === '/') return 1;
    if (path.startsWith('/tools/') || path.startsWith('/forge/')) return 0.9;
    if (path.startsWith('/solutions')) return 0.9;
    if (path === '/pricing' || path === '/book') return 0.9;
    if (path.startsWith('/reference/')) return 0.8;
    if (path.startsWith('/disciplines/')) return 0.7;
    return 0.8;
  };

  const paths = new Set<string>(['/', ...allNavPaths()]);
  for (const s of solutions) paths.add(`/solutions/${s.slug}`);
  // Legal pages are noindex but remain listed for completeness.
  paths.add('/about');
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

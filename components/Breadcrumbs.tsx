import JsonLd from './JsonLd';
import { langHref, type Lang } from '@/lib/i18n';
import { SITE_URL } from '@/lib/site';

/**
 * Visible breadcrumbs AND the matching BreadcrumbList schema from one
 * source, so the two can never drift apart. AWS shows the trail on every
 * inner page; so does this site now.
 */

export type Crumb = { name: string; path: string };

export default function Breadcrumbs({ lang, crumbs }: { lang: Lang; crumbs: Crumb[] }) {
  if (crumbs.length === 0) return null;
  const last = crumbs.length - 1;

  return (
    <>
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          {crumbs.map((c, i) => (
            <li key={c.path}>
              {i === last ? (
                <span aria-current="page">{c.name}</span>
              ) : (
                <a href={langHref(lang, c.path)}>{c.name}</a>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: crumbs.map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: c.name,
            item: `${SITE_URL}${langHref(lang, c.path)}`,
          })),
        }}
      />
    </>
  );
}

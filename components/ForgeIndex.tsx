import StatusBadge from './StatusBadge';
import type { ForgeProduct } from '@/lib/forge';
import { langHref, type Lang } from '@/lib/i18n';

/**
 * The Forge Line index: every product, brutal badge first. This is the
 * only place Paint, Dry and ForgeOS are linked — the homepage and the
 * menus link this index, never those pages. Two clicks, never one.
 */
export default function ForgeIndex({ lang, products }: { lang: Lang; products: ForgeProduct[] }) {
  return (
    <div className="forge-index">
      {products.map((p) => (
        <a className="card card-link forge-row" key={p.slug} href={langHref(lang, `/forge/${p.slug}`)}>
          <div className="forge-row-head">
            <span className="tag">{p.trade[lang]}</span>
            <StatusBadge status={p.status} lang={lang} note={p.statusNote?.[lang]} size="sm" />
          </div>
          <h3>{p.name}</h3>
          <p>{p.tagline[lang]}</p>
          <span className="forge-row-meta">
            {p.repo ? <span className="mono">{p.repo.replace('https://', '')}</span> : <span className="mono">{lang === 'de' ? 'kein Repository' : 'no repository'}</span>}
          </span>
        </a>
      ))}
    </div>
  );
}

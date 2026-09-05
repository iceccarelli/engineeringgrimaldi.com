import Breadcrumbs from './Breadcrumbs';
import { getDict } from '@/lib/dict';
import { langHref, type Lang } from '@/lib/i18n';
import { ENERGY_PAGES, ENERGY_ROOT } from '@/lib/energy/pages';
import { REGISTRY_UPDATED } from '@/lib/energy/registry';

/**
 * One template for every /energy page: breadcrumb, kicker, H1, lead, the
 * cluster sub-navigation, the content, the JSON link where one exists,
 * and the "as of" line. A control page that looks different from its
 * neighbours is a control page nobody trusts.
 */
export default function EnergyShell({
  lang, path, kicker, h1, lead, api, children,
}: {
  lang: Lang; path: string; kicker: string; h1: string; lead: string; api?: string; children: React.ReactNode;
}) {
  const t = getDict(lang);
  const href = (p: string) => langHref(lang, p);
  const crumbs = [{ name: 'Grimaldi Engineering', path: '/' }, { name: 'Energy Intelligence', path: ENERGY_ROOT }];
  if (path !== ENERGY_ROOT) crumbs.push({ name: h1, path });
  const machine = lang === 'de' ? 'Maschinenlesbar' : 'Machine-readable';
  const asOf = lang === 'de' ? 'Stand' : 'As of';

  return (
    <main>
      <div className="sheet sheet-top">
        <div className="section">
          <Breadcrumbs lang={lang} crumbs={crumbs} />
          <span className="kicker kicker-signal">{kicker}</span>
          <h1>{h1}</h1>
          <p className="intro">{lead}</p>

          <nav className="energy-subnav" aria-label="Energy Intelligence">
            <a href={href(ENERGY_ROOT)} className={path === ENERGY_ROOT ? 'on' : undefined}>{lang === 'de' ? 'Übersicht' : 'Overview'}</a>
            {ENERGY_PAGES.map((p) => (
              <a key={p.path} href={href(p.path)} className={p.path === path ? 'on' : undefined}>{p.label[lang]}</a>
            ))}
          </nav>

          {children}

          <p className="energy-meta">
            <span>{asOf} {REGISTRY_UPDATED}</span>
            {api && <a href={`/api/energy/${api}`}>{machine}: /api/energy/{api}</a>}
            <a href="/api/energy/index">{lang === 'de' ? 'Alle Ressourcen' : 'All resources'}: /api/energy/index</a>
          </p>
          <p className="author-block">{t.authorLine}</p>
        </div>
      </div>
    </main>
  );
}

/** Small status chip shared by the energy pages. */
export function Status({ value }: { value: string }) {
  const cls =
    value === 'CORE' || value === 'exists' || value === 'decided' || value === 'benchmarked' || value === 'sold' ? 'chip chip-live'
    : value === 'ARCHIVE' || value === 'missing' || value === 'killed' || value === 'reversed' ? 'chip chip-fault'
    : value === 'EXPERIMENT' || value === 'proposed' || value === 'unbenchmarked' || value === 'specified' || value === 'unlocated' ? 'chip chip-hold'
    : 'chip';
  return <span className={cls}>{value}</span>;
}

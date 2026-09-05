import type { Metadata } from 'next';
import EnergyShell, { Status } from '@/components/EnergyShell';
import JsonLd from '@/components/JsonLd';
import { CLUSTERS, clusterById } from '@/lib/clusters';
import { DECISIONS, KILL_LIST } from '@/lib/energy/decisions';
import { KPIS, KPI_AS_OF } from '@/lib/energy/kpis';
import { ENERGY_GROUP_LABEL, ENERGY_PAGES, ENERGY_ROOT } from '@/lib/energy/pages';
import { REGISTRY, statusCounts } from '@/lib/energy/registry';
import { ENERGY_KICKER, langOf } from '@/lib/energy/seo';
import { WEDGES } from '@/lib/energy/wedge';
import { langHref, pageAlternates } from '@/lib/i18n';
import { ogImages } from '@/lib/meta';
import { SITE_URL } from '@/lib/site';

/**
 * The cluster control page. Top to bottom: mission and progression ·
 * the numbers that matter (registry counts, KPIs that are zero or
 * unmeasured, decisions) · the nine control pages · the other two clusters.
 */

type PageProps = { params: { lang: string } };

const COPY = {
  en: {
    title: 'Energy Intelligence — Cluster Control',
    description: 'Control engine for the Energy Intelligence cluster of Grimaldi Engineering: repository registry, target architecture (GridOS), safety boundary, agent tool contracts, KPIs, decisions, research and external intelligence. Machine-readable at /api/energy/*.',
    h1: 'Energy Intelligence. One company, not a pile of repositories.',
    progression: 'Progression',
    status: 'Status',
    registryH2: 'Registry at a glance',
    registryLead: (n: number) => `${n} repositories under review. Statuses are the only six that exist.`,
    kpiH2: 'KPIs that matter',
    kpiLead: `As of ${KPI_AS_OF}. Zero is zero; "not measured" is not measured.`,
    notMeasured: 'not measured',
    decisionsH2: 'Latest decisions',
    killed: 'killed',
    wedgeH2: 'Commercial wedge',
    pagesH2: 'Control pages',
    clustersH2: 'The other two clusters',
    mission: 'Mission',
    judged: 'Judged by',
    open: 'Open →',
    rule: 'BUILD LESS. PROVE MORE. SELL EARLIER. MEASURE EVERYTHING. KILL WITHOUT EMOTION.',
  },
  de: {
    title: 'Energy Intelligence — Cluster-Steuerung',
    description: 'Steuerungszentrale des Energy-Intelligence-Clusters von Grimaldi Engineering: Repository-Register, Zielarchitektur (GridOS), Sicherheitsgrenze, Agent-Tool-Verträge, KPIs, Entscheidungen, Forschung und externe Intelligenz. Maschinenlesbar unter /api/energy/*.',
    h1: 'Energy Intelligence. Ein Unternehmen, kein Stapel Repositories.',
    progression: 'Progression',
    status: 'Status',
    registryH2: 'Register auf einen Blick',
    registryLead: (n: number) => `${n} Repositories in Prüfung. Es gibt genau sechs Status.`,
    kpiH2: 'KPIs, die zählen',
    kpiLead: `Stand ${KPI_AS_OF}. Null ist null; „nicht gemessen“ ist nicht gemessen.`,
    notMeasured: 'nicht gemessen',
    decisionsH2: 'Letzte Entscheidungen',
    killed: 'gestrichen',
    wedgeH2: 'Kommerzieller Wedge',
    pagesH2: 'Steuerungsseiten',
    clustersH2: 'Die anderen beiden Cluster',
    mission: 'Mission',
    judged: 'Bewertet nach',
    open: 'Öffnen →',
    rule: 'WENIGER BAUEN. MEHR BEWEISEN. FRÜHER VERKAUFEN. ALLES MESSEN. OHNE EMOTION STREICHEN.',
  },
} as const;

export function generateMetadata({ params }: PageProps): Metadata {
  const lang = langOf(params);
  const c = COPY[lang];
  return {
    title: c.title,
    description: c.description,
    alternates: pageAlternates(lang, ENERGY_ROOT),
    openGraph: { title: c.title, description: c.description, images: ogImages(c.title, ENERGY_KICKER) },
    twitter: { card: 'summary_large_image', title: c.title, description: c.description, images: ogImages(c.title, ENERGY_KICKER) },
  };
}

export default function EnergyPage({ params }: PageProps) {
  const lang = langOf(params);
  const c = COPY[lang];
  const cluster = clusterById('energy');
  const counts = statusCounts();
  const href = (p: string) => langHref(lang, p);
  const headline = KPIS.filter((k) => ['revenue', 'qualified', 'pilots', 'deployments', 'assets', 'benchmarks'].includes(k.id));
  const wedge = WEDGES[0];

  return (
    <EnergyShell lang={lang} path={ENERGY_ROOT} kicker={ENERGY_KICKER} h1={c.h1} lead={cluster.mission[lang]} api="index">
      <p className="energy-progression" aria-label={c.progression}>
        {cluster.progression.map((s, i) => (
          <span key={s}>{i > 0 && <i aria-hidden="true">→</i>}<b>{s}</b></span>
        ))}
      </p>
      <p className="honesty" role="note"><span className="kicker">{c.status}</span> {cluster.status[lang]}</p>

      <section className="index-group">
        <h2>{c.registryH2}</h2>
        <p className="intro">{c.registryLead(REGISTRY.length)}</p>
        <div className="energy-counts">
          {Object.entries(counts).map(([s, n]) => (
            <a key={s} href={`${href('/energy/registry')}#${s.toLowerCase()}`} className="energy-count">
              <Status value={s} /><strong>{n}</strong>
            </a>
          ))}
        </div>
      </section>

      <section className="index-group">
        <h2>{c.kpiH2}</h2>
        <p className="intro">{c.kpiLead}</p>
        <div className="grid grid-3 energy-kpis">
          {headline.map((k) => (
            <div className="card" key={k.id}>
              <span className="tag">{k.label}</span>
              <strong className="energy-kpi-value">{k.value === null ? c.notMeasured : k.value}</strong>
              <p>{k.unit} · {k.target}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="index-group">
        <h2>{c.wedgeH2}</h2>
        <div className="card">
          <span className="tag">Wedge {wedge.id} · <Status value={wedge.status} /></span>
          <h3>{wedge.name}</h3>
          <p>{wedge.problem}</p>
          <p><b>ROI:</b> {wedge.roiMetric}</p>
          <a className="cta" href={href('/energy/wedge')}>{c.open}</a>
        </div>
      </section>

      <section className="index-group">
        <h2>{c.decisionsH2}</h2>
        <ul className="energy-list">
          {DECISIONS.slice(-5).reverse().map((d) => (
            <li key={d.id}><code>{d.id}</code> <Status value={d.status} /> <a href={`${href('/energy/decisions')}#${d.id}`}>{d.title}</a></li>
          ))}
        </ul>
        <p className="intro"><b>{KILL_LIST.length}</b> {c.killed} — <a href={`${href('/energy/decisions')}#kill`}>{c.open}</a></p>
      </section>

      <section className="index-group">
        <h2>{c.pagesH2}</h2>
        {(['control', 'architecture', 'execution'] as const).map((g) => (
          <div key={g}>
            <h3 className="kicker">{ENERGY_GROUP_LABEL[g][lang]}</h3>
            <div className="grid">
              {ENERGY_PAGES.filter((p) => p.group === g).map((p) => (
                <a className="card card-link" key={p.path} href={href(p.path)}>
                  <h3>{p.label[lang]}</h3>
                  <p>{p.blurb[lang]}</p>
                  <span className="cta">{c.open}</span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="index-group">
        <h2>{c.clustersH2}</h2>
        <div className="grid grid-2">
          {CLUSTERS.filter((x) => x.id !== 'energy').map((x) => (
            <a className="card card-link" key={x.id} href={x.external ? x.controlPath : href(x.controlPath)} rel={x.external ? 'noopener noreferrer' : undefined}>
              <span className="tag">Cluster {x.order}</span>
              <h3>{x.name[lang]}</h3>
              <p>{x.mission[lang]}</p>
              <p><b>{c.judged}:</b> {x.judgedBy.join(' · ')}</p>
              <span className="cta">{c.open}</span>
            </a>
          ))}
        </div>
      </section>

      <p className="energy-rule">{c.rule}</p>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          '@id': `${SITE_URL}/energy#cluster`,
          name: 'Grimaldi Engineering — Energy Intelligence',
          url: `${SITE_URL}${href(ENERGY_ROOT)}`,
          parentOrganization: { '@id': `${SITE_URL}/#service` },
          founder: { '@id': `${SITE_URL}/#person` },
          description: c.description,
          knowsAbout: ['DERMS', 'BESS dispatch optimization', 'Mieterstrom §42b EnWG', 'power flow', 'physics-informed neural networks', 'digital twin', 'runtime assurance', 'OPC UA', 'IEC 61850', 'IEC 62443'],
          hasPart: ENERGY_PAGES.map((p) => ({ '@type': 'WebPage', name: p.label.en, url: `${SITE_URL}${href(p.path)}` })),
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Dataset',
          '@id': `${SITE_URL}/api/energy/registry#dataset`,
          name: 'Energy Intelligence repository registry',
          description: 'Machine-readable registry of the repositories in the Energy Intelligence cluster with evidence, statuses and target modules.',
          url: `${SITE_URL}/energy/registry`,
          distribution: [{ '@type': 'DataDownload', encodingFormat: 'application/json', contentUrl: `${SITE_URL}/api/energy/registry` }],
          creator: { '@id': `${SITE_URL}/#person` },
          license: 'https://creativecommons.org/licenses/by/4.0/',
        }}
      />
    </EnergyShell>
  );
}

import type { Metadata } from 'next';
import { Status } from '@/components/EnergyShell';
import IntakeForm from '@/components/IntakeForm';
import JsonLd from '@/components/JsonLd';
import { CLUSTERS, NOT_REWARDED_FOR, REWARDED_FOR } from '@/lib/clusters';
import { getDict } from '@/lib/dict';
import { DECISIONS } from '@/lib/energy/decisions';
import { KPIS, KPI_AS_OF } from '@/lib/energy/kpis';
import { ENERGY_PAGES } from '@/lib/energy/pages';
import { REGISTRY, statusCounts } from '@/lib/energy/registry';
import { WEDGES } from '@/lib/energy/wedge';
import { INTAKE_LABELS } from '@/lib/labels';
import { isLang, langHref, pageAlternates, type Lang } from '@/lib/i18n';
import { ogImages } from '@/lib/meta';
import { professionalServiceSchema } from '@/lib/schema';
import { PRODUCT_REPO, SITE_URL } from '@/lib/site';

/**
 * Home = the control engine's front door. Top to bottom: kicker · H1 ·
 * the three clusters in resource order with cluster 1 (Energy) leading
 * and carrying its live numbers · what agents are and are not rewarded
 * for · intake. The Palletizer planner still lives at /palletizer,
 * untouched; it is one door here, not the whole house.
 */

type PageProps = { params: { lang: string } };

const COPY = {
  en: {
    lead: 'engineeringgrimaldi.com is the control engine for the Grimaldi Engineering ventures: three strategic clusters, each judged by evidence, competing for the next euro and the next engineer. Cluster 1 is controlled here in full — registry, architecture, safety boundary, agent tools, KPIs, decisions — and published machine-readable.',
    honestyA: 'registry live',
    honestyB: 'zero paid customers',
    honestyC: (n: number) => `${n} repositories under review`,
    clustersH2: 'Three clusters, in resource order',
    control: 'Control →',
    controlledHere: 'controlled here',
    referenced: 'referenced, runs on its own domain',
    kpiAsOf: `Cluster 1 numbers as of ${KPI_AS_OF}`,
    notMeasured: 'not measured',
    wedge: 'Wedge',
    lastDecision: 'Last decision',
    rewardH2: 'What counts',
    rewarded: 'Rewarded for',
    notRewarded: 'Not rewarded for',
    machineH2: 'For agents, evaluators and procurement',
    machineP: 'Every control page has a JSON twin. Read the index, then the resource you need. No sign-up, no key, read-only.',
    intakeH2: 'Contact',
    intakeLead: 'Energy: tell us what your dispatch or your Mieterstrom project costs you today. Palletizing: send the SKU list. Either way you get an answer, not a demo.',
    palletizerNote: 'Cluster 2 product surface — planner, docs, integrators, tools — is unchanged.',
    source: 'Source',
  },
  de: {
    lead: 'engineeringgrimaldi.com ist die Steuerungszentrale der Grimaldi-Engineering-Unternehmungen: drei strategische Cluster, jedes nach Evidenz bewertet, im Wettbewerb um den nächsten Euro und den nächsten Ingenieur. Cluster 1 wird hier vollständig gesteuert — Register, Architektur, Sicherheitsgrenze, Agent-Tools, KPIs, Entscheidungen — und maschinenlesbar veröffentlicht.',
    honestyA: 'Register live',
    honestyB: 'null zahlende Kunden',
    honestyC: (n: number) => `${n} Repositories in Prüfung`,
    clustersH2: 'Drei Cluster, in Ressourcen-Reihenfolge',
    control: 'Steuerung →',
    controlledHere: 'hier gesteuert',
    referenced: 'referenziert, läuft auf eigener Domain',
    kpiAsOf: `Zahlen Cluster 1, Stand ${KPI_AS_OF}`,
    notMeasured: 'nicht gemessen',
    wedge: 'Wedge',
    lastDecision: 'Letzte Entscheidung',
    rewardH2: 'Was zählt',
    rewarded: 'Belohnt für',
    notRewarded: 'Nicht belohnt für',
    machineH2: 'Für Agenten, Prüfer und Einkauf',
    machineP: 'Jede Steuerungsseite hat einen JSON-Zwilling. Erst den Index lesen, dann die benötigte Ressource. Keine Anmeldung, kein Schlüssel, nur lesend.',
    intakeH2: 'Kontakt',
    intakeLead: 'Energie: Sagen Sie uns, was Ihr Dispatch oder Ihr Mieterstrom-Projekt Sie heute kostet. Palettieren: SKU-Liste senden. In beiden Fällen bekommen Sie eine Antwort, keine Demo.',
    palletizerNote: 'Produktoberfläche Cluster 2 — Planer, Doku, Integratoren, Werkzeuge — ist unverändert.',
    source: 'Quellcode',
  },
} as const;

export function generateMetadata({ params }: PageProps): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const t = getDict(lang);
  const description = lang === 'de'
    ? 'Steuerungszentrale der drei Grimaldi-Engineering-Cluster aus Frankfurt. Cluster 1 Energy Intelligence: GridOS, DER-Integration, Energie Teilen, Sicherheitsgrenze, Agent-Tools, KPIs, Entscheidungen — maschinenlesbar unter /api/energy.'
    : 'Control engine for the three Grimaldi Engineering clusters, Frankfurt. Cluster 1 Energy Intelligence: GridOS, DER integration, Energie Teilen, safety boundary, agent tools, KPIs, decisions — machine-readable at /api/energy.';
  return {
    title: { absolute: `${t.homeH1} | Grimaldi Engineering` },
    description,
    alternates: pageAlternates(lang, '/'),
    openGraph: { title: t.homeH1, description, images: ogImages('Grimaldi Engineering — cluster control', 'Energy Intelligence · Physical AI · Operations') },
    twitter: { card: 'summary_large_image', title: t.homeH1, description, images: ogImages('Grimaldi Engineering — cluster control', 'Energy Intelligence · Physical AI · Operations') },
  };
}

export default function Home({ params }: PageProps) {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const t = getDict(lang);
  const copy = COPY[lang];
  const href = (path: string) => langHref(lang, path);
  const counts = statusCounts();
  const headline = KPIS.filter((k) => ['revenue', 'qualified', 'pilots', 'deployments'].includes(k.id));
  const last = DECISIONS[DECISIONS.length - 1];
  const wedge = WEDGES[0];

  return (
    <main>
      <section className="hero">
        <div className="hero-in">
          <div className="hero-card">
            <span className="kicker kicker-signal">{t.homeKicker}</span>
            <h1>{t.homeH1}</h1>
            <p className="lead">{copy.lead}</p>
          </div>
          <p className="honesty" role="note">
            <span className="chip chip-live">{copy.honestyA}</span>
            <span className="sep">|</span>
            <span className="chip chip-hold">{copy.honestyB}</span>
            <span className="sep">|</span>
            <span>{copy.honestyC(REGISTRY.length)}</span>
            <span className="sep">|</span>
            <a href="/api/energy/index">/api/energy/index</a>
          </p>
        </div>
      </section>

      <div className="section" id="clusters">
        <h2>{copy.clustersH2}</h2>
        <div className="clusters">
          {CLUSTERS.map((c) => {
            const isEnergy = c.id === 'energy';
            return (
              <article className={isEnergy ? 'cluster cluster-primary' : 'cluster'} key={c.id}>
                <span className="kicker">Cluster {c.order} · {c.external ? copy.referenced : copy.controlledHere}</span>
                <h3>{c.name[lang]}</h3>
                <p>{c.mission[lang]}</p>
                <p className="energy-progression">
                  {c.progression.map((s, i) => <span key={s}>{i > 0 && <i aria-hidden="true">→</i>}<b>{s}</b></span>)}
                </p>
                {isEnergy && (
                  <div className="cluster-live">
                    <p className="kicker">{copy.kpiAsOf}</p>
                    <div className="energy-counts">
                      {Object.entries(counts).map(([s, n]) => (
                        <a key={s} href={`${href('/energy/registry')}#${s.toLowerCase()}`} className="energy-count"><Status value={s} /><strong>{n}</strong></a>
                      ))}
                    </div>
                    <div className="grid grid-4 energy-kpis">
                      {headline.map((k) => (
                        <div className="card" key={k.id}>
                          <span className="tag">{k.label}</span>
                          <strong className="energy-kpi-value">{k.value === null ? copy.notMeasured : k.value}</strong>
                          <p>{k.unit}</p>
                        </div>
                      ))}
                    </div>
                    <p><b>{copy.wedge} {wedge.id}</b> <Status value={wedge.status} /> — <a href={href('/energy/wedge')}>{wedge.name}</a></p>
                    <p><b>{copy.lastDecision}</b> <code>{last.id}</code> — <a href={`${href('/energy/decisions')}#${last.id}`}>{last.title}</a></p>
                    <ul className="cluster-pages">
                      {ENERGY_PAGES.map((p) => <li key={p.path}><a href={href(p.path)}>{p.label[lang]}</a></li>)}
                    </ul>
                  </div>
                )}
                {c.id === 'physical-ai' && <p className="honesty" role="note"><span className="chip chip-live">{lang === 'de' ? 'Software ausgeliefert' : 'software shipped'}</span> <span className="chip chip-hold">{lang === 'de' ? 'Zelle nicht in Betrieb' : 'cell not commissioned'}</span> <a href={PRODUCT_REPO} rel="noopener noreferrer">{copy.source}: github.com/iceccarelli/palletizer</a></p>}
                <p className="honesty" role="note">{c.status[lang]}</p>
                <a className="cta" href={c.external ? c.controlPath : href(c.controlPath)} rel={c.external ? 'noopener noreferrer' : undefined}>{copy.control}</a>
              </article>
            );
          })}
        </div>
        <p className="intro">{copy.palletizerNote}</p>
      </div>

      <div className="section" id="rewards">
        <h2>{copy.rewardH2}</h2>
        <div className="grid grid-2">
          <div className="card">
            <h3>{copy.rewarded}</h3>
            <p className="energy-chips">{REWARDED_FOR.map((r) => <span className="chip chip-live" key={r}>{r}</span>)}</p>
          </div>
          <div className="card">
            <h3>{copy.notRewarded}</h3>
            <p className="energy-chips">{NOT_REWARDED_FOR.map((r) => <span className="chip chip-fault" key={r}>{r}</span>)}</p>
          </div>
        </div>
      </div>

      <div className="section" id="machine">
        <h2>{copy.machineH2}</h2>
        <p className="intro">{copy.machineP}</p>
        <pre className="energy-tree">{`GET ${SITE_URL}/api/energy/index
GET ${SITE_URL}/api/energy/registry
GET ${SITE_URL}/api/energy/architecture
GET ${SITE_URL}/api/energy/tools
GET ${SITE_URL}/api/energy/kpis
GET ${SITE_URL}/api/energy/decisions`}</pre>
      </div>

      <div className="section" id="intake">
        <h2>{copy.intakeH2}</h2>
        <p className="intro">{copy.intakeLead}</p>
        <IntakeForm labels={INTAKE_LABELS[lang]} lang={lang} />
      </div>

      <JsonLd data={professionalServiceSchema()} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          '@id': `${SITE_URL}/#clusters`,
          name: 'Grimaldi Engineering — strategic clusters',
          itemListOrder: 'https://schema.org/ItemListOrderAscending',
          itemListElement: CLUSTERS.map((c) => ({
            '@type': 'ListItem',
            position: c.order,
            name: c.name.en,
            description: c.mission.en,
            url: c.external ? c.controlPath : `${SITE_URL}${href(c.controlPath)}`,
          })),
        }}
      />
    </main>
  );
}

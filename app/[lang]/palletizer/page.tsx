import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import StackPlanner from '@/components/StackPlanner';
import { getDict } from '@/lib/dict';
import { PLANNER_LABELS } from '@/lib/labels';
import { isLang, langHref, pageAlternates, type Lang } from '@/lib/i18n';
import { ogImages } from '@/lib/meta';
import { PRODUCT_REPO, SITE_URL } from '@/lib/site';

/** One product, one URL. H1 = verb + object. The planner is the page. */

type PageProps = { params: { lang: string } };
const PATH = '/palletizer';

const COPY = {
  en: {
    title: 'Palletizer — Mixed-SKU Stack Planner for UR, FANUC, KUKA, ABB',
    description: 'Stack a mixed-SKU list, read stability and density, export a URScript stub. Planner, state machine and robot adapters for palletizing cells built by integrators.',
    kicker: 'Product · Palletizer',
    h1: 'Stack mixed SKUs on the robot you already have.',
    lead: 'Paste the SKU list. The planner returns layers, stability, density and cycle time, then an export for the controller.',
    whatH2: 'What ships',
    what: [
      { h: 'Planner', p: 'Height-grouped layers, shelf packing with rotation, per-box base support, centre-of-mass score, crush-limit check. Runs in the browser here and in the Python engine in the repository.' },
      { h: 'State machine', p: 'IDLE · RUN · HOLD · FAULT with named transitions and the fault codes the planner emits. Documented on /docs so a PLC or a person can read it.' },
      { h: 'Adapters', p: 'A URScript stub today. FANUC, KUKA and ABB adapters are planned and listed as such below — not claimed.' },
    ],
    adaptersH2: 'Robot adapters',
    adapters: [
      { robot: 'Universal Robots', iface: 'URScript stub (movel, IO)', status: 'ships', note: 'Exported from the planner on this page.' },
      { robot: 'FANUC', iface: 'KAREL / TP via socket', status: 'planned', note: 'No date. Listed when it exists.' },
      { robot: 'KUKA', iface: 'KRL via EthernetKRL', status: 'planned', note: 'No date. Listed when it exists.' },
      { robot: 'ABB', iface: 'RAPID via PC SDK', status: 'planned', note: 'No date. Listed when it exists.' },
    ],
    thRobot: 'Robot', thIface: 'Interface', thStatus: 'Status', thNote: 'Note',
    ships: 'ships', planned: 'planned',
    statusH2: 'Status',
    status: 'Software shipped: repository public, planner live on this page. Cell not commissioned: no customer cell runs this software yet, so no cell video, no throughput claim and no reference appear here until one does.',
    docs: 'Read the docs →',
    integrators: 'For integrators →',
    contact: 'Send a SKU list →',
    source: 'Source on GitHub',
  },
  de: {
    title: 'Palletizer — Mixed-SKU-Stapelplaner für UR, FANUC, KUKA, ABB',
    description: 'Mixed-SKU-Liste stapeln, Stabilität und Dichte lesen, URScript-Stub exportieren. Planer, Zustandsautomat und Roboter-Adapter für Palettierzellen, die Integratoren bauen.',
    kicker: 'Produkt · Palletizer',
    h1: 'Misch-SKUs auf dem Roboter stapeln, den Sie schon haben.',
    lead: 'SKU-Liste einfügen. Der Planer liefert Lagen, Stabilität, Dichte und Taktzeit, danach einen Export für die Steuerung.',
    whatH2: 'Was ausgeliefert wird',
    what: [
      { h: 'Planer', p: 'Höhengruppierte Lagen, Shelf-Packing mit Rotation, Auflage pro Karton, Schwerpunkt-Score, Stapellast-Prüfung. Läuft hier im Browser und in der Python-Engine im Repository.' },
      { h: 'Zustandsautomat', p: 'IDLE · RUN · HOLD · FAULT mit benannten Übergängen und den Fehlercodes des Planers. Dokumentiert unter /docs, lesbar für SPS und Mensch.' },
      { h: 'Adapter', p: 'Heute ein URScript-Stub. FANUC-, KUKA- und ABB-Adapter sind geplant und unten genau so gelistet — nicht behauptet.' },
    ],
    adaptersH2: 'Roboter-Adapter',
    adapters: [
      { robot: 'Universal Robots', iface: 'URScript-Stub (movel, IO)', status: 'ships', note: 'Export aus dem Planer auf dieser Seite.' },
      { robot: 'FANUC', iface: 'KAREL / TP über Socket', status: 'planned', note: 'Kein Datum. Gelistet, sobald vorhanden.' },
      { robot: 'KUKA', iface: 'KRL über EthernetKRL', status: 'planned', note: 'Kein Datum. Gelistet, sobald vorhanden.' },
      { robot: 'ABB', iface: 'RAPID über PC SDK', status: 'planned', note: 'Kein Datum. Gelistet, sobald vorhanden.' },
    ],
    thRobot: 'Roboter', thIface: 'Schnittstelle', thStatus: 'Status', thNote: 'Hinweis',
    ships: 'verfügbar', planned: 'geplant',
    statusH2: 'Status',
    status: 'Software ausgeliefert: Repository öffentlich, Planer live auf dieser Seite. Zelle nicht in Betrieb genommen: noch keine Kundenzelle läuft mit dieser Software — deshalb hier kein Zellenvideo, keine Durchsatzangabe und keine Referenz, bis es eine gibt.',
    docs: 'Zur Dokumentation →',
    integrators: 'Für Integratoren →',
    contact: 'SKU-Liste senden →',
    source: 'Quellcode auf GitHub',
  },
} as const;

export function generateMetadata({ params }: PageProps): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const c = COPY[lang];
  return {
    title: c.title,
    description: c.description,
    alternates: pageAlternates(lang, PATH),
    openGraph: { title: `${c.title} | Grimaldi Engineering`, description: c.description, type: 'website', images: ogImages(c.h1, c.kicker) },
    twitter: { card: 'summary_large_image', images: ogImages(c.h1, c.kicker) },
  };
}

export default function PalletizerPage({ params }: PageProps) {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const t = getDict(lang);
  const c = COPY[lang];
  const href = (p: string) => langHref(lang, p);

  return (
    <main>
      <div className="section">
        <Breadcrumbs lang={lang} crumbs={[{ name: 'Grimaldi Engineering', path: '/' }, { name: 'Palletizer', path: PATH }]} />
        <span className="kicker kicker-signal">{c.kicker}</span>
        <h1>{c.h1}</h1>
        <p className="lead">{c.lead}</p>
        <StackPlanner labels={PLANNER_LABELS[lang]} lang={lang} />
      </div>

      <div className="section">
        <h2>{c.whatH2}</h2>
        <div className="grid">
          {c.what.map((w) => (
            <div className="card" key={w.h}><h3>{w.h}</h3><p>{w.p}</p></div>
          ))}
        </div>
      </div>

      <div className="section">
        <h2>{c.adaptersH2}</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>{c.thRobot}</th><th>{c.thIface}</th><th>{c.thStatus}</th><th>{c.thNote}</th></tr></thead>
            <tbody>
              {c.adapters.map((a) => (
                <tr key={a.robot}>
                  <td>{a.robot}</td>
                  <td className="mono">{a.iface}</td>
                  <td className={a.status === 'ships' ? 'adapter-ok mono' : 'adapter-plan mono'}>{a.status === 'ships' ? c.ships : c.planned}</td>
                  <td>{a.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="section">
        <h2>{c.statusH2}</h2>
        <p className="honesty" role="note">
          <span className="chip chip-live">{lang === 'de' ? 'Software ausgeliefert' : 'software shipped'}</span>
          <span className="sep">|</span>
          <span className="chip chip-hold">{lang === 'de' ? 'Zelle nicht in Betrieb genommen' : 'cell not commissioned'}</span>
        </p>
        <p className="prose">{c.status}</p>
        <div className="cta-row">
          <a className="btn btn-signal" href={href('/contact')}>{c.contact}</a>
          <a className="btn btn-line" href={href('/docs')}>{c.docs}</a>
          <a className="btn btn-line" href={href('/integrators')}>{c.integrators}</a>
          <a className="btn btn-line" href={PRODUCT_REPO} rel="noopener noreferrer">{c.source}</a>
        </div>
        <p className="author-block">{t.authorLine}</p>
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          '@id': `${SITE_URL}/palletizer#software`,
          name: 'Palletizer',
          url: `${SITE_URL}${href(PATH)}`,
          applicationCategory: 'IndustrialApplication',
          operatingSystem: 'Web, Linux',
          description: c.description,
          author: { '@id': `${SITE_URL}/#person` },
          codeRepository: PRODUCT_REPO,
          isAccessibleForFree: true,
        }}
      />
    </main>
  );
}

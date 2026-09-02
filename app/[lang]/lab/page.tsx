import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import HonestyBanner from '@/components/HonestyBanner';
import StatusBadge from '@/components/StatusBadge';
import { getDict } from '@/lib/dict';
import { isLang, langHref, pageAlternates, type Lang } from '@/lib/i18n';

/**
 * /lab — three things, clearly separated:
 * 1. the one instrument that works (grid droop, a model you can drag);
 * 2. the OEM dreams, parked, each with the status it earned;
 * 3. the banned slogans, struck through, labelled NOT SHIPPED. This is
 *    the only page on the domain where those sentences may appear.
 */

type PageProps = { params: { lang: string } };

const COPY = {
  en: {
    title: 'Lab — one instrument, parked dreams, banned slogans',
    description: 'The grid-droop instrument that works, the robot-OEM ambitions that are parked with their status stated, and the marketing sentences that are banned from every other page.',
    kicker: 'Lab',
    h1: 'What works, what is parked, what is banned',
    lead: 'One entry per instrument or build. Nothing is claimed that a model or a measuring device does not show. Hardware build logs have not shipped; the discipline pages carry a red banner until they do.',
    worksH2: 'Works',
    droopTag: 'Live instrument',
    droopBody: 'A three-phase scope driving an actual frequency-droop integrator: Δf = −f·0.04·ΔP, RoCoF bounded by inertia. The readouts come from the model, not a canned animation. It is a model — no grid was measured.',
    droopCta: 'Open the droop instrument',
    parkedH2: 'Parked OEM dreams',
    parkedLead: 'Each of these is a real repository directory or a real ambition. None is a product. The badge is the whole truth.',
    parked: [
      { name: 'Certified UR / Fanuc / ABB connectors', status: 'IN_DEVELOPMENT' as const, body: 'core/connectors/ur_bridge.py compiles URScript; core/simulation/opcua_robot_mock.py mocks OPC UA. Zero tests import either. A production arm is one partner plus integration days, after a pilot go.' },
      { name: 'Lights-out palletizing cell', status: 'RESEARCH' as const, body: 'No cell exists. The browser demos animate placements from the real optimizer; that is geometry, not a robot.' },
      { name: 'Fleet gateway / cloud SaaS', status: 'PARKED' as const, body: 'gateway/ holds an edge orchestrator and a demo API bridge. No fleet, no customer, no subscription.' },
      { name: 'ROS 2 + LiDAR reference', status: 'RESEARCH' as const, body: 'ros2_integration/ imports without ROS 2 installed (lazy). Reference code, no robot behind it.' },
      { name: 'Learned stability model (ONNX / WebLLM)', status: 'DO_NOT_LINK' as const, body: 'DEMO_REBUILD.md refused to ship a stub pretending to be learned inference. There is no trained model. Nothing to link.' },
      { name: 'Hardware build logs (HV, embedded, power)', status: 'NO_LOG_YET' as const, body: 'No instrument photo or capture published. Each discipline page shows the empty lab-notebook state.' },
    ],
    bannedH2: 'Banned slogans',
    bannedLead: 'These sentences exist in the palletizer README and on the live optimizer site. They are not allowed on any hero or product page of this domain. They are kept here, struck through, so nobody can say they were hidden.',
    banned: [
      'One codebase. Any robot arm. Any gripper. Any factory. Deploy in hours.',
      'Production-grade safety and performance.',
      'Safety-certification-ready software foundation.',
      'Certified connectors for UR, Fanuc, ABB, KUKA, Yaskawa.',
      '$187k+ projected annual savings.',
      'Physics stability score of 1.00 routinely achieved.',
    ],
    notShipped: 'NOT SHIPPED',
    aspiration: 'Allowed here as aspiration only. On /palletizer the same ideas appear in the “Not shipped” column with file paths.',
  },
  de: {
    title: 'Labor — ein Instrument, geparkte Träume, verbotene Slogans',
    description: 'Das Netz-Statik-Instrument, das funktioniert, die geparkten Roboter-OEM-Ambitionen mit genanntem Status und die Marketing-Sätze, die auf jeder anderen Seite verboten sind.',
    kicker: 'Labor',
    h1: 'Was funktioniert, was geparkt ist, was verboten ist',
    lead: 'Ein Eintrag pro Instrument oder Aufbau. Nichts wird behauptet, was ein Modell oder ein Messgerät nicht zeigt. Hardware-Baujournale sind nicht erschienen; die Disziplinseiten tragen bis dahin ein rotes Banner.',
    worksH2: 'Funktioniert',
    droopTag: 'Live-Instrument',
    droopBody: 'Ein Drei-Phasen-Oszilloskop mit echtem Frequenz-Statik-Integrator: Δf = −f·0,04·ΔP, RoCoF durch Trägheit begrenzt. Die Anzeigen kommen aus dem Modell, nicht aus einer Animation. Es ist ein Modell — kein Netz wurde gemessen.',
    droopCta: 'Statik-Instrument öffnen',
    parkedH2: 'Geparkte OEM-Träume',
    parkedLead: 'Jedes davon ist ein echtes Repository-Verzeichnis oder eine echte Ambition. Keines ist ein Produkt. Das Badge ist die ganze Wahrheit.',
    parked: [
      { name: 'Zertifizierte UR- / Fanuc- / ABB-Konnektoren', status: 'IN_DEVELOPMENT' as const, body: 'core/connectors/ur_bridge.py kompiliert URScript; core/simulation/opcua_robot_mock.py mockt OPC UA. Null Tests importieren eines davon. Ein Produktionsarm ist ein Partner plus Integrationstage, nach einem Pilot-Go.' },
      { name: 'Lights-out-Palettierzelle', status: 'RESEARCH' as const, body: 'Es existiert keine Zelle. Die Browser-Demos animieren Platzierungen aus dem echten Optimierer; das ist Geometrie, kein Roboter.' },
      { name: 'Flotten-Gateway / Cloud-SaaS', status: 'PARKED' as const, body: 'gateway/ enthält einen Edge-Orchestrator und eine Demo-API-Brücke. Keine Flotte, kein Kunde, kein Abo.' },
      { name: 'ROS-2- + LiDAR-Referenz', status: 'RESEARCH' as const, body: 'ros2_integration/ importiert ohne installiertes ROS 2 (lazy). Referenzcode, kein Roboter dahinter.' },
      { name: 'Gelerntes Stabilitätsmodell (ONNX / WebLLM)', status: 'DO_NOT_LINK' as const, body: 'DEMO_REBUILD.md hat sich geweigert, einen Stub auszuliefern, der gelernte Inferenz vortäuscht. Es gibt kein trainiertes Modell. Nichts zu verlinken.' },
      { name: 'Hardware-Baujournale (HV, Embedded, Leistung)', status: 'NO_LOG_YET' as const, body: 'Kein Instrumentenfoto und keine Messung veröffentlicht. Jede Disziplinseite zeigt den leeren Laborbuch-Zustand.' },
    ],
    bannedH2: 'Verbotene Slogans',
    bannedLead: 'Diese Sätze stehen im Palletizer-README und auf der Live-Optimierer-Seite. Auf keiner Startseite und keiner Produktseite dieser Domain sind sie erlaubt. Sie bleiben hier, durchgestrichen, damit niemand sagen kann, sie seien versteckt worden.',
    banned: [
      'One codebase. Any robot arm. Any gripper. Any factory. Deploy in hours.',
      'Production-grade safety and performance.',
      'Safety-certification-ready software foundation.',
      'Certified connectors for UR, Fanuc, ABB, KUKA, Yaskawa.',
      '$187k+ projected annual savings.',
      'Physics stability score of 1.00 routinely achieved.',
    ],
    notShipped: 'NICHT AUSGELIEFERT',
    aspiration: 'Hier nur als Aspiration erlaubt. Auf /palletizer erscheinen dieselben Ideen in der Spalte „Nicht ausgeliefert“ mit Dateipfaden.',
  },
} as const;

export function generateMetadata({ params }: PageProps): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const c = COPY[lang];
  return { title: c.title, description: c.description, alternates: pageAlternates(lang, '/lab') };
}

export default function LabIndex({ params }: PageProps) {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const t = getDict(lang);
  const c = COPY[lang];

  return (
    <main>
      <div className="sheet sheet-top">
        <div className="section">
          <Breadcrumbs lang={lang} crumbs={[{ name: 'Grimaldi Engineering', path: '/' }, { name: lang === 'de' ? 'Labor' : 'Lab', path: '/lab' }]} />
          <span className="kicker">{c.kicker}</span>
          <h1>{c.h1}</h1>
          <p className="intro">{c.lead}</p>

          <section className="index-group">
            <h2>{c.worksH2}</h2>
            <div className="grid">
              <a className="card card-link" href={langHref(lang, '/lab/grid-droop')}>
                <div className="forge-row-head">
                  <span className="tag">{c.droopTag}</span>
                  <StatusBadge status="SHIPPED_DEMO" lang={lang} size="sm" />
                </div>
                <h3>{t.labTitle}</h3>
                <p>{c.droopBody}</p>
                <span className="cta">{c.droopCta} →</span>
              </a>
            </div>
          </section>

          <section className="index-group">
            <h2>{c.parkedH2}</h2>
            <p className="intro">{c.parkedLead}</p>
            <div className="grid">
              {c.parked.map((p) => (
                <div className="card" key={p.name}>
                  <div className="forge-row-head"><StatusBadge status={p.status} lang={lang} size="sm" /></div>
                  <h3>{p.name}</h3>
                  <p>{p.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="index-group">
            <h2>{c.bannedH2}</h2>
            <p className="intro">{c.bannedLead}</p>
            <ul className="banned">
              {c.banned.map((b) => (
                <li key={b}>
                  <s>{b}</s> <span className="banned-tag">{c.notShipped}</span>
                </li>
              ))}
            </ul>
            <HonestyBanner tone="amber" title={c.notShipped}>{c.aspiration}</HonestyBanner>
          </section>

          <p className="author-block">{t.authorLine}</p>
        </div>
      </div>
    </main>
  );
}

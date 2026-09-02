import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getDict } from '@/lib/dict';
import { isLang, langHref, pageAlternates, type Lang } from '@/lib/i18n';
import { ogImages } from '@/lib/meta';

/** Distribution page. Two robots. Who supplies what. One diagram. */

type PageProps = { params: { lang: string } };
const PATH = '/integrators';

const COPY = {
  en: {
    title: 'Integrators — Planner, State Machine, Gripper Class, Acceptance Test',
    description: 'For system integrators building palletizing cells: you keep CE, fence, service and the customer. You get the mixed-SKU planner, the state-machine document, a gripper class and an acceptance test.',
    kicker: 'Integrators',
    h1: 'Build the cell. Get the planner.',
    lead: 'Two robots to start: Universal Robots with a URScript stub today, one of FANUC / KUKA / ABB next, chosen by the first integrator that brings a cell.',
    youH2: 'You keep',
    you: ['CE marking and the risk assessment', 'Fence, scanners, safety PLC', 'Service contract and spares', 'The customer relationship and the invoice'],
    weH2: 'You get',
    we: [
      { h: 'Planner', p: 'Mixed-SKU stack from a CSV, stability and density scored, faults named by SKU. Browser planner here, Python engine in the repository.' },
      { h: 'State-machine document', p: 'IDLE · RUN · HOLD · FAULT, entry and exit conditions, fault codes, what the PLC sees on OPC UA.' },
      { h: 'Gripper class', p: 'One vacuum class with pressure feedback and retry, the interface a mechanical gripper implements the same way.' },
      { h: 'Acceptance test', p: 'A written test the cell passes before RUN: sample list, expected layers, stability floor, cycle-time assumption stated.' },
    ],
    diagramH2: 'Same controller, next end-effector',
    diagramCaption: 'Pallet now. Paint or floor end-effector later on the same controller thesis: planner → state machine → robot adapter. No unit for sale beyond the palletizer.',
    now: 'now', later: 'later',
    robotsH2: 'Robots',
    robots: [
      { robot: 'Universal Robots', status: 'URScript stub ships', note: 'UR10e / UR20 class payloads. Export from the planner.' },
      { robot: 'FANUC · KUKA · ABB', status: 'planned', note: 'One adapter next. The integrator with a cell picks which.' },
    ],
    thRobot: 'Robot', thStatus: 'Status', thNote: 'Note',
    cta: 'Bring a cell →',
    docs: 'Docs →',
  },
  de: {
    title: 'Integratoren — Planer, Zustandsautomat, Greiferklasse, Abnahmetest',
    description: 'Für Systemintegratoren, die Palettierzellen bauen: Sie behalten CE, Zaun, Service und den Kunden. Sie erhalten den Mixed-SKU-Planer, die Zustandsautomat-Dokumentation, eine Greiferklasse und einen Abnahmetest.',
    kicker: 'Integratoren',
    h1: 'Sie bauen die Zelle. Sie bekommen den Planer.',
    lead: 'Zwei Roboter zum Start: Universal Robots mit URScript-Stub heute, einer von FANUC / KUKA / ABB als Nächstes — gewählt vom ersten Integrator, der eine Zelle mitbringt.',
    youH2: 'Sie behalten',
    you: ['CE-Kennzeichnung und Risikobeurteilung', 'Zaun, Scanner, Sicherheits-SPS', 'Servicevertrag und Ersatzteile', 'Kundenbeziehung und Rechnung'],
    weH2: 'Sie erhalten',
    we: [
      { h: 'Planer', p: 'Mixed-SKU-Stapel aus einer CSV, Stabilität und Dichte bewertet, Fehler pro SKU benannt. Browser-Planer hier, Python-Engine im Repository.' },
      { h: 'Zustandsautomat-Dokumentation', p: 'IDLE · RUN · HOLD · FAULT, Ein- und Austrittsbedingungen, Fehlercodes, was die SPS über OPC UA sieht.' },
      { h: 'Greiferklasse', p: 'Eine Vakuumklasse mit Druckrückmeldung und Wiederholung; die Schnittstelle, die ein mechanischer Greifer genauso implementiert.' },
      { h: 'Abnahmetest', p: 'Ein schriftlicher Test, den die Zelle vor RUN besteht: Beispielliste, erwartete Lagen, Stabilitätsuntergrenze, Taktzeitannahme benannt.' },
    ],
    diagramH2: 'Gleiche Steuerung, nächster Endeffektor',
    diagramCaption: 'Palette jetzt. Maler- oder Boden-Endeffektor später auf derselben Controller-These: Planer → Zustandsautomat → Roboter-Adapter. Keine Einheit im Verkauf außer dem Palletizer.',
    now: 'jetzt', later: 'später',
    robotsH2: 'Roboter',
    robots: [
      { robot: 'Universal Robots', status: 'URScript-Stub verfügbar', note: 'Nutzlastklasse UR10e / UR20. Export aus dem Planer.' },
      { robot: 'FANUC · KUKA · ABB', status: 'geplant', note: 'Ein Adapter als Nächstes. Der Integrator mit Zelle wählt.' },
    ],
    thRobot: 'Roboter', thStatus: 'Status', thNote: 'Hinweis',
    cta: 'Zelle mitbringen →',
    docs: 'Dokumentation →',
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

function Diagram({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  const label = lang === 'de'
    ? { planner: 'Planer', sm: 'Zustandsautomat', adapter: 'Roboter-Adapter', ctrl: 'Steuerung', pallet: 'Palettengreifer', paint: 'Lackier-Endeffektor', floor: 'Boden-Endeffektor' }
    : { planner: 'Planner', sm: 'State machine', adapter: 'Robot adapter', ctrl: 'Controller', pallet: 'Pallet gripper', paint: 'Paint end-effector', floor: 'Floor end-effector' };
  return (
    <figure className="diagram" style={{ margin: 0 }}>
      <svg viewBox="0 0 960 300" role="img" aria-label={c.diagramCaption} fontFamily="IBM Plex Mono, ui-monospace, monospace" fontSize="14">
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#12151A" />
          </marker>
        </defs>
        <rect x="24" y="120" width="180" height="60" rx="4" fill="#FFFFFF" stroke="#12151A" />
        <text x="114" y="155" textAnchor="middle" fill="#12151A">{label.planner}</text>
        <rect x="264" y="120" width="180" height="60" rx="4" fill="#FFFFFF" stroke="#12151A" />
        <text x="354" y="155" textAnchor="middle" fill="#12151A">{label.sm}</text>
        <rect x="504" y="120" width="180" height="60" rx="4" fill="#FFFFFF" stroke="#12151A" />
        <text x="594" y="155" textAnchor="middle" fill="#12151A">{label.adapter}</text>
        <line x1="204" y1="150" x2="262" y2="150" stroke="#12151A" strokeWidth="1.5" markerEnd="url(#arr)" />
        <line x1="444" y1="150" x2="502" y2="150" stroke="#12151A" strokeWidth="1.5" markerEnd="url(#arr)" />
        <rect x="24" y="96" width="660" height="108" rx="6" fill="none" stroke="#D7DCD6" strokeDasharray="4 4" />
        <text x="30" y="88" fill="#5C6570" fontSize="12">{label.ctrl}</text>
        <line x1="684" y1="150" x2="742" y2="60" stroke="#12151A" strokeWidth="1.5" markerEnd="url(#arr)" />
        <line x1="684" y1="150" x2="742" y2="150" stroke="#D7DCD6" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#arr)" />
        <line x1="684" y1="150" x2="742" y2="240" stroke="#D7DCD6" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#arr)" />
        <rect x="744" y="30" width="192" height="60" rx="4" fill="#FF8A00" stroke="#FF8A00" />
        <text x="840" y="56" textAnchor="middle" fill="#1A0E00" fontWeight="600">{label.pallet}</text>
        <text x="840" y="76" textAnchor="middle" fill="#1A0E00" fontSize="12">{c.now}</text>
        <rect x="744" y="120" width="192" height="60" rx="4" fill="#FFFFFF" stroke="#D7DCD6" />
        <text x="840" y="146" textAnchor="middle" fill="#5C6570">{label.paint}</text>
        <text x="840" y="166" textAnchor="middle" fill="#5C6570" fontSize="12">{c.later}</text>
        <rect x="744" y="210" width="192" height="60" rx="4" fill="#FFFFFF" stroke="#D7DCD6" />
        <text x="840" y="236" textAnchor="middle" fill="#5C6570">{label.floor}</text>
        <text x="840" y="256" textAnchor="middle" fill="#5C6570" fontSize="12">{c.later}</text>
      </svg>
      <figcaption className="diagram-caption">{c.diagramCaption}</figcaption>
    </figure>
  );
}

export default function IntegratorsPage({ params }: PageProps) {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const t = getDict(lang);
  const c = COPY[lang];
  const href = (p: string) => langHref(lang, p);

  return (
    <main>
      <div className="section">
        <Breadcrumbs lang={lang} crumbs={[{ name: 'Grimaldi Engineering', path: '/' }, { name: c.kicker, path: PATH }]} />
        <span className="kicker kicker-signal">{c.kicker}</span>
        <h1>{c.h1}</h1>
        <p className="lead">{c.lead}</p>
        <div className="grid grid-2">
          <div className="card">
            <h3>{c.youH2}</h3>
            <ul style={{ margin: 0, paddingLeft: 18 }}>{c.you.map((y) => <li key={y}>{y}</li>)}</ul>
          </div>
          <div className="card">
            <h3>{c.weH2}</h3>
            <ul style={{ margin: 0, paddingLeft: 18 }}>{c.we.map((w) => <li key={w.h}><strong>{w.h}</strong> — {w.p}</li>)}</ul>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>{c.robotsH2}</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>{c.thRobot}</th><th>{c.thStatus}</th><th>{c.thNote}</th></tr></thead>
            <tbody>
              {c.robots.map((r, i) => (
                <tr key={r.robot}><td>{r.robot}</td><td className={i === 0 ? 'adapter-ok mono' : 'adapter-plan mono'}>{r.status}</td><td>{r.note}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="section">
        <h2>{c.diagramH2}</h2>
        <Diagram lang={lang} />
        <div className="cta-row" style={{ marginTop: 24 }}>
          <a className="btn btn-signal" href={href('/contact')}>{c.cta}</a>
          <a className="btn btn-line" href={href('/docs')}>{c.docs}</a>
        </div>
        <p className="author-block">{t.authorLine}</p>
      </div>
    </main>
  );
}

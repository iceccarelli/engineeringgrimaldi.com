import type { Metadata } from 'next';
import EnergyShell, { Status } from '@/components/EnergyShell';
import DecisionTimeline from '@/components/viz/DecisionTimeline';
import { CLUSTER_MOVE_RECORD, PROJECT_GATES } from '@/lib/clusters';
import { DECISIONS, KILL_LIST } from '@/lib/energy/decisions';
import { energyPage } from '@/lib/energy/pages';
import { ENERGY_KICKER, energyMetadata, langOf } from '@/lib/energy/seo';

type PageProps = { params: { lang: string } };
const PAGE = energyPage('decisions')!;

const COPY = {
  en: {
    lead: 'Append-only. A decision is reversed by a new decision that names it, never by editing history. Items marked CEO need approval before they are acted on.',
    logH2: 'Decision log',
    because: 'Because',
    ceo: 'CEO approval required',
    killH2: 'Kill list',
    kth: ['What', 'Date', 'Reason', 'Decision'],
    gatesH2: 'Gates every new project passes',
    gatesLead: 'Fail two or more → ARCHIVE.',
    moveH2: 'Moving a repository between clusters requires',
  },
  de: {
    lead: 'Nur anhängend. Eine Entscheidung wird durch eine neue Entscheidung aufgehoben, die sie benennt — nie durch Editieren der Historie. Mit CEO markierte Punkte brauchen Freigabe vor Umsetzung.',
    logH2: 'Entscheidungslog',
    because: 'Weil',
    ceo: 'CEO-Freigabe erforderlich',
    killH2: 'Kill-Liste',
    kth: ['Was', 'Datum', 'Grund', 'Entscheidung'],
    gatesH2: 'Gates, die jedes neue Projekt passiert',
    gatesLead: 'Zwei oder mehr verfehlt → ARCHIVE.',
    moveH2: 'Ein Repository zwischen Clustern zu verschieben erfordert',
  },
} as const;

export function generateMetadata({ params }: PageProps): Metadata {
  return energyMetadata(langOf(params), PAGE);
}

export default function DecisionsPage({ params }: PageProps) {
  const lang = langOf(params);
  const c = COPY[lang];
  return (
    <EnergyShell lang={lang} path={PAGE.path} kicker={ENERGY_KICKER} h1={PAGE.label[lang]} lead={c.lead} api={PAGE.api}>
      <DecisionTimeline lang={lang} />
      <section className="index-group">
        <h2>{c.logH2}</h2>
        {[...DECISIONS].reverse().map((d) => (
          <article className="card energy-decision" key={d.id} id={d.id}>
            <span className="tag"><code>{d.id}</code> · {d.date} · <Status value={d.status} />{d.needsCeo && <> · <span className="chip chip-hold">{c.ceo}</span></>}</span>
            <h3>{d.title}</h3>
            <p>{d.decision}</p>
            <p><b>{c.because}:</b> {d.because.join(' · ')}</p>
          </article>
        ))}
      </section>

      <section className="index-group" id="kill">
        <h2>{c.killH2}</h2>
        <div className="table-wrap">
          <table className="ref-table energy-table">
            <thead><tr>{c.kth.map((h) => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {KILL_LIST.map((k) => (
                <tr key={k.what}><td><b>{k.what}</b></td><td>{k.date}</td><td>{k.reason}</td><td><a href={`#${k.decision}`}><code>{k.decision}</code></a></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="index-group">
        <h2>{c.gatesH2}</h2>
        <p className="intro">{c.gatesLead}</p>
        <p className="energy-progression">{PROJECT_GATES.map((g, i) => <span key={g}>{i > 0 && <i aria-hidden="true">→</i>}<b>{g}</b></span>)}</p>
        <h3>{c.moveH2}</h3>
        <p className="energy-chips">{CLUSTER_MOVE_RECORD.map((m) => <span className="chip" key={m}>{m}</span>)}</p>
      </section>
    </EnergyShell>
  );
}

import type { Metadata } from 'next';
import EnergyShell, { Status } from '@/components/EnergyShell';
import EnergyIntakeForm from '@/components/EnergyIntakeForm';
import WedgeFunnel from '@/components/viz/WedgeFunnel';
import { CONVERSATIONS, CUSTOMERS_UPDATED, SEGMENT_LABEL, STAGES, bySegment } from '@/lib/energy/customers';
import { energyPage } from '@/lib/energy/pages';
import { ENERGY_KICKER, energyMetadata, langOf } from '@/lib/energy/seo';
import { DISCOVERY_QUESTIONS, NEVER_ASK } from '@/lib/energy/wedge';
import { ENERGY_INTAKE_LABELS } from '@/lib/labels';
import { CONTACT_EMAIL } from '@/lib/site';

type PageProps = { params: { lang: string } };
const PAGE = energyPage('customers')!;

const COPY = {
  en: {
    lead: `Every conversation as one anonymised record — segment, region, size band, what it costs them, who owns the budget, stage. As of ${CUSTOMERS_UPDATED}. The funnel on this site is computed from this list; nothing is typed by hand.`,
    stagesH2: 'Stages — what counts as validation',
    counts: 'counts', notCounts: 'does not count',
    segH2: 'Conversations by segment',
    listH2: 'Records',
    empty: 'No conversations recorded yet. This is the number to change first. Use the form below, or log the first call in the private CRM and add its record here.',
    th: ['Ref', 'Date', 'Segment', 'Region', 'Size', 'Stage', 'Costs them today', 'Band / yr', 'Budget owner', 'Solved today by', 'Success worth', 'Next step'],
    askH2: 'What we ask, every time',
    never: 'Never asked:',
    intakeH2: 'Start a conversation',
    intakeLead: 'Five questions, two minutes. You get an answer with numbers, not a demo.',
  },
  de: {
    lead: `Jedes Gespräch als ein anonymisierter Datensatz — Segment, Region, Größenklasse, was es sie kostet, wer das Budget hält, Stufe. Stand ${CUSTOMERS_UPDATED}. Der Trichter auf dieser Seite wird aus dieser Liste berechnet; nichts ist von Hand getippt.`,
    stagesH2: 'Stufen — was als Validierung zählt',
    counts: 'zählt', notCounts: 'zählt nicht',
    segH2: 'Gespräche nach Segment',
    listH2: 'Datensätze',
    empty: 'Noch keine Gespräche erfasst. Das ist die Zahl, die zuerst zu ändern ist. Formular unten nutzen — oder den ersten Anruf im privaten CRM protokollieren und den Datensatz hier ergänzen.',
    th: ['Ref', 'Datum', 'Segment', 'Region', 'Größe', 'Stufe', 'Kostet sie heute', 'Band / Jahr', 'Budgetverantwortung', 'Heute gelöst durch', 'Erfolg wert', 'Nächster Schritt'],
    askH2: 'Was wir fragen, jedes Mal',
    never: 'Nie gefragt:',
    intakeH2: 'Gespräch beginnen',
    intakeLead: 'Fünf Fragen, zwei Minuten. Sie bekommen eine Antwort mit Zahlen, keine Demo.',
  },
} as const;

export function generateMetadata({ params }: PageProps): Metadata {
  return energyMetadata(langOf(params), PAGE);
}

export default function CustomersPage({ params }: PageProps) {
  const lang = langOf(params);
  const c = COPY[lang];
  const seg = bySegment();
  return (
    <EnergyShell lang={lang} path={PAGE.path} kicker={ENERGY_KICKER} h1={PAGE.label[lang]} lead={c.lead} api={PAGE.api}>
      <WedgeFunnel lang={lang} />

      <section className="index-group">
        <h2>{c.stagesH2}</h2>
        <ol className="energy-rules">
          {STAGES.map((s) => <li key={s.stage}><code>{s.stage}</code> — {s.label} <Status value={s.counts ? 'decided' : 'reversed'} /> <small>{s.counts ? c.counts : c.notCounts}</small></li>)}
        </ol>
      </section>

      <section className="index-group">
        <h2>{c.segH2}</h2>
        <p className="energy-chips">
          {(Object.keys(seg) as (keyof typeof seg)[]).map((k) => <span className="chip" key={k}>{SEGMENT_LABEL[k]} <b>{seg[k]}</b></span>)}
        </p>
      </section>

      <section className="index-group">
        <h2>{c.listH2} <span className="energy-count-inline">{CONVERSATIONS.length}</span></h2>
        {CONVERSATIONS.length === 0 ? (
          <p className="boundary-note">{c.empty}</p>
        ) : (
          <div className="table-wrap">
            <table className="ref-table energy-table">
              <thead><tr>{c.th.map((h) => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {CONVERSATIONS.map((r) => (
                  <tr key={r.ref}>
                    <td><code>{r.ref}</code></td><td>{r.date}</td><td>{SEGMENT_LABEL[r.segment]}</td><td>{r.region}</td><td>{r.size}</td>
                    <td><Status value={r.stage === 'declined' ? 'killed' : r.stage === 'paid-trial' ? 'sold' : 'proposed'} /> <code>{r.stage}</code></td>
                    <td>{r.costsToday}</td><td><code>{r.costBand}</code></td><td>{r.budgetOwner}</td><td>{r.currentSolution}</td><td>{r.successWorth}</td><td>{r.declinedBecause ?? r.nextStep}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="index-group">
        <h2>{c.askH2}</h2>
        <ol className="energy-rules">{DISCOVERY_QUESTIONS.map((q) => <li key={q}>{q}</li>)}</ol>
        <p className="boundary-note"><b>{c.never}</b> “{NEVER_ASK}”</p>
      </section>

      <section className="index-group" id="intake">
        <h2>{c.intakeH2}</h2>
        <p className="intro">{c.intakeLead}</p>
        <p id="received" className="intake-ok" role="status">{ENERGY_INTAKE_LABELS[lang].ok}</p>
        <p id="error" className="intake-err" role="alert">{ENERGY_INTAKE_LABELS[lang].errGeneric} {CONTACT_EMAIL}</p>
        <EnergyIntakeForm labels={ENERGY_INTAKE_LABELS[lang]} lang={lang} />
      </section>
    </EnergyShell>
  );
}

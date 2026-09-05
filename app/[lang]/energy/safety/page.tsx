import type { Metadata } from 'next';
import EnergyShell from '@/components/EnergyShell';
import { SAFETY_CHAIN } from '@/lib/energy/architecture';
import { energyPage } from '@/lib/energy/pages';
import { ENERGY_KICKER, energyMetadata, langOf } from '@/lib/energy/seo';

type PageProps = { params: { lang: string } };
const PAGE = energyPage('safety')!;

const COPY = {
  en: {
    lead: 'The LLM / agent never controls a physical system. Ten stages sit between a proposal and a setpoint; the first three are probabilistic, the last seven deterministic. No stage may be skipped, merged or short-circuited — in code, in a demo, or in a pilot.',
    chainH2: 'The chain',
    th: ['#', 'Stage', 'Kind', 'What it does'],
    rulesH2: 'Rules in force',
    rules: [
      'Probabilistic components (agent, planner, forecasting) have no network path to any actuator, gateway or OT segment.',
      'Candidate actions are typed, versioned and signed by the proposer; a simulation cites the exact candidate hash it evaluated.',
      'validate_constraints fails closed: an evaluation error is a failure.',
      'request_authorization is the only tool that leaves the sandbox, and it produces a request, not a command.',
      'Authorization is signed, time-boxed and revocable; pre-approved envelopes are narrow, explicit and logged.',
      'NeuralBridge is the only component allowed to talk to an actuator. It has no ML dependency and its own release cadence.',
      'Every stage writes to the hash-chained audit log; a chain break halts request tools.',
      'Until a NeuralBridge repository exists and passes its own tests, the cluster stops at RECOMMEND (decision D-007).',
    ],
    statusH2: 'Status',
    status: 'Specified. NeuralBridge is unlocated in the live inventory; the governance kernel of mcp-foundry (HMAC token gate, hash-chained audit) is the candidate foundation for stages 8–9. No EXECUTE-stage code exists in the cluster, by decision.',
  },
  de: {
    lead: 'Der LLM/Agent steuert nie ein physisches System. Zehn Stufen liegen zwischen Vorschlag und Sollwert; die ersten drei sind probabilistisch, die letzten sieben deterministisch. Keine Stufe darf übersprungen, verschmolzen oder kurzgeschlossen werden — nicht im Code, nicht in einer Demo, nicht in einem Pilot.',
    chainH2: 'Die Kette',
    th: ['#', 'Stufe', 'Art', 'Aufgabe'],
    rulesH2: 'Geltende Regeln',
    rules: [
      'Probabilistische Komponenten (Agent, Planer, Prognose) haben keinen Netzwerkpfad zu Aktoren, Gateways oder OT-Segmenten.',
      'Kandidatenaktionen sind typisiert, versioniert und vom Vorschlagenden signiert; eine Simulation zitiert den exakten Kandidaten-Hash, den sie bewertet hat.',
      'validate_constraints fällt geschlossen aus: ein Auswertungsfehler ist ein Fehlschlag.',
      'request_authorization ist das einzige Tool, das die Sandbox verlässt — und es erzeugt eine Anfrage, keinen Befehl.',
      'Autorisierung ist signiert, zeitlich begrenzt und widerrufbar; vorab genehmigte Hüllen sind eng, explizit und protokolliert.',
      'NeuralBridge ist die einzige Komponente, die mit einem Aktor sprechen darf. Keine ML-Abhängigkeit, eigener Release-Takt.',
      'Jede Stufe schreibt in das hash-verkettete Audit-Log; ein Kettenbruch stoppt alle Request-Tools.',
      'Bis ein NeuralBridge-Repository existiert und seine eigenen Tests besteht, endet der Cluster bei RECOMMEND (Entscheidung D-007).',
    ],
    statusH2: 'Status',
    status: 'Spezifiziert. NeuralBridge ist in der Live-Inventur nicht auffindbar; der Governance-Kernel von mcp-foundry (HMAC-Token-Gate, hash-verkettetes Audit) ist das Kandidatenfundament für Stufen 8–9. Im Cluster existiert per Entscheidung kein EXECUTE-Code.',
  },
} as const;

export function generateMetadata({ params }: PageProps): Metadata {
  return energyMetadata(langOf(params), PAGE);
}

export default function SafetyPage({ params }: PageProps) {
  const lang = langOf(params);
  const c = COPY[lang];
  return (
    <EnergyShell lang={lang} path={PAGE.path} kicker={ENERGY_KICKER} h1={PAGE.label[lang]} lead={c.lead}>
      <section className="index-group">
        <h2>{c.chainH2}</h2>
        <ol className="energy-chain">
          {SAFETY_CHAIN.map((s, i) => (
            <li key={s.stage} className={`energy-stage energy-stage-${s.kind}`}>
              <span className="energy-stage-n">{String(i + 1).padStart(2, '0')}</span>
              <b>{s.stage}</b>
              <code>{s.kind}</code>
              <span>{s.does}</span>
            </li>
          ))}
        </ol>
      </section>
      <section className="index-group">
        <h2>{c.rulesH2}</h2>
        <ol className="energy-rules">{c.rules.map((r) => <li key={r}>{r}</li>)}</ol>
      </section>
      <section className="index-group">
        <h2>{c.statusH2}</h2>
        <p className="boundary-note">{c.status}</p>
      </section>
    </EnergyShell>
  );
}

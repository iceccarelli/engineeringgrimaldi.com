import type { Metadata } from 'next';
import EnergyShell from '@/components/EnergyShell';
import { FINDINGS, FINDING_QUESTIONS, WATCH } from '@/lib/energy/intel';
import { energyPage } from '@/lib/energy/pages';
import { ENERGY_KICKER, energyMetadata, langOf } from '@/lib/energy/seo';

type PageProps = { params: { lang: string } };
const PAGE = energyPage('intelligence')!;

const COPY = {
  en: {
    lead: 'A continuous external intelligence layer over standards, regulation, markets, research and competitors. Primary sources only. A finding is not a link — it answers six questions or it is not logged.',
    watchH2: 'Watched sources',
    th: ['Source', 'Group', 'Why'],
    findingsH2: 'Findings',
    empty: 'No findings logged yet. The log starts empty on purpose; a pasted news feed would be worth less than an empty table.',
    questionsH2: 'Every finding answers',
    fth: ['Date', 'Source', 'What changed', 'Why it matters', 'Affects', 'Build', 'Do not build', 'Contact'],
  },
  de: {
    lead: 'Eine kontinuierliche externe Intelligenzschicht über Normen, Regulierung, Märkte, Forschung und Wettbewerber. Nur Primärquellen. Eine Erkenntnis ist kein Link — sie beantwortet sechs Fragen oder wird nicht protokolliert.',
    watchH2: 'Beobachtete Quellen',
    th: ['Quelle', 'Gruppe', 'Warum'],
    findingsH2: 'Erkenntnisse',
    empty: 'Noch keine Erkenntnisse protokolliert. Das Log beginnt absichtlich leer; ein kopierter Newsfeed wäre weniger wert als eine leere Tabelle.',
    questionsH2: 'Jede Erkenntnis beantwortet',
    fth: ['Datum', 'Quelle', 'Was hat sich geändert', 'Warum wichtig', 'Betrifft', 'Bauen', 'Nicht bauen', 'Kontakt'],
  },
} as const;

export function generateMetadata({ params }: PageProps): Metadata {
  return energyMetadata(langOf(params), PAGE);
}

export default function IntelligencePage({ params }: PageProps) {
  const lang = langOf(params);
  const c = COPY[lang];
  return (
    <EnergyShell lang={lang} path={PAGE.path} kicker={ENERGY_KICKER} h1={PAGE.label[lang]} lead={c.lead} api={PAGE.api}>
      <section className="index-group">
        <h2>{c.questionsH2}</h2>
        <p className="energy-chips">{FINDING_QUESTIONS.map((q) => <span className="chip" key={q}>{q}</span>)}</p>
      </section>
      <section className="index-group">
        <h2>{c.watchH2}</h2>
        <div className="table-wrap">
          <table className="ref-table energy-table">
            <thead><tr>{c.th.map((h) => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {WATCH.map((w) => (
                <tr key={w.name}><td><a href={w.url} rel="noopener noreferrer"><b>{w.name}</b></a></td><td><code>{w.group}</code></td><td>{w.why}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="index-group">
        <h2>{c.findingsH2}</h2>
        {FINDINGS.length === 0 ? (
          <p className="boundary-note">{c.empty}</p>
        ) : (
          <div className="table-wrap">
            <table className="ref-table energy-table">
              <thead><tr>{c.fth.map((h) => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {FINDINGS.map((f) => (
                  <tr key={`${f.date}-${f.source}`}>
                    <td>{f.date}</td><td>{f.source}</td><td>{f.whatChanged}</td><td>{f.whyItMatters}</td><td>{f.affects}</td><td>{f.build}</td><td>{f.doNotBuild}</td><td>{f.contact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </EnergyShell>
  );
}

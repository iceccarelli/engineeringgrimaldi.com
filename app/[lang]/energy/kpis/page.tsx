import type { Metadata } from 'next';
import EnergyShell from '@/components/EnergyShell';
import { CEO_REPORT_SECTIONS, KPIS, KPI_AS_OF } from '@/lib/energy/kpis';
import { energyPage } from '@/lib/energy/pages';
import { ENERGY_KICKER, energyMetadata, langOf } from '@/lib/energy/seo';

type PageProps = { params: { lang: string } };
const PAGE = energyPage('kpis')!;

const COPY = {
  en: {
    lead: `Reported weekly. As of ${KPI_AS_OF}. A KPI without a source is not a KPI; a value that is not measured says so.`,
    th: ['KPI', 'Value', 'Unit', 'Target', 'Source', 'Report section'],
    notMeasured: 'not measured',
    reportH2: 'CEO report — exactly ten sections, every week',
    reportLead: 'Outcomes, never activity. No commit counts, no repository counts, no lines of code.',
  },
  de: {
    lead: `Wöchentlich berichtet. Stand ${KPI_AS_OF}. Eine KPI ohne Quelle ist keine KPI; ein nicht gemessener Wert sagt das.`,
    th: ['KPI', 'Wert', 'Einheit', 'Ziel', 'Quelle', 'Report-Abschnitt'],
    notMeasured: 'nicht gemessen',
    reportH2: 'CEO-Report — genau zehn Abschnitte, jede Woche',
    reportLead: 'Ergebnisse, nie Aktivität. Keine Commit-Zahlen, keine Repository-Zahlen, keine Codezeilen.',
  },
} as const;

export function generateMetadata({ params }: PageProps): Metadata {
  return energyMetadata(langOf(params), PAGE);
}

export default function KpiPage({ params }: PageProps) {
  const lang = langOf(params);
  const c = COPY[lang];
  return (
    <EnergyShell lang={lang} path={PAGE.path} kicker={ENERGY_KICKER} h1={PAGE.label[lang]} lead={c.lead} api={PAGE.api}>
      <section className="index-group">
        <div className="table-wrap">
          <table className="ref-table energy-table">
            <thead><tr>{c.th.map((h) => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {KPIS.map((k) => (
                <tr key={k.id} id={k.id}>
                  <td><b>{k.label}</b></td>
                  <td><code>{k.value === null ? c.notMeasured : k.value}</code></td>
                  <td>{k.unit}</td>
                  <td>{k.target}</td>
                  <td><small>{k.source}</small></td>
                  <td><code>{k.reportSection}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="index-group">
        <h2>{c.reportH2}</h2>
        <p className="intro">{c.reportLead}</p>
        <ol className="energy-rules energy-report">{CEO_REPORT_SECTIONS.map((s) => <li key={s}><b>{s}</b></li>)}</ol>
      </section>
    </EnergyShell>
  );
}

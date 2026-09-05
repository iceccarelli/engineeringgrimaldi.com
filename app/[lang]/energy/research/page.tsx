import type { Metadata } from 'next';
import EnergyShell, { Status } from '@/components/EnergyShell';
import ResearchMatrix from '@/components/viz/ResearchMatrix';
import { energyPage } from '@/lib/energy/pages';
import { BENCHMARK_RECORD, FRONTIER, RESEARCH } from '@/lib/energy/research';
import { ENERGY_KICKER, energyMetadata, langOf } from '@/lib/energy/seo';

type PageProps = { params: { lang: string } };
const PAGE = energyPage('research')!;

const COPY = {
  en: {
    lead: 'Research survives only if it improves a product, creates defensible IP or produces credible scientific output. Nothing is called state of the art without a published benchmark against a classical baseline.',
    recordH2: 'A benchmark record contains',
    topicsH2: 'Topics',
    th: ['Topic', 'Product use', 'Module', 'Repository', 'State', 'Next'],
    benchH3: 'Benchmark record',
    frontierH2: 'Frontier watched',
    bth: ['dataset', 'baseline', 'metric', 'result', 'CI', 'hardware', 'latency', 'failure cases', 'reproducible'],
  },
  de: {
    lead: 'Forschung überlebt nur, wenn sie ein Produkt verbessert, verteidigbare IP schafft oder glaubwürdige wissenschaftliche Ergebnisse liefert. Nichts heißt „State of the Art“ ohne veröffentlichten Benchmark gegen eine klassische Baseline.',
    recordH2: 'Ein Benchmark-Eintrag enthält',
    topicsH2: 'Themen',
    th: ['Thema', 'Produktnutzen', 'Modul', 'Repository', 'Zustand', 'Nächster Schritt'],
    benchH3: 'Benchmark-Eintrag',
    frontierH2: 'Beobachtete Front',
    bth: ['Datensatz', 'Baseline', 'Metrik', 'Ergebnis', 'KI', 'Hardware', 'Latenz', 'Fehlerfälle', 'reproduzierbar'],
  },
} as const;

export function generateMetadata({ params }: PageProps): Metadata {
  return energyMetadata(langOf(params), PAGE);
}

export default function ResearchPage({ params }: PageProps) {
  const lang = langOf(params);
  const c = COPY[lang];
  return (
    <EnergyShell lang={lang} path={PAGE.path} kicker={ENERGY_KICKER} h1={PAGE.label[lang]} lead={c.lead} api={PAGE.api}>
      <section className="index-group">
        <h2>{c.recordH2}</h2>
        <p className="energy-chips">{BENCHMARK_RECORD.map((b) => <span className="chip" key={b}>{b}</span>)}</p>
      </section>
      <ResearchMatrix lang={lang} />
      <section className="index-group">
        <h2>{c.topicsH2}</h2>
        <div className="table-wrap">
          <table className="ref-table energy-table">
            <thead><tr>{c.th.map((h) => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {RESEARCH.map((r) => (
                <tr key={r.topic}>
                  <td><b>{r.topic}</b></td>
                  <td>{r.productUse}</td>
                  <td><code>{r.module}</code></td>
                  <td><small>{r.repo}</small></td>
                  <td><Status value={r.state} /></td>
                  <td>{r.next}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {RESEARCH.filter((r) => r.benchmark).map((r) => (
          <details className="energy-details" key={r.topic}>
            <summary>{c.benchH3}: {r.topic}</summary>
            <div className="table-wrap">
              <table className="ref-table energy-table">
                <thead><tr>{c.bth.map((h) => <th key={h}>{h}</th>)}</tr></thead>
                <tbody>
                  <tr>
                    <td>{r.benchmark!.dataset}</td><td>{r.benchmark!.baseline}</td><td>{r.benchmark!.metric}</td><td>{r.benchmark!.result}</td>
                    <td>{r.benchmark!.ci}</td><td>{r.benchmark!.hardware}</td><td>{r.benchmark!.latency}</td><td>{r.benchmark!.failureCases}</td>
                    <td><code>{String(r.benchmark!.reproducible)}</code></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </details>
        ))}
      </section>
      <section className="index-group">
        <h2>{c.frontierH2}</h2>
        <p className="energy-chips">{FRONTIER.map((f) => <span className="chip" key={f}>{f}</span>)}</p>
      </section>
    </EnergyShell>
  );
}

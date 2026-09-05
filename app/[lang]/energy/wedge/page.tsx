import type { Metadata } from 'next';
import EnergyShell, { Status } from '@/components/EnergyShell';
import { energyPage } from '@/lib/energy/pages';
import { ENERGY_KICKER, energyMetadata, langOf } from '@/lib/energy/seo';
import { DISCOVERY_QUESTIONS, NEVER_ASK, PRIORITY_CUSTOMERS, WEDGES } from '@/lib/energy/wedge';

type PageProps = { params: { lang: string } };
const PAGE = energyPage('wedge')!;

const COPY = {
  en: {
    lead: 'The first objective is not a platform. It is one paid customer. Three candidate wedges; only A is proposed for building, and it stops at RECOMMEND.',
    customersH2: 'Priority customers',
    askH2: 'What we ask',
    never: 'Never asked:',
    customer: 'Customer', problem: 'Problem', costs: 'What it costs them today', build: 'Build', dont: 'Do not build', roi: 'ROI metric', entry: 'Entry', decision: 'Decision',
  },
  de: {
    lead: 'Das erste Ziel ist keine Plattform. Es ist ein zahlender Kunde. Drei Wedge-Kandidaten; nur A ist zum Bau vorgeschlagen — und endet bei RECOMMEND.',
    customersH2: 'Prioritäre Kunden',
    askH2: 'Was wir fragen',
    never: 'Nie gefragt:',
    customer: 'Kunde', problem: 'Problem', costs: 'Was es sie heute kostet', build: 'Bauen', dont: 'Nicht bauen', roi: 'ROI-Metrik', entry: 'Einstieg', decision: 'Entscheidung',
  },
} as const;

export function generateMetadata({ params }: PageProps): Metadata {
  return energyMetadata(langOf(params), PAGE);
}

export default function WedgePage({ params }: PageProps) {
  const lang = langOf(params);
  const c = COPY[lang];
  return (
    <EnergyShell lang={lang} path={PAGE.path} kicker={ENERGY_KICKER} h1={PAGE.label[lang]} lead={c.lead} api={PAGE.api}>
      {WEDGES.map((w) => (
        <section className="index-group" key={w.id} id={`wedge-${w.id}`}>
          <h2>Wedge {w.id} · {w.name} <Status value={w.status} /></h2>
          <dl className="defs energy-wedge">
            <dt>{c.customer}</dt><dd>{w.customer}</dd>
            <dt>{c.problem}</dt><dd>{w.problem}</dd>
            <dt>{c.costs}</dt><dd>{w.costsThemToday}</dd>
            <dt>{c.build}</dt><dd>{w.build.join(' · ')}</dd>
            <dt>{c.dont}</dt><dd>{w.doNotBuild.join(' · ')}</dd>
            <dt>{c.roi}</dt><dd>{w.roiMetric}</dd>
            <dt>{c.entry}</dt><dd>{w.entry}</dd>
            <dt>{c.decision}</dt><dd><code>{w.decision}</code></dd>
          </dl>
        </section>
      ))}
      <section className="index-group">
        <h2>{c.customersH2}</h2>
        <p className="energy-chips">{PRIORITY_CUSTOMERS.map((p) => <span className="chip" key={p}>{p}</span>)}</p>
      </section>
      <section className="index-group">
        <h2>{c.askH2}</h2>
        <ol className="energy-rules">{DISCOVERY_QUESTIONS.map((q) => <li key={q}>{q}</li>)}</ol>
        <p className="boundary-note"><b>{c.never}</b> “{NEVER_ASK}”</p>
      </section>
    </EnergyShell>
  );
}

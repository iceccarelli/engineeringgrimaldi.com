import type { Metadata } from 'next';
import EnergyShell, { Status } from '@/components/EnergyShell';
import ArchitectureMap from '@/components/viz/ArchitectureMap';
import { MODULES, PRIMITIVES, PRODUCT_BRAND, SEPARATION_TRIGGERS } from '@/lib/energy/architecture';
import { energyPage } from '@/lib/energy/pages';
import { ENERGY_KICKER, energyMetadata, langOf } from '@/lib/energy/seo';

type PageProps = { params: { lang: string } };
const PAGE = energyPage('architecture')!;

const COPY = {
  en: {
    lead: `${PRODUCT_BRAND} is the one product. Nine modules, each with a reason to be separate. Shared primitives only where they remove duplication a named consumer actually has.`,
    treeH2: 'Target tree',
    modulesH2: 'Modules',
    th: ['Module', 'From', 'Purpose', 'Separate because', 'Kind', 'State'],
    sepH2: 'Hard separation triggers',
    sepLead: 'Components stay isolated when coupling would create any of these:',
    primH2: 'Shared primitives',
    primLead: 'Each primitive answers the five questions. One without answers does not get built.',
    pth: ['Primitive', 'Who uses it', 'Eliminates', 'Reduces cost', 'Security benefit', 'Unlocks', 'From', 'State'],
  },
  de: {
    lead: `${PRODUCT_BRAND} ist das eine Produkt. Neun Module, jedes mit einem Grund, getrennt zu sein. Gemeinsame Primitive nur dort, wo sie Dubletten beseitigen, die ein benannter Nutzer tatsächlich hat.`,
    treeH2: 'Zielbaum',
    modulesH2: 'Module',
    th: ['Modul', 'Aus', 'Zweck', 'Getrennt, weil', 'Art', 'Zustand'],
    sepH2: 'Harte Trennungsauslöser',
    sepLead: 'Komponenten bleiben isoliert, wenn Kopplung eines davon erzeugen würde:',
    primH2: 'Gemeinsame Primitive',
    primLead: 'Jedes Primitiv beantwortet die fünf Fragen. Eines ohne Antworten wird nicht gebaut.',
    pth: ['Primitiv', 'Nutzer', 'Beseitigt', 'Senkt Kosten', 'Sicherheitsnutzen', 'Ermöglicht', 'Aus', 'Zustand'],
  },
} as const;

export function generateMetadata({ params }: PageProps): Metadata {
  return energyMetadata(langOf(params), PAGE);
}

export default function ArchitecturePage({ params }: PageProps) {
  const lang = langOf(params);
  const c = COPY[lang];
  const children = MODULES.filter((m) => m.id !== 'kernel');
  return (
    <EnergyShell lang={lang} path={PAGE.path} kicker={ENERGY_KICKER} h1={PAGE.label[lang]} lead={c.lead} api={PAGE.api}>
      <ArchitectureMap lang={lang} />
      <section className="index-group">
        <h2>{c.treeH2}</h2>
        <pre className="energy-tree" aria-label="target architecture">{`${PRODUCT_BRAND.toUpperCase()}
${children.map((m, i) => `${i === children.length - 1 ? '└──' : '├──'} ${m.name}`).join('\n')}`}</pre>
      </section>

      <section className="index-group">
        <h2>{c.modulesH2}</h2>
        <div className="table-wrap">
          <table className="ref-table energy-table">
            <thead><tr>{c.th.map((h) => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {MODULES.map((m) => (
                <tr key={m.id} id={m.id}>
                  <td><b>{m.name}</b></td>
                  <td><small>{m.from.join(', ')}</small></td>
                  <td>{m.purpose}</td>
                  <td>{m.separateBecause}</td>
                  <td><code>{m.kind}</code></td>
                  <td><Status value={m.state} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="index-group">
        <h2>{c.sepH2}</h2>
        <p className="intro">{c.sepLead}</p>
        <p className="energy-chips">{SEPARATION_TRIGGERS.map((s) => <span className="chip" key={s}>{s}</span>)}</p>
      </section>

      <section className="index-group">
        <h2>{c.primH2}</h2>
        <p className="intro">{c.primLead}</p>
        <div className="table-wrap">
          <table className="ref-table energy-table">
            <thead><tr>{c.pth.map((h) => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {PRIMITIVES.map((p) => (
                <tr key={p.name}>
                  <td><b>{p.name}</b></td>
                  <td><small>{p.users.join(', ')}</small></td>
                  <td>{p.eliminates}</td>
                  <td>{p.reducesCost}</td>
                  <td>{p.securityBenefit}</td>
                  <td>{p.unlocks}</td>
                  <td><small>{p.from}</small></td>
                  <td><Status value={p.state} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </EnergyShell>
  );
}

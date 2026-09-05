import type { Metadata } from 'next';
import EnergyShell, { Status } from '@/components/EnergyShell';
import { energyPage } from '@/lib/energy/pages';
import { REGISTRY, REGISTRY_STATUSES, byStatus } from '@/lib/energy/registry';
import { ENERGY_KICKER, energyMetadata, langOf } from '@/lib/energy/seo';

type PageProps = { params: { lang: string } };
const PAGE = energyPage('registry')!;

const COPY = {
  en: {
    lead: 'Live inventory of 2026-09-05 against github.com/iceccarelli. Six statuses exist. A repository the mandate names but the inventory cannot find is recorded as unlocated — not promoted to CORE.',
    method: 'Method: git ls-remote for every name the mandate lists plus aliases; shallow clone and README read for public hits; owner-stated facts for private repositories, marked as such. The GitHub listing API is not reachable from the build environment, so private repositories carry "unknown" where nothing was verifiable.',
    th: ['Repository', 'Visibility', 'Role', 'Target module', 'Value (strat · IP · rev · int)', 'Risk', 'Action'],
    evidence: 'Evidence',
    duplicates: 'Duplicates',
    regulatory: 'Regulatory',
    none: 'none',
  },
  de: {
    lead: 'Live-Inventur vom 05.09.2026 gegen github.com/iceccarelli. Es gibt sechs Status. Ein Repository, das das Mandat nennt, die Inventur aber nicht findet, wird als „unlocated“ geführt — nicht zu CORE befördert.',
    method: 'Methode: git ls-remote für jeden im Mandat genannten Namen plus Aliasse; flacher Clone und README-Lektüre bei öffentlichen Treffern; Eigentümer-Angaben bei privaten Repositories, als solche markiert. Die GitHub-Listing-API ist aus der Build-Umgebung nicht erreichbar; private Repositories tragen daher „unknown“, wo nichts verifizierbar war.',
    th: ['Repository', 'Sichtbarkeit', 'Rolle', 'Zielmodul', 'Wert (strat · IP · Ums. · Int.)', 'Risiko', 'Maßnahme'],
    evidence: 'Evidenz',
    duplicates: 'Dubletten',
    regulatory: 'Regulatorik',
    none: 'keine',
  },
} as const;

export function generateMetadata({ params }: PageProps): Metadata {
  return energyMetadata(langOf(params), PAGE);
}

export default function RegistryPage({ params }: PageProps) {
  const lang = langOf(params);
  const c = COPY[lang];
  return (
    <EnergyShell lang={lang} path={PAGE.path} kicker={ENERGY_KICKER} h1={PAGE.label[lang]} lead={c.lead} api={PAGE.api}>
      <p className="intro energy-method">{c.method}</p>

      {REGISTRY_STATUSES.map((s) => {
        const rows = byStatus(s);
        if (rows.length === 0) return null;
        return (
          <section className="index-group" key={s} id={s.toLowerCase()}>
            <h2><Status value={s} /> <span className="energy-count-inline">{rows.length}</span></h2>
            <div className="table-wrap">
              <table className="ref-table energy-table">
                <thead><tr>{c.th.map((h) => <th key={h}>{h}</th>)}</tr></thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.repository}>
                      <td>
                        <a href={r.url} rel="noopener noreferrer"><b>{r.repository}</b></a>
                        <br /><small>{r.language} · {r.lastCommit} · {r.maturity}</small>
                      </td>
                      <td><Status value={r.visibility} /></td>
                      <td>{r.technicalRole}</td>
                      <td><code>{r.targetModule}</code></td>
                      <td><code>{r.strategicValue} · {r.ipValue} · {r.revenuePotential} · {r.integrationPotential}</code></td>
                      <td><code>{r.securityRisk}</code></td>
                      <td>{r.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {rows.map((r) => (
              <details className="energy-details" key={`${r.repository}-d`}>
                <summary>{r.repository} — {r.description}</summary>
                <dl className="defs">
                  <dt>Architecture</dt><dd>{r.architecture}</dd>
                  <dt>Hypothesis</dt><dd>{r.businessHypothesis}</dd>
                  <dt>Customer</dt><dd>{r.customer}</dd>
                  <dt>{c.duplicates}</dt><dd>{r.duplicateFunctionality.length ? r.duplicateFunctionality.join('; ') : c.none}</dd>
                  <dt>{c.regulatory}</dt><dd>{r.regulatoryImplications.length ? r.regulatoryImplications.join('; ') : c.none}</dd>
                  <dt>{c.evidence}</dt><dd>{r.evidence.join(' · ')}</dd>
                </dl>
              </details>
            ))}
          </section>
        );
      })}
    </EnergyShell>
  );
}

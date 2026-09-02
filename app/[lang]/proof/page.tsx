import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import HonestyBanner from '@/components/HonestyBanner';
import { getDict } from '@/lib/dict';
import { isLang, pageAlternates, type Lang } from '@/lib/i18n';
import { BEVERAGE_ORDER, BEVERAGE_SKUS, PHARMA_SKUS, ecommChaosSkus } from '@/lib/palletizer-engine/fixtures';
import { optimizePallet } from '@/lib/palletizer-engine/optimizer';
import { OPTIMIZER_URL, PALLETIZER_ENGINE_COMMIT, PILOT_MAILTO } from '@/lib/pilot';

/**
 * /proof — two halves. The top half is computed at build time by the
 * vendored engine on the four documented fixtures and printed as-is,
 * including the fixture where the heuristic is worse than naive. The
 * bottom half is the slot for customer SKU before/after PDFs, and it is
 * empty, and it says so.
 */

type PageProps = { params: { lang: string } };

const COPY = {
  en: {
    title: 'Proof — fixture results and an empty slot',
    description: 'Palletizer v0.2 results on four documented fixtures, computed at build time: density, naive baseline, uplift, stability. Plus the empty slot for customer SKU before/after PDFs.',
    kicker: 'Proof',
    h1: 'Fixture results, then an empty slot',
    lead: 'Every row below is computed when this page is built, by the same TypeScript engine the live optimizer runs — not typed in. One row shows the heuristic losing to naive stacking. It stays.',
    cols: ['Fixture', 'Boxes', 'Placed', 'Layers', 'Density', 'Naive', 'Uplift', 'Stability', 'Support', 'CoM'],
    fixtureNote: 'Reference geometry. Not a customer result. Uplift is density vs the naive baseline computed on the same boxes by the same engine.',
    slotH2: 'Customer before / after',
    slotBanner: 'EMPTY — NO CUSTOMER PDF PUBLISHED',
    slotBody: 'This is where a SKU master goes in and a density / stability report comes out, with the customer’s permission to publish. None has been published. The first one will be a PDF with the plan JSON attached, not a logo.',
    slotFields: ['Customer (with consent)', 'SKU count', 'Density before → after', 'Stability before → after', 'Plan JSON', 'Kill date honoured'],
    cta: 'Be the first row',
    run: 'Run a fixture yourself',
  },
  de: {
    title: 'Nachweis — Fixture-Ergebnisse und ein leerer Platz',
    description: 'Palletizer-v0.2-Ergebnisse auf vier dokumentierten Fixtures, zur Build-Zeit berechnet: Dichte, naive Basislinie, Uplift, Stabilität. Dazu der leere Platz für Kunden-SKU-Vorher/Nachher-PDFs.',
    kicker: 'Nachweis',
    h1: 'Fixture-Ergebnisse, dann ein leerer Platz',
    lead: 'Jede Zeile unten wird beim Bauen dieser Seite berechnet, von derselben TypeScript-Engine, die der Live-Optimierer ausführt — nicht abgetippt. Eine Zeile zeigt, wie die Heuristik gegen naives Stapeln verliert. Sie bleibt.',
    cols: ['Fixture', 'Kartons', 'Platziert', 'Lagen', 'Dichte', 'Naiv', 'Uplift', 'Stabilität', 'Auflage', 'Schwerpunkt'],
    fixtureNote: 'Referenzgeometrie. Kein Kundenergebnis. Uplift ist Dichte gegen die naive Basislinie, auf denselben Kartons von derselben Engine berechnet.',
    slotH2: 'Kunde vorher / nachher',
    slotBanner: 'LEER — KEIN KUNDEN-PDF VERÖFFENTLICHT',
    slotBody: 'Hier geht ein SKU-Stamm hinein und ein Dichte- / Stabilitätsbericht heraus, mit Erlaubnis des Kunden zur Veröffentlichung. Keiner ist veröffentlicht. Der erste wird ein PDF mit angehängtem Plan-JSON sein, kein Logo.',
    slotFields: ['Kunde (mit Einwilligung)', 'SKU-Anzahl', 'Dichte vorher → nachher', 'Stabilität vorher → nachher', 'Plan-JSON', 'Abbruchdatum eingehalten'],
    cta: 'Die erste Zeile sein',
    run: 'Ein Fixture selbst rechnen',
  },
} as const;

export function generateMetadata({ params }: PageProps): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const c = COPY[lang];
  return { title: c.title, description: c.description, alternates: pageAlternates(lang, '/proof') };
}

export default function ProofPage({ params }: PageProps) {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const t = getDict(lang);
  const c = COPY[lang];

  const fixtures = [
    { id: 'beverage (5 SKUs, 1 each)', boxes: BEVERAGE_SKUS },
    { id: 'beverage order (42 boxes)', boxes: BEVERAGE_ORDER },
    { id: 'pharma (10)', boxes: PHARMA_SKUS },
    { id: 'ecomm36 (seed 42)', boxes: ecommChaosSkus(36, 42) },
  ].map((f) => ({ ...f, plan: optimizePallet(f.boxes) }));

  const pct = (v: number) => `${(v * 100).toFixed(1)} %`;
  const num = (v: number) => v.toFixed(3);

  return (
    <main>
      <div className="sheet sheet-top">
        <div className="section">
          <Breadcrumbs lang={lang} crumbs={[{ name: 'Grimaldi Engineering', path: '/' }, { name: c.kicker, path: '/proof' }]} />
          <span className="kicker">{c.kicker}</span>
          <h1>{c.h1}</h1>
          <p className="intro">{c.lead}</p>

          <div className="calc-table-wrap">
            <table className="calc-table ref-table proof-table">
              <thead>
                <tr>{c.cols.map((h) => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {fixtures.map((f) => (
                  <tr key={f.id} className={f.plan.density_uplift_pct < 0 ? 'proof-loss' : undefined}>
                    <td className="mono">{f.id}</td>
                    <td>{f.boxes.length}</td>
                    <td>{f.plan.placements.length}</td>
                    <td>{f.plan.num_layers}</td>
                    <td>{pct(f.plan.volume_density)}</td>
                    <td>{pct(f.plan.baseline_density)}</td>
                    <td>{f.plan.density_uplift_pct >= 0 ? '+' : ''}{f.plan.density_uplift_pct.toFixed(1)} %</td>
                    <td>{num(f.plan.stability_score)}</td>
                    <td>{num(f.plan.support_score)}</td>
                    <td>{num(f.plan.com_score)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="calc-meta">
            {c.fixtureNote} · engine {PALLETIZER_ENGINE_COMMIT.slice(0, 7)} · stability = 0.6·support + 0.4·CoM ·{' '}
            <a href={OPTIMIZER_URL} rel="noopener noreferrer">{c.run} →</a>
          </p>

          <section className="index-group">
            <h2>{c.slotH2}</h2>
            <HonestyBanner tone="amber" title={c.slotBanner}>{c.slotBody}</HonestyBanner>
            <dl className="ebl-fields">
              {c.slotFields.map((f) => <div key={f}><dt>{f}</dt><dd>—</dd></div>)}
            </dl>
            <div className="cta-row">
              <a className="btn btn-glow" href={PILOT_MAILTO} data-cta="pilot-mail">{c.cta}</a>
            </div>
          </section>

          <p className="author-block">{t.authorLine}</p>
        </div>
      </div>
    </main>
  );
}

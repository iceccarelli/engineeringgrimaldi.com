import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import HonestyBanner from '@/components/HonestyBanner';
import JsonLd from '@/components/JsonLd';
import PalletFill from '@/components/PalletFill';
import PilotKillDate from '@/components/PilotKillDate';
import StatusBadge from '@/components/StatusBadge';
import { getDict } from '@/lib/dict';
import { getProduct } from '@/lib/forge';
import { isLang, langHref, pageAlternates, type Lang } from '@/lib/i18n';
import { ogImages } from '@/lib/meta';
import { NOT_SHIPPED, REPO_FACTS, SHIPPED } from '@/lib/palletizer-facts';
import { OPTIMIZER_URL, PALLETIZER_ENGINE_COMMIT, PALLETIZER_REPO } from '@/lib/pilot';
import { faqSchema, softwareApplicationSchema } from '@/lib/schema';

/**
 * /palletizer — the product page for the one SKU on the hero.
 * Order: what it is → the pallet filling with real geometry → SHIPPED vs
 * NOT SHIPPED, line by line with file paths → robot-OEM sentence →
 * the pilot with its kill date → FAQ. No manifesto between a plant
 * manager and the price structure.
 */

type PageProps = { params: { lang: string } };

const COPY = {
  en: {
    crumb: 'Palletizer',
    kicker: 'Palletizing · the wedge',
    h1: 'Mixed-SKU pallet plans with a stability number you can check.',
    sub: 'Open-core optimizer. v0.2 heuristic. Same math in the browser and in Python. Not a cell OS yet.',
    run: 'Run your SKU list',
    clone: 'Clone the repository',
    shippedH2: 'Shipped',
    notShippedH2: 'Not shipped',
    whereLabel: 'read from',
    robotH2: 'Robots',
    robot: 'Hardware-agnostic interface stubs. Production arm = one partner + integration days. We do not pretend a browser canvas is a cell.',
    roiBanner: 'REFERENCE GEOMETRY, NOT CUSTOMER RESULTS',
    roiBody: 'The live optimizer site still shows “18 % uplift” and “$187k projected savings”. Read them as fixture results and a stated model, never as a customer outcome. The honest sentence is: density uplift vs naive baseline on fixture X. The fixture numbers, including the one where the heuristic loses, are on /proof.',
    factsH2: 'Repository facts',
    facts: (f: typeof REPO_FACTS) => [
      ['Version', `${f.version} · pip install ${f.pypi} · ${f.cli}`],
      ['Tests', `${f.testFunctions} test functions in ${f.testFiles} files (${f.optimizerTests} on the optimizer)`],
      ['CI', `ruff + pytest on Python ${f.ciPythons.join(' / ')}`],
      ['TS ↔ Python parity', `${f.parityFixtures.join(', ')} — bit-identical by script; ${f.parityInCi ? 'in CI' : 'not in CI yet'}`],
      ['Driver tests', `${f.driverTests} — URScript compiler and OPC UA mock are untested stubs`],
      ['Counted at', PALLETIZER_ENGINE_COMMIT.slice(0, 7)],
    ],
    faqH2: 'FAQ',
    verify: 'Verification brain for grids lives on igrimaldi.engineering; the logbook on grimaldi.ca.',
  },
  de: {
    crumb: 'Palletizer',
    kicker: 'Palettieren · der Keil',
    h1: 'Misch-SKU-Palettenpläne mit einer Stabilitätszahl, die Sie nachrechnen können.',
    sub: 'Open-Core-Optimierer. v0.2-Heuristik. Dieselbe Mathematik im Browser und in Python. Noch kein Zellen-Betriebssystem.',
    run: 'Ihre SKU-Liste rechnen',
    clone: 'Repository klonen',
    shippedH2: 'Ausgeliefert',
    notShippedH2: 'Nicht ausgeliefert',
    whereLabel: 'gelesen aus',
    robotH2: 'Roboter',
    robot: 'Hardware-agnostische Schnittstellen-Stubs. Produktionsarm = ein Partner + Integrationstage. Wir tun nicht so, als wäre ein Browser-Canvas eine Zelle.',
    roiBanner: 'REFERENZGEOMETRIE, KEINE KUNDENERGEBNISSE',
    roiBody: 'Die Live-Optimierer-Seite zeigt noch „18 % Uplift“ und „$187k projected savings“. Lesen Sie das als Fixture-Ergebnisse und ein genanntes Modell, nie als Kundenergebnis. Der ehrliche Satz lautet: Dichte-Uplift gegen naive Basislinie auf Fixture X. Die Fixture-Zahlen, einschließlich der einen, bei der die Heuristik verliert, stehen auf /proof.',
    factsH2: 'Fakten aus dem Repository',
    facts: (f: typeof REPO_FACTS) => [
      ['Version', `${f.version} · pip install ${f.pypi} · ${f.cli}`],
      ['Tests', `${f.testFunctions} Testfunktionen in ${f.testFiles} Dateien (${f.optimizerTests} am Optimierer)`],
      ['CI', `ruff + pytest auf Python ${f.ciPythons.join(' / ')}`],
      ['TS ↔ Python-Parität', `${f.parityFixtures.join(', ')} — bit-identisch per Skript; ${f.parityInCi ? 'in CI' : 'noch nicht in CI'}`],
      ['Treiber-Tests', `${f.driverTests} — URScript-Compiler und OPC-UA-Mock sind ungetestete Stubs`],
      ['Gezählt bei', PALLETIZER_ENGINE_COMMIT.slice(0, 7)],
    ],
    faqH2: 'FAQ',
    verify: 'Das Verifikationsgehirn für Netze lebt auf igrimaldi.engineering; das Logbuch auf grimaldi.ca.',
  },
} as const;

export function generateMetadata({ params }: PageProps): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const product = getProduct('palletizer');
  if (!product) return {};
  const title = product.metaTitle[lang];
  return {
    title,
    description: product.metaDescription[lang],
    alternates: pageAlternates(lang, '/palletizer'),
    openGraph: { title: `${title} | Grimaldi Engineering`, description: product.metaDescription[lang], type: 'website', images: ogImages(product.name, product.trade[lang]) },
    twitter: { card: 'summary_large_image', images: ogImages(product.name, product.trade[lang]) },
  };
}

export default function PalletizerPage({ params }: PageProps) {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const product = getProduct('palletizer');
  if (!product) return null;
  const t = getDict(lang);
  const c = COPY[lang];
  const faq = faqSchema(lang, product);

  return (
    <main>
      <div className="sheet sheet-top">
        <div className="section">
          <Breadcrumbs lang={lang} crumbs={[{ name: 'Grimaldi Engineering', path: '/' }, { name: c.crumb, path: '/palletizer' }]} />
          <span className="kicker">{c.kicker}</span>
          <h1>{c.h1}</h1>
          <p className="intro">{c.sub}</p>
          <p className="status-row">
            <StatusBadge status={product.status} lang={lang} note={product.statusNote?.[lang]} />
          </p>
          <div className="cta-row">
            <a className="btn btn-glow" href={OPTIMIZER_URL} rel="noopener noreferrer" data-cta="optimizer">{c.run} →</a>
            <a className="btn btn-line" href={PALLETIZER_REPO} rel="noopener noreferrer">{c.clone}</a>
            <a className="btn btn-line" href={langHref(lang, '/tools/pallet-pattern-calculator')}>
              {lang === 'de' ? 'Kostenloser Palettenmuster-Rechner' : 'Free pallet pattern calculator'}
            </a>
          </div>

          <PalletFill lang={lang} />

          <div className="honesty-grid">
            <section className="honesty-col honesty-col-ok" aria-labelledby="h-shipped">
              <h2 id="h-shipped">{c.shippedH2}</h2>
              <ul className="honesty-list">
                {SHIPPED.map((l) => (
                  <li key={l.text.en}>
                    {l.text[lang]}
                    {l.where ? <span className="honesty-where">{c.whereLabel} <code className="mono">{l.where}</code></span> : null}
                  </li>
                ))}
              </ul>
            </section>
            <section className="honesty-col honesty-col-no" aria-labelledby="h-not">
              <h2 id="h-not">{c.notShippedH2}</h2>
              <ul className="honesty-list">
                {NOT_SHIPPED.map((l) => (
                  <li key={l.text.en}>
                    {l.text[lang]}
                    {l.where ? <span className="honesty-where">{c.whereLabel} <code className="mono">{l.where}</code></span> : null}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <HonestyBanner tone="amber" title={c.roiBanner}>{c.roiBody}</HonestyBanner>

          <div className="prose">
            <section>
              <h2>{c.robotH2}</h2>
              <p>{c.robot}</p>
            </section>
            <section>
              <h2>{c.factsH2}</h2>
              <dl className="facts">
                {c.facts(REPO_FACTS).map(([k, v]) => (
                  <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
                ))}
              </dl>
            </section>
          </div>

          <PilotKillDate lang={lang} />

          <div className="prose">
            <section>
              <h2>{lang === 'de' ? 'Architektur' : 'Architecture'}</h2>
              <p>{product.architecture[lang]}</p>
              <h2>{lang === 'de' ? 'Lizenz' : 'License'}</h2>
              <p>{product.license[lang]}</p>
            </section>
            {product.faqs.length > 0 && (
              <section>
                <h2>{c.faqH2}</h2>
                {product.faqs.map((f) => (
                  <div key={f.q.en}>
                    <h3>{f.q[lang]}</h3>
                    <p>{f.a[lang]}</p>
                  </div>
                ))}
              </section>
            )}
          </div>

          <p className="calc-meta">
            {c.verify}{' '}
            <a href={langHref(lang, '/network')}>{lang === 'de' ? 'Netzwerk →' : 'Network →'}</a>
          </p>
          <p className="author-block">{t.authorLine}</p>
        </div>
      </div>

      <JsonLd data={softwareApplicationSchema(lang, product)} />
      {faq ? <JsonLd data={faq} /> : null}
    </main>
  );
}

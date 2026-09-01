import type { Metadata } from 'next';
import BookCTA from '@/components/BookCTA';
import JsonLd from '@/components/JsonLd';
import WaitlistForm from '@/components/WaitlistForm';
import { getDict } from '@/lib/dict';
import { forgeLine } from '@/lib/forge';
import { isLang, langHref, pageAlternates, type Lang } from '@/lib/i18n';
import { ogImages } from '@/lib/meta';
import { NAV, findSection } from '@/lib/nav';
import { professionalServiceSchema } from '@/lib/schema';
import { solutions } from '@/lib/solutions';

/**
 * The landing page is a directory, not a manifesto. It mirrors the six
 * top-level sections in the order a visitor needs them: who this is for
 * (Solutions), what proves it (Tools), what is sold (Products), what
 * backs it (Capabilities), what it costs (Pricing), what to read
 * (Resources). Everything derives from the same registries as the nav,
 * so the homepage cannot drift from the architecture around it.
 */

type PageProps = { params: { lang: string } };

const COPY = {
  en: {
    solutionsH2: 'Start from your problem',
    solutionsLead: 'Four routes in. Each names the products, tools and capabilities that apply to that operation — no mixed pitch.',
    toolsH2: 'Seven working calculators',
    toolsLead: 'Real physics in your browser, CSV export, no sign-up and no email. They exist because a working instrument argues better than a brochure.',
    productsH2: 'The Forge Line',
    productsLead: 'One automation product per trade, code in the open, status stated plainly on every page.',
    capabilitiesH2: 'What backs it',
    capabilitiesLead: 'Six engineering tracks, each stating its scope, its boundary and what has actually been published.',
    pricingH2: 'What it costs',
    pricingLead: 'Bench review €0. Session €280. Retainer €3,200 a month. Integration by quote after the fit is proven. Calculators stay free.',
    pricingCta: 'See pricing',
    seeAll: 'See all',
  },
  de: {
    solutionsH2: 'Bei Ihrem Problem beginnen',
    solutionsLead: 'Vier Wege hinein. Jeder nennt die Produkte, Werkzeuge und Kompetenzen, die für diesen Betrieb gelten — kein vermischter Pitch.',
    toolsH2: 'Sieben funktionierende Rechner',
    toolsLead: 'Echte Physik im Browser, CSV-Export, ohne Anmeldung und ohne E-Mail. Sie existieren, weil ein funktionierendes Instrument besser argumentiert als ein Prospekt.',
    productsH2: 'Die Forge-Linie',
    productsLead: 'Ein Automatisierungsprodukt pro Gewerk, Code offen, Status auf jeder Seite klar benannt.',
    capabilitiesH2: 'Was dahintersteht',
    capabilitiesLead: 'Sechs Ingenieursstränge, jeder mit Umfang, Grenze und dem, was tatsächlich veröffentlicht ist.',
    pricingH2: 'Was es kostet',
    pricingLead: 'Bench-Review 0 €. Session 280 €. Retainer 3.200 € im Monat. Integration nach Angebot, sobald der Fit belegt ist. Rechner bleiben kostenlos.',
    pricingCta: 'Preise ansehen',
    seeAll: 'Alle ansehen',
  },
} as const;

export function generateMetadata({ params }: PageProps): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const t = getDict(lang);
  return {
    alternates: pageAlternates(lang, '/'),
    openGraph: { images: ogImages(t.homeH1) },
    twitter: { card: 'summary_large_image', images: ogImages(t.homeH1) },
  };
}

export default function Home({ params }: PageProps) {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const t = getDict(lang);
  const copy = COPY[lang];
  const href = (path: string) => langHref(lang, path);

  const tools = findSection('tools');
  const capabilities = findSection('capabilities');
  const toolItems = tools ? tools.groups.flatMap((g) => g.items) : [];
  const capabilityItems = capabilities ? capabilities.groups.flatMap((g) => g.items) : [];

  return (
    <main>
      <section className="hero">
        <div className="hero-in">
          <div className="hero-card">
            <span className="kicker">{t.homeKicker}</span>
            <h1>{t.homeH1}</h1>
            <p className="lead">{t.homeLead}</p>
            <div className="cta-row">
              <BookCTA label={t.ctaBook} />
              <a className="btn btn-line" href={href('/tools')}>{t.ctaForge}</a>
            </div>
          </div>
        </div>
      </section>

      <div className="sheet">
        {/* 1 — SOLUTIONS: who this is for */}
        <div className="section" id="solutions">
          <span className="kicker">{NAV[1].label[lang]}</span>
          <h2>{copy.solutionsH2}</h2>
          <p className="intro">{copy.solutionsLead}</p>
          <div className="grid">
            {solutions.map((s) => (
              <a className="card card-link" key={s.slug} href={href(`/solutions/${s.slug}`)}>
                <h3>{s.label[lang]}</h3>
                <p>{s.audience[lang]}</p>
                <span className="cta">{t.open}</span>
              </a>
            ))}
          </div>
        </div>

        {/* 2 — TOOLS: what proves it */}
        <div className="section" id="tools">
          <span className="kicker">{t.calcCardTag}</span>
          <h2>{copy.toolsH2}</h2>
          <p className="intro">{copy.toolsLead}</p>
          <div className="grid grid-4">
            {toolItems.map((item) => (
              <a className="card card-link" key={item.path} href={href(item.path)}>
                <h3>{item.label[lang]}</h3>
                <p>{item.blurb[lang]}</p>
                <span className="cta">{t.open}</span>
              </a>
            ))}
          </div>
          <p className="home-more"><a href={href('/tools')}>{copy.seeAll} →</a></p>
        </div>

        {/* 3 — PRODUCTS */}
        <div className="section" id="forge">
          <span className="kicker">{t.forgeKicker}</span>
          <h2>{copy.productsH2}</h2>
          <p className="intro">{copy.productsLead}</p>
          <div className="grid grid-4">
            {forgeLine.map((product) => (
              <a className="card card-link" key={product.slug} href={href(`/forge/${product.slug}`)}>
                <span className="tag">{product.trade[lang]}</span>
                <h3>{product.name}</h3>
                <p>{product.tagline[lang]}</p>
                <span className="status">
                  <span className={product.status === 'shipped' ? 'dot' : 'dot dot-dev'} />{' '}
                  {product.status === 'shipped' ? t.statusShipped : t.statusRepoOnly}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* 4 — CAPABILITIES */}
        <div className="section" id="capabilities">
          <span className="kicker">{NAV[3].label[lang]}</span>
          <h2>{copy.capabilitiesH2}</h2>
          <p className="intro">{copy.capabilitiesLead}</p>
          <div className="grid">
            {capabilityItems.map((item) => (
              <a className="card card-link" key={item.path} href={href(item.path)}>
                <h3>{item.label[lang]}</h3>
                <p>{item.blurb[lang]}</p>
                <span className="status"><span className="dot dot-dev" /> {t.statusLogPrep}</span>
              </a>
            ))}
          </div>
        </div>

        {/* 5 — PRICING */}
        <div className="section" id="pricing">
          <div className="banner">
            <div>
              <h2>{copy.pricingH2}</h2>
              <p>{copy.pricingLead}</p>
            </div>
            <a className="btn btn-glow" href={href('/pricing')}>{copy.pricingCta}</a>
          </div>
        </div>

        {/* 6 — WAITLIST */}
        <div className="section" id="waitlist">
          <div className="banner banner-stack">
            <div>
              <h2>{t.wlTitle}</h2>
              <p>{t.wlBody}</p>
            </div>
            <WaitlistForm t={t} />
          </div>
        </div>
      </div>

      <JsonLd data={professionalServiceSchema()} />
    </main>
  );
}

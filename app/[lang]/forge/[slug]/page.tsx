import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import HonestyBanner from '@/components/HonestyBanner';
import JsonLd from '@/components/JsonLd';
import StatusBadge from '@/components/StatusBadge';
import { getDict } from '@/lib/dict';
import { forgeLine, getProduct } from '@/lib/forge';
import { LANGS, isLang, langHref, pageAlternates, type Lang } from '@/lib/i18n';
import { ogImages } from '@/lib/meta';
import { faqSchema, softwareApplicationSchema } from '@/lib/schema';

/**
 * Product page template for the rest of the Forge Line. Palletizer has
 * its own route (/palletizer); /forge/palletizer redirects there so old
 * links keep working. Every page here carries the status badge first,
 * then problem, architecture, integration truth, license, commercial
 * terms, FAQ. FloorForge quotes its own README verbatim. Repo links are
 * rendered only when a URL exists — ForgeOS has none, so none is drawn.
 */

type PageProps = { params: { lang: string; slug: string } };

export function generateStaticParams(): { lang: Lang; slug: string }[] {
  return LANGS.flatMap((lang) => forgeLine.filter((p) => p.slug !== 'palletizer').map((p) => ({ lang, slug: p.slug })));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const product = getProduct(params.slug);
  if (!product || product.slug === 'palletizer') return {};
  return {
    title: product.metaTitle[lang],
    description: product.metaDescription[lang],
    alternates: pageAlternates(lang, `/forge/${product.slug}`),
    openGraph: {
      title: `${product.metaTitle[lang]} | Grimaldi Engineering`,
      description: product.metaDescription[lang],
      type: 'website',
      images: ogImages(product.name, product.trade[lang]),
    },
    twitter: { card: 'summary_large_image', images: ogImages(product.name, product.trade[lang]) },
  };
}

export default function ProductPage({ params }: PageProps) {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  if (params.slug === 'palletizer') permanentRedirect(langHref(lang, '/palletizer'));
  const product = getProduct(params.slug);
  if (!product) notFound();
  const t = getDict(lang);

  const sections: { heading: string; text: string }[] = [
    { heading: lang === 'de' ? 'Problem' : 'Problem', text: product.problem[lang] },
    { heading: lang === 'de' ? 'Was das Repository ist' : 'What the repository is', text: product.architecture[lang] },
    { heading: lang === 'de' ? 'Integrationen' : 'Integrations', text: product.integrations[lang] },
    { heading: lang === 'de' ? 'Lizenz' : 'License', text: product.license[lang] },
    { heading: lang === 'de' ? 'Kommerzielles' : 'Commercial', text: product.commercial[lang] },
  ];

  const faq = faqSchema(lang, product);
  const parkedTitle = lang === 'de' ? 'GEPARKT — nicht in Arbeit' : 'PARKED — not being worked on';
  const parkedBody = lang === 'de'
    ? 'Diese Seite bleibt, damit der Name nicht verschwindet. Es wird nichts daran gebaut, verkauft oder versprochen, solange Palletizer der Keil ist.'
    : 'This page stays so the name does not vanish. Nothing is being built, sold or promised under it while Palletizer is the wedge.';

  return (
    <main>
      <div className="sheet sheet-top">
        <div className="section">
          <Breadcrumbs lang={lang} crumbs={[{ name: 'Grimaldi Engineering', path: '/' }, { name: 'Forge Line', path: '/forge' }, { name: product.name, path: `/forge/${product.slug}` }]} />
          <span className="kicker">{product.trade[lang]} · Forge Line</span>
          <h1>{product.name}</h1>
          <p className="intro">{product.tagline[lang]}</p>

          <p className="status-row">
            <StatusBadge status={product.status} lang={lang} note={product.statusNote?.[lang]} />
          </p>

          {product.status === 'PARKED' && <HonestyBanner tone="amber" title={parkedTitle}>{parkedBody}</HonestyBanner>}

          {product.readmeQuote && (
            <blockquote className="readme-quote">
              <p>“{product.readmeQuote.text}”</p>
              <cite className="mono">{product.readmeQuote.source}</cite>
            </blockquote>
          )}

          <div className="cta-row">
            {product.repo ? (
              <a className="btn btn-line" href={product.repo} rel="noopener noreferrer">
                {lang === 'de' ? 'Quellcode auf GitHub' : 'Source on GitHub'}
              </a>
            ) : (
              <span className="btn btn-line btn-disabled" aria-disabled="true">
                {lang === 'de' ? 'Kein Repository — nichts zu verlinken' : 'No repository — nothing to link'}
              </span>
            )}
            <a className="btn btn-line" href={langHref(lang, '/forge')}>{lang === 'de' ? 'Zurück zum Index' : 'Back to the index'}</a>
          </div>

          <div className="prose">
            {sections.map((s) => (
              <section key={s.heading}>
                <h2>{s.heading}</h2>
                <p>{s.text}</p>
              </section>
            ))}

            {product.faqs.length > 0 && (
              <section>
                <h2>FAQ</h2>
                {product.faqs.map((f) => (
                  <div key={f.q.en}>
                    <h3>{f.q[lang]}</h3>
                    <p>{f.a[lang]}</p>
                  </div>
                ))}
              </section>
            )}
          </div>

          <p className="author-block">{t.authorLine}</p>
        </div>
      </div>

      <JsonLd data={softwareApplicationSchema(lang, product)} />
      {faq ? <JsonLd data={faq} /> : null}
    </main>
  );
}

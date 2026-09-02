import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import BookCTA from '@/components/BookCTA';
import JsonLd from '@/components/JsonLd';
import { getDict } from '@/lib/dict';
import { forgeLine, getProduct } from '@/lib/forge';
import { LANGS, isLang, langHref, pageAlternates, type Lang } from '@/lib/i18n';
import { ogImages } from '@/lib/meta';
import { breadcrumbSchema, faqSchema, softwareApplicationSchema } from '@/lib/schema';

/**
 * Product page template. Every product page carries: problem,
 * architecture, integration truth, repo, demo (if real), status,
 * license, commercial terms, FAQ — plus SoftwareApplication +
 * FAQPage + BreadcrumbList JSON-LD and an author block.
 */

type PageProps = { params: { lang: string; slug: string } };

export function generateStaticParams(): { lang: Lang; slug: string }[] {
  return LANGS.flatMap((lang) => forgeLine.map((p) => ({ lang, slug: p.slug })));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const product = getProduct(params.slug);
  if (!product) return {};
  return {
    title: product.metaTitle[lang],
    description: product.metaDescription[lang],
    alternates: pageAlternates(lang, `/forge/${product.slug}`),
    robots: { index: false, follow: true },
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
    { heading: lang === 'de' ? 'Architektur' : 'Architecture', text: product.architecture[lang] },
    { heading: lang === 'de' ? 'Integrationen' : 'Integrations', text: product.integrations[lang] },
    { heading: lang === 'de' ? 'Lizenz' : 'License', text: product.license[lang] },
    { heading: lang === 'de' ? 'Kommerzielles' : 'Commercial', text: product.commercial[lang] },
  ];

  const faq = faqSchema(lang, product);

  return (
    <main>
      <div className="sheet sheet-top">
        <div className="section">
          <span className="kicker">{product.trade[lang]} · Forge</span>
          <h1>{product.name}</h1>
          <p className="honesty" role="note">
            <span className="chip chip-hold">{lang === 'de' ? 'Labor' : 'Lab'}</span>
            <span>{lang === 'de' ? 'Gleiche Controller-These. Anderer Endeffektor. Keine Einheit im Verkauf.' : 'Same controller thesis. Different end-effector. No unit for sale.'}</span>
          </p>
          <p className="intro">{product.tagline[lang]}</p>

          <p className="status status-badge">
            <span className={product.status === 'shipped' ? 'dot' : 'dot dot-dev'} />{' '}
            {product.status === 'shipped' ? t.statusShipped : t.statusRepoOnly}
          </p>

          <div className="cta-row">
            {product.demo ? (
              <a className="btn btn-glow" href={product.demo} rel="noopener noreferrer">
                {lang === 'de' ? 'Live-Demo öffnen' : 'Open the live demo'}
              </a>
            ) : (
              <BookCTA label={t.ctaBook} lang={lang} />
            )}
            <a className="btn btn-line" href={product.repo} rel="noopener noreferrer">
              {lang === 'de' ? 'Quellcode auf GitHub' : 'Source on GitHub'}
            </a>
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

          {product.demo == null && (
            <div className="cta-row">
              <BookCTA label={t.ctaBook} variant="line" lang={lang} />
            </div>
          )}

          <p className="author-block">{t.authorLine}</p>
        </div>
      </div>

      <JsonLd data={softwareApplicationSchema(lang, product)} />
      {faq ? <JsonLd data={faq} /> : null}
      <JsonLd
        data={breadcrumbSchema(lang, [
          { name: 'Grimaldi Engineering', path: '/' },
          { name: 'Forge', path: '/forge' },
          { name: product.name, path: `/forge/${product.slug}` },
        ])}
      />
    </main>
  );
}

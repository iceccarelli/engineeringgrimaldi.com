import type { Metadata } from 'next';
import BookCTA from '@/components/BookCTA';
import JsonLd from '@/components/JsonLd';
import WaitlistForm from '@/components/WaitlistForm';
import { getDict } from '@/lib/dict';
import { disciplines } from '@/lib/disciplines';
import { forgeLine } from '@/lib/forge';
import { isLang, langHref, pageAlternates, type Lang } from '@/lib/i18n';
import { professionalServiceSchema } from '@/lib/schema';

/**
 * The homepage is a SWITCHBOARD, not a manifesto: three ICP doors,
 * the Forge Line, the lab, the disciplines, one waitlist. Primary CTA
 * is the bench-review booking — never a mailto, never the toy first.
 */

type PageProps = { params: { lang: string } };

export function generateMetadata({ params }: PageProps): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  return { alternates: pageAlternates(lang, '/') };
}

export default function Home({ params }: PageProps) {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const t = getDict(lang);
  const href = (path: string) => langHref(lang, path);

  const icps = [
    { tag: t.icpA_tag, title: t.icpA_title, body: t.icpA_body, cta: t.icpA_cta, href: href('/forge/palletizer') },
    { tag: t.icpB_tag, title: t.icpB_title, body: t.icpB_body, cta: t.icpB_cta, href: href('/forge/floorforge') },
    { tag: t.icpC_tag, title: t.icpC_title, body: t.icpC_body, cta: t.icpC_cta, href: href('/book') },
  ];

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
              <a className="btn btn-line" href={href('/forge')}>{t.ctaForge}</a>
            </div>
          </div>
        </div>
      </section>

      <div className="sheet">
        {/* SWITCHBOARD — three ICP doors */}
        <div className="section" id="start">
          <span className="kicker">{t.icpKicker}</span>
          <h2>{t.icpTitle}</h2>
          <p className="intro">{t.icpIntro}</p>
          <div className="grid">
            {icps.map((icp) => (
              <a className="card card-link" key={icp.href + icp.tag} href={icp.href}>
                <span className="tag">{icp.tag}</span>
                <h3>{icp.title}</h3>
                <p>{icp.body}</p>
                <span className="cta">{icp.cta} →</span>
              </a>
            ))}
          </div>
        </div>

        {/* FORGE LINE */}
        <div className="section" id="forge">
          <span className="kicker">{t.forgeKicker}</span>
          <h2>{t.forgeTitle}</h2>
          <p className="intro">{t.forgeIntro}</p>
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

        {/* LAB */}
        <div className="section" id="lab">
          <span className="kicker">{t.labKicker}</span>
          <h2>{t.labTitle}</h2>
          <p className="intro">{t.labIntro}</p>
          <a className="btn btn-line" href={href('/lab/grid-droop')}>{t.labCta}</a>
        </div>

        {/* DISCIPLINES */}
        <div className="section" id="disciplines">
          <span className="kicker">{t.discKicker}</span>
          <h2>{t.discTitle}</h2>
          <p className="intro">{t.discIntro}</p>
          <div className="grid">
            {disciplines.map((d) => (
              <a className="card card-link" key={d.slug} href={href(`/disciplines/${d.slug}`)}>
                <span className="tag">{d.tag[lang]}</span>
                <h3>{d.title[lang]}</h3>
                <p>{d.body[0][lang]}</p>
                <span className="status"><span className="dot dot-dev" /> {t.statusLogPrep}</span>
              </a>
            ))}
          </div>
        </div>

        {/* WAITLIST */}
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

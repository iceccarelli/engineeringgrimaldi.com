import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { getDict } from '@/lib/dict';
import { forgeLine } from '@/lib/forge';
import { isLang, langHref, pageAlternates, type Lang } from '@/lib/i18n';
import { breadcrumbSchema } from '@/lib/schema';

type PageProps = { params: { lang: string } };

export function generateMetadata({ params }: PageProps): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  return {
    title: lang === 'de' ? 'Forge — Labornotizen zur selben Controller-These' : 'Forge — Lab Notes on the Same Controller Thesis',
    description:
      lang === 'de'
        ? 'Forge: Labornotizen zu weiteren Endeffektoren auf derselben Controller-These wie der Palletizer. Keine Einheit im Verkauf.'
        : 'Forge: lab notes on further end-effectors on the same controller thesis as the palletizer. No unit for sale.',
    alternates: pageAlternates(lang, '/forge'),
    robots: { index: false, follow: true },
  };
}

export default function ForgeIndex({ params }: PageProps) {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const t = getDict(lang);

  return (
    <main>
      <div className="sheet sheet-top">
        <div className="section">
          <span className="kicker">{t.forgeKicker}</span>
          <h1>{t.forgeTitle}</h1>
          <p className="honesty" role="note">
            <span className="chip chip-hold">{lang === 'de' ? 'Labor' : 'Lab'}</span>
            <span>{lang === 'de' ? 'Gleiche Controller-These. Anderer Endeffektor. Keine Einheit im Verkauf.' : 'Same controller thesis. Different end-effector. No unit for sale.'}</span>
          </p>
          <p className="intro">{t.forgeIntro}</p>
          <div className="grid grid-4">
            {forgeLine.map((product) => (
              <a className="card card-link" key={product.slug} href={langHref(lang, `/forge/${product.slug}`)}>
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
      </div>
      <JsonLd
        data={breadcrumbSchema(lang, [
          { name: 'Grimaldi Engineering', path: '/' },
          { name: 'Forge', path: '/forge' },
        ])}
      />
    </main>
  );
}

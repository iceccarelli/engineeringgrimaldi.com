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
    title: lang === 'de' ? 'Die Forge-Linie — Automatisierung pro Gewerk' : 'The Forge Line — One Automation Product per Trade',
    description:
      lang === 'de'
        ? 'Die Forge-Linie: Palletizer OS, FloorForge AI, PaintForge AI, DryForge AI. Ein Automatisierungsprodukt pro Gewerk — Code öffentlich, Status ehrlich.'
        : 'The Forge Line: Palletizer OS, FloorForge AI, PaintForge AI, DryForge AI. One automation product per trade — code public, status honest.',
    alternates: pageAlternates(lang, '/forge'),
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
          { name: 'Forge Line', path: '/forge' },
        ])}
      />
    </main>
  );
}

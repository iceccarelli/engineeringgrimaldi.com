import type { Metadata } from 'next';
import { getDict } from '@/lib/dict';
import { isLang, langHref, pageAlternates, type Lang } from '@/lib/i18n';

type PageProps = { params: { lang: string } };

export function generateMetadata({ params }: PageProps): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  return {
    title: lang === 'de' ? 'Labor — Instrumente & Baujournale' : 'Lab — Instruments & Build Logs',
    description:
      lang === 'de'
        ? 'Das Labor von Grimaldi Engineering: interaktive Instrumente und Baujournale. Aktuell: das Netzfrequenz-Statik-Modell. Erste Hardware-Journale in Vorbereitung.'
        : 'The Grimaldi Engineering lab: interactive instruments and build logs. Currently: the grid-frequency droop model. First hardware logs in preparation.',
    alternates: pageAlternates(lang, '/lab'),
  };
}

export default function LabIndex({ params }: PageProps) {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const t = getDict(lang);

  return (
    <main>
      <div className="sheet sheet-top">
        <div className="section">
          <span className="kicker">{t.labKicker}</span>
          <h1>{t.labTitle}</h1>
          <p className="intro">
            {lang === 'de'
              ? 'Ein Eintrag pro Instrument oder Aufbau — nichts wird behauptet, was ein Modell oder ein Messgerät nicht zeigt. Die ersten Hardware-Baujournale sind in Vorbereitung; bis dahin steht hier genau ein ehrlicher Eintrag.'
              : 'One entry per instrument or build — nothing is claimed that a model or an instrument does not show. The first hardware build logs are in preparation; until then, exactly one honest entry lives here.'}
          </p>
          <div className="grid">
            <a className="card card-link" href={langHref(lang, '/lab/grid-droop')}>
              <span className="tag">{lang === 'de' ? 'Live-Instrument' : 'Live instrument'}</span>
              <h3>{t.labTitle}</h3>
              <p>{t.labIntro}</p>
              <span className="cta">{t.labCta} →</span>
            </a>
          </div>
          <p className="author-block">{t.authorLine}</p>
        </div>
      </div>
    </main>
  );
}

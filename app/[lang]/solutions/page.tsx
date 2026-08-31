import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getDict } from '@/lib/dict';
import { isLang, langHref, pageAlternates, type Lang } from '@/lib/i18n';
import { solutions } from '@/lib/solutions';

type PageProps = { params: { lang: string } };

const COPY = {
  en: {
    title: 'Solutions — Start From Your Problem',
    description: 'Four routes in: packaging and end-of-line, machine builders and OEM, energy and storage, trade contractors. Each names the products, tools and capabilities that apply.',
    h1: 'Solutions',
    lead: 'Products are organised the way the work is organised. These pages are organised the way you arrive — pick the one that matches your operation.',
    audience: 'Who this is for',
  },
  de: {
    title: 'Lösungen — bei Ihrem Problem beginnen',
    description: 'Vier Wege hinein: Verpackung und End-of-Line, Maschinenbau und OEM, Energie und Speicher, Handwerksbetriebe. Jeder nennt die passenden Produkte, Werkzeuge und Kompetenzen.',
    h1: 'Lösungen',
    lead: 'Produkte sind so geordnet, wie die Arbeit geordnet ist. Diese Seiten sind so geordnet, wie Sie ankommen — wählen Sie, was zu Ihrem Betrieb passt.',
    audience: 'Für wen das ist',
  },
} as const;

export function generateMetadata({ params }: PageProps): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  return {
    title: COPY[lang].title,
    description: COPY[lang].description,
    alternates: pageAlternates(lang, '/solutions'),
  };
}

export default function SolutionsIndex({ params }: PageProps) {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const t = getDict(lang);
  const copy = COPY[lang];

  return (
    <main>
      <div className="sheet sheet-top">
        <div className="section">
          <Breadcrumbs lang={lang} crumbs={[
            { name: 'Grimaldi Engineering', path: '/' },
            { name: copy.h1, path: '/solutions' },
          ]} />
          <h1>{copy.h1}</h1>
          <p className="intro">{copy.lead}</p>

          <div className="grid">
            {solutions.map((s) => (
              <a className="card card-link" key={s.slug} href={langHref(lang, `/solutions/${s.slug}`)}>
                <span className="tag">{copy.audience}</span>
                <h2>{s.label[lang]}</h2>
                <p>{s.audience[lang]}</p>
                <span className="cta">{t.open}</span>
              </a>
            ))}
          </div>

          <p className="author-block">{t.authorLine}</p>
        </div>
      </div>
    </main>
  );
}

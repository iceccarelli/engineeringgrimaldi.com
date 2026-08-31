import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BookCTA from '@/components/BookCTA';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getDict } from '@/lib/dict';
import { LANGS, isLang, langHref, pageAlternates, type Lang } from '@/lib/i18n';
import { getSolution, solutions } from '@/lib/solutions';

type PageProps = { params: { lang: string; slug: string } };

export function generateStaticParams(): { lang: Lang; slug: string }[] {
  return LANGS.flatMap((lang) => solutions.map((s) => ({ lang, slug: s.slug })));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const solution = getSolution(params.slug);
  if (!solution) return {};
  return {
    title: solution.metaTitle[lang],
    description: solution.metaDescription[lang],
    alternates: pageAlternates(lang, `/solutions/${solution.slug}`),
    openGraph: {
      title: `${solution.metaTitle[lang]} | Grimaldi Engineering`,
      description: solution.metaDescription[lang],
      type: 'website',
    },
  };
}

export default function SolutionPage({ params }: PageProps) {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const solution = getSolution(params.slug);
  if (!solution) notFound();
  const t = getDict(lang);

  return (
    <main>
      <div className="sheet sheet-top">
        <div className="section">
          <Breadcrumbs lang={lang} crumbs={[
            { name: 'Grimaldi Engineering', path: '/' },
            { name: lang === 'de' ? 'Lösungen' : 'Solutions', path: '/solutions' },
            { name: solution.label[lang], path: `/solutions/${solution.slug}` },
          ]} />
          <span className="kicker">{solution.audience[lang]}</span>
          <h1>{solution.label[lang]}</h1>

          <div className="prose">
            {solution.problem.map((p) => <p key={p.en.slice(0, 40)}>{p[lang]}</p>)}
          </div>

          <h2 className="index-group-h">{lang === 'de' ? 'Was hier gilt' : 'What applies here'}</h2>
          <div className="grid">
            {solution.routes.map((r) => (
              <a className="card card-link" key={r.path} href={langHref(lang, r.path)}>
                <h3>{r.label[lang]}</h3>
                <p>{r.note[lang]}</p>
                <span className="cta">{t.open}</span>
              </a>
            ))}
          </div>

          <div className="prose">
            <h2>{lang === 'de' ? 'Erster Schritt' : 'First step'}</h2>
            <p>{solution.firstStep[lang]}</p>
          </div>

          <div className="cta-row">
            <BookCTA label={t.ctaBook} />
            <a className="btn btn-line" href={langHref(lang, '/pricing')}>
              {lang === 'de' ? 'Preise ansehen →' : 'See pricing →'}
            </a>
          </div>

          <p className="author-block">{t.authorLine}</p>
        </div>
      </div>
    </main>
  );
}

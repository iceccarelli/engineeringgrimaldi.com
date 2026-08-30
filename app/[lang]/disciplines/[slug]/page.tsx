import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BookCTA from '@/components/BookCTA';
import JsonLd from '@/components/JsonLd';
import { getDict } from '@/lib/dict';
import { disciplines, getDiscipline } from '@/lib/disciplines';
import { LANGS, isLang, pageAlternates, type Lang } from '@/lib/i18n';
import { breadcrumbSchema } from '@/lib/schema';

type PageProps = { params: { lang: string; slug: string } };

export function generateStaticParams(): { lang: Lang; slug: string }[] {
  return LANGS.flatMap((lang) => disciplines.map((d) => ({ lang, slug: d.slug })));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const discipline = getDiscipline(params.slug);
  if (!discipline) return {};
  return {
    title: discipline.metaTitle[lang],
    description: discipline.metaDescription[lang],
    alternates: pageAlternates(lang, `/disciplines/${discipline.slug}`),
  };
}

export default function DisciplinePage({ params }: PageProps) {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const discipline = getDiscipline(params.slug);
  if (!discipline) notFound();
  const t = getDict(lang);

  return (
    <main>
      <div className="sheet sheet-top">
        <div className="section">
          <span className="kicker">{discipline.tag[lang]}</span>
          <h1>{discipline.title[lang]}</h1>
          <p className="status status-badge">
            <span className="dot dot-dev" /> {t.statusLogPrep}
          </p>
          <div className="prose">
            {discipline.body.map((paragraph) => (
              <p key={paragraph.en}>{paragraph[lang]}</p>
            ))}
            {discipline.boundary ? <p className="boundary-note">{discipline.boundary[lang]}</p> : null}
          </div>
          <div className="cta-row">
            <BookCTA label={t.ctaBook} variant="line" />
          </div>
          <p className="author-block">{t.authorLine}</p>
        </div>
      </div>
      <JsonLd
        data={breadcrumbSchema(lang, [
          { name: 'Grimaldi Engineering', path: '/' },
          { name: discipline.title[lang], path: `/disciplines/${discipline.slug}` },
        ])}
      />
    </main>
  );
}

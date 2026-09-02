import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BookCTA from '@/components/BookCTA';
import JsonLd from '@/components/JsonLd';
import { getDict } from '@/lib/dict';
import { disciplines, getDiscipline } from '@/lib/disciplines';
import { LANGS, isLang, langHref, pageAlternates, type Lang } from '@/lib/i18n';
import { synchronousSpeedTable } from '@/lib/machines';
import { ogImages } from '@/lib/meta';
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
    robots: { index: false, follow: true },
    openGraph: {
      title: `${discipline.metaTitle[lang]} | Grimaldi Engineering`,
      description: discipline.metaDescription[lang],
      type: 'website',
      images: ogImages(discipline.title[lang], discipline.tag[lang]),
    },
    twitter: { card: 'summary_large_image', images: ogImages(discipline.title[lang], discipline.tag[lang]) },
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

          {discipline.syncTable && (
            <>
              <div className="prose">
                <p className="formula">n_s = 120 · f / p&nbsp;&nbsp;·&nbsp;&nbsp;s = (n_s − n) / n_s&nbsp;&nbsp;·&nbsp;&nbsp;f_r = s · f&nbsp;&nbsp;·&nbsp;&nbsp;T = P / ω</p>
              </div>
              <div className="calc-table-wrap">
                <table className="calc-table ref-table">
                  <thead>
                    <tr>
                      <th>{lang === 'de' ? 'Pole' : 'Poles'}</th>
                      <th>{lang === 'de' ? 'Synchrondrehzahl bei 50 Hz' : 'Synchronous speed at 50 Hz'}</th>
                      <th>{lang === 'de' ? 'Synchrondrehzahl bei 60 Hz' : 'Synchronous speed at 60 Hz'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {synchronousSpeedTable(50).map((row, i) => (
                      <tr key={row.poles}>
                        <td>{row.poles}</td>
                        <td>{row.rpm.toLocaleString(lang)} rpm</td>
                        <td>{synchronousSpeedTable(60)[i].rpm.toLocaleString(lang)} rpm</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="calc-meta">
                {lang === 'de'
                  ? 'Eine Asynchronmaschine läuft unter diesen Drehzahlen; die Differenz ist der Schlupf und erzeugt erst das Drehmoment. Eine Synchronmaschine läuft genau darauf.'
                  : 'An induction machine runs below these speeds; the difference is slip, and it is what produces torque in the first place. A synchronous machine runs exactly on them.'}
              </p>
            </>
          )}
          <div className="cta-row">
            {discipline.tool && (
              <a className="btn btn-glow" href={langHref(lang, discipline.tool.path)}>
                {discipline.tool.label[lang]}
              </a>
            )}
            <BookCTA label={t.ctaBook} variant="line" lang={lang} />
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

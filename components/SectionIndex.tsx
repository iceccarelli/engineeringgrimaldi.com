import Breadcrumbs from './Breadcrumbs';
import { getDict } from '@/lib/dict';
import { langHref, type Lang } from '@/lib/i18n';
import type { NavSection } from '@/lib/nav';

/**
 * The standard category index: breadcrumb, title, lead, then every child
 * grouped exactly as the mega-menu groups it. One template means a
 * category page can never disagree with the navigation above it.
 */
export default function SectionIndex({
  lang, section, children,
}: { lang: Lang; section: NavSection; children?: React.ReactNode }) {
  const t = getDict(lang);
  return (
    <main>
      <div className="sheet sheet-top">
        <div className="section">
          <Breadcrumbs lang={lang} crumbs={[
            { name: 'Grimaldi Engineering', path: '/' },
            { name: section.label[lang], path: section.path },
          ]} />
          <h1>{section.label[lang]}</h1>
          <p className="intro">{section.blurb[lang]}</p>

          {section.groups.map((group) => (
            <section className="index-group" key={group.label.en}>
              <h2>{group.label[lang]}</h2>
              <div className="grid">
                {group.items.map((item) => (
                  <a className="card card-link" key={item.path} href={langHref(lang, item.path)}>
                    <h3>{item.label[lang]}</h3>
                    <p>{item.blurb[lang]}</p>
                    <span className="cta">{t.open}</span>
                  </a>
                ))}
              </div>
            </section>
          ))}

          {children}

          <p className="author-block">{t.authorLine}</p>
        </div>
      </div>
    </main>
  );
}

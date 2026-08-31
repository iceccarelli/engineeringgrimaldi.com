import BrandMark from './BrandMark';
import { getDict } from '@/lib/dict';
import { langHref, type Lang } from '@/lib/i18n';
import { NAV } from '@/lib/nav';

/**
 * Footer as the full site index, derived from the same spine as the
 * header — the AWS pattern of "everything is reachable from the bottom
 * of every page". Adding a nav item lands it here automatically.
 */
export default function SiteFooter({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const href = (path: string) => langHref(lang, path);

  return (
    <footer>
      <div className="foot">
        <div className="foot-columns">
          {NAV.map((section) => (
            <div className="foot-col" key={section.id}>
              <h4><a href={href(section.path)}>{section.label[lang]}</a></h4>
              {section.groups.map((group) => (
                <ul key={group.label.en}>
                  {group.items.map((item) => (
                    <li key={item.path}>
                      <a href={href(item.path)}>{item.label[lang]}</a>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          ))}
        </div>

        <div className="foot-base">
          <div className="foot-base-brand">
            <div className="foot-brand"><BrandMark size={36} /><b>Grimaldi Engineering</b></div>
            <p>{t.footAbout}</p>
            <p className="foot-disambiguation">{t.footDisambiguation}</p>
          </div>
          <div className="foot-base-links">
            <h4>{t.footNet}</h4>
            <a href="https://igrimaldi.engineering">igrimaldi.engineering — {t.netSoftware}</a>
            <a href="https://grimaldi.ca">grimaldi.ca — {t.netPersonal}</a>
            <a href="https://github.com/iceccarelli" rel="noopener noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/vincenzo-ceccarelli-grimaldi-2912b42a0" rel="noopener noreferrer">LinkedIn</a>
          </div>
          <div className="foot-base-links">
            <h4>{t.footLegal}</h4>
            <a href={href('/impressum')}>{t.impressum}</a>
            <a href={href('/datenschutz')}>{t.datenschutz}</a>
            <a href={href('/book')}>{t.navBook}</a>
          </div>
        </div>

        <div className="legal">
          <span>{t.rights}</span>
          <span>{t.authorLine}</span>
        </div>
      </div>
    </footer>
  );
}

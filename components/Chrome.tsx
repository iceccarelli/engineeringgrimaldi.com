import type { ReactNode } from 'react';
import BrandMark from './BrandMark';
import LangSwitcher from './LangSwitcher';
import { getDict } from '@/lib/dict';
import { langHref, type Lang } from '@/lib/i18n';

/**
 * Shared chrome: utility bar (language links + network), nav, footer.
 * Server component — no mailto anywhere; the conversion path is /book.
 */
export default function Chrome({ lang, children }: { lang: Lang; children: ReactNode }) {
  const t = getDict(lang);
  const href = (path: string) => langHref(lang, path);

  return (
    <>
      <div className="utility">
        <div className="utility-in">
          <LangSwitcher current={lang} label={t.langLabel} />
          <a href="https://igrimaldi.engineering">igrimaldi.engineering</a>
          <a href="https://grimaldi.ca">grimaldi.ca</a>
          <a href="https://github.com/iceccarelli" rel="noopener noreferrer">GitHub</a>
        </div>
      </div>

      <div className="nav">
        <div className="nav-in">
          <a className="brand" href={href('/')}>
            <BrandMark size={38} />
            <span>
              <b>Grimaldi Engineering</b>
              <small>{t.brandTag}</small>
            </span>
          </a>
          <div className="nav-links">
            <a href={href('/forge')}>{t.navForge}</a>
            <a href={href('/tools/pallet-pattern-calculator')}>{t.navTools}</a>
            <a href={href('/lab')}>{t.navLab}</a>
            <a href={href('/disciplines/high-voltage')}>{t.navDisciplines}</a>
          </div>
          <a className="pill" href={href('/book')}>{t.navBook}</a>
        </div>
      </div>

      {children}

      <footer>
        <div className="foot">
          <div className="foot-grid">
            <div>
              <div className="foot-brand"><BrandMark size={42} /><b>Grimaldi Engineering</b></div>
              <p>{t.footAbout}</p>
              <p className="foot-disambiguation">{t.footDisambiguation}</p>
            </div>
            <div>
              <h4>{t.footNet}</h4>
              <a href="https://igrimaldi.engineering">igrimaldi.engineering — {t.netSoftware}</a>
              <a href="https://grimaldi.ca">grimaldi.ca — {t.netPersonal}</a>
              <a href="https://github.com/iceccarelli" rel="noopener noreferrer">GitHub — iceccarelli</a>
              <a href="https://www.linkedin.com/in/vincenzo-ceccarelli-grimaldi-2912b42a0" rel="noopener noreferrer">LinkedIn</a>
            </div>
            <div>
              <h4>{t.footLegal}</h4>
              <a href={href('/book')}>{t.navBook}</a>
              <a href={href('/impressum')}>{t.impressum}</a>
              <a href={href('/datenschutz')}>{t.datenschutz}</a>
            </div>
          </div>
          <div className="legal">
            <span>{t.rights}</span>
            <span>{t.authorLine}</span>
          </div>
        </div>
      </footer>
    </>
  );
}

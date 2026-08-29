'use client';

import { type ReactNode } from 'react';
import BrandMark from './BrandMark';
import { locales, useI18n } from '@/lib/i18n';

/** Shared chrome: utility bar (locale + network), nav, footer. */
export default function Chrome({ children }: { children: ReactNode }) {
  const { locale, setLocale, t } = useI18n();

  return (
    <>
      <div className="utility">
        <div className="utility-in">
          <span className="lang" role="group" aria-label="Language">
            {locales.map(({ code, native }) => (
              <button key={code} type="button" className={locale === code ? 'on' : ''} onClick={() => setLocale(code)}>
                {native}
              </button>
            ))}
          </span>
          <a href="https://igrimaldi.engineering">igrimaldi.engineering</a>
          <a href="https://grimaldi.ca">grimaldi.ca</a>
          <a href="https://igrimaldi.engineering/card">{t('netCard')}</a>
          <a href="https://github.com/iceccarelli" rel="noopener noreferrer">GitHub</a>
        </div>
      </div>

      <div className="nav">
        <div className="nav-in">
          <a className="brand" href="/">
            <BrandMark size={38} />
            <span>
              <b>Grimaldi Engineering</b>
              <small>{t('brandTag')}</small>
            </span>
          </a>
          <div className="nav-links">
            <a href="#scope">{t('vKicker')}</a>
            <a href="#disciplines">{t('navD')}</a>
            <a href="#method">{t('navM')}</a>
            <a href="#network">{t('navN')}</a>
          </div>
          <a className="pill" href="mailto:vincenzo@igrimaldi.engineering">{t('connect')}</a>
        </div>
      </div>

      {children}

      <footer>
        <div className="foot">
          <div className="foot-grid">
            <div>
              <div className="foot-brand"><BrandMark size={42} /><b>Grimaldi Engineering</b></div>
              <p>{t('footAbout')}</p>
            </div>
            <div>
              <h4>{t('footNet')}</h4>
              <a href="https://igrimaldi.engineering">igrimaldi.engineering — {t('netSoftware')}</a>
              <a href="https://engineeringgrimaldi.com">engineeringgrimaldi.com — {t('netHardware')}</a>
              <a href="https://grimaldi.ca">grimaldi.ca — {t('netPersonal')}</a>
              <a href="https://igrimaldi.engineering/card">{t('netCard')}</a>
              <a href="https://github.com/iceccarelli" rel="noopener noreferrer">GitHub — iceccarelli</a>
            </div>
            <div>
              <h4>{t('footContact')}</h4>
              <a href="mailto:vincenzo@igrimaldi.engineering">vincenzo@igrimaldi.engineering →</a>
              <a href="https://www.linkedin.com/in/vincenzo-ceccarelli-grimaldi-2912b42a0" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://x.com/Vince87Grimaldi" rel="noopener noreferrer">X</a>
              <a href="https://www.instagram.com/grimaldiengineering/" rel="noopener noreferrer">Instagram</a>
            </div>
          </div>
          <div className="legal">
            <span>{t('rights')}</span>
            <a href="#top">{t('top')}</a>
          </div>
        </div>
      </footer>
    </>
  );
}

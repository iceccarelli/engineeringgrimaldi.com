'use client';

import Oscilloscope from '@/components/Oscilloscope';
import { useI18n } from '@/lib/i18n';

export default function Home() {
  const { t } = useI18n();

  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="hero-in">
          <div className="hero-card">
            <span className="kicker">{t('kicker')}</span>
            <h1>{t('title')}</h1>
            <p className="lead">{t('lead')}</p>
            <div className="cta-row">
              <a className="btn btn-glow" href="#scope">{t('vKicker')} →</a>
              <a className="btn btn-line" href="https://igrimaldi.engineering">{t('ctaSoftware')}</a>
            </div>
          </div>
        </div>
      </section>

      <div className="sheet">
        {/* SIGNATURE INSTRUMENT */}
        <div className="section" id="scope">
          <span className="kicker">{t('vKicker')}</span>
          <h2>{t('vTitle')}</h2>
          <p className="intro">{t('vIntro')}</p>
          <Oscilloscope />
        </div>

        {/* DISCIPLINES */}
        <div className="section" id="disciplines">
          <span className="kicker">{t('d_kicker')}</span>
          <h2>{t('d_title')}</h2>
          <p className="intro">{t('d_intro')}</p>
          <div className="grid">
            {(['c1', 'c2', 'c3'] as const).map((c, i) => (
              <div className="card" key={c}>
                <span className="tag">{t(`${c}tag`)}</span>
                <h3>{t(`${c}title`)}</h3>
                <p>{t(`${c}body`)}</p>
                <span className="status"><span className="dot" /> {t(i === 0 ? 'soon' : i === 1 ? 'soon2' : 'soon3')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* METHOD */}
        <div className="section" id="method">
          <span className="kicker">{t('m_kicker')}</span>
          <h2>{t('m_title')}</h2>
          <p className="intro">{t('m_intro')}</p>
          <div className="steps">
            {(['s1', 's2', 's3'] as const).map((s) => (
              <div className="step" key={s}>
                <h3>{t(`${s}title`)}</h3>
                <p>{t(`${s}body`)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* NETWORK */}
        <div className="section" id="network">
          <span className="kicker">{t('n_kicker')}</span>
          <h2>{t('n_title')}</h2>
          <div className="grid">
            <a className="card card-link" href="https://igrimaldi.engineering">
              <span className="tag">igrimaldi.engineering</span>
              <h3>{t('n1title')}</h3>
              <p>{t('n1body')}</p>
              <span className="cta">{t('open')}</span>
            </a>
            <a className="card card-link" href="https://physics-informed.vercel.app/" rel="noopener noreferrer">
              <span className="tag">{t('n2tag')}</span>
              <h3>{t('n2title')}</h3>
              <p>{t('n2body')}</p>
              <span className="cta">{t('open2')}</span>
            </a>
            <a className="card card-link" href="https://igrimaldi.engineering/card">
              <span className="tag">{t('n3tag')}</span>
              <h3>{t('n3title')}</h3>
              <p>{t('n3body')}</p>
              <span className="cta">{t('open3')}</span>
            </a>
          </div>
        </div>

        {/* NOTIFY */}
        <div className="section">
          <div className="banner">
            <div>
              <h2>{t('bannerTitle')}</h2>
              <p>{t('bannerBody')}</p>
            </div>
            <a className="btn btn-glow" href="mailto:vincenzo@igrimaldi.engineering?subject=Notify%20me%20—%20engineeringgrimaldi.com">
              {t('bannerCta')}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

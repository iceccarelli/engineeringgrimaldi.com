import Link from "next/link";
import Plate from "@/components/Plate";
import { HOME_DATA } from "@/lib/hub-home";
import { isLang, langHref, pick, type Lang } from "@/lib/i18n";
import { NB_URL, TTP_URL } from "@/lib/site";
export default function HomePage({ params }: { params: { lang: string } }) {
  const lang: Lang = isLang(params.lang) ? params.lang : "en";
  const de = lang === "de";
  return (
    <main>
      <section className="hero"><div className="hero-in">
        <span className="kicker kicker-signal">{pick(lang, HOME_DATA.kicker)}</span>
        <h1>{pick(lang, HOME_DATA.h1)}</h1><p className="lead">{pick(lang, HOME_DATA.lead)}</p>
        <div className="cta-row">
          <a className="btn btn-signal" href={TTP_URL} rel="noopener noreferrer">timetopower.ai ↗</a>
          <a className="btn btn-signal" href={NB_URL} rel="noopener noreferrer">neuralbridge.io ↗</a>
          <Link className="btn" href={langHref(lang, "/contact")}>{de ? "Pilot-Anfrage →" : "Pilot inquiry →"}</Link>
        </div>
        <Plate src={HOME_DATA.heroPlate.src} alt={HOME_DATA.heroPlate.alt} code={HOME_DATA.heroPlate.code} caption={pick(lang, HOME_DATA.heroPlate.caption)} priority />
      </div></section>
      <section className="section">
        <span className="kicker">{de ? "DIE BEIDEN UNTERNEHMEN" : "THE TWO COMPANIES"}</span>
        <h2>Time to Power (Gridforge) &amp; NeuralBridge</h2>
        <div className="grid grid-2" style={{ marginTop: 16 }}>
          {HOME_DATA.companies.map((c) => (
            <article key={c.slug} className="hub-company-card">
              <span className="kicker kicker-signal">{c.tag}</span><h3>{c.name}</h3><p>{pick(lang, c.valueProp)}</p>
              <Plate src={c.plate.src} alt={c.plate.alt} code={c.plate.code} caption={pick(lang, c.plate.caption)} sizes="(max-width: 980px) 100vw, 540px" />
              <div className="cta-row" style={{ marginBottom: 0 }}>
                <a className="btn btn-signal" href={c.externalUrl} rel="noopener noreferrer">{c.externalLabel}</a>
                <Link className="btn" href={langHref(lang, c.internalPath)}>{de ? "Überblick →" : "Hub overview →"}</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section">
        <h2>{pick(lang, HOME_DATA.whyHeading)}</h2><p className="lead">{pick(lang, HOME_DATA.whyBody)}</p>
        <div className="grid grid-2">{HOME_DATA.whyPlates.map((pl) => (<Plate key={pl.src} src={pl.src} alt={pl.alt} code={pl.code} caption={pick(lang, pl.caption)} sizes="(max-width: 980px) 100vw, 568px" />))}</div>
      </section>
      <section className="section">
        <h2>{pick(lang, HOME_DATA.statusHeading)}</h2><p className="lead">{pick(lang, HOME_DATA.statusBody)}</p>
        <div className="grid grid-2">{HOME_DATA.statusPlates.map((pl) => (<Plate key={pl.src} src={pl.src} alt={pl.alt} code={pl.code} caption={pick(lang, pl.caption)} sizes="(max-width: 980px) 100vw, 568px" />))}</div>
      </section>
    </main>
  );
}

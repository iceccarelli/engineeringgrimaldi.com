import Link from "next/link";
import Plate from "./Plate";
import { HUB_PAGES, type HubPageKey } from "@/lib/hub-pages";
import { getDict } from "@/lib/dict";
import { langHref, pick, type Lang } from "@/lib/i18n";
export default function HubSectionPage({ pageKey, lang }: { pageKey: HubPageKey; lang: Lang }) {
  const p = HUB_PAGES[pageKey];
  const t = getDict(lang);
  return (
    <main>
      <section className="hero"><div className="hero-in">
        <span className="kicker kicker-signal">{pick(lang, p.kicker)}</span>
        <h1>{pick(lang, p.title)}</h1><p className="lead">{pick(lang, p.description)}</p>
        <div className="cta-row">
          {p.externalUrl && <a className="btn btn-signal" href={p.externalUrl} rel="noopener noreferrer">{p.externalLabel}</a>}
          <Link className="btn" href={langHref(lang, "/contact")}>{t.navBook} →</Link>
        </div>
        <Plate src={p.hero.src} alt={p.hero.alt} code={p.hero.code} caption={pick(lang, p.hero.caption)} priority />
      </div></section>
      {p.blocks.map((b, i) => (
        <section key={i} className="section">
          <h2>{pick(lang, b.heading)}</h2><p className="lead">{pick(lang, b.body)}</p>
          <div className={b.plates.length > 1 ? "grid grid-2" : "hub-single"}>
            {b.plates.map((pl) => (<Plate key={pl.src} src={pl.src} alt={pl.alt} code={pl.code} caption={pick(lang, pl.caption)} sizes={b.plates.length > 1 ? "(max-width: 980px) 100vw, 568px" : "(max-width: 980px) 100vw, 1152px"} />))}
          </div>
        </section>
      ))}
    </main>
  );
}

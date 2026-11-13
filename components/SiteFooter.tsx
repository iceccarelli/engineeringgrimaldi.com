import Link from "next/link";
import BrandMark from "./BrandMark";
import { getDict } from "@/lib/dict";
import { langHref, type Lang } from "@/lib/i18n";
import { NAV } from "@/lib/nav";
import { GITHUB_OWNER, NB_URL, PERSONAL_URL, PORTFOLIO_URL, TTP_URL } from "@/lib/site";
export default function SiteFooter({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const href = (p: string) => langHref(lang, p);
  return (
    <footer><div className="foot">
      <div className="foot-base">
        <div className="foot-base-brand">
          <div className="foot-brand"><BrandMark size={36} /><b>Grimaldi Engineering</b></div>
          <p className="mono">{t.stageLine}</p><p>{t.footAbout}</p><p className="foot-disambiguation">{t.footDisambiguation}</p>
        </div>
        <div className="foot-base-links">
          <h4>{t.footNet}</h4>
          <a href={TTP_URL} rel="noopener noreferrer">timetopower.ai — Time to Power (Gridforge)</a>
          <a href={NB_URL} rel="noopener noreferrer">neuralbridge.io — NeuralBridge</a>
          <a href={PORTFOLIO_URL} rel="noopener noreferrer">igrimaldi.engineering — Power Systems</a>
          <a href={PERSONAL_URL} rel="noopener noreferrer">grimaldi.ca</a>
          <a href={GITHUB_OWNER} rel="noopener noreferrer">GitHub — iceccarelli</a>
        </div>
        <div className="foot-base-links">
          <h4>{t.footLegal}</h4>
          {NAV.map((s) => <Link key={s.id} href={href(s.path)}>{s.label[lang]}</Link>)}
          <Link href={href("/contact")}>{t.navBook}</Link>
          <Link href={href("/impressum")}>{t.impressum}</Link>
          <Link href={href("/datenschutz")}>{t.datenschutz}</Link>
          <a href="/api/hub">/api/hub</a>
          <a href="/llms.txt">/llms.txt</a>
        </div>
      </div>
      <div className="legal"><span>© {new Date().getFullYear()} Grimaldi Engineering · {t.rights}</span><span>{t.authorLine}</span></div>
    </div></footer>
  );
}

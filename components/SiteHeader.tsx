"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandMark from "./BrandMark";
import LangSwitcher from "./LangSwitcher";
import { NAV } from "@/lib/nav";
import { getDict } from "@/lib/dict";
import { langHref, type Lang } from "@/lib/i18n";
import { NB_URL, TTP_URL } from "@/lib/site";
export default function SiteHeader({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? "/";
  const t = getDict(lang);
  const href = (p: string) => langHref(lang, p);
  return (
    <>
      <a className="skip-link" href="#main">{t.skipToContent}</a>
      <div className="utility"><div className="utility-in">
        <LangSwitcher current={lang} label={t.langLabel} />
        <a href={TTP_URL} rel="noopener noreferrer">timetopower.ai ↗</a>
        <a href={NB_URL} rel="noopener noreferrer">neuralbridge.io ↗</a>
        <a href="/api/hub">/api/hub</a>
      </div></div>
      <header className="masthead"><div className="masthead-in">
        <Link className="brand" href={href("/")}><BrandMark size={36} /><span><b>Grimaldi Engineering</b><small>{t.brandTag}</small></span></Link>
        <nav className="mega" aria-label={t.primaryNav}><ul className="mega-bar">
          {NAV.map((s) => { const on = pathname === href(s.path); return (<li key={s.id} className="mega-item"><Link href={href(s.path)} className={on ? "mega-trigger on" : "mega-trigger"} aria-current={on ? "page" : undefined}>{s.label[lang]}</Link></li>); })}
        </ul></nav>
        <div className="masthead-actions">
          <Link className="pill" href={href("/contact")}>{t.navBook}</Link>
          <button type="button" className="drawer-toggle" aria-expanded={open} aria-controls="site-drawer" onClick={() => setOpen((v) => !v)}>
            <span className="sr-only">{open ? t.navClose : t.navMenu}</span><span aria-hidden="true" className={open ? "burger open" : "burger"}><i /><i /><i /></span>
          </button>
        </div>
      </div></header>
      <div id="site-drawer" className={open ? "drawer drawer-open" : "drawer"} hidden={!open}>
        <nav aria-label={t.primaryNav}>
          {NAV.map((s) => (<div className="drawer-section" key={s.id}><div className="drawer-row"><Link href={href(s.path)} className="drawer-link" onClick={() => setOpen(false)}>{s.label[lang]}</Link></div></div>))}
          <Link className="btn btn-signal drawer-cta" href={href("/contact")} onClick={() => setOpen(false)}>{t.navBook}</Link>
        </nav>
      </div>
    </>
  );
}

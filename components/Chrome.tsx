import type { ReactNode } from "react";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import type { Lang } from "@/lib/i18n";
export default function Chrome({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (<><SiteHeader lang={lang} /><div id="main">{children}</div><SiteFooter lang={lang} /></>);
}

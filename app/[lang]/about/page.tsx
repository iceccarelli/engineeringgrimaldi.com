import type { Metadata } from "next";
import HubSectionPage from "@/components/HubSectionPage";
import { HUB_PAGES } from "@/lib/hub-pages";
import { isLang, pageAlternates, pick, type Lang } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : "en";
  const p = HUB_PAGES["about"];
  return { title: pick(lang, p.title), description: pick(lang, p.description), alternates: pageAlternates(lang, p.path), openGraph: { title: pick(lang, p.title), description: pick(lang, p.description), images: [{ url: SITE_URL + p.hero.src, width: 1168, height: 784 }] } };
}
export default function Page({ params }: { params: { lang: string } }) { return <HubSectionPage pageKey="about" lang={isLang(params.lang) ? params.lang : "en"} />; }

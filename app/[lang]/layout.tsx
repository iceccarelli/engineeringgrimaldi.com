import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Chrome from "@/components/Chrome";
import JsonLd from "@/components/JsonLd";
import { LANGS, isLang, pageAlternates, type Lang } from "@/lib/i18n";
import { organizationSchema, personSchema, websiteSchema } from "@/lib/schema";
import { SITE_URL } from "@/lib/site";
import "../globals.css";
export function generateStaticParams(): { lang: Lang }[] { return LANGS.map((lang) => ({ lang })); }
export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : "en";
  const title = "Grimaldi Engineering — Time to Power (Gridforge) & NeuralBridge";
  const description = lang === "de"
    ? "Unternehmens-Hub für Time to Power (Gridforge) Leistungskapazitäts-Intelligenz und NeuralBridge industrielle autonome Sicherheitsnachweise. Pilotphase, gründergeführt."
    : "Companies hub for Time to Power (Gridforge) power-capacity intelligence and NeuralBridge industrial autonomous assurance. Pilot-stage, founder-led.";
  const og = SITE_URL + "/images/companies/07-grimaldi-engineering-two-companies.jpg";
  return {
    metadataBase: new URL(SITE_URL), title: { default: title, template: "%s | Grimaldi Engineering" }, description,
    alternates: pageAlternates(lang, "/"),
    openGraph: { title, description, url: SITE_URL + (lang === "de" ? "/de" : "/"), siteName: "Grimaldi Engineering", type: "website", locale: lang === "de" ? "de_DE" : "en_US", images: [{ url: og, width: 1168, height: 784 }] },
    twitter: { card: "summary_large_image", title, description, images: [og] },
  };
}
export default function RootLayout({ children, params }: { children: ReactNode; params: { lang: string } }) {
  if (!isLang(params.lang)) notFound();
  return (
    <html lang={params.lang} id="top">
      <head>
        <link rel="preload" href="/fonts/ibm-plex-sans-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/ibm-plex-sans-latin-600-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/ibm-plex-mono-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body><Chrome lang={params.lang}>{children}</Chrome><JsonLd data={websiteSchema()} /><JsonLd data={organizationSchema()} /><JsonLd data={personSchema()} /><Analytics /><SpeedInsights /></body>
    </html>
  );
}

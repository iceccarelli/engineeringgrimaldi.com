import type { Metadata } from "next";
import { isLang, pageAlternates, type Lang } from "@/lib/i18n";
import { CONTACT_EMAIL, PERSON_NAME } from "@/lib/site";
export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : "en";
  return { title: lang === "de" ? "Datenschutzerklärung" : "Privacy Policy", description: "DSGVO / GDPR — engineeringgrimaldi.com.", alternates: pageAlternates(lang, "/datenschutz") };
}
export default function DatenschutzPage({ params }: { params: { lang: string } }) {
  const de = params.lang === "de";
  return (
    <main><div className="sheet sheet-top"><div className="section prose">
      <h1>{de ? "Datenschutzerklärung" : "Privacy Policy"}</h1>
      <h2>{de ? "1. Verantwortlicher" : "1. Controller"}</h2>
      <p>{PERSON_NAME}<br />Pfeilstraße 6, 52066 Aachen, Deutschland<br />E-Mail: <a href={"mailto:" + CONTACT_EMAIL}>{CONTACT_EMAIL}</a></p>
      <h2>{de ? "2. Hosting & Server-Logs" : "2. Hosting & Server Logs"}</h2>
      <p>{de ? "Hosting bei Vercel Inc. (USA). Server-Logs werden zur Betriebssicherheit gemäß Art. 6 Abs. 1 lit. f DSGVO auf Basis des EU-US Data Privacy Framework verarbeitet." : "Hosted by Vercel Inc. (USA). Necessary server logs are processed under Art. 6(1)(f) GDPR via the EU-US Data Privacy Framework and Standard Contractual Clauses."}</p>
      <h2>{de ? "3. Cookielose Analytik" : "3. Cookieless Analytics"}</h2>
      <p>{de ? "Vercel Analytics und Speed Insights arbeiten ohne Cookies und ohne geräteübergreifende Profile (Art. 6 Abs. 1 lit. f DSGVO)." : "Vercel Analytics and Speed Insights run without cookies or cross-site tracking (Art. 6(1)(f) GDPR)."}</p>
      <h2>{de ? "4. Kontaktformular & Rechte" : "4. Inquiry Form & Your Rights"}</h2>
      <p>{de ? "Anfragedaten werden ausschließlich zur Beantwortung verarbeitet (Art. 6 Abs. 1 lit. b/f DSGVO). Sie haben Rechte gemäß Art. 15–21 DSGVO sowie ein Beschwerderecht bei der LDI NRW. Stand: November 2026." : "Inquiry submissions are processed solely to respond to your request (Art. 6(1)(b)/(f) GDPR). You hold GDPR rights under Arts. 15–21 and may contact the supervisory authority LDI NRW. Updated: November 2026."}</p>
    </div></div></main>
  );
}

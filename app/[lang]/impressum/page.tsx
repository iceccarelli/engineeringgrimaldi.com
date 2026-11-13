import type { Metadata } from "next";
import Link from "next/link";
import { getDict } from "@/lib/dict";
import { isLang, langHref, pageAlternates, type Lang } from "@/lib/i18n";
import { CONTACT_EMAIL, PERSON_NAME } from "@/lib/site";
export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : "en";
  return { title: "Impressum", description: "Anbieterkennzeichnung gemäß § 5 DDG — Grimaldi Engineering.", alternates: pageAlternates(lang, "/impressum") };
}
export default function ImpressumPage({ params }: { params: { lang: string } }) {
  const lang: Lang = isLang(params.lang) ? params.lang : "en";
  const t = getDict(lang);
  return (
    <main><div className="sheet sheet-top"><div className="section prose">
      <h1>Impressum</h1>
      <h2>Angaben gemäß § 5 DDG</h2>
      <p>{PERSON_NAME}<br />Pfeilstraße 6<br />52066 Aachen<br />Deutschland</p>
      <h2>Kontakt</h2>
      <p>E-Mail: <a href={"mailto:" + CONTACT_EMAIL}>{CONTACT_EMAIL}</a><br />Kontaktformular: <Link href={langHref(lang, "/contact")}>engineeringgrimaldi.com/contact</Link></p>
      <h2>Verantwortlich nach § 18 Abs. 2 MStV</h2>
      <p>{PERSON_NAME}, Pfeilstraße 6, 52066 Aachen, Deutschland.</p>
      <h2>Unabhängigkeit &amp; Namensklarstellung</h2>
      <p>{t.authorLine}</p><p>{t.footDisambiguation}</p>
      <h2>Verbraucherstreitbeilegung (§ 36 VSBG)</h2>
      <p>Zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle bin ich weder bereit noch verpflichtet.</p>
    </div></div></main>
  );
}

import type { Metadata } from 'next';
import { getDict } from '@/lib/dict';
import { isLang, pageAlternates, type Lang } from '@/lib/i18n';
import { CONTACT_EMAIL, PERSON_NAME } from '@/lib/site';

/**
 * Impressum (§ 5 DDG, § 18 Abs. 2 MStV). The German block is
 * authoritative and renders on both language routes; the English route
 * adds a short framing note. Operator MUST fill the TODO fields
 * (ladungsfähige Anschrift, ggf. USt-IdNr.) before go-live — a German
 * site without them is an abmahn risk.
 */

type PageProps = { params: { lang: string } };

export function generateMetadata({ params }: PageProps): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  return {
    title: 'Impressum',
    description:
      lang === 'de'
        ? 'Impressum von engineeringgrimaldi.com — Anbieterkennzeichnung nach § 5 DDG.'
        : 'Impressum (legal notice) for engineeringgrimaldi.com — provider identification under German law (§ 5 DDG).',
    alternates: pageAlternates(lang, '/impressum'),
    robots: { index: false, follow: true },
  };
}

export default function ImpressumPage({ params }: PageProps) {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const t = getDict(lang);

  return (
    <main>
      <div className="sheet sheet-top">
        <div className="section prose">
          <h1>Impressum</h1>

          {lang === 'en' && (
            <p>
              This site is operated from Germany. The following provider identification is required
              by German law (§ 5 DDG) and is authoritative in German.
            </p>
          )}

          <h2>Angaben gemäß § 5 DDG</h2>
          <p>
            {PERSON_NAME}
            <br />
            {/* TODO(operator): ladungsfähige Anschrift eintragen — Straße, Hausnummer, PLZ, Stadt. */}
            [TODO: Straße und Hausnummer]
            <br />
            [TODO: PLZ] Frankfurt am Main
            <br />
            Deutschland
          </p>

          <h2>Kontakt</h2>
          <p>
            E-Mail: {CONTACT_EMAIL}
            {/* TODO(operator): optional Telefonnummer ergänzen. */}
          </p>

          <h2>Umsatzsteuer-ID</h2>
          <p>
            {/* TODO(operator): USt-IdNr. gemäß § 27a UStG eintragen, oder diesen Abschnitt
                entfernen, falls keine vorhanden ist. */}
            [TODO: USt-IdNr. gemäß § 27a UStG, sofern vorhanden]
          </p>

          <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
          <p>
            {PERSON_NAME}
            <br />
            [TODO: Anschrift wie oben]
          </p>

          <h2>Namensklarstellung / Name disambiguation</h2>
          <p>{t.footDisambiguation}</p>

          <h2>Haftung für Links</h2>
          <p>
            Diese Website enthält Links zu externen Websites Dritter, auf deren Inhalte kein
            Einfluss besteht. Für diese fremden Inhalte wird keine Gewähr übernommen; verantwortlich
            ist stets der jeweilige Anbieter oder Betreiber der Seiten.
          </p>
        </div>
      </div>
    </main>
  );
}

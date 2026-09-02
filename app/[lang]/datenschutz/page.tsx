import type { Metadata } from 'next';
import { isLang, pageAlternates, type Lang } from '@/lib/i18n';
import { CONTACT_EMAIL, PERSON_NAME } from '@/lib/site';

/**
 * Datenschutzerklärung (DSGVO). Bilingual skeleton with accurate
 * descriptions of what THIS site actually does: Vercel hosting +
 * server logs, cookieless Vercel Analytics / Speed Insights, the
 * SKU/layout intake forwarded to a mail relay, and the legacy newsletter
 * endpoint (kept, unmounted).
 * TODO fields only where operator data (address) must be filled.
 * If GA4 is ever enabled (NEXT_PUBLIC_GA_ID), a consent banner MUST be
 * added first and this page extended — do not enable GA silently.
 */

type PageProps = { params: { lang: string } };

export function generateMetadata({ params }: PageProps): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  return {
    title: lang === 'de' ? 'Datenschutzerklärung' : 'Privacy Policy',
    description:
      lang === 'de'
        ? 'Datenschutzerklärung von engineeringgrimaldi.com: Hosting, Server-Logs, cookielose Analytik, SKU-/Layout-Formular.'
        : 'Privacy policy for engineeringgrimaldi.com: hosting, server logs, cookieless analytics, SKU/layout intake form.',
    alternates: pageAlternates(lang, '/datenschutz'),
    robots: { index: false, follow: true },
  };
}

export default function DatenschutzPage({ params }: PageProps) {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';

  if (lang === 'de') {
    return (
      <main>
        <div className="sheet sheet-top">
          <div className="section prose">
            <h1>Datenschutzerklärung</h1>

            <h2>1. Verantwortlicher</h2>
            <p>
              {PERSON_NAME}
              <br />
              [TODO: Anschrift wie im Impressum]
              <br />
              E-Mail: {CONTACT_EMAIL}
            </p>

            <h2>2. Hosting und Server-Logs</h2>
            <p>
              Diese Website wird bei Vercel Inc. (440 N Barranca Ave #4133, Covina, CA 91723, USA)
              gehostet. Beim Aufruf der Seiten verarbeitet Vercel technisch notwendige Daten
              (IP-Adresse, Zeitpunkt, angeforderte URL, User-Agent) in Server-Logs. Rechtsgrundlage
              ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am sicheren Betrieb). Mit
              Vercel besteht ein Auftragsverarbeitungsvertrag; Übermittlungen in die USA stützen
              sich auf die EU-Standardvertragsklauseln.
            </p>

            <h2>3. Reichweitenmessung ohne Cookies</h2>
            <p>
              Diese Website nutzt Vercel Analytics und Vercel Speed Insights. Beide arbeiten ohne
              Cookies und ohne geräteübergreifendes Tracking; IP-Adressen werden nicht dauerhaft
              gespeichert. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Ein Widerspruch ist
              jederzeit per E-Mail möglich.
            </p>

            <h2>4. SKU-/Layout-Formular</h2>
            <p>
              Über das Formular übermitteln Sie Firma, Stadt, Robotermarke, E-Mail-Adresse, eine
              SKU-Datei (CSV) und optional ein Zellenlayout (PDF). Diese Daten werden an ein vom
              Verantwortlichen betriebenes E-Mail-Relais weitergeleitet und ausschließlich zur
              Beantwortung Ihrer Anfrage verwendet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO
              (vorvertragliche Maßnahmen). Die Daten werden gelöscht, sobald die Anfrage
              abgeschlossen ist und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
            </p>

            <h2>5. Stapelplaner und Rechner</h2>
            <p>
              Der Stapelplaner und die Rechner laufen vollständig in Ihrem Browser. Eingegebene
              SKU-Listen und Maße werden nicht an einen Server übertragen.
            </p>

            <h2>6. Ihre Rechte</h2>
            <p>
              Sie haben nach der DSGVO Rechte auf Auskunft (Art. 15), Berichtigung (Art. 16),
              Löschung (Art. 17), Einschränkung (Art. 18), Datenübertragbarkeit (Art. 20) und
              Widerspruch (Art. 21) sowie das Recht auf Beschwerde bei einer Aufsichtsbehörde —
              zuständig ist der Hessische Beauftragte für Datenschutz und Informationsfreiheit.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="sheet sheet-top">
        <div className="section prose">
          <h1>Privacy Policy</h1>

          <h2>1. Controller</h2>
          <p>
            {PERSON_NAME}
            <br />
            [TODO: address as in the Impressum]
            <br />
            Email: {CONTACT_EMAIL}
          </p>

          <h2>2. Hosting and server logs</h2>
          <p>
            This site is hosted by Vercel Inc. (440 N Barranca Ave #4133, Covina, CA 91723, USA).
            Serving the site processes technically necessary data (IP address, timestamp, requested
            URL, user agent) in server logs. Legal basis: Art. 6(1)(f) GDPR (legitimate interest in
            secure operation). A data-processing agreement is in place with Vercel; US transfers
            rely on the EU Standard Contractual Clauses.
          </p>

          <h2>3. Cookieless analytics</h2>
          <p>
            This site uses Vercel Analytics and Vercel Speed Insights. Both operate without cookies
            and without cross-site tracking; IP addresses are not stored permanently. Legal basis:
            Art. 6(1)(f) GDPR. You may object at any time by email.
          </p>

          <h2>4. SKU / layout intake</h2>
          <p>
            The intake form transmits company, city, robot brand, email address, a SKU file (CSV)
            and optionally a cell layout (PDF). These are forwarded to a mail relay operated by the
            controller and used solely to answer your request. Legal basis: Art. 6(1)(b) GDPR
            (pre-contractual steps). The data is deleted once the request is closed, subject to
            statutory retention duties.
          </p>

          <h2>5. Stack planner and calculators</h2>
          <p>
            The stack planner and the calculators run entirely in your browser. SKU lists and
            dimensions you enter are not transmitted to a server.
          </p>

          <h2>6. Your rights</h2>
          <p>
            Under the GDPR you have the rights of access (Art. 15), rectification (Art. 16),
            erasure (Art. 17), restriction (Art. 18), data portability (Art. 20) and objection
            (Art. 21), plus the right to lodge a complaint with a supervisory authority — for this
            controller, the Hessian Commissioner for Data Protection and Freedom of Information.
          </p>
        </div>
      </div>
    </main>
  );
}

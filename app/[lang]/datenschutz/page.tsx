import type { Metadata } from 'next';
import { isLang, pageAlternates, type Lang } from '@/lib/i18n';
import { CONTACT_EMAIL, PERSON_NAME } from '@/lib/site';

/**
 * Datenschutzerklärung (DSGVO). Bilingual skeleton with accurate
 * descriptions of what THIS site actually does: Vercel hosting +
 * server logs, cookieless Vercel Analytics / Speed Insights, the
 * double-opt-in waitlist via Loops, and outbound booking via Cal.com.
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
        ? 'Datenschutzerklärung von engineeringgrimaldi.com: Hosting, Server-Logs, cookielose Analytik, Warteliste mit Double-Opt-in, Terminbuchung.'
        : 'Privacy policy for engineeringgrimaldi.com: hosting, server logs, cookieless analytics, double-opt-in waitlist, booking.',
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

            <h2>4. Warteliste (Newsletter)</h2>
            <p>
              Für die Warteliste wird die eingegebene E-Mail-Adresse und das gewählte Interesse an
              den Dienst Loops (Loops, Inc., USA) übermittelt und dort gespeichert. Die Anmeldung
              erfolgt im Double-Opt-in-Verfahren; ohne Bestätigung wird nicht versendet.
              Rechtsgrundlage ist die Einwilligung (Art. 6 Abs. 1 lit. a DSGVO); sie ist jederzeit
              über den Abmeldelink oder per E-Mail widerrufbar.
            </p>

            <h2>5. Terminbuchung</h2>
            <p>
              Die Terminbuchung führt zu einem externen Buchungsdienst (Cal.com). Dort eingegebene
              Daten verarbeitet der Anbieter nach eigener Datenschutzerklärung; diese Website
              überträgt beim Klick lediglich die Herkunftskennung.
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

          <h2>4. Waitlist</h2>
          <p>
            Joining the waitlist transmits your email address and chosen interest to Loops (Loops,
            Inc., USA), where they are stored. Sign-up is double opt-in; nothing is sent without
            confirmation. Legal basis: consent (Art. 6(1)(a) GDPR), revocable at any time via the
            unsubscribe link or by email.
          </p>

          <h2>5. Booking</h2>
          <p>
            Booking a call leads to an external scheduling service (Cal.com). Data entered there is
            processed by that provider under its own privacy policy; this site only passes a source
            identifier along with the click.
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

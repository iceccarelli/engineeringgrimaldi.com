import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import WaitlistForm from '@/components/WaitlistForm';
import { getDict } from '@/lib/dict';
import { isLang, langHref, pageAlternates, type Lang } from '@/lib/i18n';
import { CONNECT_MAILTO, PILOT_MAILTO, PILOT_SUBJECT, TEARDOWN_MAILTO, TEARDOWN_SUBJECT } from '@/lib/pilot';
import { CONTACT_EMAIL } from '@/lib/site';

/**
 * /connect — one address, two subject lines, one waitlist. No form that
 * pretends to be a CRM. The calendar link for the free bench review stays
 * on /book.
 */

type PageProps = { params: { lang: string } };

const COPY = {
  en: {
    title: 'Connect — one address, two subject lines',
    description: 'vincenzo@igrimaldi.engineering. Subject “Palletizer-30-day-pilot” for the pilot, “Packaging-teardown” for the €280 teardown of your SKU master. Waitlist for status changes.',
    kicker: 'Connect',
    h1: 'One address. Two subject lines.',
    lead: 'The subject line is the routing. Use it and the mail lands in the right queue the same day.',
    pilot: 'Book the 30-day pilot',
    pilotBody: 'Attach your SKU CSV (id, length, width, height, weight). You get a fixed-fee quote within one working day and a kill date to put on your calendar.',
    teardown: 'Packaging teardown — €280',
    teardownBody: '90 minutes on your SKU master and your current pallet patterns, written summary included. The same door for grids lives on igrimaldi.engineering/advisory.',
    plain: 'Anything else',
    bench: 'Prefer a calendar? The free 20-minute bench review is on /book.',
  },
  de: {
    title: 'Kontakt — eine Adresse, zwei Betreffzeilen',
    description: 'vincenzo@igrimaldi.engineering. Betreff „Palletizer-30-day-pilot“ für den Piloten, „Packaging-teardown“ für den 280-€-Teardown Ihres SKU-Stamms. Warteliste für Statusänderungen.',
    kicker: 'Kontakt',
    h1: 'Eine Adresse. Zwei Betreffzeilen.',
    lead: 'Die Betreffzeile ist das Routing. Verwenden Sie sie, und die Mail landet noch am selben Tag in der richtigen Warteschlange.',
    pilot: '30-Tage-Pilot anfragen',
    pilotBody: 'Hängen Sie Ihre SKU-CSV an (ID, Länge, Breite, Höhe, Gewicht). Sie erhalten innerhalb eines Werktags ein Festpreisangebot und ein Abbruchdatum für Ihren Kalender.',
    teardown: 'Verpackungs-Teardown — 280 €',
    teardownBody: '90 Minuten zu Ihrem SKU-Stamm und Ihren aktuellen Palettenmustern, schriftliche Zusammenfassung inklusive. Dieselbe Tür für Netze lebt auf igrimaldi.engineering/advisory.',
    plain: 'Alles andere',
    bench: 'Lieber ein Kalender? Das kostenlose 20-Minuten-Bench-Review steht auf /book.',
  },
} as const;

export function generateMetadata({ params }: PageProps): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const c = COPY[lang];
  return { title: c.title, description: c.description, alternates: pageAlternates(lang, '/connect') };
}

export default function ConnectPage({ params }: PageProps) {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const t = getDict(lang);
  const c = COPY[lang];

  return (
    <main>
      <div className="sheet sheet-top">
        <div className="section">
          <Breadcrumbs lang={lang} crumbs={[{ name: 'Grimaldi Engineering', path: '/' }, { name: c.kicker, path: '/connect' }]} />
          <span className="kicker">{c.kicker}</span>
          <h1>{c.h1}</h1>
          <p className="intro">{c.lead}</p>
          <p className="connect-address"><a className="mono" href={CONNECT_MAILTO}>{CONTACT_EMAIL}</a></p>

          <div className="grid">
            <a className="card card-link" href={PILOT_MAILTO} data-cta="pilot-mail">
              <span className="tag mono">{PILOT_SUBJECT}</span>
              <h3>{c.pilot}</h3>
              <p>{c.pilotBody}</p>
            </a>
            <a className="card card-link" href={TEARDOWN_MAILTO} data-cta="teardown-mail">
              <span className="tag mono">{TEARDOWN_SUBJECT}</span>
              <h3>{c.teardown}</h3>
              <p>{c.teardownBody}</p>
            </a>
            <div className="card">
              <span className="tag mono">—</span>
              <h3><a href={CONNECT_MAILTO}>{c.plain}</a></h3>
              <p>{c.bench} <a href={langHref(lang, '/book')}>/book →</a></p>
            </div>
          </div>

          <div className="banner banner-stack">
            <div>
              <h2>{t.wlTitle}</h2>
              <p>{t.wlBody}</p>
            </div>
            <WaitlistForm t={t} />
          </div>
          <p className="author-block">{t.authorLine}</p>
        </div>
      </div>
    </main>
  );
}

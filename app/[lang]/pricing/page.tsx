import type { Metadata } from 'next';
import BookCTA from '@/components/BookCTA';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getDict } from '@/lib/dict';
import { isLang, langHref, pageAlternates, type Lang } from '@/lib/i18n';
import { ogImages } from '@/lib/meta';
import { PILOT_MAILTO } from '@/lib/pilot';

type PageProps = { params: { lang: string } };

const COPY = {
  en: {
    title: 'Pricing — Rates and Engagements',
    description: 'Palletizer 30-day software pilot — fixed fee per CSV, kill date at week 0. Packaging teardown €280. Bench review €0. The grid retainer is sold on igrimaldi.engineering, not here. Calculators stay free.',
    h1: 'Pricing',
    lead: 'A plant manager should be able to price a pilot without reading a manifesto. So: the pilot first, the teardown second, the free bench review third. The calculators and reference data stay free — no account, no email, no usage limit.',
    freeH2: 'Free, permanently',
    freeBody: 'Six calculators and the reference tables. Everything runs in your browser, exports to CSV, and asks for nothing. They exist because a working instrument argues better than a brochure.',
    engagementsH2: 'Engagements',
    notesH2: 'How it works',
    notes: [
      'The pilot does not need a call first. Send the CSV with the subject line Palletizer-30-day-pilot and the quote comes back within one working day with a proposed kill date.',
      'Pilots and teardowns are invoiced from Frankfurt am Main. VAT is charged where applicable; the details are on the Impressum.',
      'The grid and traction-power advisory retainer is not sold on this domain. It lives on igrimaldi.engineering/advisory, with the €280 grid teardown next to it.',
    ],
    boundaryH2: 'What is not sold',
    boundary: 'No safety-function design, no certification, and no work that would require publishing employer or operator internals. Where a request crosses that line, the answer is a referral rather than a quote.',
    tiers: [
      { name: 'Palletizer 30-day pilot', price: 'Fixed fee', unit: 'quoted per CSV within one working day', body: 'Week 0 your CSV, week 2 density / stability report, week 4 go / no-go, kill date on your calendar from day one. Software only; no arm, no site visit, nothing invoiced past the kill date.' },
      { name: 'Packaging teardown', price: '€280', unit: '90 minutes', body: 'Your SKU master and current pallet patterns, worked through with the optimizer. Written summary included. Subject line: Packaging-teardown.' },
      { name: 'Bench review', price: '€0', unit: '20 minutes', body: 'Bring a SKU mix, a cell layout, or a CSV from any calculator here. No slides, engineering only.' },
      { name: 'Arm + integration', price: 'By quote', unit: 'only after a pilot go', body: 'One partner arm, integration days, quoted after week 4 says go. Never quoted from a brochure, never before the numbers.' },
    ],
  },
  de: {
    title: 'Preise — Sätze und Leistungen',
    description: 'Palletizer-30-Tage-Software-Pilot — Festpreis pro CSV, Abbruchdatum in Woche 0. Verpackungs-Teardown 280 €. Bench-Review 0 €. Der Netz-Retainer wird auf igrimaldi.engineering verkauft, nicht hier. Rechner bleiben kostenlos.',
    h1: 'Preise',
    lead: 'Ein Werksleiter sollte einen Piloten bepreisen können, ohne ein Manifest zu lesen. Also: erst der Pilot, dann der Teardown, dann das kostenlose Bench-Review. Die Rechner und Referenzdaten bleiben kostenlos — ohne Konto, ohne E-Mail, ohne Nutzungsgrenze.',
    freeH2: 'Dauerhaft kostenlos',
    freeBody: 'Sechs Rechner und die Referenztabellen. Alles läuft im Browser, geht als CSV heraus und verlangt nichts. Sie existieren, weil ein funktionierendes Instrument besser argumentiert als ein Prospekt.',
    engagementsH2: 'Leistungen',
    notesH2: 'Wie es abläuft',
    notes: [
      'Der Pilot braucht vorher kein Gespräch. Senden Sie die CSV mit dem Betreff Palletizer-30-day-pilot, und das Angebot kommt innerhalb eines Werktags mit einem vorgeschlagenen Abbruchdatum zurück.',
      'Piloten und Teardowns werden aus Frankfurt am Main abgerechnet. Umsatzsteuer wird berechnet, soweit anwendbar; Details im Impressum.',
      'Der Advisory-Retainer für Netze und Bahnstrom wird auf dieser Domain nicht verkauft. Er lebt auf igrimaldi.engineering/advisory, mit dem 280-€-Netz-Teardown daneben.',
    ],
    boundaryH2: 'Was nicht verkauft wird',
    boundary: 'Keine Auslegung von Sicherheitsfunktionen, keine Zertifizierung und keine Arbeit, die das Veröffentlichen von Arbeitgeber- oder Betreiber-Interna erfordern würde. Überschreitet eine Anfrage diese Linie, folgt eine Empfehlung statt eines Angebots.',
    tiers: [
      { name: 'Palletizer-30-Tage-Pilot', price: 'Festpreis', unit: 'pro CSV innerhalb eines Werktags angeboten', body: 'Woche 0 Ihre CSV, Woche 2 Dichte- / Stabilitätsbericht, Woche 4 Go / No-Go, Abbruchdatum ab Tag eins in Ihrem Kalender. Nur Software; kein Arm, kein Vor-Ort-Termin, nichts wird nach dem Abbruchdatum berechnet.' },
      { name: 'Verpackungs-Teardown', price: '280 €', unit: '90 Minuten', body: 'Ihr SKU-Stamm und Ihre aktuellen Palettenmuster, mit dem Optimierer durchgearbeitet. Schriftliche Zusammenfassung inklusive. Betreff: Packaging-teardown.' },
      { name: 'Bench-Review', price: '0 €', unit: '20 Minuten', body: 'Bringen Sie einen SKU-Mix, ein Zellenlayout oder eine CSV aus einem Rechner dieser Seite mit. Keine Folien, nur Engineering.' },
      { name: 'Arm + Integration', price: 'Nach Angebot', unit: 'erst nach einem Pilot-Go', body: 'Ein Partner-Arm, Integrationstage, angeboten, nachdem Woche 4 Go sagt. Nie aus einem Prospekt, nie vor den Zahlen.' },
    ],
  },
} as const;

export function generateMetadata({ params }: PageProps): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  return {
    title: COPY[lang].title,
    description: COPY[lang].description,
    alternates: pageAlternates(lang, '/pricing'),
    openGraph: { title: COPY[lang].title, description: COPY[lang].description, type: 'website', images: ogImages(COPY[lang].h1) },
    twitter: { card: 'summary_large_image', images: ogImages(COPY[lang].h1) },
  };
}

export default function PricingPage({ params }: PageProps) {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const t = getDict(lang);
  const copy = COPY[lang];

  return (
    <main>
      <div className="sheet sheet-top">
        <div className="section">
          <Breadcrumbs lang={lang} crumbs={[
            { name: 'Grimaldi Engineering', path: '/' },
            { name: copy.h1, path: '/pricing' },
          ]} />
          <h1>{copy.h1}</h1>
          <p className="intro">{copy.lead}</p>

          <h2 className="index-group-h">{copy.freeH2}</h2>
          <div className="tool-band tool-band-static">
            <p>{copy.freeBody}</p>
            <a className="cta" href={langHref(lang, '/tools')}>{t.open}</a>
          </div>

          <h2 className="index-group-h">{copy.engagementsH2}</h2>
          <div className="grid grid-4">
            {copy.tiers.map((tier) => (
              <div className="card price-card" key={tier.name}>
                <h3>{tier.name}</h3>
                <p className="price-figure">{tier.price}</p>
                <p className="price-unit">{tier.unit}</p>
                <p>{tier.body}</p>
              </div>
            ))}
          </div>

          <div className="prose">
            <h2>{copy.notesH2}</h2>
            {copy.notes.map((n) => <p key={n.slice(0, 40)}>{n}</p>)}
            <h2>{copy.boundaryH2}</h2>
            <p className="boundary-note">{copy.boundary}</p>
          </div>

          <div className="cta-row">
            <a className="btn btn-glow" href={PILOT_MAILTO} data-cta="pilot-mail">{lang === 'de' ? '30-Tage-Pilot anfragen' : 'Book the 30-day pilot'}</a>
            <BookCTA label={t.ctaBook} variant="line" />
            <a className="btn btn-line" href={langHref(lang, '/solutions')}>
              {lang === 'de' ? 'Lösungen ansehen →' : 'See solutions →'}
            </a>
          </div>

          <p className="author-block">{t.authorLine}</p>
        </div>
      </div>
    </main>
  );
}

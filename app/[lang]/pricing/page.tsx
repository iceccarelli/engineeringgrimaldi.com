import type { Metadata } from 'next';
import BookCTA from '@/components/BookCTA';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getDict } from '@/lib/dict';
import { isLang, langHref, pageAlternates, type Lang } from '@/lib/i18n';
import { ogImages } from '@/lib/meta';

type PageProps = { params: { lang: string } };

const COPY = {
  en: {
    title: 'Pricing — Rates and Engagements',
    description: 'Bench review €0, deep-dive session €280, advisory retainer €3,200/mo, Forge integration by quote. Free calculators stay free. Prices stated before you ask.',
    h1: 'Pricing',
    lead: 'Stated openly, because being asked for a rate card is not a qualification step. The calculators and reference data on this site are free and stay free — no account, no email, no usage limit.',
    freeH2: 'Free, permanently',
    freeBody: 'Six calculators and the reference tables. Everything runs in your browser, exports to CSV, and asks for nothing. They exist because a working instrument argues better than a brochure.',
    engagementsH2: 'Engagements',
    notesH2: 'How it works',
    notes: [
      'Every engagement starts with the free bench review. Twenty minutes is usually enough to tell whether the problem is one I can help with, and if it is not, I will say so on that call.',
      'Sessions and retainers are invoiced from Frankfurt am Main. VAT is charged where applicable; the details are on the Impressum.',
      'Integration work is scoped only after the fit is proven on your own data. No integration is quoted from a brochure.',
    ],
    boundaryH2: 'What is not sold',
    boundary: 'No safety-function design, no certification, and no work that would require publishing employer or operator internals. Where a request crosses that line, the answer is a referral rather than a quote.',
    tiers: [
      { name: 'Bench review', price: '€0', unit: '20 minutes', body: 'Bring a cell layout, a scope trace, a SKU mix or a CSV from any calculator here. No slides, engineering only.' },
      { name: 'Deep-dive session', price: '€280', unit: '90 minutes', body: 'One specific problem worked through: axis and drive sizing, machine selection, pack and BMS architecture, palletizing cell design, HV questions. Written summary included.' },
      { name: 'Advisory retainer', price: '€3,200', unit: 'per month', body: 'Ongoing advisory across drives, machines, battery systems and grid: weekly call, asynchronous review, priority access. Scope stays on public, generic ground.' },
      { name: 'Forge integration', price: 'By quote', unit: 'scoped per project', body: 'Palletizer or Forge tooling adapted to your line, quoted after a bench review has proven the fit.' },
    ],
  },
  de: {
    title: 'Preise — Sätze und Leistungen',
    description: 'Bench-Review 0 €, Deep-Dive-Session 280 €, Advisory-Retainer 3.200 €/Monat, Forge-Integration nach Angebot. Kostenlose Rechner bleiben kostenlos. Preise genannt, bevor Sie fragen.',
    h1: 'Preise',
    lead: 'Offen genannt, denn nach einem Satz zu fragen ist kein Qualifizierungsschritt. Die Rechner und Referenzdaten dieser Seite sind kostenlos und bleiben es — ohne Konto, ohne E-Mail, ohne Nutzungsgrenze.',
    freeH2: 'Dauerhaft kostenlos',
    freeBody: 'Sechs Rechner und die Referenztabellen. Alles läuft im Browser, geht als CSV heraus und verlangt nichts. Sie existieren, weil ein funktionierendes Instrument besser argumentiert als ein Prospekt.',
    engagementsH2: 'Leistungen',
    notesH2: 'Wie es abläuft',
    notes: [
      'Jede Zusammenarbeit beginnt mit dem kostenlosen Bench-Review. Zwanzig Minuten genügen meist, um zu klären, ob ich beim Problem helfen kann — und wenn nicht, sage ich das in diesem Gespräch.',
      'Sessions und Retainer werden aus Frankfurt am Main abgerechnet. Umsatzsteuer wird berechnet, soweit anwendbar; Details im Impressum.',
      'Integrationsarbeit wird erst gescopet, wenn der Fit an Ihren eigenen Daten belegt ist. Keine Integration wird aus einem Prospekt angeboten.',
    ],
    boundaryH2: 'Was nicht verkauft wird',
    boundary: 'Keine Auslegung von Sicherheitsfunktionen, keine Zertifizierung und keine Arbeit, die das Veröffentlichen von Arbeitgeber- oder Betreiber-Interna erfordern würde. Überschreitet eine Anfrage diese Linie, folgt eine Empfehlung statt eines Angebots.',
    tiers: [
      { name: 'Bench-Review', price: '0 €', unit: '20 Minuten', body: 'Bringen Sie ein Zellenlayout, eine Scope-Aufnahme, einen SKU-Mix oder eine CSV aus einem Rechner dieser Seite mit. Keine Folien, nur Engineering.' },
      { name: 'Deep-Dive-Session', price: '280 €', unit: '90 Minuten', body: 'Ein konkretes Problem durchgearbeitet: Achsen- und Antriebsauslegung, Maschinenauswahl, Pack- und BMS-Architektur, Palettierzellen-Design, HV-Fragen. Schriftliche Zusammenfassung inklusive.' },
      { name: 'Advisory-Retainer', price: '3.200 €', unit: 'pro Monat', body: 'Laufende Beratung zu Antrieben, Maschinen, Batteriesystemen und Netz: wöchentlicher Call, asynchrone Reviews, priorisierter Zugang. Die Themen bleiben auf öffentlichem, generischem Terrain.' },
      { name: 'Forge-Integration', price: 'Nach Angebot', unit: 'pro Projekt gescopet', body: 'Palletizer oder Forge-Tooling, angepasst an Ihre Linie — angeboten, nachdem ein Bench-Review den Fit belegt hat.' },
    ],
  },
} as const;

export function generateMetadata({ params }: PageProps): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  return {
    title: COPY[lang].title,
    description: COPY[lang].description,
    alternates: pageAlternates(lang, '/pricing'),
    robots: { index: false, follow: true },
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
            <BookCTA label={t.ctaBook} lang={lang} />
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

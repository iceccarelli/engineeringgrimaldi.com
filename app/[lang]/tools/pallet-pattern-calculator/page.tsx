import type { Metadata } from 'next';
import BookCTA from '@/components/BookCTA';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import PatternCalculator, { type CalculatorLabels } from '@/components/PatternCalculator';
import { getDict } from '@/lib/dict';
import { isLang, langHref, pageAlternates, type Lang } from '@/lib/i18n';
import { ogImages } from '@/lib/meta';
import { SITE_URL } from '@/lib/site';

/**
 * Free pallet pattern calculator — the demand asset for ICP A.
 *
 * Server component: the explanation, the method and the FAQ are
 * server-rendered so the page ranks with zero JavaScript. Only the
 * calculator itself is a client island. Nothing is gated: an engineer
 * gets the full answer and the CSV without surrendering an email —
 * a calculator behind a form ranks worse and converts worse.
 */

type PageProps = { params: { lang: string } };

const PATH = '/tools/pallet-pattern-calculator';

const META = {
  en: {
    title: 'Pallet Pattern Calculator — Mixed-SKU Layer Optimizer',
    description:
      'Free pallet pattern calculator: enter case and pallet dimensions, get cases per layer, layer count, cube utilisation and a downloadable pattern sheet. Column, two-block and four-block layouts on EUR, ISO and 48×40 decks.',
  },
  de: {
    title: 'Palettenmuster-Rechner — Lagenoptimierung für Misch-SKU',
    description:
      'Kostenloser Palettenmuster-Rechner: Kartons- und Palettenmaße eingeben, Kartons pro Lage, Lagenzahl, Raumnutzung und ein Muster-Datenblatt zum Download erhalten. Säulen-, Zwei-Block- und Vier-Block-Muster auf EUR-, ISO- und 48×40-Paletten.',
  },
} as const;

export function generateMetadata({ params }: PageProps): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  return {
    title: META[lang].title,
    description: META[lang].description,
    alternates: pageAlternates(lang, PATH),
    openGraph: {
      title: `${META[lang].title} | Grimaldi Engineering`,
      description: META[lang].description,
      type: 'website',
      images: ogImages(META[lang].title),
    },
    twitter: { card: 'summary_large_image', images: ogImages(META[lang].title) },
  };
}

const LABELS: Record<Lang, CalculatorLabels> = {
  en: {
    palletLegend: 'Pallet & load limits',
    preset: 'Pallet',
    custom: 'Custom',
    palletLength: 'Pallet length',
    palletWidth: 'Pallet width',
    deckHeight: 'Deck height',
    maxHeight: 'Max total height (incl. pallet)',
    maxWeight: 'Max payload',
    boxLegend: 'Case',
    boxLength: 'Case length',
    boxWidth: 'Case width',
    boxHeight: 'Case height',
    boxWeight: 'Case weight',
    resultsLegend: 'Result',
    casesPerLayer: 'Cases per layer',
    layers: 'Layers',
    totalCases: 'Cases per pallet',
    areaUtil: 'Deck area used',
    cubeUtil: 'Cube utilisation',
    loadHeight: 'Load height',
    loadWeight: 'Load weight',
    limitedBy: 'Limited by',
    limitHeight: 'Height',
    limitWeight: 'Weight',
    limitBoth: 'Height and weight',
    patternColumn: 'Column pattern',
    patternTwoBlock: 'Two-block pattern',
    patternFourBlock: 'Four-block pattern',
    interlocked: 'interlocked (mixed orientation)',
    uniform: 'uniform orientation',
    alternatives: 'Alternative layouts',
    perLayerShort: 'per layer',
    errBoxTooLarge: 'This case does not fit on the deck in either orientation. Check the dimensions.',
    errNoVerticalRoom: 'No complete layer fits inside the height or weight limit. Raise the limit or reduce the case.',
    errInvalid: 'Every dimension must be a positive number.',
    downloadCsv: 'Download pattern sheet (CSV)',
    planView: 'Layer plan view — top down',
    disclaimer:
      'Geometry only. This is a layer-pattern and cube calculation, not a load-stability, crush-strength or transport-safety certification. Validate any pattern against your own stacking, wrapping and compression standards before running it on a line.',
  },
  de: {
    palletLegend: 'Palette & Lastgrenzen',
    preset: 'Palette',
    custom: 'Benutzerdefiniert',
    palletLength: 'Palettenlänge',
    palletWidth: 'Palettenbreite',
    deckHeight: 'Palettenhöhe',
    maxHeight: 'Max. Gesamthöhe (inkl. Palette)',
    maxWeight: 'Max. Nutzlast',
    boxLegend: 'Karton',
    boxLength: 'Kartonlänge',
    boxWidth: 'Kartonbreite',
    boxHeight: 'Kartonhöhe',
    boxWeight: 'Kartongewicht',
    resultsLegend: 'Ergebnis',
    casesPerLayer: 'Kartons pro Lage',
    layers: 'Lagen',
    totalCases: 'Kartons pro Palette',
    areaUtil: 'Genutzte Deckfläche',
    cubeUtil: 'Raumnutzung',
    loadHeight: 'Ladehöhe',
    loadWeight: 'Ladegewicht',
    limitedBy: 'Begrenzt durch',
    limitHeight: 'Höhe',
    limitWeight: 'Gewicht',
    limitBoth: 'Höhe und Gewicht',
    patternColumn: 'Säulenmuster',
    patternTwoBlock: 'Zwei-Block-Muster',
    patternFourBlock: 'Vier-Block-Muster',
    interlocked: 'verzahnt (gemischte Ausrichtung)',
    uniform: 'einheitliche Ausrichtung',
    alternatives: 'Alternative Muster',
    perLayerShort: 'pro Lage',
    errBoxTooLarge: 'Dieser Karton passt in keiner Ausrichtung auf die Palette. Bitte Maße prüfen.',
    errNoVerticalRoom: 'Keine vollständige Lage passt in die Höhen- oder Gewichtsgrenze. Grenze erhöhen oder Karton verkleinern.',
    errInvalid: 'Alle Maße müssen positive Zahlen sein.',
    downloadCsv: 'Muster-Datenblatt herunterladen (CSV)',
    planView: 'Lagenmuster — Draufsicht',
    disclaimer:
      'Nur Geometrie. Dies ist eine Lagenmuster- und Raumberechnung, keine Zertifizierung von Ladungssicherheit, Stauchdruckfestigkeit oder Transportsicherheit. Prüfen Sie jedes Muster gegen Ihre eigenen Stapel-, Wickel- und Kompressionsstandards, bevor es auf einer Linie läuft.',
  },
};

const FAQS: Record<Lang, { q: string; a: string }[]> = {
  en: [
    {
      q: 'How does the calculator choose a layer pattern?',
      a: 'It enumerates three families of layouts — uniform column, two-block split and four-block (quadrant) split — in both case orientations, then ranks every candidate by cases per layer. Ties go to the interlocked layout, because mixed orientations bind courses together better than pure column stacking.',
    },
    {
      q: 'Is this a load-stability calculation?',
      a: 'No. It computes geometry: footprint fit, layer count, deck-area and cube utilisation. Crush strength, load stability, wrapping and transport safety are separate engineering questions and remain yours to verify.',
    },
    {
      q: 'Which pallets are supported?',
      a: 'EUR/EPAL 1 (1200 × 800), EUR 2 (1200 × 1000), the North American 1219 × 1016 (48" × 40") deck, and the half/Düsseldorf 800 × 600 — plus any custom deck you type in.',
    },
    {
      q: 'Does anything leave my browser?',
      a: 'No. The whole calculation runs client-side. Your case dimensions are never sent to a server, and the CSV is generated in the browser.',
    },
    {
      q: 'How does this relate to Palletizer OS?',
      a: 'This calculator solves a single-SKU layer pattern. Palletizer OS is the wider open codebase for mixed-SKU end-of-line cells — pattern generation plus cell orchestration over a vendor-neutral driver interface.',
    },
  ],
  de: [
    {
      q: 'Wie wählt der Rechner ein Lagenmuster?',
      a: 'Er zählt drei Muster-Familien auf — einheitliche Säule, Zwei-Block-Teilung und Vier-Block-Teilung (Quadranten) — in beiden Kartonausrichtungen und bewertet jeden Kandidaten nach Kartons pro Lage. Bei Gleichstand gewinnt das verzahnte Muster, weil gemischte Ausrichtungen die Lagen besser binden als reine Säulenstapelung.',
    },
    {
      q: 'Ist das eine Ladungssicherheitsberechnung?',
      a: 'Nein. Berechnet wird Geometrie: Grundflächenpassung, Lagenzahl, Deckflächen- und Raumnutzung. Stauchdruckfestigkeit, Ladungssicherheit, Wickeln und Transportsicherheit sind eigene Ingenieursfragen und bleiben in Ihrer Verantwortung.',
    },
    {
      q: 'Welche Paletten werden unterstützt?',
      a: 'EUR/EPAL 1 (1200 × 800), EUR 2 (1200 × 1000), die nordamerikanische 1219 × 1016 (48" × 40") sowie die Halb-/Düsseldorfer Palette 800 × 600 — dazu jedes selbst eingegebene Maß.',
    },
    {
      q: 'Verlassen Daten meinen Browser?',
      a: 'Nein. Die gesamte Berechnung läuft clientseitig. Ihre Kartonmaße werden nie an einen Server gesendet, und die CSV-Datei entsteht im Browser.',
    },
    {
      q: 'Wie hängt das mit Palletizer OS zusammen?',
      a: 'Dieser Rechner löst ein Einzel-SKU-Lagenmuster. Palletizer OS ist die umfassendere offene Codebasis für Misch-SKU-End-of-Line-Zellen — Mustererzeugung plus Zellen-Orchestrierung über eine herstellerneutrale Treiber-Schnittstelle.',
    },
  ],
};

const BODY: Record<Lang, { kicker: string; h1: string; lead: string; methodH2: string; method: string[]; faqH2: string; ctaH2: string; ctaBody: string; productLink: string }> = {
  en: {
    kicker: 'Free tool · Palletizing',
    h1: 'Pallet pattern calculator',
    lead: 'Enter a case and a deck. Get cases per layer, layer count, cube utilisation and a downloadable pattern sheet — computed in your browser, nothing sent anywhere.',
    methodH2: 'How the numbers are produced',
    method: [
      'The solver enumerates three layout families in both case orientations: uniform column packing, a two-block split along either pallet axis, and a four-block quadrant split that subsumes pinwheel-style layouts. Each candidate is a concrete set of placements, not an estimate.',
      'Candidates are ranked by cases per layer. Ties are broken toward interlocked layers — layouts mixing both orientations — because they bind courses together better than pure column stacks.',
      'Layer count is then bounded twice: by usable height (max total height minus deck height, divided by case height) and by payload (max payload divided by the mass of one layer). The smaller bound wins, and the result tells you which one bit.',
    ],
    faqH2: 'Questions',
    ctaH2: 'Bring the pattern to a bench review',
    ctaBody:
      'If the cube utilisation on your real SKU mix is worse than this single-SKU number suggests, that gap is where mixed-SKU software pays for itself. Twenty minutes, no slides — bring the CSV.',
    productLink: 'See Palletizer OS →',
  },
  de: {
    kicker: 'Kostenloses Werkzeug · Palettieren',
    h1: 'Palettenmuster-Rechner',
    lead: 'Karton und Palette eingeben. Kartons pro Lage, Lagenzahl, Raumnutzung und ein Muster-Datenblatt zum Download — im Browser berechnet, nichts wird übertragen.',
    methodH2: 'Wie die Zahlen entstehen',
    method: [
      'Der Löser zählt drei Muster-Familien in beiden Kartonausrichtungen auf: einheitliche Säulenpackung, eine Zwei-Block-Teilung entlang beider Palettenachsen und eine Vier-Block-Quadrantenteilung, die auch Pinwheel-artige Muster abdeckt. Jeder Kandidat ist eine konkrete Menge von Positionen, keine Schätzung.',
      'Kandidaten werden nach Kartons pro Lage bewertet. Bei Gleichstand gewinnt die verzahnte Lage — Muster mit beiden Ausrichtungen — weil sie die Lagen besser bindet als reine Säulenstapel.',
      'Die Lagenzahl wird dann zweifach begrenzt: durch die nutzbare Höhe (Gesamthöhe minus Palettenhöhe, geteilt durch die Kartonhöhe) und durch die Nutzlast (max. Nutzlast geteilt durch die Masse einer Lage). Die kleinere Grenze gewinnt, und das Ergebnis nennt die bindende Grenze.',
    ],
    faqH2: 'Fragen',
    ctaH2: 'Bringen Sie das Muster in ein Bench-Review',
    ctaBody:
      'Wenn die Raumnutzung bei Ihrem echten SKU-Mix schlechter ausfällt als dieser Einzel-SKU-Wert nahelegt, ist genau diese Lücke der Punkt, an dem sich Misch-SKU-Software rechnet. Zwanzig Minuten, keine Folien — bringen Sie die CSV mit.',
    productLink: 'Palletizer OS ansehen →',
  },
};

export default function PatternCalculatorPage({ params }: PageProps) {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const t = getDict(lang);
  const copy = BODY[lang];
  const faqs = FAQS[lang];

  return (
    <main>
      <div className="sheet sheet-top">
        <div className="section">
          <Breadcrumbs lang={lang} crumbs={[
            { name: 'Grimaldi Engineering', path: '/' },
            { name: lang === 'de' ? 'Werkzeuge' : 'Tools', path: '/tools' },
            { name: copy.h1, path: PATH },
          ]} />
          <span className="kicker">{copy.kicker}</span>
          <h1>{copy.h1}</h1>
          <p className="intro">{copy.lead}</p>

          <PatternCalculator labels={LABELS[lang]} lang={lang} />

          {/* Server-rendered method + FAQ: the page ranks with JS off. */}
          <div className="prose">
            <h2>{copy.methodH2}</h2>
            {copy.method.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}

            <h2>{copy.faqH2}</h2>
            {faqs.map((f) => (
              <div key={f.q}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}

            <h2>{copy.ctaH2}</h2>
            <p>{copy.ctaBody}</p>
          </div>

          <div className="cta-row">
            <BookCTA label={t.ctaBook} />
            <a className="btn btn-line" href={langHref(lang, '/tools/case-size-optimizer')}>
              {lang === 'de' ? 'Kartongrößen-Optimierer →' : 'Case size optimizer →'}
            </a>
            <a className="btn btn-line" href={langHref(lang, '/tools/truck-load-calculator')}>
              {lang === 'de' ? 'Lkw-/Container-Laderechner →' : 'Truck & container load calculator →'}
            </a>
            <a className="btn btn-line" href={langHref(lang, '/palletizer')}>{copy.productLink}</a>
          </div>

          <p className="author-block">{t.authorLine}</p>
        </div>
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          '@id': `${SITE_URL}${PATH}#tool`,
          name: META[lang].title,
          url: `${SITE_URL}${langHref(lang, PATH)}`,
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          description: META[lang].description,
          author: { '@id': `${SITE_URL}/#person` },
          isAccessibleForFree: true,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          '@id': `${SITE_URL}${PATH}#faq`,
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }}
      />
    </main>
  );
}

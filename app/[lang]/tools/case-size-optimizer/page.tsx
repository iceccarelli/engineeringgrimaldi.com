import type { Metadata } from 'next';
import BookCTA from '@/components/BookCTA';
import Breadcrumbs from '@/components/Breadcrumbs';
import CaseOptimizer, { type OptimizerLabels } from '@/components/CaseOptimizer';
import JsonLd from '@/components/JsonLd';
import { getDict } from '@/lib/dict';
import { isLang, langHref, pageAlternates, type Lang } from '@/lib/i18n';
import { ogImages } from '@/lib/meta';
import { SITE_URL } from '@/lib/site';

/**
 * The differentiated tool: not "how does my case pack?" but "which case
 * size should I have ordered?". Case dimensions are decided once and
 * paid for on every pallet for years, which is why this is the question
 * with money attached.
 */

type PageProps = { params: { lang: string } };

const PATH = '/tools/case-size-optimizer';

const META = {
  en: {
    title: 'Case Size Optimizer — Find the Carton That Fills the Pallet',
    description:
      'Free case size optimizer: sweep thousands of carton dimensions against your pallet and load limits, ranked by cube utilisation, with the gain over your current case shown in percentage points. Runs in your browser.',
  },
  de: {
    title: 'Kartongrößen-Optimierer — die Schachtel finden, die die Palette füllt',
    description:
      'Kostenloser Kartongrößen-Optimierer: Tausende Kartonmaße gegen Palette und Lastgrenzen durchrechnen, nach Raumnutzung sortiert, mit dem Gewinn gegenüber Ihrem aktuellen Karton in Prozentpunkten. Läuft im Browser.',
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

const LABELS: Record<Lang, OptimizerLabels> = {
  en: {
    palletLegend: 'Pallet & load limits',
    preset: 'Pallet',
    custom: 'Custom',
    palletLength: 'Pallet length',
    palletWidth: 'Pallet width',
    deckHeight: 'Deck height',
    maxHeight: 'Max total height',
    maxWeight: 'Max payload',
    currentLegend: 'Your current case',
    curLength: 'Length',
    curWidth: 'Width',
    curHeight: 'Height',
    curWeight: 'Weight',
    rangeLegend: 'Sizes you could order',
    minLength: 'Length from',
    maxLength: 'Length to',
    minWidth: 'Width from',
    maxWidth: 'Width to',
    minHeight: 'Height from',
    maxHeight2: 'Height to',
    step: 'Grid step',
    resultsLegend: 'Best cases in your range',
    yourCase: '(yours)',
    headerCase: 'Case L × W × H',
    headerPerLayer: 'Per layer',
    headerLayers: 'Layers',
    headerTotal: 'Per pallet',
    headerCube: 'Cube',
    headerDelta: 'Δ points',
    gainHeadline: 'Best case in range gains {points} percentage points of cube utilisation over yours.',
    gainNone: 'Your current case is already the best in the range you specified.',
    evaluated: '{n} candidate sizes evaluated',
    coarsened: 'grid widened to {step} mm to keep the sweep responsive',
    errInvalidRange: 'Each "from" value must be less than or equal to its "to" value.',
    errNothingFits: 'No case in this range produces a complete layer inside your height and weight limits.',
    errInvalid: 'Every dimension must be a positive number.',
    downloadCsv: 'Download candidates (CSV)',
    disclaimer:
      'Geometry only, and the ranking assumes every size in your range physically suits the product — that judgement is yours. Candidate mass is scaled from your current case density. Tooling, artwork, retail-shelf fit, board grade and case-count-per-case are real costs and are NOT modelled. Treat the output as a shortlist to evaluate, never as a purchase decision.',
  },
  de: {
    palletLegend: 'Palette & Lastgrenzen',
    preset: 'Palette',
    custom: 'Benutzerdefiniert',
    palletLength: 'Palettenlänge',
    palletWidth: 'Palettenbreite',
    deckHeight: 'Palettenhöhe',
    maxHeight: 'Max. Gesamthöhe',
    maxWeight: 'Max. Nutzlast',
    currentLegend: 'Ihr aktueller Karton',
    curLength: 'Länge',
    curWidth: 'Breite',
    curHeight: 'Höhe',
    curWeight: 'Gewicht',
    rangeLegend: 'Bestellbare Maße',
    minLength: 'Länge von',
    maxLength: 'Länge bis',
    minWidth: 'Breite von',
    maxWidth: 'Breite bis',
    minHeight: 'Höhe von',
    maxHeight2: 'Höhe bis',
    step: 'Rasterschritt',
    resultsLegend: 'Beste Kartons im Bereich',
    yourCase: '(Ihrer)',
    headerCase: 'Karton L × B × H',
    headerPerLayer: 'Pro Lage',
    headerLayers: 'Lagen',
    headerTotal: 'Pro Palette',
    headerCube: 'Raum',
    headerDelta: 'Δ Punkte',
    gainHeadline: 'Der beste Karton im Bereich gewinnt {points} Prozentpunkte Raumnutzung gegenüber Ihrem.',
    gainNone: 'Ihr aktueller Karton ist im angegebenen Bereich bereits der beste.',
    evaluated: '{n} Kandidatenmaße berechnet',
    coarsened: 'Raster auf {step} mm erweitert, damit die Berechnung flüssig bleibt',
    errInvalidRange: 'Jeder „von“-Wert muss kleiner oder gleich dem „bis“-Wert sein.',
    errNothingFits: 'Kein Karton in diesem Bereich ergibt eine vollständige Lage innerhalb Ihrer Höhen- und Gewichtsgrenzen.',
    errInvalid: 'Alle Maße müssen positive Zahlen sein.',
    downloadCsv: 'Kandidaten herunterladen (CSV)',
    disclaimer:
      'Nur Geometrie, und die Rangfolge unterstellt, dass jedes Maß im Bereich physisch zum Produkt passt — diese Beurteilung liegt bei Ihnen. Die Kandidatenmasse wird aus der Dichte Ihres aktuellen Kartons skaliert. Werkzeuge, Druckbild, Regalmaße, Wellpappensorte und Stückzahl je Karton sind reale Kosten und werden NICHT modelliert. Behandeln Sie das Ergebnis als zu prüfende Vorauswahl, nie als Beschaffungsentscheidung.',
  },
};

const FAQS: Record<Lang, { q: string; a: string }[]> = {
  en: [
    {
      q: 'Why rank by cube utilisation instead of cases per pallet?',
      a: 'Because ranking by cases per pallet rewards shrinking the box, which ships less product per pallet — the opposite of what you want. Cube utilisation measures how much of the usable pallet volume your cases actually occupy, so a higher figure means more product per pallet, per truck and per shipment.',
    },
    {
      q: 'How can a 20 mm change matter?',
      a: 'Because layer count is a floor division. A case 250 mm tall gives six layers under a 1,656 mm usable height and leaves 156 mm of paid-for air; at 270 mm the same six layers fill 1,620 mm. Nothing else changed, and the pallet carries meaningfully more product.',
    },
    {
      q: 'Does it know whether my product fits the new case?',
      a: 'No, and it does not pretend to. You set the dimension range, which is where product fit, count-per-case and shelf constraints belong. Inside that range the tool ranks geometry — the shortlist is yours to evaluate.',
    },
    {
      q: 'What about tooling and artwork costs?',
      a: 'Not modelled, deliberately. A case change carries die, plate, artwork and qualification costs that only you can price. This tool tells you the size of the prize; whether it clears your changeover cost is a separate calculation.',
    },
    {
      q: 'How many sizes does it actually try?',
      a: 'Every combination on your grid — typically several thousand — using a count-only packing routine that agrees exactly with the full layer solver. The sweep runs in your browser in milliseconds, and no dimension you type is ever transmitted.',
    },
  ],
  de: [
    {
      q: 'Warum nach Raumnutzung statt nach Kartons pro Palette sortieren?',
      a: 'Weil eine Sortierung nach Kartons pro Palette das Verkleinern der Schachtel belohnt — und damit weniger Produkt pro Palette versendet. Die Raumnutzung misst, wie viel des nutzbaren Palettenvolumens Ihre Kartons tatsächlich einnehmen: mehr Prozent bedeuten mehr Produkt pro Palette, pro Lkw und pro Sendung.',
    },
    {
      q: 'Wie können 20 mm einen Unterschied machen?',
      a: 'Weil die Lagenzahl eine Abrundung ist. Ein 250 mm hoher Karton ergibt bei 1.656 mm nutzbarer Höhe sechs Lagen und lässt 156 mm bezahlte Luft übrig; bei 270 mm füllen dieselben sechs Lagen 1.620 mm. Sonst ändert sich nichts, und die Palette trägt spürbar mehr Produkt.',
    },
    {
      q: 'Weiß das Werkzeug, ob mein Produkt in den neuen Karton passt?',
      a: 'Nein, und es tut auch nicht so. Sie legen den Maßbereich fest — dort gehören Produktpassung, Stückzahl je Karton und Regalvorgaben hin. Innerhalb dieses Bereichs bewertet das Werkzeug Geometrie; die Vorauswahl prüfen Sie.',
    },
    {
      q: 'Und Werkzeug- und Druckkosten?',
      a: 'Bewusst nicht modelliert. Ein Kartonwechsel bringt Stanz-, Klischee-, Druckbild- und Qualifizierungskosten mit sich, die nur Sie beziffern können. Dieses Werkzeug nennt die Größe des Gewinns; ob er Ihre Umstellungskosten übersteigt, ist eine eigene Rechnung.',
    },
    {
      q: 'Wie viele Maße werden tatsächlich geprüft?',
      a: 'Jede Kombination Ihres Rasters — typischerweise mehrere Tausend — mit einer reinen Zählroutine, die exakt mit dem vollständigen Lagenlöser übereinstimmt. Der Durchlauf dauert im Browser Millisekunden, und kein eingegebenes Maß wird übertragen.',
    },
  ],
};

const BODY: Record<Lang, { kicker: string; h1: string; lead: string; whyH2: string; why: string[]; faqH2: string; ctaH2: string; ctaBody: string; toolLink: string }> = {
  en: {
    kicker: 'Free tool · Packaging design',
    h1: 'Case size optimizer',
    lead: 'Your case dimensions were chosen once and are paid for on every pallet since. This sweeps the sizes you could order and shows what the best one is worth, in percentage points of pallet cube.',
    whyH2: 'Why this is the expensive decision',
    why: [
      'A pallet pattern is a consequence, not a choice. By the time a carton spec is signed off, the cases per layer, the layer count and the air you ship are all already determined — and they repeat on every pallet, in every truck, for the life of the SKU.',
      'The arithmetic is unforgiving in a useful way: layer count is a floor division of usable height by case height, so a case a few millimetres too tall throws away an entire layer, and a case slightly too short leaves a band of paid-for air under the stretch wrap. Neither shows up on a spec sheet.',
      'The sweep evaluates every size on your grid with a count-only packing routine that agrees exactly with the full layer solver, then ranks by cube utilisation and breaks ties toward the least disruptive change — so the top row is usually a carton you could order tomorrow, not a redesign.',
    ],
    faqH2: 'Questions',
    ctaH2: 'Worth a bench review',
    ctaBody:
      'If the sweep shows several points of cube sitting on the table, the next questions are whether your product tolerates the change, what the tooling costs, and whether a mixed-SKU line can hold the new pattern. Twenty minutes, no slides — bring the CSV.',
    toolLink: 'Check the pattern for one case →',
  },
  de: {
    kicker: 'Kostenloses Werkzeug · Verpackungsdesign',
    h1: 'Kartongrößen-Optimierer',
    lead: 'Ihre Kartonmaße wurden einmal festgelegt und werden seither auf jeder Palette bezahlt. Dieses Werkzeug durchsucht die bestellbaren Maße und zeigt, was das beste wert ist — in Prozentpunkten Palettenraum.',
    whyH2: 'Warum das die teure Entscheidung ist',
    why: [
      'Ein Palettenmuster ist eine Folge, keine Wahl. Sobald eine Kartonspezifikation freigegeben ist, stehen Kartons pro Lage, Lagenzahl und die mitversendete Luft bereits fest — und sie wiederholen sich auf jeder Palette, in jedem Lkw, über die gesamte Laufzeit des Artikels.',
      'Die Arithmetik ist auf nützliche Weise unerbittlich: Die Lagenzahl ist eine Abrundung der nutzbaren Höhe durch die Kartonhöhe. Ein paar Millimeter zu hoch kostet eine ganze Lage; etwas zu niedrig lässt ein Band bezahlter Luft unter der Stretchfolie. Beides steht auf keinem Datenblatt.',
      'Der Durchlauf bewertet jedes Maß Ihres Rasters mit einer reinen Zählroutine, die exakt mit dem vollständigen Lagenlöser übereinstimmt, sortiert nach Raumnutzung und entscheidet Gleichstände zugunsten der kleinsten Änderung — die oberste Zeile ist deshalb meist ein Karton, den Sie morgen bestellen könnten, keine Neukonstruktion.',
    ],
    faqH2: 'Fragen',
    ctaH2: 'Ein Bench-Review wert',
    ctaBody:
      'Wenn der Durchlauf mehrere Prozentpunkte Raum offenlegt, lauten die nächsten Fragen: Verträgt das Produkt die Änderung, was kosten die Werkzeuge, und hält eine Misch-SKU-Linie das neue Muster? Zwanzig Minuten, keine Folien — bringen Sie die CSV mit.',
    toolLink: 'Muster für einen Karton prüfen →',
  },
};

export default function CaseOptimizerPage({ params }: PageProps) {
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

          <CaseOptimizer labels={LABELS[lang]} lang={lang} />

          <div className="prose">
            <h2>{copy.whyH2}</h2>
            {copy.why.map((paragraph) => <p key={paragraph.slice(0, 40)}>{paragraph}</p>)}

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
            <a className="btn btn-line" href={langHref(lang, '/tools/pallet-pattern-calculator')}>{copy.toolLink}</a>
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

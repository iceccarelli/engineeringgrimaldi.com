import type { Metadata } from 'next';
import BookCTA from '@/components/BookCTA';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import TruckLoadCalculator, { type LoadLabels } from '@/components/TruckLoadCalculator';
import { getDict } from '@/lib/dict';
import { isLang, langHref, pageAlternates, type Lang } from '@/lib/i18n';
import { ogImages } from '@/lib/meta';
import { SITE_URL } from '@/lib/site';

/**
 * How many pallets fit a trailer or container — the second half of the
 * case → pallet → vehicle chain. Server-rendered method and FAQ; only
 * the instrument hydrates.
 */

type PageProps = { params: { lang: string } };

const PATH = '/tools/truck-load-calculator';

const META = {
  en: {
    title: 'Truck & Container Load Calculator — Pallets per Vehicle',
    description:
      'Free load calculator: how many pallets fit a 13.6 m curtainsider, 20 ft or 40 ft container. Floor spots, double-stacking, payload limit, floor utilisation and a downloadable load plan. Geometry and mass only.',
  },
  de: {
    title: 'Lkw- & Container-Laderechner — Paletten pro Fahrzeug',
    description:
      'Kostenloser Laderechner: wie viele Paletten in einen 13,6-m-Planenauflieger, 20-Fuß- oder 40-Fuß-Container passen. Stellplätze, Doppelstockung, Nutzlastgrenze, Flächennutzung und ein Ladeplan zum Download. Nur Geometrie und Masse.',
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

const LABELS: Record<Lang, LoadLabels> = {
  en: {
    vehicleLegend: 'Vehicle',
    preset: 'Vehicle type',
    custom: 'Custom',
    floorLength: 'Floor length',
    floorWidth: 'Floor width',
    interiorHeight: 'Interior height',
    payload: 'Max payload',
    unitLegend: 'Load unit (loaded pallet)',
    unitLength: 'Footprint length',
    unitWidth: 'Footprint width',
    unitHeight: 'Loaded height (incl. pallet)',
    unitWeight: 'Gross weight',
    stackable: 'Double-stackable',
    resultsLegend: 'Result',
    floorSpots: 'Floor spots',
    tiers: 'Tiers',
    totalUnits: 'Pallets per vehicle',
    floorUtil: 'Floor area used',
    payloadUsed: 'Payload used',
    payloadUtil: 'Payload utilisation',
    stackHeight: 'Stack height',
    limitedBy: 'Limited by',
    limitSpace: 'Space',
    limitPayload: 'Payload',
    limitBoth: 'Space and payload',
    patternColumn: 'Column loading',
    patternTwoBlock: 'Two-block loading',
    patternFourBlock: 'Four-block loading',
    interlocked: 'mixed orientation',
    uniform: 'uniform orientation',
    alternatives: 'Alternative arrangements',
    spotsShort: 'floor spots',
    errUnitTooLarge: 'This load unit does not fit the floor in either orientation. Check the dimensions.',
    errTooTall: 'The loaded pallet is taller than the vehicle interior.',
    errInvalid: 'Every dimension must be a positive number.',
    downloadCsv: 'Download load plan (CSV)',
    planView: 'Floor plan — top down',
    disclaimer:
      'Geometry and mass only. This is not a load-securing (EN 12195), axle-load-distribution or dangerous-goods calculation, and it models no door clearance or working tolerance — which is why a 13.6 m trailer is quoted as 33 pallets in practice where raw geometry allows 34. Verify every load plan against your own securing and axle-load requirements.',
  },
  de: {
    vehicleLegend: 'Fahrzeug',
    preset: 'Fahrzeugtyp',
    custom: 'Benutzerdefiniert',
    floorLength: 'Ladeflächenlänge',
    floorWidth: 'Ladeflächenbreite',
    interiorHeight: 'Innenhöhe',
    payload: 'Max. Nutzlast',
    unitLegend: 'Ladeeinheit (beladene Palette)',
    unitLength: 'Grundfläche Länge',
    unitWidth: 'Grundfläche Breite',
    unitHeight: 'Ladehöhe (inkl. Palette)',
    unitWeight: 'Bruttogewicht',
    stackable: 'Doppelstockbar',
    resultsLegend: 'Ergebnis',
    floorSpots: 'Stellplätze',
    tiers: 'Lagen',
    totalUnits: 'Paletten pro Fahrzeug',
    floorUtil: 'Genutzte Ladefläche',
    payloadUsed: 'Genutzte Nutzlast',
    payloadUtil: 'Nutzlastauslastung',
    stackHeight: 'Stapelhöhe',
    limitedBy: 'Begrenzt durch',
    limitSpace: 'Platz',
    limitPayload: 'Nutzlast',
    limitBoth: 'Platz und Nutzlast',
    patternColumn: 'Säulenladung',
    patternTwoBlock: 'Zwei-Block-Ladung',
    patternFourBlock: 'Vier-Block-Ladung',
    interlocked: 'gemischte Ausrichtung',
    uniform: 'einheitliche Ausrichtung',
    alternatives: 'Alternative Anordnungen',
    spotsShort: 'Stellplätze',
    errUnitTooLarge: 'Diese Ladeeinheit passt in keiner Ausrichtung auf die Ladefläche. Bitte Maße prüfen.',
    errTooTall: 'Die beladene Palette ist höher als der Fahrzeuginnenraum.',
    errInvalid: 'Alle Maße müssen positive Zahlen sein.',
    downloadCsv: 'Ladeplan herunterladen (CSV)',
    planView: 'Ladeflächenplan — Draufsicht',
    disclaimer:
      'Nur Geometrie und Masse. Dies ist keine Ladungssicherungs- (EN 12195), Achslastverteilungs- oder Gefahrgutberechnung und modelliert weder Türfreiraum noch Arbeitstoleranz — deshalb wird ein 13,6-m-Auflieger in der Praxis mit 33 Paletten angegeben, wo die reine Geometrie 34 erlaubt. Prüfen Sie jeden Ladeplan gegen Ihre eigenen Sicherungs- und Achslastanforderungen.',
  },
};

const FAQS: Record<Lang, { q: string; a: string }[]> = {
  en: [
    {
      q: 'How many EUR pallets fit in a 40 ft container?',
      a: 'Twenty-five, loaded in a single tier. The solver reaches that from geometry alone: a 12,032 × 2,352 mm floor against a 1,200 × 800 mm footprint, best arrangement being a two-block split. A 20 ft container takes eleven on the same basis.',
    },
    {
      q: 'Why does a 13.6 m trailer show 34 and not the usual 33?',
      a: 'Both numbers are real. Raw geometry allows 34 when pallets are turned crosswise; the industry quotes 33 because loading needs working clearance and because the three-across lengthwise arrangement is easier to secure. This tool reports geometry, so it shows 34 and tells you the arrangement.',
    },
    {
      q: 'Does it handle double-stacking?',
      a: 'Yes. Tick "double-stackable" and a second tier is added whenever twice the loaded height fits the interior height. The payload limit is still applied afterwards, so a light, tall product stacks and a dense one does not.',
    },
    {
      q: 'Is this a load-securing calculation?',
      a: 'No. It computes floor arrangement, tiers, mass and utilisation. Load securing under EN 12195, axle-load distribution and dangerous-goods rules are separate obligations and remain yours.',
    },
    {
      q: 'How do I get from cases to pallets?',
      a: 'Use the pallet pattern calculator first: it turns a case size into cases per layer and a loaded pallet height. Feed that height and the resulting gross weight into this tool to get pallets per vehicle.',
    },
  ],
  de: [
    {
      q: 'Wie viele Europaletten passen in einen 40-Fuß-Container?',
      a: 'Fünfundzwanzig in einer Lage. Der Löser erreicht das rein geometrisch: 12.032 × 2.352 mm Ladefläche gegen eine Grundfläche von 1.200 × 800 mm, beste Anordnung ist eine Zwei-Block-Teilung. Ein 20-Fuß-Container nimmt auf gleicher Basis elf auf.',
    },
    {
      q: 'Warum zeigt ein 13,6-m-Auflieger 34 statt der üblichen 33?',
      a: 'Beide Zahlen stimmen. Die reine Geometrie erlaubt 34, wenn die Paletten quer stehen; die Branche nennt 33, weil das Beladen Arbeitsfreiraum braucht und die Drei-nebeneinander-Anordnung leichter zu sichern ist. Dieses Werkzeug meldet Geometrie, zeigt also 34 und nennt die Anordnung.',
    },
    {
      q: 'Wird Doppelstockung berücksichtigt?',
      a: 'Ja. Aktivieren Sie „Doppelstockbar“, und eine zweite Lage wird ergänzt, sobald die doppelte Ladehöhe in die Innenhöhe passt. Die Nutzlastgrenze wird danach weiterhin angewendet — leichte, hohe Ware stapelt, dichte nicht.',
    },
    {
      q: 'Ist das eine Ladungssicherungsberechnung?',
      a: 'Nein. Berechnet werden Flächenanordnung, Lagen, Masse und Auslastung. Ladungssicherung nach EN 12195, Achslastverteilung und Gefahrgutvorschriften sind eigene Pflichten und bleiben in Ihrer Verantwortung.',
    },
    {
      q: 'Wie komme ich von Kartons zu Paletten?',
      a: 'Nutzen Sie zuerst den Palettenmuster-Rechner: Er macht aus einem Kartonmaß Kartons pro Lage und eine Ladehöhe. Diese Höhe und das resultierende Bruttogewicht geben Sie hier ein, um Paletten pro Fahrzeug zu erhalten.',
    },
  ],
};

const BODY: Record<Lang, { kicker: string; h1: string; lead: string; methodH2: string; method: string[]; faqH2: string; chainH2: string; chainBody: string; chainLink: string }> = {
  en: {
    kicker: 'Free tool · Logistics',
    h1: 'Truck & container load calculator',
    lead: 'How many pallets fit the vehicle — floor spots, tiers, payload and utilisation, computed in your browser with a downloadable load plan.',
    methodH2: 'How the numbers are produced',
    method: [
      'The loading floor is treated as a region and the loaded pallet as a rectangle. The same solver that packs cases onto a deck enumerates column, two-block and four-block arrangements in both pallet orientations and reports the best floor count, with the arrangement named.',
      'A second tier is added only when twice the loaded height fits the interior height and you have marked the unit stackable. The payload limit is then applied on top, so the result tells you whether space or mass is the binding constraint — the distinction that decides whether you ship air or ship iron.',
      'Container and trailer presets use published interior dimensions and typical payloads. Override any of them: real vehicles vary by operator, and the solver does not care where the numbers come from.',
    ],
    faqH2: 'Questions',
    chainH2: 'Cases → pallets → vehicle',
    chainBody:
      'This tool starts where the pallet pattern calculator stops. Compute a layer pattern first to get loaded height and gross weight, then bring both here. The gap between the two results — cases you could ship versus cases you do ship — is the number worth arguing about.',
    chainLink: 'Open the pallet pattern calculator →',
  },
  de: {
    kicker: 'Kostenloses Werkzeug · Logistik',
    h1: 'Lkw- & Container-Laderechner',
    lead: 'Wie viele Paletten ins Fahrzeug passen — Stellplätze, Lagen, Nutzlast und Auslastung, im Browser berechnet, mit Ladeplan zum Download.',
    methodH2: 'Wie die Zahlen entstehen',
    method: [
      'Die Ladefläche wird als Region behandelt, die beladene Palette als Rechteck. Derselbe Löser, der Kartons auf eine Palette packt, zählt Säulen-, Zwei-Block- und Vier-Block-Anordnungen in beiden Palettenausrichtungen auf und meldet die beste Stellplatzzahl samt Anordnung.',
      'Eine zweite Lage entsteht nur, wenn die doppelte Ladehöhe in die Innenhöhe passt und die Einheit als stapelbar markiert ist. Danach greift die Nutzlastgrenze — das Ergebnis nennt also, ob Platz oder Masse bindet. Genau diese Unterscheidung entscheidet, ob Sie Luft oder Eisen transportieren.',
      'Container- und Aufliegervorgaben nutzen veröffentlichte Innenmaße und typische Nutzlasten. Überschreiben Sie sie beliebig: echte Fahrzeuge unterscheiden sich je nach Betreiber, und dem Löser ist die Herkunft der Zahlen gleichgültig.',
    ],
    faqH2: 'Fragen',
    chainH2: 'Kartons → Paletten → Fahrzeug',
    chainBody:
      'Dieses Werkzeug beginnt dort, wo der Palettenmuster-Rechner aufhört. Berechnen Sie zuerst ein Lagenmuster für Ladehöhe und Bruttogewicht und bringen Sie beides hierher. Die Lücke zwischen beiden Ergebnissen — versendbare gegen tatsächlich versendete Kartons — ist die Zahl, über die zu streiten sich lohnt.',
    chainLink: 'Palettenmuster-Rechner öffnen →',
  },
};

export default function TruckLoadPage({ params }: PageProps) {
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

          <TruckLoadCalculator labels={LABELS[lang]} lang={lang} />

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

            <h2>{copy.chainH2}</h2>
            <p>{copy.chainBody}</p>
          </div>

          <div className="cta-row">
            <a className="btn btn-glow" href={langHref(lang, '/tools/pallet-pattern-calculator')}>{copy.chainLink}</a>
            <BookCTA label={t.ctaBook} variant="line" lang={lang} />
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

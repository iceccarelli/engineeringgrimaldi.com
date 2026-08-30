import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { getDict } from '@/lib/dict';
import { isLang, langHref, pageAlternates, type Lang } from '@/lib/i18n';
import { breadcrumbSchema } from '@/lib/schema';

/** Tools hub — a crawlable parent for the calculators, and the place
 *  new instruments get added without touching navigation. */

type PageProps = { params: { lang: string } };

const COPY = {
  en: {
    title: 'Free Engineering Tools — Palletizing & Logistics Calculators',
    description:
      'Free browser-based calculators from Grimaldi Engineering: pallet layer patterns and truck/container load planning. Deterministic geometry, CSV export, no sign-up, nothing leaves your browser.',
    kicker: 'Tools',
    h1: 'Free calculators',
    lead: 'Working instruments, not lead-capture forms. Every calculation runs in your browser, every result exports to CSV, and none of them ask for an email.',
    chain: 'Use them in sequence: a case size becomes a pallet, a pallet becomes a vehicle load.',
    tools: [
      {
        path: '/tools/pallet-pattern-calculator',
        tag: 'Palletizing',
        name: 'Pallet pattern calculator',
        body: 'Cases per layer, layer count, deck-area and cube utilisation for any case on any pallet. Column, two-block and four-block layouts with a plan view.',
      },
      {
        path: '/tools/truck-load-calculator',
        tag: 'Logistics',
        name: 'Truck & container load calculator',
        body: 'Pallets per 13.6 m trailer, 20 ft or 40 ft container. Floor spots, double-stacking, payload limit and floor utilisation.',
      },
      {
        path: '/tools/case-size-optimizer',
        tag: 'Packaging design',
        name: 'Case size optimizer',
        body: 'Sweep every carton size you could order and rank them by pallet cube utilisation — with the gain over your current case in percentage points.',
      },
      {
        path: '/tools/motor-sizing-calculator',
        tag: 'Actuators',
        name: 'Servo motor sizing calculator',
        body: 'Rotary axis and robot joint sizing: reflected inertia, inertia ratio, gravity torque, peak and RMS motor torque, speed and power over a real duty cycle.',
      },
      {
        path: '/tools/battery-pack-calculator',
        tag: 'Battery systems',
        name: 'Battery pack calculator',
        body: 'S/P topology, voltage window, energy, C-rate headroom, runtime, resistive loss — with the design flags that catch a pack before it is built.',
      },
    ],
    referenceH2: 'Reference',
    reference: [
      { path: '/reference/pallet-sizes', name: 'Pallet sizes and standards', body: 'EPAL 1, 2, 3, 6 and the North American 48 × 40 — dimensions, own weight, safe working load, sources cited.' },
      { path: '/reference/container-dimensions', name: 'Shipping container dimensions', body: 'Interior dimensions, tare, payload, volume and EUR pallets per container for 20 ft, 40 ft and high cube.' },
    ],
  },
  de: {
    title: 'Kostenlose Ingenieur-Werkzeuge — Palettier- & Logistikrechner',
    description:
      'Kostenlose Browser-Rechner von Grimaldi Engineering: Paletten-Lagenmuster und Lkw-/Container-Ladeplanung. Deterministische Geometrie, CSV-Export, ohne Anmeldung, nichts verlässt Ihren Browser.',
    kicker: 'Werkzeuge',
    h1: 'Kostenlose Rechner',
    lead: 'Arbeitende Instrumente, keine Formulare zur Adressgewinnung. Jede Berechnung läuft im Browser, jedes Ergebnis geht als CSV heraus, und keiner fragt nach einer E-Mail-Adresse.',
    chain: 'In Reihe nutzen: Aus einem Kartonmaß wird eine Palette, aus einer Palette eine Fahrzeugladung.',
    tools: [
      {
        path: '/tools/pallet-pattern-calculator',
        tag: 'Palettieren',
        name: 'Palettenmuster-Rechner',
        body: 'Kartons pro Lage, Lagenzahl, Deckflächen- und Raumnutzung für jeden Karton auf jeder Palette. Säulen-, Zwei-Block- und Vier-Block-Muster mit Draufsicht.',
      },
      {
        path: '/tools/truck-load-calculator',
        tag: 'Logistik',
        name: 'Lkw- & Container-Laderechner',
        body: 'Paletten pro 13,6-m-Auflieger, 20-Fuß- oder 40-Fuß-Container. Stellplätze, Doppelstockung, Nutzlastgrenze und Flächennutzung.',
      },
      {
        path: '/tools/case-size-optimizer',
        tag: 'Verpackungsdesign',
        name: 'Kartongrößen-Optimierer',
        body: 'Jedes bestellbare Kartonmaß durchrechnen und nach Palettenraumnutzung sortieren — mit dem Gewinn gegenüber Ihrem aktuellen Karton in Prozentpunkten.',
      },
      {
        path: '/tools/motor-sizing-calculator',
        tag: 'Aktorik',
        name: 'Servomotor-Auslegungsrechner',
        body: 'Auslegung von Drehachsen und Robotergelenken: reduzierte Trägheit, Trägheitsverhältnis, Gravitationsmoment, Spitzen- und Effektivmoment, Drehzahl und Leistung über einen realen Arbeitszyklus.',
      },
      {
        path: '/tools/battery-pack-calculator',
        tag: 'Batteriesysteme',
        name: 'Batteriepack-Rechner',
        body: 'S/P-Topologie, Spannungsfenster, Energie, C-Raten-Reserve, Laufzeit, ohmsche Verluste — mit den Hinweisen, die ein Pack vor dem Bau abfangen.',
      },
    ],
    referenceH2: 'Referenz',
    reference: [
      { path: '/reference/pallet-sizes', name: 'Palettenmaße und Normen', body: 'EPAL 1, 2, 3, 6 und die nordamerikanische 48 × 40 — Maße, Eigengewicht, sichere Traglast, mit Quellen.' },
      { path: '/reference/container-dimensions', name: 'Container-Abmessungen', body: 'Innenmaße, Leergewicht, Nutzlast, Volumen und Europaletten pro Container für 20 Fuß, 40 Fuß und High Cube.' },
    ],
  },
} as const;

export function generateMetadata({ params }: PageProps): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  return {
    title: COPY[lang].title,
    description: COPY[lang].description,
    alternates: pageAlternates(lang, '/tools'),
  };
}

export default function ToolsIndex({ params }: PageProps) {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const t = getDict(lang);
  const copy = COPY[lang];

  return (
    <main>
      <div className="sheet sheet-top">
        <div className="section">
          <span className="kicker">{copy.kicker}</span>
          <h1>{copy.h1}</h1>
          <p className="intro">{copy.lead}</p>
          <div className="grid">
            {copy.tools.map((tool) => (
              <a className="card card-link" key={tool.path} href={langHref(lang, tool.path)}>
                <span className="tag">{tool.tag}</span>
                <h2>{tool.name}</h2>
                <p>{tool.body}</p>
                <span className="cta">{t.open}</span>
              </a>
            ))}
          </div>
          <p className="book-bring">{copy.chain}</p>

          <h2 className="tools-ref-h2">{copy.referenceH2}</h2>
          <div className="grid">
            {copy.reference.map((ref) => (
              <a className="card card-link" key={ref.path} href={langHref(lang, ref.path)}>
                <h3>{ref.name}</h3>
                <p>{ref.body}</p>
                <span className="cta">{t.open}</span>
              </a>
            ))}
          </div>
          <p className="author-block">{t.authorLine}</p>
        </div>
      </div>
      <JsonLd
        data={breadcrumbSchema(lang, [
          { name: 'Grimaldi Engineering', path: '/' },
          { name: copy.kicker, path: '/tools' },
        ])}
      />
    </main>
  );
}

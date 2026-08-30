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

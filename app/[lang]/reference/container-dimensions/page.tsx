import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { getDict } from '@/lib/dict';
import { isLang, langHref, pageAlternates, type Lang } from '@/lib/i18n';
import { CONTAINER_SOURCES, CONTAINER_STANDARDS } from '@/lib/reference';
import { breadcrumbSchema } from '@/lib/schema';

type PageProps = { params: { lang: string } };
const PATH = '/reference/container-dimensions';

const COPY = {
  en: {
    title: 'Shipping Container Dimensions — 20 ft, 40 ft and High Cube',
    description:
      'Interior container dimensions in millimetres with tare, payload, volume and EUR pallets per container: 20 ft (11 pallets), 40 ft and 40 ft high cube (25 pallets). Sources cited.',
    kicker: 'Reference',
    h1: 'Shipping container dimensions',
    lead: 'Nominal interior dimensions, payloads and the pallet counts our own solver produces from them.',
    hName: 'Container',
    hDims: 'Interior L × W × H (mm)',
    hTare: 'Tare',
    hPayload: 'Max payload',
    hVolume: 'Volume',
    hPallets: 'EPAL 1 per tier',
    varianceNote:
      'Interior dimensions and payloads vary between builders and operators, and the maximum payload permitted on a given movement is set by your carrier and by road weight limits — often well below the container rating. Confirm before booking.',
    palletsNote:
      'The pallet counts are not copied from a chart: they come from the same geometry solver behind the load calculator on this site, run on the interior dimensions in this table.',
    sourcesH2: 'Sources',
    ctaH2: 'Run your own load',
    ctaBody: 'Change the deck, the load height or the payload and the count changes with it.',
    link: 'Truck & container load calculator →',
  },
  de: {
    title: 'Container-Abmessungen — 20 Fuß, 40 Fuß und High Cube',
    description:
      'Innenmaße von Containern in Millimetern mit Leergewicht, Nutzlast, Volumen und Europaletten pro Container: 20 Fuß (11 Paletten), 40 Fuß und 40 Fuß High Cube (25 Paletten). Mit Quellen.',
    kicker: 'Referenz',
    h1: 'Container-Abmessungen',
    lead: 'Nominelle Innenmaße, Nutzlasten und die Palettenzahlen, die unser eigener Löser daraus errechnet.',
    hName: 'Container',
    hDims: 'Innen L × B × H (mm)',
    hTare: 'Leergewicht',
    hPayload: 'Max. Nutzlast',
    hVolume: 'Volumen',
    hPallets: 'EPAL 1 pro Lage',
    varianceNote:
      'Innenmaße und Nutzlasten unterscheiden sich je nach Hersteller und Betreiber, und die für eine konkrete Fahrt zulässige Nutzlast bestimmen Ihr Carrier und die Straßengewichtsgrenzen — oft deutlich unterhalb der Containerangabe. Vor der Buchung prüfen.',
    palletsNote:
      'Die Palettenzahlen sind nicht aus einer Tabelle übernommen: Sie stammen aus demselben Geometrie-Löser, der dem Laderechner dieser Seite zugrunde liegt, angewendet auf die Innenmaße dieser Tabelle.',
    sourcesH2: 'Quellen',
    ctaH2: 'Eigene Ladung rechnen',
    ctaBody: 'Ändern Sie Palette, Ladehöhe oder Nutzlast, und die Zahl ändert sich mit.',
    link: 'Lkw- & Container-Laderechner →',
  },
} as const;

export function generateMetadata({ params }: PageProps): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  return {
    title: COPY[lang].title,
    description: COPY[lang].description,
    alternates: pageAlternates(lang, PATH),
  };
}

export default function ContainerDimensionsPage({ params }: PageProps) {
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

          <div className="calc-table-wrap">
            <table className="calc-table ref-table">
              <thead>
                <tr>
                  <th>{copy.hName}</th>
                  <th>{copy.hDims}</th>
                  <th>{copy.hTare}</th>
                  <th>{copy.hPayload}</th>
                  <th>{copy.hVolume}</th>
                  <th>{copy.hPallets}</th>
                </tr>
              </thead>
              <tbody>
                {CONTAINER_STANDARDS.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.interiorLength} × {c.interiorWidth} × {c.interiorHeight}</td>
                    <td>{c.tare.toLocaleString(lang)} kg</td>
                    <td>{c.payload.toLocaleString(lang)} kg</td>
                    <td>{c.volume} m³</td>
                    <td>{c.eurPallets}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="calc-meta">{copy.varianceNote}</p>

          <div className="prose">
            <p>{copy.palletsNote}</p>

            <h2>{copy.sourcesH2}</h2>
            <ul>
              {CONTAINER_SOURCES.map((s) => (
                <li key={s.url}>
                  <a href={s.url} rel="noopener noreferrer nofollow">{s.label}</a>
                </li>
              ))}
            </ul>

            <h2>{copy.ctaH2}</h2>
            <p>{copy.ctaBody}</p>
          </div>

          <div className="cta-row">
            <a className="btn btn-line" href={langHref(lang, '/tools/truck-load-calculator')}>{copy.link}</a>
            <a className="btn btn-line" href={langHref(lang, '/reference/pallet-sizes')}>
              {lang === 'de' ? 'Palettenmaße →' : 'Pallet sizes →'}
            </a>
          </div>

          <p className="author-block">{t.authorLine}</p>
        </div>
      </div>

      <JsonLd
        data={breadcrumbSchema(lang, [
          { name: 'Grimaldi Engineering', path: '/' },
          { name: copy.kicker, path: '/reference/container-dimensions' },
        ])}
      />
    </main>
  );
}

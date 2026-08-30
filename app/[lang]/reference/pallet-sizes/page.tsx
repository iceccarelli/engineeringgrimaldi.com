import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { getDict } from '@/lib/dict';
import { isLang, langHref, pageAlternates, type Lang } from '@/lib/i18n';
import { PALLET_SOURCES, PALLET_STANDARDS } from '@/lib/reference';
import { breadcrumbSchema } from '@/lib/schema';

type PageProps = { params: { lang: string } };
const PATH = '/reference/pallet-sizes';

const COPY = {
  en: {
    title: 'Pallet Sizes & Standards — EPAL, EUR and 48×40 Dimensions',
    description:
      'Standard pallet dimensions in millimetres: EPAL 1 (1200 × 800), EPAL 2, EPAL 3, EPAL 6 half pallet and the North American 48 × 40. With own weight, safe working load and sources.',
    kicker: 'Reference',
    h1: 'Pallet sizes and standards',
    lead: 'The dimensions that decide every downstream calculation on this site, with the figures attributed rather than asserted.',
    tableCaption: 'Standard pallet dimensions',
    hName: 'Pallet',
    hDims: 'L × W × H (mm)',
    hOwn: 'Own weight',
    hSwl: 'Safe working load',
    notesH2: 'Notes',
    sourcesH2: 'Sources',
    varianceNote:
      'Own weight and load ratings vary with timber moisture, build and condition. Where a figure is not published as part of the standard it is left blank rather than estimated.',
    ctaH2: 'Use these numbers',
    ctaBody: 'Both calculators on this site are preloaded with these decks.',
    link1: 'Pallet pattern calculator →',
    link2: 'Truck & container load calculator →',
  },
  de: {
    title: 'Palettenmaße & Normen — EPAL-, EUR- und 48×40-Abmessungen',
    description:
      'Standard-Palettenmaße in Millimetern: EPAL 1 (1200 × 800), EPAL 2, EPAL 3, EPAL 6 Halbpalette und die nordamerikanische 48 × 40. Mit Eigengewicht, sicherer Traglast und Quellen.',
    kicker: 'Referenz',
    h1: 'Palettenmaße und Normen',
    lead: 'Die Maße, die jede weitere Berechnung auf dieser Seite bestimmen — mit Quellenangabe statt bloßer Behauptung.',
    tableCaption: 'Standard-Palettenmaße',
    hName: 'Palette',
    hDims: 'L × B × H (mm)',
    hOwn: 'Eigengewicht',
    hSwl: 'Sichere Traglast',
    notesH2: 'Hinweise',
    sourcesH2: 'Quellen',
    varianceNote:
      'Eigengewicht und Traglast schwanken mit Holzfeuchte, Bauart und Zustand. Wo eine Angabe nicht Teil der veröffentlichten Norm ist, bleibt das Feld leer statt geschätzt.',
    ctaH2: 'Diese Zahlen nutzen',
    ctaBody: 'Beide Rechner dieser Seite sind mit diesen Paletten vorbelegt.',
    link1: 'Palettenmuster-Rechner →',
    link2: 'Lkw- & Container-Laderechner →',
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

export default function PalletSizesPage({ params }: PageProps) {
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
              <caption className="sr-only">{copy.tableCaption}</caption>
              <thead>
                <tr>
                  <th>{copy.hName}</th>
                  <th>{copy.hDims}</th>
                  <th>{copy.hOwn}</th>
                  <th>{copy.hSwl}</th>
                </tr>
              </thead>
              <tbody>
                {PALLET_STANDARDS.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.length} × {p.width} × {p.height}</td>
                    <td>{p.ownWeight === null ? '—' : `${p.ownWeight} kg`}</td>
                    <td>{p.safeWorkingLoad === null ? '—' : `${p.safeWorkingLoad} kg`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="calc-meta">{copy.varianceNote}</p>

          <div className="prose">
            <h2>{copy.notesH2}</h2>
            {PALLET_STANDARDS.map((p) => (
              <div key={p.id}>
                <h3>{p.name}</h3>
                <p>{p.note[lang]}</p>
              </div>
            ))}

            <h2>{copy.sourcesH2}</h2>
            <ul>
              {PALLET_SOURCES.map((s) => (
                <li key={s.url}>
                  <a href={s.url} rel="noopener noreferrer nofollow">{s.label}</a>
                </li>
              ))}
            </ul>

            <h2>{copy.ctaH2}</h2>
            <p>{copy.ctaBody}</p>
          </div>

          <div className="cta-row">
            <a className="btn btn-line" href={langHref(lang, '/tools/pallet-pattern-calculator')}>{copy.link1}</a>
            <a className="btn btn-line" href={langHref(lang, '/tools/truck-load-calculator')}>{copy.link2}</a>
          </div>

          <p className="author-block">{t.authorLine}</p>
        </div>
      </div>

      <JsonLd
        data={breadcrumbSchema(lang, [
          { name: 'Grimaldi Engineering', path: '/' },
          { name: copy.kicker, path: '/reference/pallet-sizes' },
        ])}
      />
    </main>
  );
}

import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import { NETWORK_LINES } from '@/components/NetworkFooter';
import { getDict } from '@/lib/dict';
import { isLang, pageAlternates, type Lang } from '@/lib/i18n';

/**
 * /network — pointers only. No grid capability register is rebuilt here,
 * no books or podcast are serialised here. One line per domain, the same
 * line the footer carries.
 */

type PageProps = { params: { lang: string } };

const COPY = {
  en: {
    title: 'Network — the other three domains',
    description: 'engineeringgrimaldi.com is one of four: igrimaldi.engineering for verifiable intelligence on grids, grimaldi.ca for the logbook, GitHub for the code. One line each, no duplication.',
    kicker: 'Network',
    h1: 'Four domains, one line each',
    lead: 'This site owns one trade cell. The grid capability register, the advisory door and the verification brain live on igrimaldi.engineering. The logbook, podcast, reviews and books live on grimaldi.ca. Nothing from either is rebuilt here.',
    rows: [
      { host: 'igrimaldi.engineering', what: 'Verification brain for grids and traction power. The €280 teardown and the advisory retainer live there, not here.' },
      { host: 'engineeringgrimaldi.com', what: 'This site. Palletizer on the hero, the Forge Line behind /forge, the disciplines with their red banners.' },
      { host: 'grimaldi.ca', what: 'Logbook, podcast, reviews, books. Not serialised here.' },
      { host: 'github.com/iceccarelli', what: 'Clone or it does not exist. Only repositories that return 200 are linked from this site.' },
    ],
    collision: 'Name collision, stated: “Grimaldi Engineering” is also a French consultancy and a UK Ltd in liquidation. Neither is us. That is why the H1 on this site is the product sentence, not the company name.',
  },
  de: {
    title: 'Netzwerk — die anderen drei Domains',
    description: 'engineeringgrimaldi.com ist eine von vier: igrimaldi.engineering für verifizierbare Intelligenz für Netze, grimaldi.ca für das Logbuch, GitHub für den Code. Je eine Zeile, keine Duplikate.',
    kicker: 'Netzwerk',
    h1: 'Vier Domains, je eine Zeile',
    lead: 'Diese Seite besitzt eine Gewerkezelle. Das Netz-Kompetenzregister, die Beratungstür und das Verifikationsgehirn leben auf igrimaldi.engineering. Logbuch, Podcast, Rezensionen und Bücher leben auf grimaldi.ca. Nichts davon wird hier nachgebaut.',
    rows: [
      { host: 'igrimaldi.engineering', what: 'Verifikationsgehirn für Netze und Bahnstrom. Der 280-€-Teardown und der Advisory-Retainer leben dort, nicht hier.' },
      { host: 'engineeringgrimaldi.com', what: 'Diese Seite. Palletizer auf der Startseite, die Forge-Linie hinter /forge, die Disziplinen mit ihren roten Bannern.' },
      { host: 'grimaldi.ca', what: 'Logbuch, Podcast, Rezensionen, Bücher. Hier nicht serialisiert.' },
      { host: 'github.com/iceccarelli', what: 'Klonen oder es existiert nicht. Von dieser Seite werden nur Repositories verlinkt, die 200 zurückgeben.' },
    ],
    collision: 'Namenskollision, offen gesagt: „Grimaldi Engineering“ ist auch eine französische Beratung und eine britische Ltd in Liquidation. Keine davon sind wir. Deshalb ist die H1 dieser Seite der Produktsatz, nicht der Firmenname.',
  },
} as const;

export function generateMetadata({ params }: PageProps): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const c = COPY[lang];
  return { title: c.title, description: c.description, alternates: pageAlternates(lang, '/network') };
}

export default function NetworkPage({ params }: PageProps) {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const t = getDict(lang);
  const c = COPY[lang];

  return (
    <main>
      <div className="sheet sheet-top">
        <div className="section">
          <Breadcrumbs lang={lang} crumbs={[{ name: 'Grimaldi Engineering', path: '/' }, { name: c.kicker, path: '/network' }]} />
          <span className="kicker">{c.kicker}</span>
          <h1>{c.h1}</h1>
          <p className="intro">{c.lead}</p>
          <div className="grid">
            {c.rows.map((r) => {
              const line = NETWORK_LINES.find((n) => n.host === r.host);
              return (
                <a className="card card-link" key={r.host} href={line?.href ?? '#'} rel="noopener noreferrer">
                  <span className="tag mono">{r.host}</span>
                  <h3>{line?.line}</h3>
                  <p>{r.what}</p>
                </a>
              );
            })}
          </div>
          <p className="boundary-note">{c.collision}</p>
          <p className="author-block">{t.authorLine}</p>
        </div>
      </div>
    </main>
  );
}

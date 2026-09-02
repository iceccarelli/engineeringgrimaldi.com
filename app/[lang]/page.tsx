import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import PalletFill from '@/components/PalletFill';
import PilotKillDate from '@/components/PilotKillDate';
import StatusBadge from '@/components/StatusBadge';
import { getDict } from '@/lib/dict';
import { getProduct } from '@/lib/forge';
import { isLang, langHref, pageAlternates, type Lang } from '@/lib/i18n';
import { ogImages } from '@/lib/meta';
import { NOT_SHIPPED, SHIPPED } from '@/lib/palletizer-facts';
import { OPTIMIZER_URL, PALLETIZER_REPO } from '@/lib/pilot';
import { professionalServiceSchema } from '@/lib/schema';

/**
 * The landing page has one product on it. Hero = Palletizer: the H1 is the
 * product sentence (not the company name — "Grimaldi Engineering" is not
 * ours globally), the cinema is the pallet the real optimizer fills, the
 * two buttons are the optimizer and the pilot. Below the fold: the
 * shipped / not-shipped columns in short form, the pilot with its kill
 * date, and a thin index to everything else. Paint and Dry are not linked
 * from here — they live behind /forge, two clicks away.
 */

type PageProps = { params: { lang: string } };

const COPY = {
  en: {
    kicker: 'engineeringgrimaldi.com · one trade cell, shipped and measured',
    h1: 'Mixed-SKU pallet plans with a stability number you can check.',
    sub: 'Open-core optimizer. v0.2 heuristic. Same math in the browser and in Python. Not a cell OS yet.',
    run: 'Run your SKU list',
    product: 'What ships, what does not',
    shippedH2: 'Shipped',
    notShippedH2: 'Not shipped',
    fullList: 'Full list with file paths on /palletizer →',
    restH2: 'Everything else, one click deeper',
    restLead: 'Kept, reachable, labelled. Nothing below is on the hero because nothing below is shipped and measured.',
    rest: [
      { path: '/forge', title: 'Forge Line', body: 'FloorForge (IN DEVELOPMENT), PaintForge, DryForge, ForgeOS (PARKED). Status badges first, copy second.' },
      { path: '/tools', title: 'Six free calculators', body: 'Pallet patterns, truck load, case size, servo sizing, battery packs, control loops. Browser, CSV export, no sign-up.' },
      { path: '/disciplines', title: 'Disciplines', body: 'HV, embedded, power electronics, machines, batteries, control — each with a red NO LOG YET banner until an instrument capture is published.' },
      { path: '/lab', title: 'Lab', body: 'The grid-droop instrument that works, the OEM dreams that are parked, and the slogans that are banned.' },
      { path: '/proof', title: 'Proof', body: 'Fixture results, including the one the heuristic loses. Slot for SKU before/after PDFs.' },
      { path: '/network', title: 'Network', body: 'igrimaldi.engineering for the verification brain, grimaldi.ca for the logbook, GitHub for the code.' },
    ],
    hv: 'The engineer behind this digitises high-voltage systems for German rail by day. That credential backs the HV discipline pages; it is not evidence that Palletizer runs anywhere near a railway.',
  },
  de: {
    kicker: 'engineeringgrimaldi.com · eine Gewerkezelle, ausgeliefert und gemessen',
    h1: 'Misch-SKU-Palettenpläne mit einer Stabilitätszahl, die Sie nachrechnen können.',
    sub: 'Open-Core-Optimierer. v0.2-Heuristik. Dieselbe Mathematik im Browser und in Python. Noch kein Zellen-Betriebssystem.',
    run: 'Ihre SKU-Liste rechnen',
    product: 'Was ausgeliefert ist, was nicht',
    shippedH2: 'Ausgeliefert',
    notShippedH2: 'Nicht ausgeliefert',
    fullList: 'Vollständige Liste mit Dateipfaden auf /palletizer →',
    restH2: 'Alles andere, einen Klick tiefer',
    restLead: 'Behalten, erreichbar, beschriftet. Nichts davon steht auf der Startseite, weil nichts davon ausgeliefert und gemessen ist.',
    rest: [
      { path: '/forge', title: 'Forge-Linie', body: 'FloorForge (IN ENTWICKLUNG), PaintForge, DryForge, ForgeOS (GEPARKT). Erst Status-Badge, dann Text.' },
      { path: '/tools', title: 'Sechs kostenlose Rechner', body: 'Palettenmuster, Lkw-Ladung, Kartongröße, Servo-Auslegung, Batteriepacks, Regelkreise. Browser, CSV-Export, ohne Anmeldung.' },
      { path: '/disciplines', title: 'Disziplinen', body: 'HV, Embedded, Leistungselektronik, Maschinen, Batterien, Regelung — jede mit rotem NOCH-KEIN-JOURNAL-Banner, bis eine Messung veröffentlicht ist.' },
      { path: '/lab', title: 'Labor', body: 'Das Statik-Instrument, das funktioniert, die geparkten OEM-Träume und die verbotenen Slogans.' },
      { path: '/proof', title: 'Nachweis', body: 'Fixture-Ergebnisse, einschließlich des einen, das die Heuristik verliert. Platz für SKU-Vorher/Nachher-PDFs.' },
      { path: '/network', title: 'Netzwerk', body: 'igrimaldi.engineering für das Verifikationsgehirn, grimaldi.ca für das Logbuch, GitHub für den Code.' },
    ],
    hv: 'Der Ingenieur dahinter digitalisiert tagsüber Hochspannungssysteme für die deutsche Bahn. Diese Referenz stützt die HV-Disziplinseiten; sie ist kein Beleg dafür, dass Palletizer irgendwo in Bahnnähe läuft.',
  },
} as const;

export function generateMetadata({ params }: PageProps): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const c = COPY[lang];
  return {
    alternates: pageAlternates(lang, '/'),
    openGraph: { images: ogImages('Palletizer OS — mixed-SKU planning', c.kicker) },
    twitter: { card: 'summary_large_image', images: ogImages('Palletizer OS — mixed-SKU planning', c.kicker) },
  };
}

export default function Home({ params }: PageProps) {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const t = getDict(lang);
  const c = COPY[lang];
  const href = (path: string) => langHref(lang, path);
  const product = getProduct('palletizer');

  return (
    <main>
      <section className="hero hero-wedge">
        <div className="hero-in hero-split">
          <div className="hero-card">
            <span className="kicker">{c.kicker}</span>
            <h1>{c.h1}</h1>
            <p className="lead">{c.sub}</p>
            {product ? (
              <p className="status-row"><StatusBadge status={product.status} lang={lang} note={product.statusNote?.[lang]} /></p>
            ) : null}
            <div className="cta-row">
              <a className="btn btn-glow" href={OPTIMIZER_URL} rel="noopener noreferrer" data-cta="optimizer">{c.run} →</a>
              <a className="btn btn-line" href={href('/palletizer')}>{c.product}</a>
            </div>
            <p className="hero-fine">
              <a className="mono" href={PALLETIZER_REPO} rel="noopener noreferrer">github.com/iceccarelli/palletizer</a>
            </p>
          </div>
          <div className="hero-cinema">
            <PalletFill lang={lang} />
          </div>
        </div>
      </section>

      <div className="sheet">
        <div className="section" id="ships">
          <div className="honesty-grid">
            <section className="honesty-col honesty-col-ok" aria-labelledby="home-shipped">
              <h2 id="home-shipped">{c.shippedH2}</h2>
              <ul className="honesty-list honesty-list-short">
                {SHIPPED.map((l) => <li key={l.text.en}>{l.text[lang]}</li>)}
              </ul>
            </section>
            <section className="honesty-col honesty-col-no" aria-labelledby="home-not">
              <h2 id="home-not">{c.notShippedH2}</h2>
              <ul className="honesty-list honesty-list-short">
                {NOT_SHIPPED.map((l) => <li key={l.text.en}>{l.text[lang]}</li>)}
              </ul>
            </section>
          </div>
          <p className="home-more"><a href={href('/palletizer')}>{c.fullList}</a></p>
        </div>

        <div className="section" id="pilot-home">
          <PilotKillDate lang={lang} compact />
        </div>

        <div className="section" id="rest">
          <h2>{c.restH2}</h2>
          <p className="intro">{c.restLead}</p>
          <div className="grid">
            {c.rest.map((r) => (
              <a className="card card-link" key={r.path} href={href(r.path)}>
                <h3>{r.title}</h3>
                <p>{r.body}</p>
                <span className="cta">{t.open}</span>
              </a>
            ))}
          </div>
          <p className="calc-meta">{c.hv}</p>
        </div>
      </div>

      <JsonLd data={professionalServiceSchema()} />
    </main>
  );
}

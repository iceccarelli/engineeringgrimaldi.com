/**
 * The Forge Line — product registry and page content.
 *
 * Honesty contract (do not weaken):
 * - Status comes from lib/status.ts and must be true on the day it ships.
 *   Palletizer is SHIPPED because `pip install palletizer-full-stack`,
 *   the repository, tests + CI and the live optimizer all exist — and its
 *   page lists, line by line, what is NOT shipped (no certified arm, no
 *   cell). FloorForge is IN_DEVELOPMENT because its own README says
 *   "No shipped hardware or production software yet". PaintForge, DryForge
 *   and ForgeOS are PARKED: kept, reachable, not worked on — cash goes to
 *   the wedge.
 * - No invented customers, robots, metrics or case studies. Integration
 *   fields say "none yet" when that is the truth.
 * - `repo` may only hold a URL that returns 200. ForgeOS has none, so it
 *   has none.
 */

import type { Localized } from './i18n';
import type { Status } from './status';

export type ForgeFaq = { q: Localized; a: Localized };

export type ForgeProduct = {
  slug: string;
  /** Short alias route from the brief (/forge/floor …). Redirected in next.config.js. */
  alias: string;
  name: string;
  trade: Localized;
  tagline: Localized;
  metaTitle: Localized;
  metaDescription: Localized;
  problem: Localized;
  architecture: Localized;
  integrations: Localized;
  license: Localized;
  commercial: Localized;
  repo?: string;
  demo?: string;
  status: Status;
  statusNote?: Localized;
  /** Verbatim quote from the product's own README, with the line it comes from. */
  readmeQuote?: { text: string; source: string };
  faqs: ForgeFaq[];
};

export const forgeLine: ForgeProduct[] = [
  {
    slug: 'palletizer',
    alias: '/palletizer',
    name: 'Palletizer OS',
    trade: { en: 'Palletizing', de: 'Palettieren' },
    tagline: {
      en: 'Mixed-SKU pallet plans with a stability number you can check. Open-core optimizer, v0.2 heuristic, same math in the browser and in Python. Not a cell OS yet.',
      de: 'Misch-SKU-Palettenpläne mit einer Stabilitätszahl, die Sie nachrechnen können. Open-Core-Optimierer, v0.2-Heuristik, dieselbe Mathematik im Browser und in Python. Noch kein Zellen-Betriebssystem.',
    },
    metaTitle: {
      en: 'Palletizer OS — mixed-SKU planning',
      de: 'Palletizer OS — Misch-SKU-Planung',
    },
    metaDescription: {
      en: 'Palletizer v0.2: open-core mixed-SKU pallet optimizer. Rotation, volumetric density vs naive baseline, stability = 0.6·support + 0.4·CoM. TS↔Python parity on fixtures, tests + CI, live optimizer. 30-day software pilot with a kill date. No certified robot drivers yet.',
      de: 'Palletizer v0.2: Open-Core-Misch-SKU-Palettenoptimierer. Rotation, Volumendichte gegen naive Basislinie, Stabilität = 0,6·Auflage + 0,4·Schwerpunkt. TS↔Python-Parität auf Fixtures, Tests + CI, Live-Optimierer. 30-Tage-Software-Pilot mit Abbruchdatum. Noch keine zertifizierten Robotertreiber.',
    },
    problem: {
      en: 'A plant, packaging or 3PL engineer with a messy SKU master needs a pallet plan they can defend: how dense, how stable, and why. Today that answer comes from an integrator’s black box or from a forklift driver’s judgement. Palletizer answers it in seconds with a number that can be recomputed by hand.',
      de: 'Ein Werks-, Verpackungs- oder 3PL-Ingenieur mit einem unordentlichen SKU-Stamm braucht einen Palettenplan, den er verteidigen kann: wie dicht, wie stabil und warum. Heute kommt die Antwort aus der Blackbox eines Integrators oder aus dem Bauchgefühl eines Staplerfahrers. Palletizer beantwortet sie in Sekunden mit einer Zahl, die sich von Hand nachrechnen lässt.',
    },
    architecture: {
      en: 'A shelf-packing heuristic in Python (palletizer_full/optimizer.py) with a function-for-function TypeScript port that runs in the browser. Rotation 0/90°, volumetric density, density vs a naive baseline computed on the same boxes, and stability = 0.6 × base-support + 0.4 × centre-of-mass score. Interface stubs exist for URScript compilation and an OPC UA mock; they are stubs until tests prove otherwise.',
      de: 'Eine Shelf-Packing-Heuristik in Python (palletizer_full/optimizer.py) mit einer funktionsgleichen TypeScript-Portierung, die im Browser läuft. Rotation 0/90°, Volumendichte, Dichte gegen eine auf denselben Kartons berechnete naive Basislinie und Stabilität = 0,6 × Auflage + 0,4 × Schwerpunkt-Score. Schnittstellen-Stubs für URScript-Kompilierung und ein OPC-UA-Mock existieren; sie bleiben Stubs, bis Tests etwas anderes belegen.',
    },
    integrations: {
      en: 'Hardware-agnostic interface stubs. Production arm = one partner + integration days. No certified UR / Fanuc / ABB driver exists. We do not pretend a browser canvas is a cell.',
      de: 'Hardware-agnostische Schnittstellen-Stubs. Produktionsarm = ein Partner + Integrationstage. Es existiert kein zertifizierter UR- / Fanuc- / ABB-Treiber. Wir tun nicht so, als wäre ein Browser-Canvas eine Zelle.',
    },
    license: {
      en: 'License: Apache-2.0 (open core). Commercial licensing for production use is agreed per project.',
      de: 'Lizenz: Apache-2.0 (Open Core). Kommerzielle Lizenzierung für den Produktiveinsatz wird pro Projekt vereinbart.',
    },
    commercial: {
      en: 'Commercial terms: a 30-day software pilot on your CSV with a kill date on the calendar at week 0. Fixed fee, quoted within one working day of receiving the CSV. Arm and integration are quoted only after a go at week 4.',
      de: 'Kommerzielle Konditionen: ein 30-Tage-Software-Pilot auf Ihrer CSV mit Abbruchdatum im Kalender ab Woche 0. Festpreis, angeboten innerhalb eines Werktags nach Erhalt der CSV. Arm und Integration werden erst nach einem Go in Woche 4 angeboten.',
    },
    repo: 'https://github.com/iceccarelli/palletizer',
    demo: 'https://palletizer-app.vercel.app/',
    status: 'SHIPPED',
    statusNote: { en: 'optimizer v0.2 · not a cell', de: 'Optimierer v0.2 · keine Zelle' },
    faqs: [
      {
        q: { en: 'Is Palletizer production software?', de: 'Ist Palletizer Produktivsoftware?' },
        a: {
          en: 'The optimizer is: versioned (v0.2.0 on PyPI), tested, CI on three Python versions, and deployed as a live app. The cell layer is not: no certified robot driver, no lights-out cell, no washdown hardware. The page above lists both columns.',
          de: 'Der Optimierer ja: versioniert (v0.2.0 auf PyPI), getestet, CI auf drei Python-Versionen, als Live-App deployt. Die Zellenschicht nein: kein zertifizierter Robotertreiber, keine Lights-out-Zelle, keine Washdown-Hardware. Die Seite oben nennt beide Spalten.',
        },
      },
      {
        q: { en: 'Which robots does it support?', de: 'Welche Roboter werden unterstützt?' },
        a: {
          en: 'None is certified. The repository contains a URScript compiler and an OPC UA mock as interface stubs. A production arm means one partner and integration days, quoted after the pilot — not before.',
          de: 'Keiner ist zertifiziert. Das Repository enthält einen URScript-Compiler und einen OPC-UA-Mock als Schnittstellen-Stubs. Ein Produktionsarm bedeutet einen Partner und Integrationstage, angeboten nach dem Piloten — nicht davor.',
        },
      },
      {
        q: { en: 'What does “18 % uplift” or “$187k” on the live site mean?', de: 'Was bedeuten „18 % Uplift“ oder „$187k“ auf der Live-Seite?' },
        a: {
          en: 'Reference geometry on fixtures, not customer results. The honest sentence is “density uplift vs naive baseline on fixture X”. On the 36-box e-commerce fixture the heuristic is 1 % below naive — that number is published on /proof too.',
          de: 'Referenzgeometrie auf Fixtures, keine Kundenergebnisse. Der ehrliche Satz lautet „Dichte-Uplift gegen naive Basislinie auf Fixture X“. Auf dem 36-Karton-E-Commerce-Fixture liegt die Heuristik 1 % unter naiv — auch diese Zahl steht auf /proof.',
        },
      },
    ],
  },
  {
    slug: 'floorforge',
    alias: '/forge/floor',
    name: 'FloorForge AI',
    trade: { en: 'Flooring', de: 'Bodenlegen' },
    tagline: {
      en: 'Autonomous hardwood floor refinishing — a Next.js waitlist site and a pilot programme forming. No shipped hardware or production software yet.',
      de: 'Autonomes Aufarbeiten von Hartholzböden — eine Next.js-Wartelisten-Seite und ein entstehendes Pilotprogramm. Noch keine ausgelieferte Hardware und keine Produktivsoftware.',
    },
    metaTitle: {
      en: 'FloorForge AI — in development',
      de: 'FloorForge AI — in Entwicklung',
    },
    metaDescription: {
      en: 'FloorForge AI: robotic hardwood floor refinishing, early stage. Its own README states: no shipped hardware or production software yet. Public repository, waitlist, ROI model with stated assumptions. Not for sale.',
      de: 'FloorForge AI: robotisches Aufarbeiten von Hartholzböden, frühes Stadium. Das eigene README sagt: noch keine ausgelieferte Hardware und keine Produktivsoftware. Öffentliches Repository, Warteliste, ROI-Modell mit genannten Annahmen. Nicht im Verkauf.',
    },
    problem: {
      en: 'Hardwood refinishing is sanded by hand, dust-managed by habit and scheduled by phone. FloorForge AI is the channel bet: a crew that uses software weekly before any robot exists. Until a crew does, this stays IN DEVELOPMENT and off the hero.',
      de: 'Hartholzböden werden von Hand geschliffen, Staub wird aus Gewohnheit beherrscht, geplant wird per Telefon. FloorForge AI ist die Kanal-Wette: eine Kolonne, die wöchentlich Software nutzt, bevor ein Roboter existiert. Bis eine Kolonne das tut, bleibt es IN ENTWICKLUNG und nicht auf der Startseite.',
    },
    architecture: {
      en: 'What the repository actually is: a Next.js 16 marketing and waitlist site with an ROI model (assumptions stated on the page), a scripted demo chatbot labelled as such, and a dashboard preview on sample data. Architecture claims about robots appear here only once code backs them.',
      de: 'Was das Repository tatsächlich ist: eine Next.js-16-Marketing- und Wartelisten-Seite mit einem ROI-Modell (Annahmen auf der Seite genannt), einem als solcher gekennzeichneten geskripteten Demo-Chatbot und einer Dashboard-Vorschau auf Beispieldaten. Architektur-Aussagen über Roboter erscheinen hier erst, wenn der Code sie deckt.',
    },
    integrations: {
      en: 'Supported hardware: none. Ecowoods relationship: public contractor site independent; integration not public. Ecowoods (Toronto, est. 2000) is not rebranded here and its homepage does not mention FloorForge.',
      de: 'Unterstützte Hardware: keine. Beziehung zu Ecowoods: öffentliche Handwerker-Seite unabhängig; Integration nicht öffentlich. Ecowoods (Toronto, seit 2000) wird hier nicht umbenannt, und seine Startseite erwähnt FloorForge nicht.',
    },
    license: {
      en: 'License: see the repository.',
      de: 'Lizenz: siehe Repository.',
    },
    commercial: {
      en: 'Commercial terms: not for sale. The one conversion path is the pilot waitlist on floorforge.ai.',
      de: 'Kommerzielle Konditionen: nicht im Verkauf. Der einzige Konversionspfad ist die Pilot-Warteliste auf floorforge.ai.',
    },
    repo: 'https://github.com/iceccarelli/floorforge-ai',
    status: 'IN_DEVELOPMENT',
    readmeQuote: {
      text: 'No shipped hardware or production software yet — that is what the pilot program exists to build',
      source: 'floorforge-ai/README.md · Status',
    },
    faqs: [
      {
        q: { en: 'Can I buy FloorForge AI today?', de: 'Kann ich FloorForge AI heute kaufen?' },
        a: {
          en: 'No. Its README says no shipped hardware or production software yet. The waitlist gets one email when that changes.',
          de: 'Nein. Das README sagt: noch keine ausgelieferte Hardware und keine Produktivsoftware. Die Warteliste erhält eine E-Mail, wenn sich das ändert.',
        },
      },
      {
        q: { en: 'Is Ecowoods a FloorForge customer?', de: 'Ist Ecowoods ein FloorForge-Kunde?' },
        a: {
          en: 'Ecowoods is an independent Toronto hardwood contractor with its own public site. Any integration is not public, so it is not claimed here.',
          de: 'Ecowoods ist ein unabhängiger Hartholz-Betrieb aus Toronto mit eigener öffentlicher Seite. Eine Integration ist nicht öffentlich und wird hier daher nicht behauptet.',
        },
      },
    ],
  },
  {
    slug: 'paintforge',
    alias: '/forge/paint',
    name: 'PaintForge AI',
    trade: { en: 'Painting', de: 'Malen' },
    tagline: {
      en: 'Automation tooling for the painting trade. Parked: kept, reachable, not worked on.',
      de: 'Automatisierungs-Tooling für das Maler-Gewerk. Geparkt: behalten, erreichbar, nicht bearbeitet.',
    },
    metaTitle: {
      en: 'PaintForge AI — parked',
      de: 'PaintForge AI — geparkt',
    },
    metaDescription: {
      en: 'PaintForge AI: automation tooling for the painting trade. Public repository, parked while Palletizer is the wedge. No production deployment.',
      de: 'PaintForge AI: Automatisierungs-Tooling für das Maler-Gewerk. Öffentliches Repository, geparkt, solange Palletizer der Keil ist. Kein Produktiveinsatz.',
    },
    problem: {
      en: 'Surface prep, coverage estimation and job sequencing in the painting trade are experience-bound and rarely written down. PaintForge AI explored which of those steps become software.',
      de: 'Untergrund-Vorbereitung, Verbrauchskalkulation und Auftragsreihenfolge im Maler-Gewerk hängen an Erfahrung und stehen selten auf Papier. PaintForge AI hat erkundet, welche dieser Schritte Software werden.',
    },
    architecture: {
      en: 'Early-stage codebase. No architecture claim is made while the project is parked.',
      de: 'Codebasis in frühem Stadium. Solange das Projekt geparkt ist, wird keine Architektur-Aussage gemacht.',
    },
    integrations: { en: 'Supported hardware: none.', de: 'Unterstützte Hardware: keine.' },
    license: { en: 'License: see the repository.', de: 'Lizenz: siehe Repository.' },
    commercial: {
      en: 'Commercial terms: not for sale. Parked for cash — the wedge is Palletizer.',
      de: 'Kommerzielle Konditionen: nicht im Verkauf. Aus Kostengründen geparkt — der Keil ist Palletizer.',
    },
    repo: 'https://github.com/iceccarelli/paintforge-ai',
    status: 'PARKED',
    faqs: [
      {
        q: { en: 'Is PaintForge AI deployed anywhere?', de: 'Ist PaintForge AI irgendwo im Einsatz?' },
        a: {
          en: 'No. It is a public repository, parked. No production deployment exists.',
          de: 'Nein. Es ist ein öffentliches Repository, geparkt. Es existiert kein Produktiveinsatz.',
        },
      },
    ],
  },
  {
    slug: 'dryforge',
    alias: '/forge/dry',
    name: 'DryForge AI',
    trade: { en: 'Drying', de: 'Trocknen' },
    tagline: {
      en: 'Drying and climate workflows on site. Parked: kept, reachable, not worked on.',
      de: 'Trocknungs- und Klima-Abläufe auf der Baustelle. Geparkt: behalten, erreichbar, nicht bearbeitet.',
    },
    metaTitle: {
      en: 'DryForge AI — parked',
      de: 'DryForge AI — geparkt',
    },
    metaDescription: {
      en: 'DryForge AI: automation for site drying and climate workflows. Public repository, parked while Palletizer is the wedge. No production deployment.',
      de: 'DryForge AI: Automatisierung für Baustellen-Trocknung und Klima-Abläufe. Öffentliches Repository, geparkt, solange Palletizer der Keil ist. Kein Produktiveinsatz.',
    },
    problem: {
      en: 'Screed and water-damage drying runs on rented dehumidifiers, paper logs and gut feel — while energy is metered and deadlines are contractual. DryForge AI explored measured, logged drying workflows.',
      de: 'Estrich- und Wasserschaden-Trocknung läuft über gemietete Trockner, Papierprotokolle und Bauchgefühl — während Energie gemessen wird und Fristen vertraglich sind. DryForge AI hat gemessene, protokollierte Trocknungs-Abläufe erkundet.',
    },
    architecture: {
      en: 'Early-stage codebase. No architecture claim is made while the project is parked.',
      de: 'Codebasis in frühem Stadium. Solange das Projekt geparkt ist, wird keine Architektur-Aussage gemacht.',
    },
    integrations: { en: 'Supported hardware: none.', de: 'Unterstützte Hardware: keine.' },
    license: { en: 'License: see the repository.', de: 'Lizenz: siehe Repository.' },
    commercial: {
      en: 'Commercial terms: not for sale. Parked for cash — the wedge is Palletizer.',
      de: 'Kommerzielle Konditionen: nicht im Verkauf. Aus Kostengründen geparkt — der Keil ist Palletizer.',
    },
    repo: 'https://github.com/iceccarelli/dryforge-ai',
    status: 'PARKED',
    faqs: [
      {
        q: { en: 'Is DryForge AI deployed anywhere?', de: 'Ist DryForge AI irgendwo im Einsatz?' },
        a: {
          en: 'No. It is a public repository, parked. No production deployment exists.',
          de: 'Nein. Es ist ein öffentliches Repository, geparkt. Es existiert kein Produktiveinsatz.',
        },
      },
    ],
  },
  {
    slug: 'os',
    alias: '/forge/os',
    name: 'ForgeOS',
    trade: { en: 'Cross-trade layer', de: 'Gewerkeübergreifende Schicht' },
    tagline: {
      en: 'The idea of one runtime under every Forge product. Parked. There is no repository to link, so none is linked.',
      de: 'Die Idee einer Laufzeitumgebung unter jedem Forge-Produkt. Geparkt. Es gibt kein Repository zum Verlinken, also ist keines verlinkt.',
    },
    metaTitle: {
      en: 'ForgeOS — parked',
      de: 'ForgeOS — geparkt',
    },
    metaDescription: {
      en: 'ForgeOS: the parked idea of a shared runtime under the Forge Line. No repository, no code, no deployment. Listed so the name is not mistaken for a product.',
      de: 'ForgeOS: die geparkte Idee einer gemeinsamen Laufzeitumgebung unter der Forge-Linie. Kein Repository, kein Code, kein Einsatz. Aufgeführt, damit der Name nicht für ein Produkt gehalten wird.',
    },
    problem: {
      en: 'Every Forge product would eventually need the same things: job records, telemetry, a device boundary, an audit trail. ForgeOS was the name for sharing them. The honest order is the other way round: ship one trade first, then extract what repeats.',
      de: 'Jedes Forge-Produkt bräuchte irgendwann dasselbe: Auftragsdatensätze, Telemetrie, eine Gerätegrenze, einen Audit-Trail. ForgeOS war der Name dafür, sie zu teilen. Die ehrliche Reihenfolge ist umgekehrt: erst ein Gewerk ausliefern, dann herausziehen, was sich wiederholt.',
    },
    architecture: {
      en: 'None. No code exists under this name.',
      de: 'Keine. Unter diesem Namen existiert kein Code.',
    },
    integrations: { en: 'Supported hardware: none.', de: 'Unterstützte Hardware: keine.' },
    license: { en: 'License: not applicable — nothing to license.', de: 'Lizenz: entfällt — nichts zu lizenzieren.' },
    commercial: {
      en: 'Commercial terms: none. Parked.',
      de: 'Kommerzielle Konditionen: keine. Geparkt.',
    },
    status: 'PARKED',
    faqs: [],
  },
];

export function getProduct(slug: string): ForgeProduct | undefined {
  return forgeLine.find((p) => p.slug === slug);
}

/** The Forge Line minus the wedge — what /forge indexes. */
export const forgeRest = forgeLine.filter((p) => p.slug !== 'palletizer');

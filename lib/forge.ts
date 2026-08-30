/**
 * The Forge Line — product registry and page content.
 *
 * Honesty contract (do not weaken):
 * - `status: 'shipped'` is allowed ONLY while it is true. Palletizer OS
 *   qualifies because its repository and live optimizer are public.
 * - Everything else is `repo-only` and MUST render as
 *   "Public repo — not a production deployment" until a real deployment exists.
 * - No invented customers, robots, metrics or case studies. Integration
 *   fields say "none yet" when that is the truth.
 */

import type { Localized } from './i18n';

export type ForgeStatus = 'shipped' | 'repo-only';

export type ForgeFaq = { q: Localized; a: Localized };

export type ForgeProduct = {
  slug: string;
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
  repo: string;
  demo?: string;
  status: ForgeStatus;
  faqs: ForgeFaq[];
};

export const forgeLine: ForgeProduct[] = [
  {
    slug: 'palletizer',
    name: 'Palletizer OS',
    trade: { en: 'Palletizing', de: 'Palettieren' },
    tagline: {
      en: 'A software foundation for high-throughput end-of-line palletizing cells, with a public mixed-SKU optimizer.',
      de: 'Eine Software-Basis für End-of-Line-Palettierzellen mit hohem Durchsatz — mit öffentlichem Misch-SKU-Optimierer.',
    },
    metaTitle: {
      en: 'Palletizer OS — Mixed-SKU Palletizing Software',
      de: 'Palletizer OS — Misch-SKU-Palettier-Software',
    },
    metaDescription: {
      en: 'Palletizer OS: open palletizing software for mixed-SKU end-of-line cells. Public repository, live pattern optimizer, vendor-neutral architecture. By Grimaldi Engineering, Frankfurt.',
      de: 'Palletizer OS: offene Palettier-Software für Misch-SKU-End-of-Line-Zellen. Öffentliches Repository, Live-Pattern-Optimierer, herstellerneutrale Architektur. Von Grimaldi Engineering, Frankfurt.',
    },
    problem: {
      en: 'Mixed-SKU palletizing is still solved cell by cell with vendor-locked teach pendants and brittle custom rigs. Changing a SKU mix means calling an integrator. Palletizer OS treats pattern generation and cell orchestration as software: versioned, testable, portable across lines.',
      de: 'Misch-SKU-Palettieren wird noch immer Zelle für Zelle gelöst — mit herstellergebundenen Teach-Pendants und fragilen Sonderaufbauten. Ein geänderter SKU-Mix heißt: Integrator anrufen. Palletizer OS behandelt Pattern-Erzeugung und Zellen-Orchestrierung als Software: versioniert, testbar, über Linien portierbar.',
    },
    architecture: {
      en: 'A pattern/optimization core (mixed-SKU stacking with stability constraints), a cell-orchestration layer, and a vendor-neutral driver interface intended to sit above specific robot arms and grippers. The mixed-SKU optimizer runs in the browser and is publicly deployed.',
      de: 'Ein Pattern-/Optimierungskern (Misch-SKU-Stapelung mit Stabilitäts-Constraints), eine Zellen-Orchestrierungsschicht und eine herstellerneutrale Treiber-Schnittstelle oberhalb konkreter Roboterarme und Greifer. Der Misch-SKU-Optimierer läuft im Browser und ist öffentlich deployt.',
    },
    integrations: {
      en: 'Supported robots and grippers: the driver interface is vendor-neutral by design, but no OEM robot or gripper integration is certified yet. If you run a specific arm, bring it to a bench review.',
      de: 'Unterstützte Roboter und Greifer: Die Treiber-Schnittstelle ist bewusst herstellerneutral, aber noch ist keine OEM-Roboter- oder Greifer-Integration zertifiziert. Wenn Sie einen konkreten Arm betreiben: bringen Sie ihn in ein Bench-Review mit.',
    },
    license: {
      en: 'License: see the repository. Commercial licensing for production use is agreed per project.',
      de: 'Lizenz: siehe Repository. Kommerzielle Lizenzierung für den Produktiveinsatz wird pro Projekt vereinbart.',
    },
    commercial: {
      en: 'Commercial terms: custom integration is scoped after a free 20-minute bench review. No integration is sold before the fit is proven on your SKU mix.',
      de: 'Kommerzielle Konditionen: Integrationen werden nach einem kostenlosen 20-Minuten-Bench-Review gescopet. Keine Integration wird verkauft, bevor der Fit an Ihrem SKU-Mix belegt ist.',
    },
    repo: 'https://github.com/iceccarelli/palletizer',
    demo: 'https://palletizer-app.vercel.app',
    status: 'shipped',
    faqs: [
      {
        q: { en: 'Is Palletizer OS production software?', de: 'Ist Palletizer OS Produktivsoftware?' },
        a: {
          en: 'The repository and the mixed-SKU optimizer are public and usable today. No OEM robot integration is certified yet; production deployments are scoped per project.',
          de: 'Repository und Misch-SKU-Optimierer sind öffentlich und heute nutzbar. Noch ist keine OEM-Roboter-Integration zertifiziert; Produktiveinsätze werden pro Projekt gescopet.',
        },
      },
      {
        q: { en: 'Which robots does it support?', de: 'Welche Roboter werden unterstützt?' },
        a: {
          en: 'The architecture is vendor-neutral, but no specific arm or gripper is certified yet. That status will change on this page — not before.',
          de: 'Die Architektur ist herstellerneutral, aber noch ist kein konkreter Arm oder Greifer zertifiziert. Dieser Status ändert sich auf dieser Seite — nicht vorher.',
        },
      },
      {
        q: { en: 'Can I try the optimizer?', de: 'Kann ich den Optimierer testen?' },
        a: {
          en: 'Yes — the mixed-SKU optimizer is deployed publicly and linked from this page. It runs in your browser.',
          de: 'Ja — der Misch-SKU-Optimierer ist öffentlich deployt und auf dieser Seite verlinkt. Er läuft im Browser.',
        },
      },
    ],
  },
  {
    slug: 'floorforge',
    name: 'FloorForge AI',
    trade: { en: 'Flooring', de: 'Bodenlegen' },
    tagline: {
      en: 'AI-native automation tooling for the flooring trade. Public repository, in active development.',
      de: 'KI-natives Automatisierungs-Tooling für das Bodenleger-Gewerk. Öffentliches Repository, in aktiver Entwicklung.',
    },
    metaTitle: {
      en: 'FloorForge AI — Flooring Trade Automation',
      de: 'FloorForge AI — Automatisierung für das Bodenleger-Gewerk',
    },
    metaDescription: {
      en: 'FloorForge AI: automation tooling for flooring contractors — layout, estimation and workflow software in the open. Public repo, not a production deployment. By Grimaldi Engineering.',
      de: 'FloorForge AI: Automatisierungs-Tooling für Bodenleger-Betriebe — Layout-, Kalkulations- und Workflow-Software, offen entwickelt. Öffentliches Repo, kein Produktiveinsatz. Von Grimaldi Engineering.',
    },
    problem: {
      en: 'Flooring is estimated on paper, laid out by eye, and scheduled by phone. Waste, rework and idle crews are priced in. FloorForge AI works toward software-first layout, estimation and job orchestration for mid-size flooring contractors.',
      de: 'Bodenlegen wird auf Papier kalkuliert, nach Augenmaß ausgelegt und per Telefon geplant. Verschnitt, Nacharbeit und wartende Kolonnen sind eingepreist. FloorForge AI arbeitet an software-getriebenem Layout, Kalkulation und Auftrags-Orchestrierung für mittelgroße Bodenleger-Betriebe.',
    },
    architecture: {
      en: 'Early-stage codebase, developed in the open. Current focus: layout/estimation primitives. Architecture claims will appear here only once the code backs them.',
      de: 'Codebasis in frühem Stadium, offen entwickelt. Aktueller Fokus: Layout-/Kalkulations-Primitiven. Architektur-Aussagen erscheinen hier erst, wenn der Code sie deckt.',
    },
    integrations: {
      en: 'Supported hardware: none yet.',
      de: 'Unterstützte Hardware: noch keine.',
    },
    license: {
      en: 'License: see the repository.',
      de: 'Lizenz: siehe Repository.',
    },
    commercial: {
      en: 'Commercial terms: not for sale yet. Flooring contractors who want to shape the pilot can join the waitlist or book a bench review.',
      de: 'Kommerzielle Konditionen: noch nicht im Verkauf. Bodenleger-Betriebe, die den Piloten mitprägen wollen, können sich auf die Warteliste setzen oder ein Bench-Review buchen.',
    },
    repo: 'https://github.com/iceccarelli/floorforge-ai',
    status: 'repo-only',
    faqs: [
      {
        q: { en: 'Can I buy FloorForge AI today?', de: 'Kann ich FloorForge AI heute kaufen?' },
        a: {
          en: 'No. It is a public repository under active development, not a production deployment. The waitlist gets one email when that changes.',
          de: 'Nein. Es ist ein öffentliches Repository in aktiver Entwicklung, kein Produktiveinsatz. Die Warteliste erhält eine E-Mail, wenn sich das ändert.',
        },
      },
      {
        q: { en: 'Who is it for?', de: 'Für wen ist es gedacht?' },
        a: {
          en: 'Mid-size flooring contractors who lose margin to estimation error, material waste and scheduling friction.',
          de: 'Mittelgroße Bodenleger-Betriebe, die Marge an Kalkulationsfehler, Materialverschnitt und Planungsreibung verlieren.',
        },
      },
    ],
  },
  {
    slug: 'paintforge',
    name: 'PaintForge AI',
    trade: { en: 'Painting', de: 'Malen' },
    tagline: {
      en: 'AI-native automation tooling for the painting trade. Public repository, in active development.',
      de: 'KI-natives Automatisierungs-Tooling für das Maler-Gewerk. Öffentliches Repository, in aktiver Entwicklung.',
    },
    metaTitle: {
      en: 'PaintForge AI — Painting Trade Automation',
      de: 'PaintForge AI — Automatisierung für das Maler-Gewerk',
    },
    metaDescription: {
      en: 'PaintForge AI: automation tooling for the painting trade, developed in the open. Public repo, not a production deployment. By Grimaldi Engineering.',
      de: 'PaintForge AI: Automatisierungs-Tooling für das Maler-Gewerk, offen entwickelt. Öffentliches Repo, kein Produktiveinsatz. Von Grimaldi Engineering.',
    },
    problem: {
      en: 'Surface prep, coverage estimation and job sequencing in the painting trade are experience-bound and rarely written down. PaintForge AI explores which of those steps become software.',
      de: 'Untergrund-Vorbereitung, Verbrauchskalkulation und Auftragsreihenfolge im Maler-Gewerk hängen an Erfahrung und stehen selten auf Papier. PaintForge AI erkundet, welche dieser Schritte Software werden.',
    },
    architecture: {
      en: 'Early-stage codebase, developed in the open. Architecture claims will appear here only once the code backs them.',
      de: 'Codebasis in frühem Stadium, offen entwickelt. Architektur-Aussagen erscheinen hier erst, wenn der Code sie deckt.',
    },
    integrations: { en: 'Supported hardware: none yet.', de: 'Unterstützte Hardware: noch keine.' },
    license: { en: 'License: see the repository.', de: 'Lizenz: siehe Repository.' },
    commercial: {
      en: 'Commercial terms: not for sale yet.',
      de: 'Kommerzielle Konditionen: noch nicht im Verkauf.',
    },
    repo: 'https://github.com/iceccarelli/paintforge-ai',
    status: 'repo-only',
    faqs: [
      {
        q: { en: 'Is PaintForge AI deployed anywhere?', de: 'Ist PaintForge AI irgendwo im Einsatz?' },
        a: {
          en: 'No. It is a public repository under active development — no production deployment exists.',
          de: 'Nein. Es ist ein öffentliches Repository in aktiver Entwicklung — es existiert kein Produktiveinsatz.',
        },
      },
    ],
  },
  {
    slug: 'dryforge',
    name: 'DryForge AI',
    trade: { en: 'Drying', de: 'Trocknen' },
    tagline: {
      en: 'AI-native automation for drying and climate workflows on site. Public repository, in active development.',
      de: 'KI-native Automatisierung für Trocknungs- und Klima-Abläufe auf der Baustelle. Öffentliches Repository, in aktiver Entwicklung.',
    },
    metaTitle: {
      en: 'DryForge AI — Site Drying & Climate Automation',
      de: 'DryForge AI — Baustellen-Trocknung & Klima-Automatisierung',
    },
    metaDescription: {
      en: 'DryForge AI: automation for site drying and climate workflows, developed in the open. Public repo, not a production deployment. By Grimaldi Engineering.',
      de: 'DryForge AI: Automatisierung für Baustellen-Trocknung und Klima-Abläufe, offen entwickelt. Öffentliches Repo, kein Produktiveinsatz. Von Grimaldi Engineering.',
    },
    problem: {
      en: 'Screed and water-damage drying runs on rented dehumidifiers, paper logs and gut feel — while energy is metered and deadlines are contractual. DryForge AI works toward measured, logged, automated drying workflows.',
      de: 'Estrich- und Wasserschaden-Trocknung läuft über gemietete Trockner, Papierprotokolle und Bauchgefühl — während Energie gemessen wird und Fristen vertraglich sind. DryForge AI arbeitet an gemessenen, protokollierten, automatisierten Trocknungs-Abläufen.',
    },
    architecture: {
      en: 'Early-stage codebase, developed in the open. Architecture claims will appear here only once the code backs them.',
      de: 'Codebasis in frühem Stadium, offen entwickelt. Architektur-Aussagen erscheinen hier erst, wenn der Code sie deckt.',
    },
    integrations: { en: 'Supported hardware: none yet.', de: 'Unterstützte Hardware: noch keine.' },
    license: { en: 'License: see the repository.', de: 'Lizenz: siehe Repository.' },
    commercial: {
      en: 'Commercial terms: not for sale yet.',
      de: 'Kommerzielle Konditionen: noch nicht im Verkauf.',
    },
    repo: 'https://github.com/iceccarelli/dryforge-ai',
    status: 'repo-only',
    faqs: [
      {
        q: { en: 'Is DryForge AI deployed anywhere?', de: 'Ist DryForge AI irgendwo im Einsatz?' },
        a: {
          en: 'No. It is a public repository under active development — no production deployment exists.',
          de: 'Nein. Es ist ein öffentliches Repository in aktiver Entwicklung — es existiert kein Produktiveinsatz.',
        },
      },
    ],
  },
];

export function getProduct(slug: string): ForgeProduct | undefined {
  return forgeLine.find((p) => p.slug === slug);
}

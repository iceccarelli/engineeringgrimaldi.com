/**
 * THE INFORMATION ARCHITECTURE SPINE.
 *
 * One registry, six top-level sections, modelled on the pattern AWS uses:
 * a small number of stable top-level categories, each with an index page
 * that never orphans its children, and a grouped menu that shows the
 * whole category at once instead of hiding it behind a scroll.
 *
 * Header, desktop mega-menu, mobile drawer, footer columns, breadcrumbs
 * and the XML sitemap ALL derive from this file. Adding a page here puts
 * it in every navigation surface at once; that is the point. Nothing on
 * this site should be reachable only by knowing its URL.
 *
 * Rule enforced by the structure itself: every section has an index
 * `path`, and every item lives under exactly one section.
 */

import type { Localized } from './i18n';

export type NavItem = {
  path: string;
  label: Localized;
  /** One line, shown in the mega-menu and on index pages. */
  blurb: Localized;
};

export type NavGroup = {
  label: Localized;
  items: NavItem[];
};

export type NavSection = {
  id: string;
  /** Index page for the whole section. Never orphan a category. */
  path: string;
  label: Localized;
  /** Shown at the top of the mega-menu and as the index page lead. */
  blurb: Localized;
  groups: NavGroup[];
};

export const NAV: NavSection[] = [
  {
    id: 'products',
    path: '/forge',
    label: { en: 'Products', de: 'Produkte' },
    blurb: {
      en: 'The Forge Line — one automation product per trade, code public, status stated plainly.',
      de: 'Die Forge-Linie — ein Automatisierungsprodukt pro Gewerk, Code öffentlich, Status klar benannt.',
    },
    groups: [
      {
        label: { en: 'Automation products', de: 'Automatisierungsprodukte' },
        items: [
          { path: '/forge/palletizer', label: { en: 'Palletizer OS', de: 'Palletizer OS' }, blurb: { en: 'Mixed-SKU palletizing software for end-of-line cells.', de: 'Misch-SKU-Palettiersoftware für End-of-Line-Zellen.' } },
          { path: '/forge/floorforge', label: { en: 'FloorForge AI', de: 'FloorForge AI' }, blurb: { en: 'Automation tooling for the flooring trade.', de: 'Automatisierungs-Tooling für das Bodenleger-Gewerk.' } },
          { path: '/forge/paintforge', label: { en: 'PaintForge AI', de: 'PaintForge AI' }, blurb: { en: 'Automation tooling for the painting trade.', de: 'Automatisierungs-Tooling für das Maler-Gewerk.' } },
          { path: '/forge/dryforge', label: { en: 'DryForge AI', de: 'DryForge AI' }, blurb: { en: 'Drying and climate workflows on site.', de: 'Trocknungs- und Klima-Abläufe auf der Baustelle.' } },
        ],
      },
    ],
  },
  {
    id: 'solutions',
    path: '/solutions',
    label: { en: 'Solutions', de: 'Lösungen' },
    blurb: {
      en: 'Start from your problem, not from our catalogue. Each route names the products, tools and capabilities that apply.',
      de: 'Beginnen Sie bei Ihrem Problem, nicht bei unserem Katalog. Jeder Weg nennt die passenden Produkte, Werkzeuge und Kompetenzen.',
    },
    groups: [
      {
        label: { en: 'By operation', de: 'Nach Betrieb' },
        items: [
          { path: '/solutions/packaging-end-of-line', label: { en: 'Packaging & end-of-line', de: 'Verpackung & End-of-Line' }, blurb: { en: 'Mixed-SKU palletizing, cube utilisation, vehicle fill.', de: 'Misch-SKU-Palettierung, Raumnutzung, Fahrzeugauslastung.' } },
          { path: '/solutions/machine-builders', label: { en: 'Machine builders & OEM', de: 'Maschinenbau & OEM' }, blurb: { en: 'Axis sizing, drive selection, control and bus architecture.', de: 'Achsenauslegung, Antriebswahl, Regelungs- und Busarchitektur.' } },
          { path: '/solutions/energy-storage', label: { en: 'Energy & storage', de: 'Energie & Speicher' }, blurb: { en: 'Battery pack architecture, BMS scope, grid-side physics.', de: 'Batteriepack-Architektur, BMS-Umfang, netzseitige Physik.' } },
          { path: '/solutions/trade-contractors', label: { en: 'Trade contractors', de: 'Handwerksbetriebe' }, blurb: { en: 'Flooring, painting and drying crews moving to software.', de: 'Bodenleger-, Maler- und Trocknungsbetriebe auf dem Weg zur Software.' } },
        ],
      },
    ],
  },
  {
    id: 'tools',
    path: '/tools',
    label: { en: 'Tools', de: 'Werkzeuge' },
    blurb: {
      en: 'Working calculators, not lead-capture forms. Everything runs in your browser and exports to CSV.',
      de: 'Arbeitende Rechner, keine Formulare zur Adressgewinnung. Alles läuft im Browser und geht als CSV heraus.',
    },
    groups: [
      {
        label: { en: 'Palletizing & logistics', de: 'Palettieren & Logistik' },
        items: [
          { path: '/tools/pallet-pattern-calculator', label: { en: 'Pallet pattern calculator', de: 'Palettenmuster-Rechner' }, blurb: { en: 'Cases per layer, layers, cube utilisation.', de: 'Kartons pro Lage, Lagen, Raumnutzung.' } },
          { path: '/tools/truck-load-calculator', label: { en: 'Truck & container load', de: 'Lkw- & Container-Ladung' }, blurb: { en: 'Pallets per trailer or container, payload limits.', de: 'Paletten pro Auflieger oder Container, Nutzlastgrenzen.' } },
          { path: '/tools/case-size-optimizer', label: { en: 'Case size optimizer', de: 'Kartongrößen-Optimierer' }, blurb: { en: 'Find the carton that fills the pallet.', de: 'Die Schachtel finden, die die Palette füllt.' } },
        ],
      },
      {
        label: { en: 'Machines, energy & control', de: 'Maschinen, Energie & Regelung' },
        items: [
          { path: '/tools/motor-sizing-calculator', label: { en: 'Servo motor sizing', de: 'Servomotor-Auslegung' }, blurb: { en: 'Reflected inertia, peak and RMS torque, speed.', de: 'Reduzierte Trägheit, Spitzen- und Effektivmoment, Drehzahl.' } },
          { path: '/tools/battery-pack-calculator', label: { en: 'Battery pack calculator', de: 'Batteriepack-Rechner' }, blurb: { en: 'S/P topology, C-rate, runtime, design flags.', de: 'S/P-Topologie, C-Rate, Laufzeit, Auslegungshinweise.' } },
          { path: '/tools/control-loop-calculator', label: { en: 'Control loop & fieldbus', de: 'Regelkreis & Feldbus' }, blurb: { en: 'Dead time, achievable bandwidth, bus load.', de: 'Totzeit, erreichbare Bandbreite, Buslast.' } },
        ],
      },
    ],
  },
  {
    id: 'capabilities',
    path: '/disciplines',
    label: { en: 'Capabilities', de: 'Kompetenzen' },
    blurb: {
      en: 'Six engineering tracks. Each states its scope, its boundary, and what has actually been published.',
      de: 'Sechs Ingenieursstränge. Jeder nennt Umfang, Grenze und was tatsächlich veröffentlicht ist.',
    },
    groups: [
      {
        label: { en: 'Machines & energy', de: 'Maschinen & Energie' },
        items: [
          { path: '/disciplines/machines-actuators', label: { en: 'Machines & actuators', de: 'Maschinen & Aktorik' }, blurb: { en: 'DC, AC, async and sync; rotors, joints, gearing.', de: 'DC, AC, asynchron und synchron; Rotoren, Gelenke, Getriebe.' } },
          { path: '/disciplines/battery-systems', label: { en: 'Battery systems & BMS', de: 'Batteriesysteme & BMS' }, blurb: { en: 'Pack architecture, management, safety boundaries.', de: 'Packarchitektur, Management, Sicherheitsgrenzen.' } },
          { path: '/disciplines/power-electronics', label: { en: 'Power electronics', de: 'Leistungselektronik' }, blurb: { en: 'Inverters, converters, switching hardware.', de: 'Wechselrichter, Umrichter, Schalt-Hardware.' } },
        ],
      },
      {
        label: { en: 'Control & infrastructure', de: 'Regelung & Infrastruktur' },
        items: [
          { path: '/disciplines/control-integration', label: { en: 'Control & integration', de: 'Regelung & Integration' }, blurb: { en: 'Determinism, motion, fieldbus, the agent boundary.', de: 'Determinismus, Bewegung, Feldbus, die Agentengrenze.' } },
          { path: '/disciplines/embedded', label: { en: 'Embedded control', de: 'Embedded-Regelung' }, blurb: { en: 'Deterministic controllers, RTOS, hardware-in-the-loop.', de: 'Deterministische Regler, RTOS, Hardware-in-the-Loop.' } },
          { path: '/disciplines/high-voltage', label: { en: 'High voltage', de: 'Hochspannung' }, blurb: { en: 'Traction power, protection and measurement chains.', de: 'Bahnstrom, Schutz- und Messketten.' } },
        ],
      },
    ],
  },
  {
    id: 'pricing',
    path: '/pricing',
    label: { en: 'Pricing', de: 'Preise' },
    blurb: {
      en: 'What things cost, stated before you ask. Free tools stay free; engagements are priced in the open.',
      de: 'Was Dinge kosten, genannt bevor Sie fragen. Kostenlose Werkzeuge bleiben kostenlos; Leistungen sind offen bepreist.',
    },
    groups: [
      {
        label: { en: 'Engagements', de: 'Leistungen' },
        items: [
          { path: '/pricing', label: { en: 'Rates & engagements', de: 'Sätze & Leistungen' }, blurb: { en: 'Bench review, deep-dive session, retainer, integration.', de: 'Bench-Review, Deep-Dive-Session, Retainer, Integration.' } },
          { path: '/book', label: { en: 'Book a bench review', de: 'Bench-Review buchen' }, blurb: { en: 'Twenty minutes, €0, no slides.', de: 'Zwanzig Minuten, 0 €, keine Folien.' } },
        ],
      },
    ],
  },
  {
    id: 'resources',
    path: '/resources',
    label: { en: 'Resources', de: 'Ressourcen' },
    blurb: {
      en: 'Reference data with its sources named, and the lab where instruments and build logs live.',
      de: 'Referenzdaten mit genannten Quellen und das Labor, in dem Instrumente und Baujournale leben.',
    },
    groups: [
      {
        label: { en: 'Reference', de: 'Referenz' },
        items: [
          { path: '/reference/pallet-sizes', label: { en: 'Pallet sizes & standards', de: 'Palettenmaße & Normen' }, blurb: { en: 'EPAL 1–6 and 48×40, with sources cited.', de: 'EPAL 1–6 und 48×40, mit Quellenangabe.' } },
          { path: '/reference/container-dimensions', label: { en: 'Container dimensions', de: 'Container-Abmessungen' }, blurb: { en: '20 ft, 40 ft, high cube — and pallets per unit.', de: '20 Fuß, 40 Fuß, High Cube — und Paletten je Einheit.' } },
        ],
      },
      {
        label: { en: 'Lab', de: 'Labor' },
        items: [
          { path: '/lab', label: { en: 'Lab index', de: 'Labor-Übersicht' }, blurb: { en: 'Instruments and build logs as they ship.', de: 'Instrumente und Baujournale, sobald sie erscheinen.' } },
          { path: '/lab/grid-droop', label: { en: 'Grid droop instrument', de: 'Netz-Statik-Instrument' }, blurb: { en: 'A real frequency-droop model you can drag.', de: 'Ein echtes Frequenz-Statik-Modell zum Ziehen.' } },
        ],
      },
    ],
  },
];

/** Every item path in the tree, including section index pages. */
export function allNavPaths(): string[] {
  const paths = new Set<string>();
  for (const section of NAV) {
    paths.add(section.path);
    for (const group of section.groups) {
      for (const item of group.items) paths.add(item.path);
    }
  }
  return Array.from(paths);
}

export function findSection(id: string): NavSection | undefined {
  return NAV.find((s) => s.id === id);
}

/** The section a path belongs to — drives breadcrumbs without hand-wiring. */
export function sectionForPath(path: string): NavSection | undefined {
  return NAV.find(
    (s) =>
      s.path === path ||
      s.groups.some((g) => g.items.some((i) => i.path === path)) ||
      (s.path !== '/' && path.startsWith(`${s.path}/`)),
  );
}

/** Legal and identity links — footer only, never in the main nav. */
export const LEGAL_PATHS = ['/impressum', '/datenschutz'] as const;

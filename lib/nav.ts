/**
 * THE INFORMATION ARCHITECTURE SPINE.
 *
 * One registry, six top-level sections, modelled on the pattern AWS uses:
 * (Products = Palletizer first. PaintForge, DryForge and ForgeOS are NOT
 * in this registry on purpose: they are reachable only via /forge, so they
 * are always two clicks away and never one. The sitemap adds them.)
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
    path: '/palletizer',
    label: { en: 'Palletizer', de: 'Palletizer' },
    blurb: {
      en: 'The one product on the hero: a mixed-SKU pallet optimizer with a stability number you can check. Everything else in the Forge Line sits behind the index, with its status in capitals.',
      de: 'Das eine Produkt auf der Startseite: ein Misch-SKU-Palettenoptimierer mit einer Stabilitätszahl, die Sie nachrechnen können. Alles andere in der Forge-Linie steht hinter dem Index, mit Status in Großbuchstaben.',
    },
    groups: [
      {
        label: { en: 'Shipped', de: 'Ausgeliefert' },
        items: [
          { path: '/palletizer', label: { en: 'Palletizer OS', de: 'Palletizer OS' }, blurb: { en: 'What ships, what does not, robot-OEM honesty, the 30-day pilot.', de: 'Was ausgeliefert ist, was nicht, Roboter-OEM-Ehrlichkeit, der 30-Tage-Pilot.' } },
          { path: '/proof', label: { en: 'Proof', de: 'Nachweis' }, blurb: { en: 'Fixture results and the slot for SKU before/after PDFs.', de: 'Fixture-Ergebnisse und der Platz für SKU-Vorher/Nachher-PDFs.' } },
        ],
      },
      {
        label: { en: 'The rest of the line', de: 'Der Rest der Linie' },
        items: [
          { path: '/forge', label: { en: 'Forge Line index', de: 'Forge-Linie — Index' }, blurb: { en: 'FloorForge, PaintForge, DryForge, ForgeOS — with brutal status badges.', de: 'FloorForge, PaintForge, DryForge, ForgeOS — mit schonungslosen Status-Badges.' } },
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
    label: { en: 'Disciplines', de: 'Disziplinen' },
    blurb: {
      en: 'Six engineering tracks. Each states its scope, its boundary, and — in red — that no instrument log has been published yet.',
      de: 'Sechs Ingenieursstränge. Jeder nennt Umfang, Grenze und — in Rot — dass noch kein Instrumenten-Journal veröffentlicht ist.',
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
      en: 'The pilot first, then the teardown. Stated before you ask; the calculators stay free.',
      de: 'Erst der Pilot, dann der Teardown. Genannt, bevor Sie fragen; die Rechner bleiben kostenlos.',
    },
    groups: [
      {
        label: { en: 'Engagements', de: 'Leistungen' },
        items: [
          { path: '/pricing', label: { en: 'Pilot & teardown', de: 'Pilot & Teardown' }, blurb: { en: '30-day software pilot with a kill date; €280 packaging teardown.', de: '30-Tage-Software-Pilot mit Abbruchdatum; 280 € Verpackungs-Teardown.' } },
          { path: '/connect', label: { en: 'Connect', de: 'Kontakt' }, blurb: { en: 'One address, two subject lines.', de: 'Eine Adresse, zwei Betreffzeilen.' } },
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
      en: 'Reference data with its sources named, the lab, and the pointers to the rest of the network.',
      de: 'Referenzdaten mit genannten Quellen, das Labor und die Verweise auf den Rest des Netzwerks.',
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
        label: { en: 'Lab & network', de: 'Labor & Netzwerk' },
        items: [
          { path: '/lab', label: { en: 'Lab', de: 'Labor' }, blurb: { en: 'The droop instrument, the parked OEM dreams, the banned slogans.', de: 'Das Statik-Instrument, die geparkten OEM-Träume, die verbotenen Slogans.' } },
          { path: '/lab/grid-droop', label: { en: 'Grid droop instrument', de: 'Netz-Statik-Instrument' }, blurb: { en: 'A real frequency-droop model you can drag.', de: 'Ein echtes Frequenz-Statik-Modell zum Ziehen.' } },
          { path: '/network', label: { en: 'Network', de: 'Netzwerk' }, blurb: { en: 'igrimaldi.engineering, grimaldi.ca, GitHub — one line each.', de: 'igrimaldi.engineering, grimaldi.ca, GitHub — je eine Zeile.' } },
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
      (s.path !== '/' && path.startsWith(`${s.path}/`)) ||
      s.groups.some((g) => g.items.some((i) => path.startsWith(`${i.path}/`))),
  );
}

/** Legal and identity links — footer only, never in the main nav. */
export const LEGAL_PATHS = ['/impressum', '/datenschutz'] as const;

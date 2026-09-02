/**
 * THE INFORMATION ARCHITECTURE SPINE.
 *
 * Five top-level items, one product per URL. Header, mobile drawer,
 * footer and the XML sitemap all derive from this file. Nothing that is
 * not listed here is linked from the header or the home page.
 *
 * Parked routes (still HTTP 200, deliberately unlisted): /forge, /lab,
 * /disciplines, /solutions, /pricing, /resources, /about, and the
 * motor / battery / control-loop calculators. They keep their URLs; they
 * are not the business.
 */

import type { Localized } from './i18n';

export type NavItem = {
  path: string;
  label: Localized;
  /** One line, shown in the menu and on index pages. */
  blurb: Localized;
};

export type NavGroup = {
  label: Localized;
  items: NavItem[];
};

export type NavSection = {
  id: string;
  /** Index page for the section. */
  path: string;
  label: Localized;
  blurb: Localized;
  groups: NavGroup[];
};

export const NAV: NavSection[] = [
  {
    id: 'product',
    path: '/palletizer',
    label: { en: 'Product', de: 'Produkt' },
    blurb: {
      en: 'Mixed-SKU palletizing software: planner, state machine, robot adapters.',
      de: 'Mixed-SKU-Palettiersoftware: Planer, Zustandsautomat, Roboter-Adapter.',
    },
    groups: [
      {
        label: { en: 'Palletizer', de: 'Palletizer' },
        items: [
          { path: '/palletizer', label: { en: 'Palletizer', de: 'Palletizer' }, blurb: { en: 'Stack a SKU list, read stability and density, export a URScript stub.', de: 'SKU-Liste stapeln, Stabilität und Dichte lesen, URScript-Stub exportieren.' } },
          { path: '/docs', label: { en: 'Docs', de: 'Dokumentation' }, blurb: { en: 'CSV format, units, fault codes, IDLE · RUN · HOLD · FAULT.', de: 'CSV-Format, Einheiten, Fehlercodes, IDLE · RUN · HOLD · FAULT.' } },
        ],
      },
    ],
  },
  {
    id: 'integrators',
    path: '/integrators',
    label: { en: 'Integrators', de: 'Integratoren' },
    blurb: {
      en: 'You keep CE, fence, service and the customer. We supply the planner, the state-machine doc, a gripper class and an acceptance test.',
      de: 'Sie behalten CE, Zaun, Service und den Kunden. Wir liefern Planer, Zustandsautomat-Dokumentation, Greiferklasse und Abnahmetest.',
    },
    groups: [],
  },
  {
    id: 'tools',
    path: '/tools',
    label: { en: 'Tools', de: 'Werkzeuge' },
    blurb: {
      en: 'Pallet, case and truck calculators plus reference tables. Browser only, CSV out, no sign-up.',
      de: 'Paletten-, Karton- und Lkw-Rechner plus Referenztabellen. Nur im Browser, CSV-Export, ohne Anmeldung.',
    },
    groups: [
      {
        label: { en: 'Calculators', de: 'Rechner' },
        items: [
          { path: '/tools/pallet-pattern-calculator', label: { en: 'Pallet pattern', de: 'Palettenmuster' }, blurb: { en: 'Cases per layer, layers, cube utilisation.', de: 'Kartons pro Lage, Lagen, Raumnutzung.' } },
          { path: '/tools/case-size-optimizer', label: { en: 'Case size', de: 'Kartongröße' }, blurb: { en: 'Which carton fills the pallet.', de: 'Welcher Karton die Palette füllt.' } },
          { path: '/tools/truck-load-calculator', label: { en: 'Truck & container load', de: 'Lkw- & Container-Ladung' }, blurb: { en: 'Pallets per trailer or container, payload limits.', de: 'Paletten pro Auflieger oder Container, Nutzlastgrenzen.' } },
        ],
      },
      {
        label: { en: 'Reference', de: 'Referenz' },
        items: [
          { path: '/reference/pallet-sizes', label: { en: 'Pallet sizes', de: 'Palettenmaße' }, blurb: { en: 'EPAL 1–6 and 48×40, sources cited.', de: 'EPAL 1–6 und 48×40, mit Quellen.' } },
          { path: '/reference/container-dimensions', label: { en: 'Container dimensions', de: 'Container-Abmessungen' }, blurb: { en: '20 ft, 40 ft, high cube — and pallets per unit.', de: '20 Fuß, 40 Fuß, High Cube — und Paletten je Einheit.' } },
        ],
      },
    ],
  },
  {
    id: 'work',
    path: '/work',
    label: { en: 'Work', de: 'Referenzen' },
    blurb: {
      en: 'Commissioned cells, published only once they run.',
      de: 'In Betrieb genommene Zellen — veröffentlicht erst, wenn sie laufen.',
    },
    groups: [],
  },
  {
    id: 'contact',
    path: '/contact',
    label: { en: 'Contact', de: 'Kontakt' },
    blurb: {
      en: 'Send a SKU list. You get a stack and the unstable SKUs back.',
      de: 'SKU-Liste senden. Sie erhalten einen Stapel und die instabilen SKUs zurück.',
    },
    groups: [],
  },
];

/**
 * Parked sections: still rendered at their own URLs (HTTP 200, noindex),
 * never in the header, home, footer or sitemap.
 */
export const PARKED: NavSection[] = [
  {
    id: 'capabilities',
    path: '/disciplines',
    label: { en: 'Disciplines', de: 'Disziplinen' },
    blurb: {
      en: 'Parked engineering notes. No build log published; nothing here is for sale.',
      de: 'Geparkte Ingenieursnotizen. Kein Baujournal veröffentlicht; nichts hiervon ist im Verkauf.',
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
          { path: '/disciplines/control-integration', label: { en: 'Control & integration', de: 'Regelung & Integration' }, blurb: { en: 'Determinism, motion, fieldbus.', de: 'Determinismus, Bewegung, Feldbus.' } },
          { path: '/disciplines/embedded', label: { en: 'Embedded control', de: 'Embedded-Regelung' }, blurb: { en: 'Deterministic controllers, RTOS, hardware-in-the-loop.', de: 'Deterministische Regler, RTOS, Hardware-in-the-Loop.' } },
          { path: '/disciplines/high-voltage', label: { en: 'High voltage', de: 'Hochspannung' }, blurb: { en: 'Traction power, protection and measurement chains.', de: 'Bahnstrom, Schutz- und Messketten.' } },
        ],
      },
    ],
  },
  {
    id: 'resources',
    path: '/resources',
    label: { en: 'Resources', de: 'Ressourcen' },
    blurb: {
      en: 'Reference data with its sources named, and the lab instrument.',
      de: 'Referenzdaten mit genannten Quellen und das Labor-Instrument.',
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
          { path: '/lab', label: { en: 'Lab index', de: 'Labor-Übersicht' }, blurb: { en: 'Instruments, as they exist.', de: 'Instrumente, soweit vorhanden.' } },
          { path: '/lab/grid-droop', label: { en: 'Grid droop instrument', de: 'Netz-Statik-Instrument' }, blurb: { en: 'A frequency-droop model you can drag.', de: 'Ein Frequenz-Statik-Modell zum Ziehen.' } },
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
  return NAV.find((s) => s.id === id) ?? PARKED.find((s) => s.id === id);
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

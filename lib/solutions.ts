/**
 * Solutions — the buyer-first route into the catalogue.
 *
 * Products are organised the way the work is organised; solutions are
 * organised the way a buyer arrives. Each entry names the concrete
 * problem, then routes to the products, tools and capabilities that
 * actually apply — no page here invents a capability the site cannot
 * back, and none of them claims a customer.
 */

import type { Localized } from './i18n';

export type Solution = {
  slug: string;
  label: Localized;
  metaTitle: Localized;
  metaDescription: Localized;
  audience: Localized;
  problem: Localized[];
  /** Paths into products, tools and capabilities. */
  routes: { path: string; label: Localized; note: Localized }[];
  /** What a first conversation would cover. */
  firstStep: Localized;
};

export const solutions: Solution[] = [
  {
    slug: 'packaging-end-of-line',
    label: { en: 'Packaging & end-of-line', de: 'Verpackung & End-of-Line' },
    metaTitle: {
      en: 'Packaging & End-of-Line Automation — Palletizing, Cube and Vehicle Fill',
      de: 'Verpackungs- & End-of-Line-Automatisierung — Palettieren, Raumnutzung, Fahrzeugauslastung',
    },
    metaDescription: {
      en: 'For packaging and end-of-line engineering managers: mixed-SKU palletizing software, pallet pattern and case-size optimisation, and vehicle load planning. Free calculators, honest product status.',
      de: 'Für Verpackungs- und End-of-Line-Verantwortliche: Misch-SKU-Palettiersoftware, Palettenmuster- und Kartongrößen-Optimierung sowie Fahrzeug-Ladeplanung. Kostenlose Rechner, ehrlicher Produktstatus.',
    },
    audience: {
      en: 'Packaging engineering, end-of-line and plant engineering managers.',
      de: 'Verpackungstechnik, End-of-Line- und Werksleitung.',
    },
    problem: [
      {
        en: 'Mixed-SKU palletizing is still solved cell by cell with vendor-locked pendants and brittle custom rigs, so a changed SKU mix means calling an integrator. Meanwhile the cube you actually ship is decided years earlier by a carton spec nobody revisits.',
        de: 'Misch-SKU-Palettieren wird noch Zelle für Zelle mit herstellergebundenen Pendants und fragilen Sonderaufbauten gelöst — ein geänderter SKU-Mix heißt: Integrator anrufen. Zugleich entscheidet über den tatsächlich versendeten Raum eine Kartonspezifikation, die Jahre zuvor festgelegt und nie wieder geprüft wurde.',
      },
      {
        en: 'The chain is measurable end to end: case size sets cases per layer, the layer pattern sets pallet cube, and pallet footprint sets how many units cross the dock. Every step has a calculator on this site, and the gap between them is usually where the money sits.',
        de: 'Die Kette ist durchgängig messbar: Das Kartonmaß bestimmt die Kartons pro Lage, das Lagenmuster den Palettenraum und die Palettengrundfläche, wie viele Einheiten über die Rampe gehen. Für jeden Schritt gibt es hier einen Rechner — und in der Lücke dazwischen liegt meist das Geld.',
      },
    ],
    routes: [
      { path: '/tools/case-size-optimizer', label: { en: 'Case size optimizer', de: 'Kartongrößen-Optimierer' }, note: { en: 'Start here: the case decision is the expensive one.', de: 'Hier starten: Die Kartonentscheidung ist die teure.' } },
      { path: '/tools/pallet-pattern-calculator', label: { en: 'Pallet pattern calculator', de: 'Palettenmuster-Rechner' }, note: { en: 'Cases per layer and cube for a given case.', de: 'Kartons pro Lage und Raumnutzung für ein Maß.' } },
      { path: '/tools/truck-load-calculator', label: { en: 'Truck & container load', de: 'Lkw- & Container-Ladung' }, note: { en: 'Whether space or payload limits the shipment.', de: 'Ob Platz oder Nutzlast die Sendung begrenzt.' } },
      { path: '/palletizer', label: { en: 'Palletizer OS', de: 'Palletizer OS' }, note: { en: 'The optimizer that ships, and the 30-day pilot with a kill date.', de: 'Der Optimierer, der ausgeliefert ist, und der 30-Tage-Pilot mit Abbruchdatum.' } },
    ],
    firstStep: {
      en: 'Bring a SKU mix and a cell layout. Twenty minutes is enough to see whether the constraint is the pattern, the carton, or the cell.',
      de: 'Bringen Sie einen SKU-Mix und ein Zellenlayout mit. Zwanzig Minuten genügen, um zu sehen, ob das Muster, der Karton oder die Zelle die Grenze setzt.',
    },
  },
  {
    slug: 'machine-builders',
    label: { en: 'Machine builders & OEM', de: 'Maschinenbau & OEM' },
    metaTitle: {
      en: 'Machine Builders & OEM — Axis Sizing, Drives, Control Architecture',
      de: 'Maschinenbau & OEM — Achsenauslegung, Antriebe, Regelungsarchitektur',
    },
    metaDescription: {
      en: 'For machine builders and OEMs: rotary axis and servo sizing, machine selection across DC, async and sync, control loop and fieldbus budgets, and the agent boundary in automation software.',
      de: 'Für Maschinenbauer und OEMs: Dreh- und Servoachsen-Auslegung, Maschinenauswahl über DC, Asynchron und Synchron, Regelkreis- und Feldbus-Budgets sowie die Agentengrenze in Automatisierungssoftware.',
    },
    audience: {
      en: 'Mechanical and controls engineering in machine building, special-purpose machinery and robotics integration.',
      de: 'Konstruktion und Steuerungstechnik im Maschinenbau, Sondermaschinenbau und in der Roboterintegration.',
    },
    problem: [
      {
        en: 'A cell is only as capable as its worst-sized axis, and the two decisions that cap it — gear ratio and where the loop closes — are usually made before anyone computes reflected inertia or dead time. Both then present as tuning problems that tuning cannot fix.',
        de: 'Eine Zelle ist nur so leistungsfähig wie ihre am schlechtesten ausgelegte Achse, und die beiden begrenzenden Entscheidungen — Übersetzung und Ort des Regelkreisschlusses — fallen meist, bevor jemand reduzierte Trägheit oder Totzeit berechnet. Beide erscheinen später als Einstellprobleme, die sich nicht einstellen lassen.',
      },
      {
        en: 'The same applies to the bus: axis count times process data over line rate decides how many joints one controller coordinates, and that number quietly constrains the architecture long before commissioning.',
        de: 'Für den Bus gilt dasselbe: Achsenzahl mal Prozessdaten über die Übertragungsrate bestimmt, wie viele Gelenke eine Steuerung koordiniert — diese Zahl beschränkt die Architektur still, lange vor der Inbetriebnahme.',
      },
    ],
    routes: [
      { path: '/tools/motor-sizing-calculator', label: { en: 'Servo motor sizing', de: 'Servomotor-Auslegung' }, note: { en: 'Reflected inertia, RMS torque, regeneration.', de: 'Reduzierte Trägheit, Effektivmoment, Rückspeisung.' } },
      { path: '/tools/control-loop-calculator', label: { en: 'Control loop & fieldbus', de: 'Regelkreis & Feldbus' }, note: { en: 'Dead time, achievable bandwidth, axes per cycle.', de: 'Totzeit, erreichbare Bandbreite, Achsen pro Zyklus.' } },
      { path: '/disciplines/machines-actuators', label: { en: 'Machines & actuators', de: 'Maschinen & Aktorik' }, note: { en: 'DC, AC, async and sync selection.', de: 'Auswahl über DC, AC, asynchron und synchron.' } },
      { path: '/disciplines/control-integration', label: { en: 'Control & integration', de: 'Regelung & Integration' }, note: { en: 'Determinism, motion, and where agents stop.', de: 'Determinismus, Bewegung und wo Agenten aufhören.' } },
    ],
    firstStep: {
      en: 'Bring an axis: payload, arm, gearbox, duty cycle. The sizing sheet usually settles whether the fix is the gearbox, the profile or the topology.',
      de: 'Bringen Sie eine Achse mit: Nutzlast, Arm, Getriebe, Arbeitszyklus. Das Auslegungsblatt klärt meist, ob Getriebe, Profil oder Topologie die Lösung ist.',
    },
  },
  {
    slug: 'energy-storage',
    label: { en: 'Energy & storage', de: 'Energie & Speicher' },
    metaTitle: {
      en: 'Energy & Storage — Battery Pack Architecture, BMS Scope, Grid Physics',
      de: 'Energie & Speicher — Batteriepack-Architektur, BMS-Umfang, Netzphysik',
    },
    metaDescription: {
      en: 'For energy and storage teams: pack topology and C-rate headroom, the voltage thresholds that change your obligations, BMS scope, plus high-voltage and grid-frequency physics.',
      de: 'Für Energie- und Speicherteams: Packtopologie und C-Raten-Reserve, die Spannungsschwellen, die Ihre Pflichten ändern, BMS-Umfang sowie Hochspannungs- und Netzfrequenzphysik.',
    },
    audience: {
      en: 'Storage system design, electrification projects, and grid-side engineering.',
      de: 'Speichersystem-Auslegung, Elektrifizierungsprojekte und netzseitige Technik.',
    },
    problem: [
      {
        en: 'First-pass pack designs are rarely wrong about energy. They are wrong about C-rate, about headroom once cells age, or about the voltage class they landed in — and the third one changes insulation, interlocks and who is legally allowed to touch the machine.',
        de: 'Erste Packentwürfe irren selten bei der Energie. Sie irren bei der C-Rate, bei der Reserve nach Alterung oder bei der Spannungsklasse, in der sie gelandet sind — und Letzteres ändert Isolation, Verriegelungen und wer die Maschine rechtlich berühren darf.',
      },
      {
        en: 'On the grid side the same discipline applies: frequency behaviour under load follows droop and inertia, not intuition, and the instrument on this site integrates the actual equations rather than animating a plausible curve.',
        de: 'Netzseitig gilt dieselbe Disziplin: Das Frequenzverhalten unter Last folgt Statik und Trägheit, nicht der Intuition — und das Instrument auf dieser Seite integriert die echten Gleichungen, statt eine plausible Kurve zu animieren.',
      },
    ],
    routes: [
      { path: '/tools/battery-pack-calculator', label: { en: 'Battery pack calculator', de: 'Batteriepack-Rechner' }, note: { en: 'Topology, C-rate, runtime and design flags.', de: 'Topologie, C-Rate, Laufzeit und Auslegungshinweise.' } },
      { path: '/disciplines/battery-systems', label: { en: 'Battery systems & BMS', de: 'Batteriesysteme & BMS' }, note: { en: 'What a BMS specification has to carry.', de: 'Was eine BMS-Spezifikation tragen muss.' } },
      { path: '/disciplines/high-voltage', label: { en: 'High voltage', de: 'Hochspannung' }, note: { en: 'Generic HV engineering, boundary stated.', de: 'Generische HV-Technik, Grenze benannt.' } },
      { path: '/lab/grid-droop', label: { en: 'Grid droop instrument', de: 'Netz-Statik-Instrument' }, note: { en: 'Droop and RoCoF, integrated live.', de: 'Statik und RoCoF, live integriert.' } },
    ],
    firstStep: {
      en: 'Bring a cell datasheet and a load profile. Topology is cheap to change on a spreadsheet and expensive after a BMS is specified around it.',
      de: 'Bringen Sie ein Zelldatenblatt und ein Lastprofil mit. Topologie ist in der Tabelle billig zu ändern und teuer, sobald eine BMS darauf ausgelegt ist.',
    },
  },
  {
    slug: 'trade-contractors',
    label: { en: 'Trade contractors', de: 'Handwerksbetriebe' },
    metaTitle: {
      en: 'Trade Contractors — Flooring, Painting and Drying Automation',
      de: 'Handwerksbetriebe — Automatisierung für Boden, Malerei und Trocknung',
    },
    metaDescription: {
      en: 'For mid-size flooring, painting and drying contractors: where the Forge Line is heading, what exists today as public code, and what is honestly not for sale yet.',
      de: 'Für mittelgroße Bodenleger-, Maler- und Trocknungsbetriebe: wohin die Forge-Linie geht, was heute als öffentlicher Code existiert und was ehrlich gesagt noch nicht verkäuflich ist.',
    },
    audience: {
      en: 'Owners and operations leads at mid-size trade contracting firms.',
      de: 'Inhaber und Betriebsleitung mittelgroßer Handwerksbetriebe.',
    },
    problem: [
      {
        en: 'Estimation on paper, layout by eye, scheduling by phone: waste, rework and idle crews are priced in as a cost of doing business rather than treated as a software problem.',
        de: 'Kalkulation auf Papier, Auslegung nach Augenmaß, Planung per Telefon: Verschnitt, Nacharbeit und wartende Kolonnen gelten als Betriebskosten statt als Softwareproblem.',
      },
      {
        en: 'Being direct about status: FloorForge is IN DEVELOPMENT (its README: no shipped hardware or production software yet). PaintForge and DryForge are PARKED. None is a production deployment or for sale today. If that changes, it changes on their product pages first.',
        de: 'Klar zum Status: FloorForge ist IN ENTWICKLUNG (laut README: noch keine ausgelieferte Hardware und keine Produktivsoftware). PaintForge und DryForge sind GEPARKT. Keines ist ein Produktiveinsatz oder heute verkäuflich. Ändert sich das, ändert es sich zuerst auf ihren Produktseiten.',
      },
    ],
    routes: [
      { path: '/forge/floorforge', label: { en: 'FloorForge AI', de: 'FloorForge AI' }, note: { en: 'Flooring — IN DEVELOPMENT.', de: 'Boden — IN ENTWICKLUNG.' } },
      { path: '/forge/paintforge', label: { en: 'PaintForge AI', de: 'PaintForge AI' }, note: { en: 'Painting — PARKED.', de: 'Malerei — GEPARKT.' } },
      { path: '/forge/dryforge', label: { en: 'DryForge AI', de: 'DryForge AI' }, note: { en: 'Drying — PARKED.', de: 'Trocknung — GEPARKT.' } },
      { path: '/forge', label: { en: 'The Forge Line', de: 'Die Forge-Linie' }, note: { en: 'How the whole line is being built.', de: 'Wie die gesamte Linie entsteht.' } },
    ],
    firstStep: {
      en: 'If you want to shape a pilot rather than buy a finished product, a bench review is the honest starting point.',
      de: 'Wenn Sie einen Piloten mitgestalten statt ein fertiges Produkt kaufen wollen, ist ein Bench-Review der ehrliche Anfang.',
    },
  },
];

export function getSolution(slug: string): Solution | undefined {
  return solutions.find((s) => s.slug === slug);
}

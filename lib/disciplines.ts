/**
 * Discipline registry — the three hardware tracks.
 *
 * Legal boundary (do not weaken): the operator works on German rail
 * infrastructure. NOTHING on this site describes DB InfraGO, KRITIS or
 * rail-asset internals. Public HV content is generic engineering,
 * owned material, or explicitly cleared. Each page states this boundary.
 */

import type { Localized } from './i18n';

export type Discipline = {
  slug: string;
  tag: Localized;
  title: Localized;
  metaTitle: Localized;
  metaDescription: Localized;
  body: Localized[];
  boundary?: Localized;
  /** Render the synchronous-speed reference table on this page. */
  syncTable?: boolean;
  /** Optional link to a tool that demonstrates this discipline. */
  tool?: { path: string; label: Localized };
};

export const disciplines: Discipline[] = [
  {
    slug: 'high-voltage',
    tag: { en: 'High Voltage', de: 'Hochspannung' },
    title: { en: 'High-voltage systems', de: 'Hochspannungssysteme' },
    metaTitle: {
      en: 'High-Voltage Systems & Traction Digitalisation',
      de: 'Hochspannungssysteme & Bahnstrom-Digitalisierung',
    },
    metaDescription: {
      en: 'Generic high-voltage engineering: traction power principles, protection and measurement chains, digitalisation of HV assets. Build logs with instrument captures — first log in preparation. No operator internals.',
      de: 'Generische Hochspannungstechnik: Bahnstrom-Grundlagen, Schutz- und Messketten, Digitalisierung von HV-Anlagen. Baujournale mit Instrumenten-Messungen — erstes Journal in Vorbereitung. Keine Betreiber-Interna.',
    },
    body: [
      {
        en: 'Traction power, substation-class hardware, protection and measurement chains: this track documents the energy layer with generic, owned material — schematics drawn for this site, measurements taken on this bench.',
        de: 'Bahnstrom, Hardware der Unterwerks-Klasse, Schutz- und Messketten: Dieser Strang dokumentiert die Energieebene mit generischem, eigenem Material — Schaltpläne für diese Seite gezeichnet, Messungen an dieser Werkbank genommen.',
      },
      {
        en: 'Every future log opens with design intent and simulation, continues with real instrument captures, and keeps the failure notes in the record.',
        de: 'Jedes künftige Journal beginnt mit Designabsicht und Simulation, fährt mit echten Instrumenten-Messungen fort und behält die Fehlernotizen im Protokoll.',
      },
    ],
    boundary: {
      en: 'Boundary: nothing published here describes rail-operator systems, critical-infrastructure configurations or employer internals. Public HV content on this site is generic engineering or explicitly cleared material.',
      de: 'Grenze: Nichts, was hier erscheint, beschreibt Systeme von Bahnbetreibern, KRITIS-Konfigurationen oder Arbeitgeber-Interna. Öffentliche HV-Inhalte auf dieser Seite sind generische Ingenieursarbeit oder ausdrücklich freigegebenes Material.',
    },
  },
  {
    slug: 'machines-actuators',
    tag: { en: 'Machines & Actuators', de: 'Maschinen & Aktorik' },
    title: { en: 'Electrical machines and actuators', de: 'Elektrische Maschinen und Aktorik' },
    metaTitle: {
      en: 'Electrical Machines & Actuators — DC, AC, Async and Sync',
      de: 'Elektrische Maschinen & Aktorik — DC, AC, Asynchron und Synchron',
    },
    metaDescription: {
      en: 'Rotors, motors and joints: DC and AC machines, asynchronous and synchronous, servo axis sizing, gearing and reflected inertia. With a free rotary-axis sizing calculator and the governing relations.',
      de: 'Rotoren, Motoren und Gelenke: Gleich- und Wechselstrommaschinen, asynchron und synchron, Servoachsen-Auslegung, Getriebe und reduzierte Trägheit. Mit kostenlosem Achsen-Auslegungsrechner und den maßgebenden Beziehungen.',
    },
    body: [
      {
        en: 'The actuator is where every automation claim finally has to be true. A palletizing cell is a set of joints; each joint is a motor, a gearbox and a control loop, and the whole cell is only as capable as the worst-sized axis in it. This track covers the machines that do that work — brushed and brushless DC, asynchronous (induction) and synchronous AC machines, and the permanent-magnet servo machines that dominate jointed automation.',
        de: 'Am Aktor muss sich jede Automatisierungsbehauptung schließlich bewähren. Eine Palettierzelle ist eine Menge von Gelenken; jedes Gelenk ist Motor, Getriebe und Regelkreis, und die Zelle ist nur so leistungsfähig wie ihre am schlechtesten ausgelegte Achse. Dieser Strang behandelt die Maschinen, die diese Arbeit leisten — bürstenbehaftete und bürstenlose Gleichstrommaschinen, Asynchron- und Synchronmaschinen sowie die Permanentmagnet-Servomaschinen, die die Gelenkautomatisierung dominieren.',
      },
      {
        en: 'The selection question is rarely "which motor is strongest". It is whether the reflected inertia lets the loop stay stable, whether RMS torque over the real duty cycle sits under the continuous rating, and where the deceleration energy goes. Gearing dominates all three, because reflection through a ratio divides inertia by its square.',
        de: 'Die Auswahlfrage lautet selten „welcher Motor ist der stärkste“. Sie lautet, ob die reduzierte Trägheit den Regelkreis stabil hält, ob das Effektivmoment über den realen Arbeitszyklus unter dem Dauerwert bleibt und wohin die Verzögerungsenergie geht. Das Getriebe dominiert alle drei, denn die Reduktion teilt die Trägheit durch das Quadrat der Übersetzung.',
      },
      {
        en: 'For AC machines the starting arithmetic is the synchronous speed and the slip that separates a synchronous machine from an induction one. The table below is computed, not transcribed.',
        de: 'Bei Wechselstrommaschinen beginnt die Rechnung mit der synchronen Drehzahl und dem Schlupf, der die Synchron- von der Asynchronmaschine trennt. Die Tabelle unten ist berechnet, nicht abgeschrieben.',
      },
    ],
    syncTable: true,
    tool: {
      path: '/tools/motor-sizing-calculator',
      label: { en: 'Open the rotary axis sizing calculator', de: 'Achsen-Auslegungsrechner öffnen' },
    },
  },
  {
    slug: 'control-integration',
    tag: { en: 'Control & Integration', de: 'Regelung & Integration' },
    title: { en: 'Machine control and software integration', de: 'Maschinensteuerung und Software-Integration' },
    metaTitle: {
      en: 'Machine Control & Software Integration — Determinism, Fieldbus, Agents',
      de: 'Maschinensteuerung & Software-Integration — Determinismus, Feldbus, Agenten',
    },
    metaDescription: {
      en: 'The software-to-hardware layer: deterministic control, motion profiles and kinematics, fieldbus timing, controller architecture, and where an AI agent may and may not sit. With a free loop and bus budget calculator.',
      de: 'Die Schicht zwischen Software und Hardware: deterministische Regelung, Bewegungsprofile und Kinematik, Feldbus-Timing, Steuerungsarchitektur und wo ein KI-Agent sitzen darf und wo nicht. Mit kostenlosem Regelkreis- und Bus-Budgetrechner.',
    },
    body: [
      {
        en: 'Automation software is judged at one boundary: the moment a computed intention becomes torque in a real joint. Everything upstream — planning, scheduling, pattern generation, the vendor-neutral driver interface that lets one codebase drive different arms — only matters if that boundary holds its timing. This track is about the layer where software becomes machine behaviour.',
        de: 'Automatisierungssoftware wird an einer Grenze gemessen: dem Moment, in dem eine berechnete Absicht zu Drehmoment in einem echten Gelenk wird. Alles davor — Planung, Ablaufsteuerung, Mustererzeugung, die herstellerneutrale Treiberschnittstelle, mit der eine Codebasis verschiedene Arme antreibt — zählt nur, wenn diese Grenze ihr Timing hält. Dieser Strang behandelt die Schicht, in der Software zu Maschinenverhalten wird.',
      },
      {
        en: 'Concretely: deterministic execution and bounded worst-case timing rather than average throughput; motion profile generation with jerk limits, and the kinematics that turn a Cartesian target into coordinated joint trajectories; fieldbus cycle budgets that decide how many axes one controller can hold; state machines and interlocking that survive a power cycle mid-motion; and the diagnostics that make a stopped cell explainable instead of merely stopped.',
        de: 'Konkret: deterministische Ausführung und begrenzte Worst-Case-Zeiten statt mittlerem Durchsatz; Bewegungsprofilerzeugung mit Ruckbegrenzung und die Kinematik, die ein kartesisches Ziel in koordinierte Gelenkbahnen übersetzt; Feldbus-Zyklusbudgets, die bestimmen, wie viele Achsen eine Steuerung hält; Zustandsautomaten und Verriegelungen, die einen Spannungsausfall mitten in der Bewegung überstehen; und die Diagnose, die eine stehende Zelle erklärbar macht statt nur stehend.',
      },
      {
        en: 'Above that sits the layer this decade actually added: assistant software that reads a task, proposes a plan and drives tooling through a protocol interface rather than a bespoke integration. It is genuinely useful for interpretation, generation and explanation, and the Forge is built to accept it. What it is not is a participant in the control loop.',
        de: 'Darüber liegt die Schicht, die dieses Jahrzehnt tatsächlich hinzugefügt hat: agentische Software, die eine Aufgabe liest, einen Plan vorschlägt und Werkzeuge über eine Protokollschnittstelle ansteuert statt über eine Sonderintegration. Für Interpretation, Erzeugung und Erklärung ist sie wirklich nützlich, und die Forge-Linie ist darauf ausgelegt, sie aufzunehmen. Was sie nicht ist: Teilnehmerin im Regelkreis.',
      },
    ],
    boundary: {
      en: 'Boundary — stated because the industry keeps blurring it: a language model or planning agent may interpret, propose, explain and generate. It may not close a cycle-time-critical loop, and it may never implement a safety function. Safety-rated stopping, speed and separation monitoring, interlocks and emergency stop belong on qualified hardware, designed and validated under their own standards. Nothing published on this site describes employer systems, operator installations or critical-infrastructure configurations.',
      de: 'Grenze — ausgesprochen, weil die Branche sie beharrlich verwischt: Ein Sprachmodell oder planender Agent darf interpretieren, vorschlagen, erklären und erzeugen. Er darf keinen zykluszeitkritischen Regelkreis schließen und niemals eine Sicherheitsfunktion umsetzen. Sicherheitsgerichtetes Stillsetzen, Geschwindigkeits- und Abstandsüberwachung, Verriegelungen und Not-Halt gehören auf qualifizierte Hardware, ausgelegt und validiert nach eigenen Normen. Nichts auf dieser Seite beschreibt Arbeitgebersysteme, Betreiberanlagen oder KRITIS-Konfigurationen.',
    },
    tool: {
      path: '/tools/control-loop-calculator',
      label: { en: 'Open the loop & bus budget calculator', de: 'Regelkreis- & Bus-Budgetrechner öffnen' },
    },
  },
  {
    slug: 'battery-systems',
    tag: { en: 'Battery Systems & BMS', de: 'Batteriesysteme & BMS' },
    title: { en: 'Battery systems and management', de: 'Batteriesysteme und Batteriemanagement' },
    metaTitle: {
      en: 'Battery Systems & BMS — Pack Topology, C-Rate and Safety',
      de: 'Batteriesysteme & BMS — Packtopologie, C-Rate und Sicherheit',
    },
    metaDescription: {
      en: 'Battery pack architecture and management: S/P topology, voltage windows, C-rate limits, balancing, state estimation and the safety boundaries that decide a design. With a free pack calculator.',
      de: 'Batteriepack-Architektur und -Management: S/P-Topologie, Spannungsfenster, C-Raten-Grenzen, Balancing, Zustandsschätzung und die Sicherheitsgrenzen, die eine Auslegung bestimmen. Mit kostenlosem Pack-Rechner.',
    },
    body: [
      {
        en: 'A battery pack is a series-parallel arrangement of cells that a management system has to keep inside a window it cannot leave without damage. The architecture question — how many in series, how many strings in parallel — sets voltage, current ceiling, resistance and, quietly, the entire safety classification of the machine it powers.',
        de: 'Ein Batteriepack ist eine Reihen-Parallel-Anordnung von Zellen, die ein Managementsystem in einem Fenster halten muss, das ohne Schaden nicht verlassen werden darf. Die Architekturfrage — wie viele in Reihe, wie viele Stränge parallel — bestimmt Spannung, Stromgrenze, Widerstand und stillschweigend die gesamte Sicherheitsklassifizierung der Maschine, die davon lebt.',
      },
      {
        en: 'The management system then carries the parts that arithmetic alone will not give you: cell monitoring and balancing, state of charge and state of health estimation, temperature-dependent current limits, contactor and fusing strategy, isolation monitoring above the touch-safe threshold, and a defined response to every fault it can detect. Most first-pass pack designs are not wrong about energy; they are wrong about C-rate, headroom or the voltage class they landed in.',
        de: 'Das Managementsystem trägt dann die Teile, die reine Arithmetik nicht liefert: Zellüberwachung und Balancing, Schätzung von Ladezustand und Alterungszustand, temperaturabhängige Stromgrenzen, Schütz- und Absicherungsstrategie, Isolationsüberwachung oberhalb der Berührungsschutzgrenze und eine definierte Reaktion auf jeden erkennbaren Fehler. Die meisten ersten Packentwürfe irren nicht bei der Energie, sondern bei C-Rate, Reserve oder der Spannungsklasse, in der sie gelandet sind.',
      },
    ],
    boundary: {
      en: 'Boundary: public content here is generic engineering. Nothing published describes employer systems, operator installations or critical-infrastructure configurations. Nothing here is a safety qualification: lithium cells fail dangerously when abused, and any pack design belongs in front of a qualified engineer before it is built.',
      de: 'Grenze: Die öffentlichen Inhalte hier sind generische Ingenieursarbeit. Nichts davon beschreibt Arbeitgebersysteme, Betreiberanlagen oder KRITIS-Konfigurationen. Nichts hier ist eine Sicherheitsqualifizierung: Lithiumzellen versagen bei Missbrauch gefährlich, und jede Packauslegung gehört vor dem Bau einer Fachkraft vorgelegt.',
    },
    tool: {
      path: '/tools/battery-pack-calculator',
      label: { en: 'Open the battery pack calculator', de: 'Batteriepack-Rechner öffnen' },
    },
  },
  {
    slug: 'embedded',
    tag: { en: 'Embedded', de: 'Embedded' },
    title: { en: 'Embedded control boards', de: 'Eingebettete Steuerplatinen' },
    metaTitle: {
      en: 'Embedded Control & Hardware-in-the-Loop',
      de: 'Embedded-Regelung & Hardware-in-the-Loop',
    },
    metaDescription: {
      en: 'Deterministic controllers, RTOS firmware, signal integrity and hardware-in-the-loop rigs. Build logs with instrument captures — first log in preparation.',
      de: 'Deterministische Regler, RTOS-Firmware, Signalintegrität und Hardware-in-the-Loop-Prüfstände. Baujournale mit Instrumenten-Messungen — erstes Journal in Vorbereitung.',
    },
    body: [
      {
        en: 'Deterministic controllers, RTOS firmware, signal integrity, and hardware-in-the-loop test rigs that prove the timing before anything touches a real plant.',
        de: 'Deterministische Regler, RTOS-Firmware, Signalintegrität und Hardware-in-the-Loop-Prüfstände, die das Timing beweisen, bevor etwas eine echte Anlage berührt.',
      },
    ],
  },
  {
    slug: 'power-electronics',
    tag: { en: 'Power Electronics', de: 'Leistungselektronik' },
    title: { en: 'Power electronics', de: 'Leistungselektronik' },
    metaTitle: {
      en: 'Power Electronics — Inverters & Converters',
      de: 'Leistungselektronik — Wechselrichter & Umrichter',
    },
    metaDescription: {
      en: 'Inverters, converters and switching hardware connecting renewables to real grids — measured, thermally characterised, documented. First build log in preparation.',
      de: 'Wechselrichter, Umrichter und Schalt-Hardware, die Erneuerbare mit echten Netzen verbindet — gemessen, thermisch charakterisiert, dokumentiert. Erstes Baujournal in Vorbereitung.',
    },
    body: [
      {
        en: 'Inverters, converters, and the switching hardware that connects renewables to real grids — measured, thermally characterised, documented.',
        de: 'Wechselrichter, Umrichter und die Schalt-Hardware, die Erneuerbare mit echten Netzen verbindet — gemessen, thermisch charakterisiert, dokumentiert.',
      },
    ],
  },
];

export function getDiscipline(slug: string): Discipline | undefined {
  return disciplines.find((d) => d.slug === slug);
}

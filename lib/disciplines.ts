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

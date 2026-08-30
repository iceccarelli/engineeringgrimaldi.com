/**
 * Reference data — standard pallets and standard containers.
 *
 * SOURCING RULE: every figure here was read off a primary or
 * near-primary source (EPAL's own specification pages, ISO container
 * references) and each table carries its sources on the rendered page.
 * Figures that vary by manufacturer or carrier are labelled "typical"
 * rather than presented as standards, because a reference page that
 * quietly rounds is worse than no reference page.
 *
 * Interior container dimensions and payloads in particular vary between
 * builders and operators; they are given here as the widely published
 * nominal values and the page says to confirm with the carrier.
 */

import type { Localized } from './i18n';

export type PalletStandard = {
  id: string;
  name: string;
  /** Longer deck dimension, mm. */
  length: number;
  /** Shorter deck dimension, mm. */
  width: number;
  height: number;
  /** Own weight, kg — typical. */
  ownWeight: number | null;
  /** Safe working load, kg, where the standard states one. */
  safeWorkingLoad: number | null;
  note: Localized;
};

export const PALLET_STANDARDS: PalletStandard[] = [
  {
    id: 'epal1',
    name: 'EPAL 1 (EUR / Euro pallet)',
    length: 1200,
    width: 800,
    height: 144,
    ownWeight: 25,
    safeWorkingLoad: 1500,
    note: {
      en: 'The European default. EPAL states an own weight of approximately 25 kg and a safe working load of 1,500 kg; when laden pallets are stacked on a solid, even surface the bottom pallet must not carry more than 5,500 kg.',
      de: 'Der europäische Standard. EPAL nennt ein Eigengewicht von etwa 25 kg und eine sichere Traglast von 1.500 kg; beim Stapeln beladener Paletten auf festem, ebenem Untergrund darf die unterste Palette höchstens 5.500 kg tragen.',
    },
  },
  {
    id: 'epal2',
    name: 'EPAL 2',
    length: 1200,
    width: 1000,
    height: 144,
    ownWeight: null,
    safeWorkingLoad: null,
    note: {
      en: 'The 1200 × 1000 mm industrial format. Common in chemicals and beverages, and a better match for many 40 ft container loads than the EPAL 1.',
      de: 'Das industrielle Format 1200 × 1000 mm. Verbreitet in Chemie und Getränken und für viele 40-Fuß-Containerladungen besser geeignet als die EPAL 1.',
    },
  },
  {
    id: 'epal3',
    name: 'EPAL 3',
    length: 1200,
    width: 1000,
    height: 144,
    ownWeight: null,
    safeWorkingLoad: null,
    note: {
      en: 'A heavier-duty 1000 × 1200 mm construction. Same footprint as the EPAL 2, different build.',
      de: 'Eine schwerere Ausführung im Format 1000 × 1200 mm. Gleiche Grundfläche wie die EPAL 2, andere Bauweise.',
    },
  },
  {
    id: 'epal6',
    name: 'EPAL 6 (half pallet)',
    length: 800,
    width: 600,
    height: 144,
    ownWeight: null,
    safeWorkingLoad: null,
    note: {
      en: 'Half the EPAL 1 footprint — 800 × 600 mm. Used for retail display and smaller consignments; also known as the Düsseldorf pallet.',
      de: 'Halbe EPAL-1-Grundfläche — 800 × 600 mm. Für Verkaufsdisplays und kleinere Sendungen; auch Düsseldorfer Palette genannt.',
    },
  },
  {
    id: 'na48x40',
    name: 'North American 48" × 40"',
    length: 1219,
    width: 1016,
    height: 140,
    ownWeight: null,
    safeWorkingLoad: null,
    note: {
      en: 'The dominant North American format, 48 × 40 inches (1219 × 1016 mm). Height varies by build; 140 mm is typical.',
      de: 'Das vorherrschende nordamerikanische Format, 48 × 40 Zoll (1219 × 1016 mm). Die Höhe variiert je nach Bauart; 140 mm ist typisch.',
    },
  },
];

export type ContainerStandard = {
  id: string;
  name: string;
  /** Nominal interior dimensions, mm. */
  interiorLength: number;
  interiorWidth: number;
  interiorHeight: number;
  /** Typical tare, kg. */
  tare: number;
  /** Typical maximum payload, kg. */
  payload: number;
  /** Nominal interior volume, m³. */
  volume: number;
  /** EPAL 1 pallets in a single floor tier, from this site's own solver. */
  eurPallets: number;
};

export const CONTAINER_STANDARDS: ContainerStandard[] = [
  {
    id: 'c20',
    name: '20 ft standard',
    interiorLength: 5898,
    interiorWidth: 2352,
    interiorHeight: 2393,
    tare: 2300,
    payload: 28200,
    volume: 33,
    eurPallets: 11,
  },
  {
    id: 'c40',
    name: '40 ft standard',
    interiorLength: 12032,
    interiorWidth: 2352,
    interiorHeight: 2393,
    tare: 3700,
    payload: 26700,
    volume: 67,
    eurPallets: 25,
  },
  {
    id: 'c40hc',
    name: '40 ft high cube',
    interiorLength: 12032,
    interiorWidth: 2352,
    interiorHeight: 2698,
    tare: 3900,
    payload: 26500,
    volume: 76,
    eurPallets: 25,
  },
];

export type SourceLink = { label: string; url: string };

export const PALLET_SOURCES: SourceLink[] = [
  { label: 'EPAL — EPAL Euro pallet specification', url: 'https://www.epal-pallets.org/eu-en/load-carriers/epal-euro-pallet' },
  { label: 'Wikipedia — EUR-pallet', url: 'https://en.wikipedia.org/wiki/EUR-pallet' },
];

export const CONTAINER_SOURCES: SourceLink[] = [
  { label: 'iContainers — 40 ft container dimensions', url: 'https://www.icontainers.com/help/40-foot-container/' },
  { label: 'iContainers — 20 ft container dimensions', url: 'https://www.icontainers.com/help/20-foot-container/' },
];

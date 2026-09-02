/**
 * The status vocabulary for everything on this site. One list, brutal on
 * purpose. A page may only carry a status that is true on the day it is
 * published, and the label text is not editable per page — if the truth
 * changes, change the status, not the wording.
 */

import type { Lang, Localized } from './i18n';

export type Status =
  | 'SHIPPED'
  | 'SHIPPED_DEMO'
  | 'PILOT'
  | 'IN_DEVELOPMENT'
  | 'CLIENT_BUILD'
  | 'RESEARCH'
  | 'PARKED'
  | 'DO_NOT_LINK'
  | 'NO_LOG_YET';

export type StatusTone = 'ok' | 'demo' | 'warn' | 'off' | 'danger';

export const STATUS_META: Record<Status, { label: Localized; tone: StatusTone; hint: Localized }> = {
  SHIPPED: {
    label: { en: 'SHIPPED', de: 'AUSGELIEFERT' },
    tone: 'ok',
    hint: { en: 'Installable, versioned, tested. Clone it.', de: 'Installierbar, versioniert, getestet. Klonen Sie es.' },
  },
  SHIPPED_DEMO: {
    label: { en: 'SHIPPED DEMO', de: 'DEMO VERÖFFENTLICHT' },
    tone: 'demo',
    hint: { en: 'Runs in a browser. Not deployed on a machine.', de: 'Läuft im Browser. Nicht auf einer Maschine im Einsatz.' },
  },
  PILOT: {
    label: { en: 'PILOT', de: 'PILOT' },
    tone: 'demo',
    hint: { en: 'Running on one customer’s data with a kill date.', de: 'Läuft auf den Daten eines Kunden, mit Abbruchdatum.' },
  },
  IN_DEVELOPMENT: {
    label: { en: 'IN DEVELOPMENT', de: 'IN ENTWICKLUNG' },
    tone: 'warn',
    hint: { en: 'Public code, no production use.', de: 'Öffentlicher Code, kein Produktiveinsatz.' },
  },
  CLIENT_BUILD: {
    label: { en: 'CLIENT BUILD', de: 'KUNDENBAU' },
    tone: 'demo',
    hint: { en: 'Built for one client; not public.', de: 'Für einen Kunden gebaut; nicht öffentlich.' },
  },
  RESEARCH: {
    label: { en: 'RESEARCH', de: 'FORSCHUNG' },
    tone: 'warn',
    hint: { en: 'Notes and models. No product.', de: 'Notizen und Modelle. Kein Produkt.' },
  },
  PARKED: {
    label: { en: 'PARKED', de: 'GEPARKT' },
    tone: 'off',
    hint: { en: 'Kept, not worked on. Cash goes to the wedge.', de: 'Behalten, nicht bearbeitet. Das Geld geht in den Keil.' },
  },
  DO_NOT_LINK: {
    label: { en: '404 — DO NOT LINK', de: '404 — NICHT VERLINKEN' },
    tone: 'danger',
    hint: { en: 'Named somewhere, but no public repository exists.', de: 'Irgendwo genannt, aber kein öffentliches Repository.' },
  },
  NO_LOG_YET: {
    label: { en: 'NO LOG YET', de: 'NOCH KEIN JOURNAL' },
    tone: 'danger',
    hint: { en: 'No instrument photo or capture has been published.', de: 'Kein Instrumentenfoto und keine Messung veröffentlicht.' },
  },
};

export function statusLabel(lang: Lang, status: Status): string {
  return STATUS_META[status].label[lang];
}

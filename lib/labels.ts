/**
 * Labels for the two client islands, kept in a server-safe module so
 * server components can import them without dragging a 'use client'
 * module's non-component exports through the RSC boundary.
 */

import type { IntakeLabels } from '@/components/IntakeForm';
import type { EnergyIntakeLabels } from '@/components/EnergyIntakeForm';
import type { PlannerLabels } from '@/components/StackPlanner';

export const PLANNER_LABELS: Record<'en' | 'de', PlannerLabels> = {
  en: {
    csvLabel: 'SKU list (CSV: sku_id, length_mm, width_mm, height_mm, weight_kg, qty, max_stack_kg)',
    fileLabel: 'or drop a CSV file',
    pallet: 'Pallet',
    palletEur1: 'EPAL 1 — 1200 × 800',
    palletEur2: 'EPAL 2 — 1200 × 1000',
    palletCustom: 'Custom',
    length: 'Length mm',
    width: 'Width mm',
    maxHeight: 'Max stack mm',
    maxWeight: 'Max payload kg',
    stack: 'Stack',
    reset: 'Sample',
    layerMap: 'Layer map',
    layer: 'Layer',
    allLayers: 'All',
    stability: 'Stability',
    density: 'Density',
    layers: 'Layers',
    cycle: 'Cycle time',
    cycleNote: 'Cycle time at {s} s per pick, planning assumption.',
    height: 'Height',
    weight: 'Weight',
    placed: 'Placed',
    exportUr: 'Export URScript stub',
    exportCsv: 'Export plan CSV',
    scriptTitle: 'URScript stub (preview)',
    boundary: 'Static geometry: base support and centre of mass. Not a transport or wrapping certification.',
    state: 'Cell state',
  },
  de: {
    csvLabel: 'SKU-Liste (CSV: sku_id, length_mm, width_mm, height_mm, weight_kg, qty, max_stack_kg)',
    fileLabel: 'oder CSV-Datei wählen',
    pallet: 'Palette',
    palletEur1: 'EPAL 1 — 1200 × 800',
    palletEur2: 'EPAL 2 — 1200 × 1000',
    palletCustom: 'Eigenes Maß',
    length: 'Länge mm',
    width: 'Breite mm',
    maxHeight: 'Max. Stapel mm',
    maxWeight: 'Max. Nutzlast kg',
    stack: 'Stapeln',
    reset: 'Beispiel',
    layerMap: 'Lagenplan',
    layer: 'Lage',
    allLayers: 'Alle',
    stability: 'Stabilität',
    density: 'Dichte',
    layers: 'Lagen',
    cycle: 'Taktzeit',
    cycleNote: 'Taktzeit bei {s} s pro Griff, Planungsannahme.',
    height: 'Höhe',
    weight: 'Gewicht',
    placed: 'Gesetzt',
    exportUr: 'URScript-Stub exportieren',
    exportCsv: 'Plan als CSV exportieren',
    scriptTitle: 'URScript-Stub (Vorschau)',
    boundary: 'Statische Geometrie: Auflage und Schwerpunkt. Keine Transport- oder Wickelzertifizierung.',
    state: 'Zellenzustand',
  },
};

export const INTAKE_LABELS: Record<'en' | 'de', IntakeLabels> = {
  en: {
    company: 'Company',
    city: 'City',
    robot: 'Robot brand',
    robotOther: 'Other / none yet',
    sku: 'SKU file (CSV)',
    skuHint: 'Columns: sku_id, length_mm, width_mm, height_mm, weight_kg, qty. Same format as the planner above.',
    layout: 'Cell layout (PDF, optional)',
    email: 'Email',
    submit: 'Send the list',
    sending: 'Sending…',
    ok: 'Received. We answer with a stack and the unstable SKUs.',
    errGeneric: 'Sending failed on our side. Please email the file to',
    errUnconfigured: 'The intake is not wired up yet. Please email the file to',
    errEmail: 'That does not look like a valid email address. Or email the file to',
    errSku: 'Attach a SKU CSV. Or email the file to',
    errSize: 'File too large (CSV up to 2 MB, PDF up to 8 MB). Or email the file to',
    privacy: 'Your SKU data is used to answer this request and nothing else. Details in the privacy policy.',
  },
  de: {
    company: 'Firma',
    city: 'Stadt',
    robot: 'Robotermarke',
    robotOther: 'Andere / noch keiner',
    sku: 'SKU-Datei (CSV)',
    skuHint: 'Spalten: sku_id, length_mm, width_mm, height_mm, weight_kg, qty. Gleiches Format wie im Planer oben.',
    layout: 'Zellenlayout (PDF, optional)',
    email: 'E-Mail',
    submit: 'Liste senden',
    sending: 'Wird gesendet…',
    ok: 'Erhalten. Sie bekommen einen Stapel und die instabilen SKUs.',
    errGeneric: 'Das Senden ist auf unserer Seite fehlgeschlagen. Bitte senden Sie die Datei per E-Mail an',
    errUnconfigured: 'Die Annahme ist noch nicht angebunden. Bitte senden Sie die Datei per E-Mail an',
    errEmail: 'Das sieht nicht nach einer gültigen E-Mail-Adresse aus. Oder senden Sie die Datei an',
    errSku: 'Bitte hängen Sie eine SKU-CSV an. Oder senden Sie die Datei an',
    errSize: 'Datei zu groß (CSV bis 2 MB, PDF bis 8 MB). Oder senden Sie die Datei an',
    privacy: 'Ihre SKU-Daten werden nur zur Beantwortung dieser Anfrage verwendet. Details in der Datenschutzerklärung.',
  },
};

const SEGMENTS_EN: [string, string][] = [['stadtwerke', 'Stadtwerke / municipal utility'], ['mieterstrom-operator', 'Mieterstrom / building-energy operator'], ['bess-operator', 'BESS operator'], ['c-and-i', 'C&I energy operator'], ['aggregator', 'Aggregator'], ['energy-community', 'Energy community'], ['renewable-developer', 'Renewable developer'], ['dso', 'DSO / network operator'], ['other', 'Other']];
const SEGMENTS_DE: [string, string][] = [['stadtwerke', 'Stadtwerke'], ['mieterstrom-operator', 'Mieterstrom / GGV-Betreiber'], ['bess-operator', 'Speicherbetreiber (BESS)'], ['c-and-i', 'Industrie / Gewerbe (Energie)'], ['aggregator', 'Aggregator'], ['energy-community', 'Energiegemeinschaft'], ['renewable-developer', 'EE-Projektierer'], ['dso', 'Verteilnetzbetreiber'], ['other', 'Sonstige']];
const BANDS_EN: [string, string][] = [['unknown', 'Not quantified yet'], ['<10k', 'under €10k / year'], ['10k-50k', '€10k – 50k / year'], ['50k-250k', '€50k – 250k / year'], ['>250k', 'over €250k / year']];
const BANDS_DE: [string, string][] = [['unknown', 'Noch nicht quantifiziert'], ['<10k', 'unter 10 T€ / Jahr'], ['10k-50k', '10 – 50 T€ / Jahr'], ['50k-250k', '50 – 250 T€ / Jahr'], ['>250k', 'über 250 T€ / Jahr']];

export const ENERGY_INTAKE_LABELS: Record<'en' | 'de', EnergyIntakeLabels> = {
  en: {
    org: 'Organisation', role: 'Your role', segment: 'Segment', segments: SEGMENTS_EN,
    costs: 'What costs you money today?', costsHint: 'e.g. our batteries follow a fixed schedule and miss intraday prices; our §42b allocation is done by hand each quarter',
    band: 'How much, roughly?', bands: BANDS_EN,
    owner: 'Who owns that budget? (role)', current: 'How do you solve it today?', worth: 'What would success be worth?',
    email: 'Email', submit: 'Send the five answers', sending: 'Sending…',
    ok: 'Received. You get a written answer with numbers within five working days — or a no, with the reason.',
    errGeneric: 'Sending failed on our side. Please email your answers to', errUnconfigured: 'The intake is not wired up yet. Please email your answers to',
    errEmail: 'That does not look like a valid email address. Or email your answers to', errFields: 'Organisation, role, the first question and email are required. Or email your answers to',
    privacy: 'Your answers are used to reply to this request and, anonymised (segment, size band, cost band), to count one conversation on this page. Nothing else. Details in the privacy policy.',
  },
  de: {
    org: 'Organisation', role: 'Ihre Rolle', segment: 'Segment', segments: SEGMENTS_DE,
    costs: 'Was kostet Sie heute Geld?', costsHint: 'z. B. unsere Speicher fahren einen festen Fahrplan und verpassen Intraday-Preise; die §42b-Aufteilung machen wir jedes Quartal von Hand',
    band: 'Wie viel, ungefähr?', bands: BANDS_DE,
    owner: 'Wer hält dieses Budget? (Rolle)', current: 'Wie lösen Sie es heute?', worth: 'Was wäre Erfolg wert?',
    email: 'E-Mail', submit: 'Die fünf Antworten senden', sending: 'Wird gesendet…',
    ok: 'Erhalten. Sie bekommen innerhalb von fünf Arbeitstagen eine schriftliche Antwort mit Zahlen — oder ein Nein mit Begründung.',
    errGeneric: 'Senden ist auf unserer Seite fehlgeschlagen. Bitte Antworten per E-Mail an', errUnconfigured: 'Die Annahme ist noch nicht angebunden. Bitte Antworten per E-Mail an',
    errEmail: 'Das sieht nicht nach einer gültigen E-Mail-Adresse aus. Oder Antworten per E-Mail an', errFields: 'Organisation, Rolle, die erste Frage und E-Mail sind Pflicht. Oder Antworten per E-Mail an',
    privacy: 'Ihre Antworten dienen der Antwort auf diese Anfrage und — anonymisiert (Segment, Größen-, Kostenband) — dem Zählen eines Gesprächs auf dieser Seite. Nichts sonst. Details in der Datenschutzerklärung.',
  },
};

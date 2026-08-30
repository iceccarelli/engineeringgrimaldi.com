/**
 * UI dictionary — en + de only, typed so a missing key is a compile error,
 * not a silent English fallback. Long-form page content lives with its
 * registry (lib/forge.ts, lib/disciplines.ts); this file is chrome + shared UI.
 */

import type { Lang } from './i18n';

export interface Dict {
  brandTag: string;
  navForge: string;
  navLab: string;
  navDisciplines: string;
  navBook: string;
  langLabel: string;

  // Home
  homeKicker: string;
  homeH1: string;
  homeLead: string;
  ctaBook: string;
  ctaForge: string;
  icpKicker: string;
  icpTitle: string;
  icpIntro: string;
  icpA_tag: string;
  icpA_title: string;
  icpA_body: string;
  icpA_cta: string;
  icpB_tag: string;
  icpB_title: string;
  icpB_body: string;
  icpB_cta: string;
  icpC_tag: string;
  icpC_title: string;
  icpC_body: string;
  icpC_cta: string;
  forgeKicker: string;
  forgeTitle: string;
  forgeIntro: string;
  labKicker: string;
  labTitle: string;
  labIntro: string;
  labCta: string;
  discKicker: string;
  discTitle: string;
  discIntro: string;
  open: string;

  // Status badges
  statusShipped: string;
  statusRepoOnly: string;
  statusLogPrep: string;

  // Waitlist
  wlTitle: string;
  wlBody: string;
  wlEmailLabel: string;
  wlInterestLabel: string;
  wlInterestPalletizer: string;
  wlInterestFloorforge: string;
  wlInterestHvLab: string;
  wlSubmit: string;
  wlOk: string;
  wlErrEmail: string;
  wlErrServer: string;
  wlErrUnconfigured: string;
  wlPrivacy: string;

  // Book
  bookTitle: string;
  bookLead: string;
  bookCta: string;
  bookBring: string;
  offersTitle: string;
  offerSession: string;
  offerSessionBody: string;
  offerRetainer: string;
  offerRetainerBody: string;
  offerIntegration: string;
  offerIntegrationBody: string;

  // Footer
  footAbout: string;
  footNet: string;
  footLegal: string;
  footDisambiguation: string;
  netSoftware: string;
  netPersonal: string;
  impressum: string;
  datenschutz: string;
  rights: string;
  authorLine: string;
}

const en: Dict = {
  brandTag: 'Hardware • Electrical Engineering',
  navForge: 'Forge Line',
  navLab: 'Lab',
  navDisciplines: 'Disciplines',
  navBook: 'Book a bench review',
  langLabel: 'Language',

  homeKicker: 'Grimaldi Engineering · Frankfurt',
  homeH1: 'Automation software for the trades. Engineering you can verify.',
  homeLead:
    'The Forge Line ships automation products for palletizing, flooring, painting and drying — code public, status stated plainly. Underneath: high-voltage, embedded and power-electronics work. Build logs ship with instrument captures; the first are in preparation.',
  ctaBook: 'Book a 20-minute bench review — €0',
  ctaForge: 'See the Forge Line',
  icpKicker: 'Start here',
  icpTitle: 'Three doors, one bench',
  icpIntro: 'Pick the door that matches your problem. Each leads to its own page — no mixed pitch.',
  icpA_tag: 'Packaging / end-of-line',
  icpA_title: 'You palletize mixed SKUs',
  icpA_body:
    'Palletizer OS is a software foundation for end-of-line palletizing cells, with a public mixed-SKU optimizer you can open right now.',
  icpA_cta: 'Palletizer OS',
  icpB_tag: 'Flooring contractors',
  icpB_title: 'You run flooring crews',
  icpB_body:
    'FloorForge AI is automation tooling for the flooring trade — public repository, in active development, no production deployment yet.',
  icpB_cta: 'FloorForge AI',
  icpC_tag: 'Grid / OT advisory',
  icpC_title: 'You need an HV / OT engineer',
  icpC_body:
    'Advisory sessions and retainers on high-voltage systems, grid physics and OT digitalisation. Public content stays generic — no operator internals.',
  icpC_cta: 'See advisory terms',
  forgeKicker: 'Trades 2.0 · The Forge Line',
  forgeTitle: 'One trade, one product at a time',
  forgeIntro:
    'An automation product per trade, code in the open, status stated plainly. Every product page lists problem, architecture, real integration status, license and commercial terms.',
  labKicker: 'Lab',
  labTitle: 'Grid frequency under load — a real droop model',
  labIntro:
    'A three-phase scope driving an actual frequency-droop integrator: Δf = −f·0.04·ΔP, RoCoF bounded by inertia. The readouts come out of the model, not a canned animation.',
  labCta: 'Open the droop instrument',
  discKicker: 'Disciplines',
  discTitle: 'Three tracks of physical engineering',
  discIntro:
    'High voltage, embedded control, power electronics. Each track gets complete build logs — schematic to measured result. Until the first log ships, the status below says exactly that.',
  open: 'Open →',

  statusShipped: 'Shipped',
  statusRepoOnly: 'Public repo — not a production deployment',
  statusLogPrep: 'First build log in preparation',

  wlTitle: 'Get one email when something real ships',
  wlBody: 'First lab log, Palletizer OS milestones, FloorForge pilots. Double opt-in, no noise, unsubscribe anytime.',
  wlEmailLabel: 'Email address',
  wlInterestLabel: 'I care about',
  wlInterestPalletizer: 'Palletizer OS',
  wlInterestFloorforge: 'FloorForge AI',
  wlInterestHvLab: 'HV lab logs',
  wlSubmit: 'Join the waitlist',
  wlOk: 'Check your inbox to confirm your subscription.',
  wlErrEmail: 'That does not look like a valid email address.',
  wlErrServer: 'Something failed on our side. Please try again later.',
  wlErrUnconfigured: 'The waitlist backend is not configured yet. Please try again later.',
  wlPrivacy: 'Consent is revocable anytime; details in the privacy policy.',

  bookTitle: 'Book a 20-minute bench review — €0',
  bookLead:
    'Bring a cell layout, a scope trace, or the problem statement. Twenty minutes, no slides, engineering only.',
  bookCta: 'Pick a slot',
  bookBring: 'What to bring: a cell layout, a scope trace, a SKU mix, or a one-paragraph problem statement.',
  offersTitle: 'Working terms',
  offerSession: 'Deep-dive session — €280',
  offerSessionBody: '90 minutes on your specific problem: palletizing cell design, HV/OT questions, architecture review. Written summary included.',
  offerRetainer: 'Advisory retainer — €3,200/mo',
  offerRetainerBody: 'Ongoing engineering advisory: weekly call, async review, priority access. Grid/OT scope stays on public, generic ground.',
  offerIntegration: 'Forge integration — custom quote',
  offerIntegrationBody: 'Palletizer OS or Forge tooling adapted to your line. Scoped after a bench review; no integration is sold before the fit is proven.',

  footAbout: 'The hardware and product surface of the Grimaldi network. Operated from Frankfurt am Main.',
  footNet: 'The Grimaldi network',
  footLegal: 'Legal',
  footDisambiguation:
    'Not affiliated with Grimaldi Engineering Ltd (UK automotive workshop) or the Grimaldi Group (shipping, Naples).',
  netSoftware: 'Software & AI portfolio',
  netPersonal: 'Personal site',
  impressum: 'Impressum',
  datenschutz: 'Privacy policy',
  rights: '© 2026 Vincenzo Ceccarelli Grimaldi. All rights reserved.',
  authorLine: 'Written and maintained by Vincenzo Ceccarelli Grimaldi, Frankfurt am Main.',
};

const de: Dict = {
  brandTag: 'Hardware • Elektrotechnik',
  navForge: 'Forge-Linie',
  navLab: 'Labor',
  navDisciplines: 'Disziplinen',
  navBook: 'Bench-Review buchen',
  langLabel: 'Sprache',

  homeKicker: 'Grimaldi Engineering · Frankfurt',
  homeH1: 'Automatisierungssoftware für die Gewerke. Ingenieursarbeit zum Nachprüfen.',
  homeLead:
    'Die Forge-Linie liefert Automatisierungsprodukte für Palettieren, Bodenlegen, Malen und Trocknen — Code öffentlich, Status klar benannt. Darunter: Hochspannungs-, Embedded- und Leistungselektronik-Arbeit. Baujournale erscheinen mit Instrumenten-Messungen; die ersten sind in Vorbereitung.',
  ctaBook: '20-Minuten-Bench-Review buchen — 0 €',
  ctaForge: 'Zur Forge-Linie',
  icpKicker: 'Hier starten',
  icpTitle: 'Drei Türen, eine Werkbank',
  icpIntro: 'Wählen Sie die Tür, die zu Ihrem Problem passt. Jede führt auf eine eigene Seite — kein vermischter Pitch.',
  icpA_tag: 'Verpackung / End-of-Line',
  icpA_title: 'Sie palettieren Misch-SKUs',
  icpA_body:
    'Palletizer OS ist eine Software-Basis für End-of-Line-Palettierzellen — mit einem öffentlichen Misch-SKU-Optimierer, den Sie sofort öffnen können.',
  icpA_cta: 'Palletizer OS',
  icpB_tag: 'Bodenleger-Betriebe',
  icpB_title: 'Sie führen Bodenleger-Kolonnen',
  icpB_body:
    'FloorForge AI ist Automatisierungs-Tooling für das Bodenleger-Gewerk — öffentliches Repository, in aktiver Entwicklung, noch kein Produktiveinsatz.',
  icpB_cta: 'FloorForge AI',
  icpC_tag: 'Netz- / OT-Beratung',
  icpC_title: 'Sie brauchen einen HV-/OT-Ingenieur',
  icpC_body:
    'Beratungssessions und Retainer zu Hochspannungssystemen, Netzphysik und OT-Digitalisierung. Öffentliche Inhalte bleiben generisch — keine Betreiber-Interna.',
  icpC_cta: 'Konditionen ansehen',
  forgeKicker: 'Gewerke 2.0 · Die Forge-Linie',
  forgeTitle: 'Ein Gewerk, ein Produkt nach dem anderen',
  forgeIntro:
    'Ein Automatisierungsprodukt pro Gewerk, Code offen, Status klar benannt. Jede Produktseite nennt Problem, Architektur, echten Integrationsstand, Lizenz und kommerzielle Konditionen.',
  labKicker: 'Labor',
  labTitle: 'Netzfrequenz unter Last — ein echtes Statik-Modell',
  labIntro:
    'Ein Drei-Phasen-Oszilloskop mit echtem Frequenz-Statik-Integrator: Δf = −f·0,04·ΔP, RoCoF durch Trägheit begrenzt. Die Anzeigen kommen aus dem Modell, nicht aus einer Animation.',
  labCta: 'Statik-Instrument öffnen',
  discKicker: 'Disziplinen',
  discTitle: 'Drei Stränge physischer Ingenieursarbeit',
  discIntro:
    'Hochspannung, Embedded-Regelung, Leistungselektronik. Jeder Strang erhält vollständige Baujournale — vom Schaltplan bis zum gemessenen Ergebnis. Bis das erste Journal erscheint, steht unten genau das.',
  open: 'Öffnen →',

  statusShipped: 'Veröffentlicht',
  statusRepoOnly: 'Öffentliches Repo — kein Produktiveinsatz',
  statusLogPrep: 'Erstes Baujournal in Vorbereitung',

  wlTitle: 'Eine E-Mail, wenn etwas Echtes erscheint',
  wlBody: 'Erstes Laborjournal, Palletizer-OS-Meilensteine, FloorForge-Piloten. Double-Opt-in, kein Lärm, jederzeit abbestellbar.',
  wlEmailLabel: 'E-Mail-Adresse',
  wlInterestLabel: 'Mich interessiert',
  wlInterestPalletizer: 'Palletizer OS',
  wlInterestFloorforge: 'FloorForge AI',
  wlInterestHvLab: 'HV-Laborjournale',
  wlSubmit: 'In die Warteliste',
  wlOk: 'Bitte bestätigen Sie die Anmeldung über die E-Mail in Ihrem Posteingang.',
  wlErrEmail: 'Das sieht nicht nach einer gültigen E-Mail-Adresse aus.',
  wlErrServer: 'Auf unserer Seite ist etwas fehlgeschlagen. Bitte später erneut versuchen.',
  wlErrUnconfigured: 'Das Wartelisten-Backend ist noch nicht konfiguriert. Bitte später erneut versuchen.',
  wlPrivacy: 'Die Einwilligung ist jederzeit widerrufbar; Details in der Datenschutzerklärung.',

  bookTitle: '20-Minuten-Bench-Review buchen — 0 €',
  bookLead:
    'Bringen Sie ein Zellen-Layout, eine Oszilloskop-Aufnahme oder die Problemstellung mit. Zwanzig Minuten, keine Folien, nur Engineering.',
  bookCta: 'Termin wählen',
  bookBring: 'Mitbringen: ein Zellen-Layout, eine Scope-Aufnahme, ein SKU-Mix oder eine Problemstellung in einem Absatz.',
  offersTitle: 'Konditionen',
  offerSession: 'Deep-Dive-Session — 280 €',
  offerSessionBody: '90 Minuten zu Ihrem konkreten Problem: Palettierzellen-Design, HV-/OT-Fragen, Architektur-Review. Schriftliche Zusammenfassung inklusive.',
  offerRetainer: 'Advisory-Retainer — 3.200 €/Monat',
  offerRetainerBody: 'Laufende Ingenieursberatung: wöchentlicher Call, asynchrone Reviews, priorisierter Zugang. Netz-/OT-Themen bleiben auf öffentlichem, generischem Terrain.',
  offerIntegration: 'Forge-Integration — individuelles Angebot',
  offerIntegrationBody: 'Palletizer OS oder Forge-Tooling, angepasst an Ihre Linie. Scoping nach einem Bench-Review; keine Integration wird verkauft, bevor der Fit belegt ist.',

  footAbout: 'Die Hardware- und Produkt-Oberfläche des Grimaldi-Netzwerks. Betrieben aus Frankfurt am Main.',
  footNet: 'Das Grimaldi-Netzwerk',
  footLegal: 'Rechtliches',
  footDisambiguation:
    'Nicht verbunden mit Grimaldi Engineering Ltd (Kfz-Werkstatt, UK) oder der Grimaldi Group (Schifffahrt, Neapel).',
  netSoftware: 'Software- & KI-Portfolio',
  netPersonal: 'Persönliche Seite',
  impressum: 'Impressum',
  datenschutz: 'Datenschutzerklärung',
  rights: '© 2026 Vincenzo Ceccarelli Grimaldi. Alle Rechte vorbehalten.',
  authorLine: 'Verfasst und gepflegt von Vincenzo Ceccarelli Grimaldi, Frankfurt am Main.',
};

const dictionaries: Record<Lang, Dict> = { en, de };

export function getDict(lang: Lang): Dict {
  return dictionaries[lang];
}

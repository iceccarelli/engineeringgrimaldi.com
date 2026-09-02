/**
 * UI dictionary — en + de only, typed so a missing key is a compile error,
 * not a silent English fallback. Long-form page content lives with the
 * page that renders it; this file is chrome + shared UI.
 */

import type { Lang } from './i18n';

export interface Dict {
  brandTag: string;
  navMenu: string;
  navClose: string;
  skipToContent: string;
  primaryNav: string;
  navAbout: string;
  navBook: string;
  langLabel: string;
  calcCardTag: string;

  // Home
  homeKicker: string;
  homeH1: string;
  homeLead: string;
  ctaBook: string;
  ctaForge: string;
  open: string;

  // Parked sections (still rendered at their own URLs)
  forgeKicker: string;
  forgeTitle: string;
  forgeIntro: string;
  labKicker: string;
  labTitle: string;
  labIntro: string;
  labCta: string;

  // Status badges
  statusShipped: string;
  statusRepoOnly: string;
  statusLogPrep: string;

  // Waitlist component (not mounted on any header-linked page)
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

  // Legacy booking copy (the /book route now redirects to /contact)
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
  brandTag: 'Palletizing software · Frankfurt',
  navMenu: 'Menu',
  navClose: 'Close menu',
  skipToContent: 'Skip to content',
  primaryNav: 'Primary',
  navAbout: 'About',
  navBook: 'Send a SKU list',
  langLabel: 'Language',
  calcCardTag: 'Tools',

  homeKicker: 'PALLETIZING SOFTWARE · FRANKFURT',
  homeH1: 'Mixed-SKU palletizing software for the robot you already have.',
  homeLead:
    'Density, stability and cycle time from your real SKU list. Robot-agnostic planner; the arm stays yours.',
  ctaBook: 'Send a SKU list',
  ctaForge: 'Open the tools',
  open: 'Open →',

  forgeKicker: 'Forge · lab',
  forgeTitle: 'Same controller thesis. Different end-effector.',
  forgeIntro:
    'The palletizer is the shipped product. Everything else on this page is a lab note on the same controller thesis with a different end-effector. No unit for sale.',
  labKicker: 'Lab',
  labTitle: 'Grid frequency under load — a droop model',
  labIntro:
    'A three-phase scope driving a frequency-droop integrator: Δf = −f·0.04·ΔP, RoCoF bounded by inertia. The readouts come out of the model, not a canned animation.',
  labCta: 'Open the droop instrument',

  statusShipped: 'Software shipped',
  statusRepoOnly: 'Public repo — not a production deployment',
  statusLogPrep: 'No build log published',

  wlTitle: 'One email when something real ships',
  wlBody: 'Double opt-in, no noise, unsubscribe anytime.',
  wlEmailLabel: 'Email address',
  wlInterestLabel: 'I care about',
  wlInterestPalletizer: 'Palletizer',
  wlInterestFloorforge: 'FloorForge',
  wlInterestHvLab: 'HV lab logs',
  wlSubmit: 'Subscribe',
  wlOk: 'Check your inbox to confirm your subscription.',
  wlErrEmail: 'That does not look like a valid email address.',
  wlErrServer: 'Something failed on our side. Please try again later.',
  wlErrUnconfigured: 'The subscription backend is not configured yet. Please try again later.',
  wlPrivacy: 'Consent is revocable anytime; details in the privacy policy.',

  bookTitle: 'Send a SKU list',
  bookLead: 'Company, city, robot brand, SKU file. You get a stack and the unstable SKUs back.',
  bookCta: 'Go to the intake',
  bookBring: 'What to send: a SKU CSV (sku_id, length_mm, width_mm, height_mm, weight_kg) and, if you have one, a cell layout PDF.',
  offersTitle: 'How work starts',
  offerSession: 'Stack review',
  offerSessionBody: 'Your SKU list, stacked. Unstable SKUs named. No slides.',
  offerRetainer: 'Cell scope',
  offerRetainerBody: 'Once the stack is agreed: robot adapter, gripper class, acceptance test — scoped with your integrator.',
  offerIntegration: 'Integration',
  offerIntegrationBody: 'Priced after the SKU problem is on the table, never before.',

  footAbout: 'Mixed-SKU palletizing software for cells built by integrators. Operated from Frankfurt am Main.',
  footNet: 'Elsewhere',
  footLegal: 'Legal',
  footDisambiguation:
    'Not affiliated with Grimaldi Engineering Ltd (UK automotive workshop) or the Grimaldi Group (shipping, Naples).',
  netSoftware: 'software portfolio',
  netPersonal: 'personal site',
  impressum: 'Impressum',
  datenschutz: 'Privacy policy',
  rights: '© 2026 Vincenzo Ceccarelli Grimaldi. All rights reserved.',
  authorLine: 'Written and maintained by Vincenzo Ceccarelli Grimaldi, Frankfurt am Main.',
};

const de: Dict = {
  brandTag: 'Palettiersoftware · Frankfurt',
  navMenu: 'Menü',
  navClose: 'Menü schließen',
  skipToContent: 'Zum Inhalt springen',
  primaryNav: 'Hauptnavigation',
  navAbout: 'Über',
  navBook: 'SKU-Liste senden',
  langLabel: 'Sprache',
  calcCardTag: 'Werkzeuge',

  homeKicker: 'PALETTIERSOFTWARE · FRANKFURT',
  homeH1: 'Mixed-SKU-Palettiersoftware für den Roboter, den Sie schon haben.',
  homeLead:
    'Dichte, Stabilität und Taktzeit aus Ihrer echten SKU-Liste. Roboterunabhängiger Planer; der Arm bleibt Ihrer.',
  ctaBook: 'SKU-Liste senden',
  ctaForge: 'Werkzeuge öffnen',
  open: 'Öffnen →',

  forgeKicker: 'Forge · Labor',
  forgeTitle: 'Gleiche Controller-These. Anderer Endeffektor.',
  forgeIntro:
    'Der Palletizer ist das ausgelieferte Produkt. Alles Weitere auf dieser Seite ist eine Labornotiz zur selben Controller-These mit anderem Endeffektor. Keine Einheit im Verkauf.',
  labKicker: 'Labor',
  labTitle: 'Netzfrequenz unter Last — ein Statik-Modell',
  labIntro:
    'Ein Drei-Phasen-Oszilloskop mit Frequenz-Statik-Integrator: Δf = −f·0,04·ΔP, RoCoF durch Trägheit begrenzt. Die Anzeigen kommen aus dem Modell, nicht aus einer Animation.',
  labCta: 'Statik-Instrument öffnen',

  statusShipped: 'Software ausgeliefert',
  statusRepoOnly: 'Öffentliches Repo — kein Produktiveinsatz',
  statusLogPrep: 'Kein Baujournal veröffentlicht',

  wlTitle: 'Eine E-Mail, wenn etwas Echtes erscheint',
  wlBody: 'Double-Opt-in, kein Lärm, jederzeit abbestellbar.',
  wlEmailLabel: 'E-Mail-Adresse',
  wlInterestLabel: 'Mich interessiert',
  wlInterestPalletizer: 'Palletizer',
  wlInterestFloorforge: 'FloorForge',
  wlInterestHvLab: 'HV-Laborjournale',
  wlSubmit: 'Abonnieren',
  wlOk: 'Bitte bestätigen Sie die Anmeldung über die E-Mail in Ihrem Posteingang.',
  wlErrEmail: 'Das sieht nicht nach einer gültigen E-Mail-Adresse aus.',
  wlErrServer: 'Auf unserer Seite ist etwas fehlgeschlagen. Bitte versuchen Sie es später erneut.',
  wlErrUnconfigured: 'Das Abonnement-Backend ist noch nicht konfiguriert. Bitte versuchen Sie es später erneut.',
  wlPrivacy: 'Die Einwilligung ist jederzeit widerrufbar; Details in der Datenschutzerklärung.',

  bookTitle: 'SKU-Liste senden',
  bookLead: 'Firma, Stadt, Robotermarke, SKU-Datei. Sie erhalten einen Stapel und die instabilen SKUs zurück.',
  bookCta: 'Zum Formular',
  bookBring: 'Was Sie senden: eine SKU-CSV (sku_id, length_mm, width_mm, height_mm, weight_kg) und, falls vorhanden, ein Zellenlayout als PDF.',
  offersTitle: 'So beginnt die Arbeit',
  offerSession: 'Stapel-Review',
  offerSessionBody: 'Ihre SKU-Liste, gestapelt. Instabile SKUs benannt. Keine Folien.',
  offerRetainer: 'Zellen-Scope',
  offerRetainerBody: 'Sobald der Stapel abgestimmt ist: Roboter-Adapter, Greiferklasse, Abnahmetest — gemeinsam mit Ihrem Integrator.',
  offerIntegration: 'Integration',
  offerIntegrationBody: 'Bepreist, sobald das SKU-Problem auf dem Tisch liegt — nicht vorher.',

  footAbout: 'Mixed-SKU-Palettiersoftware für Zellen, die Integratoren bauen. Betrieben aus Frankfurt am Main.',
  footNet: 'Anderswo',
  footLegal: 'Rechtliches',
  footDisambiguation:
    'Nicht verbunden mit Grimaldi Engineering Ltd (Kfz-Werkstatt, UK) oder der Grimaldi Group (Schifffahrt, Neapel).',
  netSoftware: 'Software-Portfolio',
  netPersonal: 'persönliche Seite',
  impressum: 'Impressum',
  datenschutz: 'Datenschutzerklärung',
  rights: '© 2026 Vincenzo Ceccarelli Grimaldi. Alle Rechte vorbehalten.',
  authorLine: 'Verfasst und gepflegt von Vincenzo Ceccarelli Grimaldi, Frankfurt am Main.',
};

const dictionaries: Record<Lang, Dict> = { en, de };

export function getDict(lang: Lang): Dict {
  return dictionaries[lang];
}

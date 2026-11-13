import type { Lang } from "./i18n";
const en = {
  brandTag: "Companies Hub · Time to Power & NeuralBridge", navBook: "Inquire", navMenu: "Menu", navClose: "Close",
  langLabel: "Language", skipToContent: "Skip to content", primaryNav: "Primary navigation",
  stageLine: "Pilot-stage · founder-led · Frankfurt / Aachen / Toronto",
  footAbout: "Umbrella hub for Time to Power (Gridforge) power-capacity intelligence and NeuralBridge industrial autonomous assurance. Product sites remain primary.",
  footDisambiguation: "Name disambiguation: Grimaldi Engineering is the independent venture hub of Vincenzo Ceccarelli Grimaldi in Germany and is unaffiliated with Grimaldi Group S.p.A. (Naples).",
  footNet: "Companies & Domains", footLegal: "Hub & Legal", impressum: "Impressum", datenschutz: "Privacy / Datenschutz",
  rights: "All rights reserved.", authorLine: "Independent of and outside the scope of employment at DB InfraGO AG.",
};
const de: typeof en = {
  brandTag: "Unternehmens-Hub · Time to Power & NeuralBridge", navBook: "Anfragen", navMenu: "Menü", navClose: "Schließen",
  langLabel: "Sprache", skipToContent: "Zum Inhalt springen", primaryNav: "Hauptnavigation",
  stageLine: "Pilotphase · gründergeführt · Frankfurt / Aachen / Toronto",
  footAbout: "Dach-Hub für Time to Power (Gridforge) Leistungskapazitäts-Intelligenz und NeuralBridge industrielle autonome Sicherheitsnachweise. Produktseiten sind primär.",
  footDisambiguation: "Namensklarstellung: Grimaldi Engineering ist der unabhängige Ingenieur-Hub von Vincenzo Ceccarelli Grimaldi in Deutschland und steht in keiner Verbindung zur Grimaldi Group S.p.A. (Neapel).",
  footNet: "Unternehmen & Domains", footLegal: "Hub & Rechtliches", impressum: "Impressum", datenschutz: "Datenschutz",
  rights: "Alle Rechte vorbehalten.", authorLine: "Unabhängig von und außerhalb meiner Tätigkeit bei der DB InfraGO AG.",
};
export function getDict(lang: Lang) { return lang === "de" ? de : en; }

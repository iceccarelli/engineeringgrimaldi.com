import type { Localized } from "./i18n";
export type NavSection = { id: string; path: string; label: Localized };
export const NAV: NavSection[] = [
  { id: "ttp", path: "/time-to-power", label: { en: "Time to Power", de: "Time to Power" } },
  { id: "nb", path: "/neuralbridge", label: { en: "NeuralBridge", de: "NeuralBridge" } },
  { id: "foundation", path: "/foundation", label: { en: "Foundation", de: "Fundament" } },
  { id: "prospect", path: "/prospect", label: { en: "Critical Path", de: "Engpass & Maßstab" } },
  { id: "about", path: "/about", label: { en: "About", de: "Über uns" } },
];
export function allNavPaths(): string[] { return [...NAV.map((n) => n.path), "/contact"]; }

import type { Metadata } from "next";
import { SITE_URL } from "./site";
export type Lang = "en" | "de";
export const LANGS: readonly Lang[] = ["en", "de"] as const;
export function isLang(v: string): v is Lang { return v === "en" || v === "de"; }
export function langHref(lang: Lang, p: string): string { const c = p === "/" ? "" : p; return lang === "en" ? c || "/" : "/de" + c || "/de"; }
export function pageAlternates(lang: Lang, p: string): Metadata["alternates"] {
  return { canonical: SITE_URL + langHref(lang, p), languages: { en: SITE_URL + langHref("en", p), de: SITE_URL + langHref("de", p), "x-default": SITE_URL + langHref("en", p) } };
}
export type Localized = { en: string; de: string };
export function pick(lang: Lang, v: Localized): string { return v[lang]; }

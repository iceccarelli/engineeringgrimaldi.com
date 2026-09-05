/**
 * VISUALIZATION TOKENS — one system for every chart on the site.
 *
 * Four data colours, validated with the dataviz six-checks validator on the
 * paper surface #F6F7F4 (lightness band, chroma floor, CVD separation,
 * normal-vision floor, contrast ≥ 3:1 — all PASS; the amber↔red pair sits at
 * ΔE 7.6 deutan, which is legal only with secondary encoding, so every mark
 * in this system also carries a direct text label and a 2 px surface gap).
 *
 * Colour follows the ENTITY'S TIER, never its rank or position:
 *   keep    — CORE, MODULE, exists, active, decided, benchmarked, deterministic
 *   support — RESEARCH, INTERNAL, specified, building, partial, data
 *   hold    — EXPERIMENT, proposed, unbenchmarked, unlocated, probabilistic
 *   kill    — ARCHIVE, missing, killed, locked
 * Text never wears a data colour; labels use ink / muted.
 *
 * Charts are server-rendered SVG: no client JavaScript, so they prerender
 * with the page, cost nothing on first load, and read identically to
 * crawlers and agents. Hover detail is native <title>; every figure has a
 * table twin in the page.
 */

export const VIZ = {
  keep: '#0B7A4B',
  support: '#2458B3',
  hold: '#A87A00',
  kill: '#C81E3A',
  ink: '#12151A',
  muted: '#5C6570',
  line: '#D7DCD6',
  surface: '#F6F7F4',
  panel: '#FFFFFF',
  signal: '#FF8A00',
} as const;

export type Tier = 'keep' | 'support' | 'hold' | 'kill';

const TIER_OF: Record<string, Tier> = {
  CORE: 'keep', MODULE: 'keep', RESEARCH: 'support', INTERNAL: 'support', EXPERIMENT: 'hold', ARCHIVE: 'kill',
  exists: 'keep', merging: 'support', specified: 'support', research: 'support', missing: 'kill',
  active: 'keep', building: 'support', locked: 'kill',
  deterministic: 'keep', probabilistic: 'hold', data: 'support', integration: 'support',
  decided: 'keep', proposed: 'hold', reversed: 'kill',
  benchmarked: 'keep', partial: 'support', unbenchmarked: 'hold', watch: 'support',
  sold: 'keep', validating: 'support', killed: 'kill',
  public: 'keep', private: 'support', unlocated: 'hold',
  none: 'kill', low: 'hold', medium: 'support', high: 'keep',
};

export function tierOf(value: string): Tier {
  return TIER_OF[value] ?? 'support';
}

export function colorOf(value: string): string {
  return VIZ[tierOf(value)];
}

/** Ordinal grade → 0..3 for the value/risk matrix. */
export function gradeIndex(g: 'none' | 'low' | 'medium' | 'high'): number {
  return ['none', 'low', 'medium', 'high'].indexOf(g);
}

/** Mark specs from the dataviz system. */
export const MARK = { bar: 20, gap: 2, radius: 4, dot: 5, line: 2 } as const;

/** Text style shared by every SVG, in the site's mono face. */
export const SVG_TEXT = { fontFamily: "'IBM Plex Mono', ui-monospace, Menlo, monospace", fontSize: 11 } as const;

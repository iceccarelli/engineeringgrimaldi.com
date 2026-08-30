/**
 * Pallet layer-pattern engine.
 *
 * The geometry search lives in lib/rectpack.ts (shared with the vehicle
 * load solver). This module adds the pallet-specific layer: vertical
 * stacking bounded by usable height AND by payload mass, plus the
 * utilisation figures an engineer actually argues about.
 *
 * HONESTY BOUNDARY: this computes GEOMETRY. It is not a load-stability,
 * crush-strength or transport-safety calculation, and the UI says so.
 *
 * Axes: x runs along pallet length, y along pallet width. All lengths in
 * millimetres, all masses in kilograms.
 */

import {
  enumeratePatterns,
  shortlistPatterns,
  type Pattern,
  type Placement,
} from './rectpack';

export type { Placement, Pattern };
/** Kept for call sites that read better with a domain name. */
export type LayerPattern = Pattern;

export type PalletSpec = {
  length: number;
  width: number;
  /** Height of the empty pallet itself. */
  height: number;
  /** Maximum total height INCLUDING the pallet. */
  maxLoadHeight: number;
  /** Maximum payload mass excluding the pallet. */
  maxLoadWeight: number;
};

export type BoxSpec = {
  length: number;
  width: number;
  height: number;
  weight: number;
};

export type PalletizationResult = {
  ok: boolean;
  /** Set when ok === false: which input made the solve impossible. */
  reason?: 'box-too-large' | 'no-vertical-room' | 'invalid-input';
  best: LayerPattern | null;
  alternatives: LayerPattern[];
  layers: number;
  layersByHeight: number;
  layersByWeight: number;
  limitedBy: 'height' | 'weight' | 'both' | 'none';
  totalCases: number;
  /** Footprint of one layer over pallet deck area, 0..1. */
  areaUtilisation: number;
  /** Box volume over usable cube, 0..1. */
  volumeUtilisation: number;
  loadHeight: number;
  loadWeight: number;
  usableHeight: number;
};

/** Enumerate candidate layer patterns, best first. */
export function layerPatterns(pallet: PalletSpec, box: BoxSpec): LayerPattern[] {
  return enumeratePatterns(pallet.length, pallet.width, { length: box.length, width: box.width });
}

export function palletize(pallet: PalletSpec, box: BoxSpec): PalletizationResult {
  const empty: PalletizationResult = {
    ok: false,
    best: null,
    alternatives: [],
    layers: 0,
    layersByHeight: 0,
    layersByWeight: 0,
    limitedBy: 'none',
    totalCases: 0,
    areaUtilisation: 0,
    volumeUtilisation: 0,
    loadHeight: pallet.height,
    loadWeight: 0,
    usableHeight: 0,
  };

  const positive = [
    pallet.length, pallet.width, pallet.maxLoadHeight, pallet.maxLoadWeight,
    box.length, box.width, box.height, box.weight,
  ].every((v) => Number.isFinite(v) && v > 0);
  if (!positive || pallet.height < 0) return { ...empty, reason: 'invalid-input' };

  const usableHeight = pallet.maxLoadHeight - pallet.height;
  if (usableHeight < box.height) {
    return { ...empty, reason: 'no-vertical-room', usableHeight: Math.max(0, usableHeight) };
  }

  const ranked = layerPatterns(pallet, box);
  const best = ranked[0];
  if (!best || best.count === 0) return { ...empty, reason: 'box-too-large', usableHeight };

  const layersByHeight = Math.floor(usableHeight / box.height);
  const layerWeight = best.count * box.weight;
  const layersByWeight = layerWeight > 0 ? Math.floor(pallet.maxLoadWeight / layerWeight) : 0;
  const layers = Math.max(0, Math.min(layersByHeight, layersByWeight));

  if (layers === 0) {
    return {
      ...empty,
      reason: 'no-vertical-room',
      best,
      alternatives: shortlistPatterns(ranked.slice(1), 3),
      layersByHeight,
      layersByWeight,
      limitedBy: layersByWeight === 0 ? 'weight' : 'height',
      usableHeight,
    };
  }

  const totalCases = best.count * layers;
  const deckArea = pallet.length * pallet.width;
  const footprintArea = best.count * box.length * box.width;
  const usableCube = deckArea * usableHeight;
  const boxCube = totalCases * box.length * box.width * box.height;

  let limitedBy: PalletizationResult['limitedBy'] = 'none';
  if (layersByHeight === layersByWeight) limitedBy = 'both';
  else if (layers === layersByHeight) limitedBy = 'height';
  else limitedBy = 'weight';

  return {
    ok: true,
    best,
    alternatives: shortlistPatterns(ranked.slice(1), 3),
    layers,
    layersByHeight,
    layersByWeight,
    limitedBy,
    totalCases,
    areaUtilisation: deckArea > 0 ? footprintArea / deckArea : 0,
    volumeUtilisation: usableCube > 0 ? boxCube / usableCube : 0,
    loadHeight: pallet.height + layers * box.height,
    loadWeight: totalCases * box.weight,
    usableHeight,
  };
}

/** Standard decks offered in the UI. */
export const PALLET_PRESETS: { id: string; label: string; length: number; width: number; height: number }[] = [
  { id: 'eur1', label: 'EUR / EPAL 1 — 1200 × 800', length: 1200, width: 800, height: 144 },
  { id: 'eur2', label: 'EUR 2 — 1200 × 1000', length: 1200, width: 1000, height: 144 },
  { id: 'iso-na', label: 'North American — 1219 × 1016 (48" × 40")', length: 1219, width: 1016, height: 140 },
  { id: 'half', label: 'Half / Düsseldorf — 800 × 600', length: 800, width: 600, height: 144 },
];

/** CSV export of the chosen layer — the artefact an engineer takes away. */
export function placementsToCsv(result: PalletizationResult, pallet: PalletSpec, box: BoxSpec): string {
  const rows: string[] = [];
  rows.push('# Grimaldi Engineering - pallet layer pattern (geometry only, not a stability certification)');
  rows.push(`# pallet_mm,${pallet.length},${pallet.width},deck_height_mm,${pallet.height}`);
  rows.push(`# box_mm,${box.length},${box.width},${box.height},box_kg,${box.weight}`);
  rows.push(`# cases_per_layer,${result.best?.count ?? 0},layers,${result.layers},total_cases,${result.totalCases}`);
  rows.push(`# load_height_mm,${result.loadHeight},load_weight_kg,${result.loadWeight.toFixed(2)}`);
  rows.push('index,x_mm,y_mm,footprint_x_mm,footprint_y_mm,rotated_deg');
  (result.best?.placements ?? []).forEach((p, i) => {
    rows.push(`${i + 1},${p.x},${p.y},${p.w},${p.d},${p.rotated ? 90 : 0}`);
  });
  return rows.join('\n');
}

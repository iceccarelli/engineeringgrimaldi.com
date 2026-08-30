/**
 * Case-size optimiser — the reverse question.
 *
 * The pattern calculator answers "how does MY case pack?". This answers
 * "which case size in the range I can actually order packs best?", which
 * is where the money is: case dimensions are chosen once, then paid for
 * on every pallet and every truck for years.
 *
 * OBJECTIVE. Candidates are ranked by CUBE UTILISATION — the share of the
 * usable pallet cube occupied by case volume. That is the honest general
 * objective: if the case is the vessel your product ships in, more case
 * volume per pallet is more product per pallet. Ranking by "cases per
 * pallet" alone would reward shrinking the case, which ships less.
 *
 * STATED SIMPLIFICATIONS (surfaced in the UI, not buried here):
 * - Every candidate in the range is assumed to physically suit the
 *   product. The range is the user's to set; we do not model fit,
 *   count-per-case, or integer product arrangement inside the case.
 * - Candidate mass is derived from the current case's density, so the
 *   payload limit stays meaningful across the sweep.
 * - Tooling, artwork, retail-shelf fit and carton-board cost are real
 *   and are NOT modelled. This ranks geometry only.
 */

import { maxCountIn } from './rectpack';
import type { PalletSpec } from './palletize';

export type CaseRange = {
  minLength: number;
  maxLength: number;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  /** Grid resolution in mm. Clamped to a sane minimum. */
  step: number;
};

export type CurrentCase = {
  length: number;
  width: number;
  height: number;
  weight: number;
};

export type Candidate = {
  length: number;
  width: number;
  height: number;
  weight: number;
  casesPerLayer: number;
  layers: number;
  totalCases: number;
  areaUtilisation: number;
  cubeUtilisation: number;
  loadHeight: number;
  loadWeight: number;
};

export type OptimizeResult = {
  ok: boolean;
  reason?: 'invalid-range' | 'nothing-fits' | 'invalid-input';
  /** The user's own case, evaluated on the same basis. */
  current: Candidate | null;
  /** Best candidates, cube utilisation descending. */
  best: Candidate[];
  evaluated: number;
  /** True when the grid was too large and the step was widened. */
  coarsened: boolean;
  effectiveStep: number;
  /** Percentage points of cube utilisation gained over the current case. */
  gainPoints: number;
  /** Extra cases per pallet versus the current case. */
  gainCases: number;
};

const MIN_STEP = 5;
const MAX_EVALUATIONS = 60000;

function axisValues(min: number, max: number, step: number): number[] {
  const out: number[] = [];
  for (let v = min; v <= max + 1e-9; v += step) out.push(Math.round(v));
  if (out.length === 0) out.push(min);
  return out;
}

function evaluate(
  pallet: PalletSpec,
  usableHeight: number,
  density: number,
  length: number,
  width: number,
  height: number,
  countPerLayer: number,
): Candidate | null {
  if (countPerLayer <= 0 || height <= 0 || height > usableHeight) return null;

  const volume = length * width * height;
  const weight = density * volume;
  const layersByHeight = Math.floor(usableHeight / height);
  const layerWeight = countPerLayer * weight;
  const layersByWeight = layerWeight > 0 ? Math.floor(pallet.maxLoadWeight / layerWeight) : 0;
  const layers = Math.max(0, Math.min(layersByHeight, layersByWeight));
  if (layers === 0) return null;

  const totalCases = countPerLayer * layers;
  const deckArea = pallet.length * pallet.width;
  const usableCube = deckArea * usableHeight;

  return {
    length,
    width,
    height,
    weight,
    casesPerLayer: countPerLayer,
    layers,
    totalCases,
    areaUtilisation: deckArea > 0 ? (countPerLayer * length * width) / deckArea : 0,
    cubeUtilisation: usableCube > 0 ? (totalCases * volume) / usableCube : 0,
    loadHeight: pallet.height + layers * height,
    loadWeight: totalCases * weight,
  };
}

export function optimiseCase(
  pallet: PalletSpec,
  current: CurrentCase,
  range: CaseRange,
  limit = 8,
): OptimizeResult {
  const empty: OptimizeResult = {
    ok: false,
    current: null,
    best: [],
    evaluated: 0,
    coarsened: false,
    effectiveStep: range.step,
    gainPoints: 0,
    gainCases: 0,
  };

  const numbers = [
    pallet.length, pallet.width, pallet.maxLoadHeight, pallet.maxLoadWeight,
    current.length, current.width, current.height, current.weight,
    range.minLength, range.maxLength, range.minWidth, range.maxWidth,
    range.minHeight, range.maxHeight, range.step,
  ];
  if (!numbers.every((v) => Number.isFinite(v) && v > 0)) return { ...empty, reason: 'invalid-input' };
  if (range.maxLength < range.minLength || range.maxWidth < range.minWidth || range.maxHeight < range.minHeight) {
    return { ...empty, reason: 'invalid-range' };
  }

  const usableHeight = pallet.maxLoadHeight - pallet.height;
  if (usableHeight <= 0) return { ...empty, reason: 'nothing-fits' };

  const density = current.weight / (current.length * current.width * current.height);

  // Widen the step if the requested grid is unreasonably large, and say so.
  let step = Math.max(MIN_STEP, Math.round(range.step));
  let coarsened = false;
  const gridSize = (s: number) =>
    axisValues(range.minLength, range.maxLength, s).length *
    axisValues(range.minWidth, range.maxWidth, s).length *
    axisValues(range.minHeight, range.maxHeight, s).length;
  while (gridSize(step) > MAX_EVALUATIONS) {
    step *= 2;
    coarsened = true;
  }

  const lengths = axisValues(range.minLength, range.maxLength, step);
  const widths = axisValues(range.minWidth, range.maxWidth, step);
  const heights = axisValues(range.minHeight, range.maxHeight, step);

  const found: Candidate[] = [];
  let evaluated = 0;

  for (const length of lengths) {
    for (const width of widths) {
      // Footprint packing is height-independent — compute it once.
      const countPerLayer = maxCountIn(pallet.length, pallet.width, { length, width });
      if (countPerLayer <= 0) {
        evaluated += heights.length;
        continue;
      }
      for (const height of heights) {
        evaluated += 1;
        const candidate = evaluate(pallet, usableHeight, density, length, width, height, countPerLayer);
        if (candidate) found.push(candidate);
      }
    }
  }

  const currentCount = maxCountIn(pallet.length, pallet.width, {
    length: current.length,
    width: current.width,
  });
  const currentCandidate = evaluate(
    pallet, usableHeight, density,
    current.length, current.width, current.height, currentCount,
  );

  if (found.length === 0) {
    return { ...empty, reason: 'nothing-fits', current: currentCandidate, evaluated, coarsened, effectiveStep: step };
  }

  // A case is defined by its footprint regardless of which side you call
  // "length": 400x300 and 300x400 are the same carton. Collapse them.
  // Packing already tries both orientations, so a candidate's length/width
  // labelling is free. Orient every survivor the same way round as the
  // current case, otherwise "same box, 20 mm taller" gets mis-scored below
  // as a full redesign.
  const currentLongFirst = current.length >= current.width;
  const orient = (c: Candidate): Candidate => {
    const lo = Math.min(c.length, c.width);
    const hi = Math.max(c.length, c.width);
    return { ...c, length: currentLongFirst ? hi : lo, width: currentLongFirst ? lo : hi };
  };

  const unique = new Map<string, Candidate>();
  for (const raw of found) {
    const c = orient(raw);
    const key = `${Math.min(c.length, c.width)}x${Math.max(c.length, c.width)}x${c.height}`;
    const seen = unique.get(key);
    if (!seen || c.cubeUtilisation > seen.cubeUtilisation) unique.set(key, c);
  }

  // Rank by cube utilisation, then by how little the case has to change.
  // An engineer can act on "same box, 20 mm taller"; they cannot act on
  // "redesign the carton" for the same result.
  const disruption = (c: Candidate) =>
    Math.abs(c.length - current.length) / current.length +
    Math.abs(c.width - current.width) / current.width +
    Math.abs(c.height - current.height) / current.height;

  const ranked = Array.from(unique.values()).sort((a, b) => {
    const cube = b.cubeUtilisation - a.cubeUtilisation;
    if (Math.abs(cube) > 1e-9) return cube;
    return disruption(a) - disruption(b);
  });

  const best = ranked.slice(0, limit);
  const top = best[0];

  return {
    ok: true,
    current: currentCandidate,
    best,
    evaluated,
    coarsened,
    effectiveStep: step,
    gainPoints: currentCandidate ? (top.cubeUtilisation - currentCandidate.cubeUtilisation) * 100 : 0,
    gainCases: currentCandidate ? top.totalCases - currentCandidate.totalCases : 0,
  };
}

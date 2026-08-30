/**
 * Pallet layer-pattern engine — pure, deterministic geometry.
 *
 * No ML, no heuristic hand-waving dressed up as optimisation: this is an
 * exhaustive search over a bounded family of well-known layer families
 * (uniform column, two-block split, four-block split), scored by cases
 * per layer. Every number the UI shows comes out of these functions.
 *
 * HONESTY BOUNDARY: this computes GEOMETRY. It is not a load-stability,
 * crush-strength or transport-safety calculation, and the UI says so.
 *
 * Axes: x runs along pallet length, y along pallet width. All lengths in
 * millimetres, all masses in kilograms.
 */

export type Placement = {
  x: number;
  y: number;
  /** Footprint along x. */
  w: number;
  /** Footprint along y. */
  d: number;
  /** True when the box is turned 90° from its nominal orientation. */
  rotated: boolean;
};

export type LayerPattern = {
  /** Stable key for i18n lookup: the UI translates it. */
  kind: 'column' | 'two-block' | 'four-block';
  placements: Placement[];
  count: number;
  /** Both orientations present — interlocks better across courses. */
  interlocked: boolean;
};

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

const MAX_SPLIT_CANDIDATES = 24;

/** Fill a rectangular region with one fixed box footprint, origin-anchored. */
function columnFill(
  originX: number,
  originY: number,
  regionL: number,
  regionW: number,
  footprintX: number,
  footprintY: number,
  rotated: boolean,
): Placement[] {
  if (footprintX <= 0 || footprintY <= 0) return [];
  const nx = Math.floor(regionL / footprintX);
  const ny = Math.floor(regionW / footprintY);
  if (nx <= 0 || ny <= 0) return [];
  const out: Placement[] = [];
  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < ny; j++) {
      out.push({
        x: originX + i * footprintX,
        y: originY + j * footprintY,
        w: footprintX,
        d: footprintY,
        rotated,
      });
    }
  }
  return out;
}

/** Best single-orientation fill of a region (tries both rotations). */
function packRegion(
  originX: number,
  originY: number,
  regionL: number,
  regionW: number,
  box: BoxSpec,
): Placement[] {
  const a = columnFill(originX, originY, regionL, regionW, box.length, box.width, false);
  const b = columnFill(originX, originY, regionL, regionW, box.width, box.length, true);
  return b.length > a.length ? b : a;
}

/** Split offsets worth testing along one axis: multiples of each footprint. */
function splitCandidates(span: number, box: BoxSpec): number[] {
  const set = new Set<number>([0]);
  for (const step of [box.length, box.width]) {
    if (step <= 0) continue;
    for (let v = step; v <= span; v += step) set.add(v);
  }
  return Array.from(set).sort((p, q) => p - q).slice(0, MAX_SPLIT_CANDIDATES);
}

function toPattern(kind: LayerPattern['kind'], placements: Placement[]): LayerPattern {
  const rotatedCount = placements.filter((p) => p.rotated).length;
  return {
    kind,
    placements,
    count: placements.length,
    interlocked: rotatedCount > 0 && rotatedCount < placements.length,
  };
}

/** Enumerate candidate layer patterns, best first. */
export function layerPatterns(pallet: PalletSpec, box: BoxSpec): LayerPattern[] {
  const L = pallet.length;
  const W = pallet.width;
  const found: LayerPattern[] = [];

  // 1 — uniform column, both orientations.
  found.push(toPattern('column', columnFill(0, 0, L, W, box.length, box.width, false)));
  found.push(toPattern('column', columnFill(0, 0, L, W, box.width, box.length, true)));

  // 2 — two-block split along each axis.
  for (const sx of splitCandidates(L, box)) {
    if (sx === 0 || sx >= L) continue;
    found.push(
      toPattern('two-block', [
        ...packRegion(0, 0, sx, W, box),
        ...packRegion(sx, 0, L - sx, W, box),
      ]),
    );
  }
  for (const sy of splitCandidates(W, box)) {
    if (sy === 0 || sy >= W) continue;
    found.push(
      toPattern('two-block', [
        ...packRegion(0, 0, L, sy, box),
        ...packRegion(0, sy, L, W - sy, box),
      ]),
    );
  }

  // 3 — four-block (quadrant) split; subsumes pinwheel-style layouts.
  for (const sx of splitCandidates(L, box)) {
    if (sx === 0 || sx >= L) continue;
    for (const sy of splitCandidates(W, box)) {
      if (sy === 0 || sy >= W) continue;
      found.push(
        toPattern('four-block', [
          ...packRegion(0, 0, sx, sy, box),
          ...packRegion(sx, 0, L - sx, sy, box),
          ...packRegion(0, sy, sx, W - sy, box),
          ...packRegion(sx, sy, L - sx, W - sy, box),
        ]),
      );
    }
  }

  // Rank: more cases wins; on a tie prefer an interlocked layer, then the
  // simpler construction (fewer blocks) for a cell that has to build it.
  const rank = { column: 0, 'two-block': 1, 'four-block': 2 } as const;
  return found
    .filter((p) => p.count > 0)
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      if (a.interlocked !== b.interlocked) return a.interlocked ? -1 : 1;
      return rank[a.kind] - rank[b.kind];
    });
}

/** Distinct-by-count shortlist, so the UI shows real alternatives. */
function shortlist(patterns: LayerPattern[], limit: number): LayerPattern[] {
  const seen = new Set<string>();
  const out: LayerPattern[] = [];
  for (const p of patterns) {
    const key = `${p.count}:${p.kind}:${p.interlocked}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
    if (out.length >= limit) break;
  }
  return out;
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
      alternatives: shortlist(ranked.slice(1), 3),
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
    alternatives: shortlist(ranked.slice(1), 3),
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

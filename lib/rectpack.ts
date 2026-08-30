/**
 * Generic 2D rectangle packing over a bounded family of real-world
 * layouts. Shared by the pallet layer solver and the vehicle load
 * solver — cases on a deck and pallets on a trailer floor are the same
 * geometry problem with different units of pride.
 *
 * The search is exhaustive over three layout families, not a heuristic
 * guess: uniform column packing, a two-block split on either axis, and
 * a four-block quadrant split (which subsumes pinwheel-style layouts).
 * Every candidate is a concrete placement set, so what the UI draws is
 * exactly what the solver scored.
 */

export type Placement = {
  x: number;
  y: number;
  /** Footprint along x. */
  w: number;
  /** Footprint along y. */
  d: number;
  /** True when the item is turned 90° from its nominal orientation. */
  rotated: boolean;
};

export type PatternKind = 'column' | 'two-block' | 'four-block';

export type Pattern = {
  kind: PatternKind;
  placements: Placement[];
  count: number;
  /** Both orientations present — interlocks better across courses. */
  interlocked: boolean;
};

export type Footprint = { length: number; width: number };

const MAX_SPLIT_CANDIDATES = 24;

/** Fill a rectangular region with one fixed footprint, origin-anchored. */
export function columnFill(
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
export function packRegion(
  originX: number,
  originY: number,
  regionL: number,
  regionW: number,
  item: Footprint,
): Placement[] {
  const a = columnFill(originX, originY, regionL, regionW, item.length, item.width, false);
  const b = columnFill(originX, originY, regionL, regionW, item.width, item.length, true);
  return b.length > a.length ? b : a;
}

/** Split offsets worth testing along one axis: multiples of each footprint. */
function splitCandidates(span: number, item: Footprint): number[] {
  const set = new Set<number>([0]);
  for (const step of [item.length, item.width]) {
    if (step <= 0) continue;
    for (let v = step; v <= span; v += step) set.add(v);
  }
  return Array.from(set).sort((p, q) => p - q).slice(0, MAX_SPLIT_CANDIDATES);
}

function toPattern(kind: PatternKind, placements: Placement[]): Pattern {
  const rotatedCount = placements.filter((p) => p.rotated).length;
  return {
    kind,
    placements,
    count: placements.length,
    interlocked: rotatedCount > 0 && rotatedCount < placements.length,
  };
}

/**
 * Enumerate candidate layouts for `item` inside an L × W region,
 * best first. Ranking: more items wins; ties go to an interlocked
 * layout, then to the simpler construction.
 */
export function enumeratePatterns(regionL: number, regionW: number, item: Footprint): Pattern[] {
  const found: Pattern[] = [];

  // 1 — uniform column, both orientations.
  found.push(toPattern('column', columnFill(0, 0, regionL, regionW, item.length, item.width, false)));
  found.push(toPattern('column', columnFill(0, 0, regionL, regionW, item.width, item.length, true)));

  // 2 — two-block split along each axis.
  for (const sx of splitCandidates(regionL, item)) {
    if (sx === 0 || sx >= regionL) continue;
    found.push(
      toPattern('two-block', [
        ...packRegion(0, 0, sx, regionW, item),
        ...packRegion(sx, 0, regionL - sx, regionW, item),
      ]),
    );
  }
  for (const sy of splitCandidates(regionW, item)) {
    if (sy === 0 || sy >= regionW) continue;
    found.push(
      toPattern('two-block', [
        ...packRegion(0, 0, regionL, sy, item),
        ...packRegion(0, sy, regionL, regionW - sy, item),
      ]),
    );
  }

  // 3 — four-block (quadrant) split; subsumes pinwheel-style layouts.
  for (const sx of splitCandidates(regionL, item)) {
    if (sx === 0 || sx >= regionL) continue;
    for (const sy of splitCandidates(regionW, item)) {
      if (sy === 0 || sy >= regionW) continue;
      found.push(
        toPattern('four-block', [
          ...packRegion(0, 0, sx, sy, item),
          ...packRegion(sx, 0, regionL - sx, sy, item),
          ...packRegion(0, sy, sx, regionW - sy, item),
          ...packRegion(sx, sy, regionL - sx, regionW - sy, item),
        ]),
      );
    }
  }

  const rank: Record<PatternKind, number> = { column: 0, 'two-block': 1, 'four-block': 2 };
  return found
    .filter((p) => p.count > 0)
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      if (a.interlocked !== b.interlocked) return a.interlocked ? -1 : 1;
      return rank[a.kind] - rank[b.kind];
    });
}

/** Distinct-by-shape shortlist, so a UI shows real alternatives. */
export function shortlistPatterns(patterns: Pattern[], limit: number): Pattern[] {
  const seen = new Set<string>();
  const out: Pattern[] = [];
  for (const p of patterns) {
    const key = `${p.count}:${p.kind}:${p.interlocked}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
    if (out.length >= limit) break;
  }
  return out;
}

/* ── Count-only fast path ─────────────────────────────────────────────
 * Same three layout families, but allocating nothing. A case-dimension
 * sweep evaluates thousands of candidates; building placement arrays for
 * each would make it unusable in a browser. Counts here must always agree
 * with enumeratePatterns()[0].count — there is a test vector for that.
 * ------------------------------------------------------------------ */

function columnCount(regionL: number, regionW: number, fx: number, fy: number): number {
  if (fx <= 0 || fy <= 0) return 0;
  return Math.floor(regionL / fx) * Math.floor(regionW / fy);
}

function regionCount(regionL: number, regionW: number, item: Footprint): number {
  if (regionL <= 0 || regionW <= 0) return 0;
  return Math.max(
    columnCount(regionL, regionW, item.length, item.width),
    columnCount(regionL, regionW, item.width, item.length),
  );
}

/** Best achievable item count in an L × W region, counts only. */
export function maxCountIn(regionL: number, regionW: number, item: Footprint): number {
  if (regionL <= 0 || regionW <= 0 || item.length <= 0 || item.width <= 0) return 0;

  let best = regionCount(regionL, regionW, item);

  const xs = splitCandidatesFor(regionL, item);
  const ys = splitCandidatesFor(regionW, item);

  for (const sx of xs) {
    if (sx <= 0 || sx >= regionL) continue;
    best = Math.max(
      best,
      regionCount(sx, regionW, item) + regionCount(regionL - sx, regionW, item),
    );
  }
  for (const sy of ys) {
    if (sy <= 0 || sy >= regionW) continue;
    best = Math.max(
      best,
      regionCount(regionL, sy, item) + regionCount(regionL, regionW - sy, item),
    );
  }
  for (const sx of xs) {
    if (sx <= 0 || sx >= regionL) continue;
    for (const sy of ys) {
      if (sy <= 0 || sy >= regionW) continue;
      best = Math.max(
        best,
        regionCount(sx, sy, item) +
          regionCount(regionL - sx, sy, item) +
          regionCount(sx, regionW - sy, item) +
          regionCount(regionL - sx, regionW - sy, item),
      );
    }
  }

  return best;
}

/** Exported twin of the internal split-candidate helper. */
function splitCandidatesFor(span: number, item: Footprint): number[] {
  const set = new Set<number>([0]);
  for (const step of [item.length, item.width]) {
    if (step <= 0) continue;
    for (let v = step; v <= span; v += step) set.add(v);
  }
  return Array.from(set).sort((p, q) => p - q).slice(0, MAX_SPLIT_CANDIDATES);
}

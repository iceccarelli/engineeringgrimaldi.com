/**
 * Mixed-SKU stack planner — the product's planning core, in the browser.
 *
 * Deterministic and geometry-derived: a SKU list becomes concrete
 * placements (x, y, z, rotation, layer), and every figure shown next to
 * the layer map — density, stability, support, centre of mass, crush
 * load — is computed from those placements. Nothing is sampled, nothing
 * is tuned to look good.
 *
 * The algorithm mirrors the upstream Python optimizer
 * (github.com/iceccarelli/palletizer, palletizer_full/optimizer.py):
 * boxes grouped into height-similar layers, each layer shelf-packed
 * first-fit-decreasing by footprint with 90° rotation allowed. Stability
 * is 0.6 × base-support ratio + 0.4 × centre-of-mass score. On top of the
 * upstream model this module adds an optional per-SKU crush limit
 * (max_stack_kg) and reports the resulting faults by SKU.
 *
 * HONESTY BOUNDARY: a heuristic planner and a static stability model.
 * It is not a dynamic (acceleration, wrapping, transport) certification.
 * Units: millimetres and kilograms throughout.
 */

export type Sku = {
  id: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  /** Maximum load this box may carry on top of it, kg. Optional. */
  maxStack: number | null;
};

export type Box = Sku & { seq: number };

export type PalletSpec = {
  length: number;
  width: number;
  /** Maximum stack height above the deck (excluding the pallet itself). */
  maxHeight: number;
  /** Maximum payload mass. */
  maxWeight: number;
};

export type Placement = {
  id: string;
  seq: number;
  x: number;
  y: number;
  z: number;
  /** Footprint along x after rotation. */
  l: number;
  /** Footprint along y after rotation. */
  w: number;
  h: number;
  weight: number;
  rot: 0 | 90;
  layer: number;
  /** Fraction of footprint supported by the layer below (1 on the deck). */
  support: number;
  /** Mass resting on this box, kg, from every higher layer. */
  loadOnTop: number;
  crushed: boolean;
};

export type FaultLevel = 'fault' | 'hold' | 'ok';

export type Fault = {
  level: FaultLevel;
  code: string;
  /** Human copy in both languages, already formatted. */
  en: string;
  de: string;
  sku?: string;
};

export type CellState = 'IDLE' | 'RUN' | 'HOLD' | 'FAULT';

export type Plan = {
  placements: Placement[];
  unplaced: { id: string; reason: 'deck' | 'height' | 'weight' }[];
  layers: number;
  stackHeight: number;
  totalWeight: number;
  boxesIn: number;
  boxesPlaced: number;
  /** Placed volume over pallet footprint × stack height. */
  density: number;
  supportScore: number;
  comScore: number;
  /** Centre-of-mass offset from pallet centre, fraction of half diagonal. */
  comOffset: number;
  stability: number;
  faults: Fault[];
  state: CellState;
  /** Estimated pick-and-place cycle time at the stated seconds per pick. */
  cycleSeconds: number;
};

export const DEFAULT_PALLET: PalletSpec = { length: 1200, width: 800, maxHeight: 1650, maxWeight: 1000 };

/** Planning assumption for the cycle-time figure; stated in the UI. */
export const SECONDS_PER_PICK = 6;

export const MAX_BOXES = 400;

export const CSV_HEADER = 'sku_id,length_mm,width_mm,height_mm,weight_kg,qty,max_stack_kg';

/** The six-row sample every visitor sees stacked before they type. */
export const SAMPLE_CSV = `${CSV_HEADER}
SKU-01,400,300,250,8.5,6,60
SKU-02,600,400,300,15,4,120
SKU-03,300,200,200,4,10,20
SKU-04,400,400,280,11,6,80
SKU-05,250,250,200,3.2,8,15
SKU-06,400,200,250,2.4,3,20`;

/* ── CSV ───────────────────────────────────────────────────────────── */

export type ParseResult = { skus: Box[]; errors: Fault[] };

const HEADER_ALIASES: Record<string, keyof Sku | 'qty'> = {
  sku_id: 'id', sku: 'id', id: 'id', artikel: 'id', article: 'id', name: 'id',
  length_mm: 'length', length: 'length', l: 'length', laenge: 'length', länge: 'length', laenge_mm: 'length',
  width_mm: 'width', width: 'width', w: 'width', breite: 'width', breite_mm: 'width',
  height_mm: 'height', height: 'height', h: 'height', hoehe: 'height', höhe: 'height', hoehe_mm: 'height',
  weight_kg: 'weight', weight: 'weight', kg: 'weight', gewicht: 'weight', gewicht_kg: 'weight', mass_kg: 'weight',
  qty: 'qty', quantity: 'qty', count: 'qty', menge: 'qty', anzahl: 'qty', n: 'qty',
  max_stack_kg: 'maxStack', max_stack: 'maxStack', crush_kg: 'maxStack', stapellast_kg: 'maxStack', top_load_kg: 'maxStack',
};

function toNumber(raw: string): number {
  const s = raw.trim().replace(/\s/g, '');
  if (s === '') return NaN;
  // German decimals: "8,5" → 8.5 (only when no dot is present).
  const normalised = s.includes(',') && !s.includes('.') ? s.replace(',', '.') : s.replace(/,/g, '');
  return Number(normalised);
}

/** Parse a SKU CSV. Comma or semicolon delimited, header required. */
export function parseSkuCsv(text: string): ParseResult {
  const errors: Fault[] = [];
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l !== '' && !l.startsWith('#'));
  if (lines.length === 0) {
    errors.push(fault('fault', 'E-CSV-EMPTY', 'CSV is empty.', 'CSV ist leer.'));
    return { skus: [], errors };
  }
  const delimiter = (lines[0].match(/;/g) ?? []).length > (lines[0].match(/,/g) ?? []).length ? ';' : ',';
  const split = (line: string) => line.split(delimiter).map((c) => c.trim().replace(/^"|"$/g, ''));

  const header = split(lines[0]).map((h) => h.toLowerCase().replace(/[^a-zäöü_]/g, ''));
  const columns = header.map((h) => HEADER_ALIASES[h] ?? null);
  const need: (keyof Sku)[] = ['id', 'length', 'width', 'height'];
  for (const key of need) {
    if (!columns.includes(key)) {
      errors.push(fault('fault', 'E-CSV-HEADER', `Header missing column: ${key === 'id' ? 'sku_id' : `${key}_mm`}.`, `Kopfzeile ohne Spalte: ${key === 'id' ? 'sku_id' : `${key}_mm`}.`));
    }
  }
  if (errors.length > 0) return { skus: [], errors };

  const skus: Box[] = [];
  let seq = 0;
  for (let i = 1; i < lines.length; i++) {
    const cells = split(lines[i]);
    const row: Partial<Record<keyof Sku | 'qty', string>> = {};
    columns.forEach((key, idx) => { if (key) row[key] = cells[idx] ?? ''; });
    const id = (row.id ?? '').trim() || `ROW-${i}`;
    const length = toNumber(row.length ?? '');
    const width = toNumber(row.width ?? '');
    const height = toNumber(row.height ?? '');
    const weight = row.weight === undefined || row.weight === '' ? 0 : toNumber(row.weight);
    const qty = row.qty === undefined || row.qty === '' ? 1 : Math.floor(toNumber(row.qty));
    const maxStack = row.maxStack === undefined || row.maxStack === '' ? null : toNumber(row.maxStack);

    if (![length, width, height].every((v) => Number.isFinite(v) && v > 0)) {
      errors.push(fault('fault', 'E-ROW-DIM', `${id}: length, width and height must be positive millimetres (row ${i + 1}).`, `${id}: Länge, Breite und Höhe müssen positive Millimeter sein (Zeile ${i + 1}).`, id));
      continue;
    }
    if (!Number.isFinite(weight) || weight < 0) {
      errors.push(fault('fault', 'E-ROW-KG', `${id}: weight_kg must be a number ≥ 0 (row ${i + 1}).`, `${id}: weight_kg muss eine Zahl ≥ 0 sein (Zeile ${i + 1}).`, id));
      continue;
    }
    if (!Number.isFinite(qty) || qty < 1) {
      errors.push(fault('fault', 'E-ROW-QTY', `${id}: qty must be an integer ≥ 1 (row ${i + 1}).`, `${id}: qty muss eine ganze Zahl ≥ 1 sein (Zeile ${i + 1}).`, id));
      continue;
    }
    if (maxStack !== null && (!Number.isFinite(maxStack) || maxStack < 0)) {
      errors.push(fault('fault', 'E-ROW-STACK', `${id}: max_stack_kg must be a number ≥ 0 (row ${i + 1}).`, `${id}: max_stack_kg muss eine Zahl ≥ 0 sein (Zeile ${i + 1}).`, id));
      continue;
    }
    for (let q = 0; q < qty; q++) {
      if (seq >= MAX_BOXES) break;
      skus.push({ id, length, width, height, weight, maxStack, seq: seq++ });
    }
  }
  if (seq >= MAX_BOXES) {
    errors.push(fault('hold', 'H-CSV-CAP', `List capped at ${MAX_BOXES} boxes for the browser planner.`, `Liste für den Browser-Planer auf ${MAX_BOXES} Kartons begrenzt.`));
  }
  if (skus.length === 0 && errors.length === 0) {
    errors.push(fault('fault', 'E-CSV-ROWS', 'No data rows under the header.', 'Keine Datenzeilen unter der Kopfzeile.'));
  }
  return { skus, errors };
}

function fault(level: FaultLevel, code: string, en: string, de: string, sku?: string): Fault {
  return { level, code, en, de, sku };
}

/* ── Packing ───────────────────────────────────────────────────────── */

type Rect = { x: number; y: number; l: number; w: number };

function overlapArea(a: Rect, b: Rect): number {
  const dx = Math.max(0, Math.min(a.x + a.l, b.x + b.l) - Math.max(a.x, b.x));
  const dy = Math.max(0, Math.min(a.y + a.w, b.y + b.w) - Math.max(a.y, b.y));
  return dx * dy;
}

/** Boxes within this fraction of the layer's tallest box may share a layer,
 *  so every layer presents a near-flat top face to the one above. */
const LAYER_HEIGHT_TOLERANCE = 0.1;

/** Shelf-pack one layer; returns placements and the leftover boxes. */
function packLayer(boxes: Box[], pallet: PalletSpec, z: number, layer: number): { placed: Placement[]; leftover: Box[] } {
  const placed: Placement[] = [];
  const leftover: Box[] = [];
  const tallest = Math.max(...boxes.map((b) => b.height));
  const eligible = boxes.filter((b) => b.height >= tallest * (1 - LAYER_HEIGHT_TOLERANCE));
  for (const b of boxes) if (!eligible.includes(b)) leftover.push(b);
  const ordered = [...eligible].sort((a, b) => b.length * b.width - a.length * a.width || a.seq - b.seq);

  let xCursor = 0;
  let yCursor = 0;
  let shelfDepth = 0;
  const eps = 1e-6;

  for (const box of ordered) {
    let done = false;
    const orientations: [number, number, 0 | 90][] = [
      [box.length, box.width, 0],
      [box.width, box.length, 90],
    ];
    for (const [l, w, rot] of orientations) {
      if (l > pallet.length + eps || w > pallet.width + eps) continue;
      if (xCursor + l <= pallet.length + eps && yCursor + w <= pallet.width + eps) {
        placed.push(mk(box, xCursor, yCursor, z, l, w, rot, layer));
        xCursor += l;
        shelfDepth = Math.max(shelfDepth, w);
        done = true;
        break;
      }
      const newY = yCursor + shelfDepth;
      if (newY + w <= pallet.width + eps) {
        yCursor = newY;
        xCursor = 0;
        shelfDepth = w;
        placed.push(mk(box, xCursor, yCursor, z, l, w, rot, layer));
        xCursor += l;
        done = true;
        break;
      }
    }
    if (!done) leftover.push(box);
  }
  return { placed, leftover };
}

function mk(box: Box, x: number, y: number, z: number, l: number, w: number, rot: 0 | 90, layer: number): Placement {
  return { id: box.id, seq: box.seq, x, y, z, l, w, h: box.height, weight: box.weight, rot, layer, support: 1, loadOnTop: 0, crushed: false };
}

export function planStack(skus: Box[], pallet: PalletSpec = DEFAULT_PALLET, csvErrors: Fault[] = []): Plan {
  const faults: Fault[] = [...csvErrors];
  const unplaced: Plan['unplaced'] = [];

  const oversize = skus.filter((b) => {
    const fits = (b.length <= pallet.length && b.width <= pallet.width) || (b.width <= pallet.length && b.length <= pallet.width);
    return !fits || b.height > pallet.maxHeight;
  });
  const oversizeIds = new Set<string>();
  for (const b of oversize) {
    unplaced.push({ id: b.id, reason: b.height > pallet.maxHeight ? 'height' : 'deck' });
    if (!oversizeIds.has(b.id)) {
      oversizeIds.add(b.id);
      faults.push(b.height > pallet.maxHeight
        ? fault('fault', 'F-HEIGHT', `${b.id} is taller than the stack limit.`, `${b.id} ist höher als die Stapelgrenze.`, b.id)
        : fault('fault', 'F-DECK', `${b.id} does not fit the deck in either orientation.`, `${b.id} passt in keiner Ausrichtung auf die Palette.`, b.id));
    }
  }

  let remaining = skus.filter((b) => !oversize.includes(b)).sort((a, b) => b.height - a.height || b.weight - a.weight || a.seq - b.seq);
  const placements: Placement[] = [];
  let z = 0;
  let weight = 0;
  let layer = 0;
  let stopReason: 'height' | 'weight' | null = null;

  while (remaining.length > 0) {
    const minH = Math.min(...remaining.map((b) => b.height));
    if (z + minH > pallet.maxHeight) { stopReason = 'height'; break; }
    const { placed, leftover } = packLayer(remaining, pallet, z, layer);
    if (placed.length === 0) break;
    const layerHeight = Math.max(...placed.map((p) => p.h));
    if (z + layerHeight > pallet.maxHeight) {
      // Retry the layer with only boxes that still fit vertically.
      const fitting = remaining.filter((b) => z + b.height <= pallet.maxHeight);
      if (fitting.length === 0) { stopReason = 'height'; break; }
      const retry = packLayer(fitting, pallet, z, layer);
      if (retry.placed.length === 0) { stopReason = 'height'; break; }
      const retryHeight = Math.max(...retry.placed.map((p) => p.h));
      const layerWeight = retry.placed.reduce((s, p) => s + p.weight, 0);
      if (weight + layerWeight > pallet.maxWeight && placements.length > 0) { stopReason = 'weight'; break; }
      placements.push(...retry.placed);
      z += retryHeight;
      weight += layerWeight;
      layer += 1;
      const placedSeq = new Set(retry.placed.map((p) => p.seq));
      remaining = remaining.filter((b) => !placedSeq.has(b.seq));
      continue;
    }
    const layerWeight = placed.reduce((s, p) => s + p.weight, 0);
    if (weight + layerWeight > pallet.maxWeight && placements.length > 0) { stopReason = 'weight'; break; }
    placements.push(...placed);
    z += layerHeight;
    weight += layerWeight;
    layer += 1;
    remaining = leftover;
  }

  const leftIds = new Set<string>();
  for (const b of remaining) {
    unplaced.push({ id: b.id, reason: stopReason ?? 'deck' });
    leftIds.add(b.id);
  }
  if (remaining.length > 0) {
    const ids = Array.from(leftIds).join(', ');
    faults.push(stopReason === 'weight'
      ? fault('hold', 'H-PAYLOAD', `${remaining.length} box(es) left off: payload limit reached (${ids}).`, `${remaining.length} Karton(s) nicht gesetzt: Nutzlastgrenze erreicht (${ids}).`)
      : fault('hold', 'H-HEIGHT', `${remaining.length} box(es) left off: stack height reached (${ids}).`, `${remaining.length} Karton(s) nicht gesetzt: Stapelhöhe erreicht (${ids}).`));
  }

  // Support ratio per box and load on top per box.
  const byLayer = new Map<number, Placement[]>();
  for (const p of placements) byLayer.set(p.layer, [...(byLayer.get(p.layer) ?? []), p]);
  for (const p of placements) {
    if (p.layer === 0) { p.support = 1; continue; }
    const below = byLayer.get(p.layer - 1) ?? [];
    const area = p.l * p.w;
    const supported = below.reduce((s, b) => s + overlapArea(p, b), 0);
    p.support = area > 0 ? Math.min(1, supported / area) : 0;
  }
  for (const p of placements) {
    let load = 0;
    for (const above of placements) {
      if (above.layer <= p.layer) continue;
      const share = overlapArea(p, above) / (above.l * above.w);
      if (share > 0) load += above.weight * share;
    }
    p.loadOnTop = load;
  }
  const crushedIds = new Set<string>();
  for (const b of skus) {
    if (b.maxStack === null) continue;
    for (const p of placements) {
      if (p.seq !== b.seq) continue;
      if (p.loadOnTop > b.maxStack + 1e-9) {
        p.crushed = true;
        crushedIds.add(b.id);
      }
    }
  }
  for (const id of Array.from(crushedIds)) {
    const worst = Math.max(...placements.filter((p) => p.id === id).map((p) => p.loadOnTop));
    const limit = skus.find((b) => b.id === id)?.maxStack ?? 0;
    faults.push(fault('fault', 'F-CRUSH', `${id} exceeds crush stack (${worst.toFixed(1)} kg on a ${limit} kg limit).`, `${id} überschreitet die Stapellast (${worst.toFixed(1)} kg bei ${limit} kg Grenze).`, id));
  }

  const supportScore = placements.length ? placements.reduce((s, p) => s + p.support, 0) / placements.length : 0;
  let comScore = 0;
  let comOffset = 1;
  if (placements.length > 0) {
    const tw = placements.reduce((s, p) => s + Math.max(p.weight, 1e-6), 0);
    const cx = placements.reduce((s, p) => s + (p.x + p.l / 2) * Math.max(p.weight, 1e-6), 0) / tw;
    const cy = placements.reduce((s, p) => s + (p.y + p.w / 2) * Math.max(p.weight, 1e-6), 0) / tw;
    const px = pallet.length / 2;
    const py = pallet.width / 2;
    comOffset = Math.hypot(cx - px, cy - py) / Math.hypot(px, py);
    comScore = Math.max(0, 1 - comOffset);
  }
  const stability = placements.length ? 0.6 * supportScore + 0.4 * comScore : 0;

  const lowLayers = Array.from(byLayer.entries())
    .filter(([idx, list]) => idx > 0 && list.reduce((s, p) => s + p.support, 0) / list.length < 0.85)
    .map(([idx]) => idx + 1);
  if (lowLayers.length > 0) {
    faults.push(fault('hold', 'H-SUPPORT', `Layer ${lowLayers.join(', ')} under 85 % base support — larger footprints lower.`, `Lage ${lowLayers.join(', ')} unter 85 % Auflage — größere Grundflächen nach unten.`));
  }
  if (placements.length > 0 && comScore < 0.8) {
    faults.push(fault('hold', 'H-COM', `Load off-centre (${(comOffset * 100).toFixed(0)} % of half diagonal) — move heavy SKUs to the centre.`, `Last außermittig (${(comOffset * 100).toFixed(0)} % der halben Diagonale) — schwere SKUs zur Mitte.`));
  }

  const placedVol = placements.reduce((s, p) => s + p.l * p.w * p.h, 0);
  const density = z > 0 ? placedVol / (pallet.length * pallet.width * z) : 0;

  const hasFault = faults.some((f) => f.level === 'fault');
  const hasHold = faults.some((f) => f.level === 'hold');
  const state: CellState = placements.length === 0 ? (hasFault ? 'FAULT' : 'IDLE') : hasFault ? 'FAULT' : hasHold || stability < 0.6 ? 'HOLD' : 'RUN';
  if (state === 'RUN') {
    faults.push(fault('ok', 'OK', 'All SKUs placed. Static stability within limits.', 'Alle SKUs gesetzt. Statische Stabilität innerhalb der Grenzen.'));
  }

  return {
    placements,
    unplaced,
    layers: layer,
    stackHeight: z,
    totalWeight: weight,
    boxesIn: skus.length,
    boxesPlaced: placements.length,
    density,
    supportScore,
    comScore,
    comOffset,
    stability,
    faults,
    state,
    cycleSeconds: placements.length * SECONDS_PER_PICK,
  };
}

/** One call from CSV text to plan. */
export function planFromCsv(csv: string, pallet: PalletSpec = DEFAULT_PALLET): Plan {
  const { skus, errors } = parseSkuCsv(csv);
  return planStack(skus, pallet, errors);
}

/* ── Exports ───────────────────────────────────────────────────────── */

export function planToCsv(plan: Plan, pallet: PalletSpec): string {
  const rows: string[] = [];
  rows.push('# Grimaldi Engineering - mixed-SKU stack plan (static geometry, not a transport certification)');
  rows.push(`# pallet_mm,${pallet.length},${pallet.width},max_height_mm,${pallet.maxHeight},max_weight_kg,${pallet.maxWeight}`);
  rows.push(`# layers,${plan.layers},stack_height_mm,${plan.stackHeight.toFixed(0)},weight_kg,${plan.totalWeight.toFixed(2)},density,${plan.density.toFixed(4)},stability,${plan.stability.toFixed(3)},state,${plan.state}`);
  rows.push('index,sku_id,layer,x_mm,y_mm,z_mm,footprint_x_mm,footprint_y_mm,height_mm,weight_kg,rot_deg,support,load_on_top_kg,crushed');
  plan.placements.forEach((p, i) => {
    rows.push(`${i + 1},${p.id},${p.layer + 1},${p.x},${p.y},${p.z},${p.l},${p.w},${p.h},${p.weight},${p.rot},${p.support.toFixed(3)},${p.loadOnTop.toFixed(2)},${p.crushed ? 1 : 0}`);
  });
  for (const u of plan.unplaced) rows.push(`,${u.id},unplaced,,,,,,,,,,,${u.reason}`);
  return rows.join('\n');
}

/**
 * URScript stub. Place poses are expressed in a pallet frame the
 * commissioning engineer defines on the teach pendant; pick pose,
 * gripper IO and safety configuration are deliberately left as named
 * inputs. This is a planner export, not a commissioned program.
 */
export function planToUrscript(plan: Plan, pallet: PalletSpec): string {
  const m = (mm: number) => (mm / 1000).toFixed(4);
  const out: string[] = [];
  out.push('# Palletizer stack plan — URScript STUB (Grimaldi Engineering, Frankfurt)');
  out.push('# Not commissioned. Verify pallet_frame, approach heights, gripper IO and safety config on the cell before RUN.');
  out.push(`# pallet ${pallet.length} x ${pallet.width} mm, ${plan.layers} layers, ${plan.stackHeight.toFixed(0)} mm, ${plan.totalWeight.toFixed(1)} kg, stability ${plan.stability.toFixed(2)}, state ${plan.state}`);
  out.push('def palletizer_stack():');
  out.push('  # --- cell inputs (teach on the pendant) ---');
  out.push('  pallet_frame = p[0.0, 0.0, 0.0, 0.0, 0.0, 0.0]   # pallet deck corner, x along length, y along width, z up');
  out.push('  pick_pose    = p[0.0, 0.0, 0.0, 0.0, 0.0, 0.0]   # infeed pick, tool centre at box top face');
  out.push('  approach_z   = 0.150                            # m above place pose');
  out.push('  acc = 1.2');
  out.push('  vel = 0.8');
  out.push('  def grip():');
  out.push('    set_standard_digital_out(0, True)               # gripper class: vacuum, adapt to cell');
  out.push('    sleep(0.3)');
  out.push('  end');
  out.push('  def release():');
  out.push('    set_standard_digital_out(0, False)');
  out.push('    sleep(0.2)');
  out.push('  end');
  out.push('  def place(box_pose, yaw):');
  out.push('    target = pose_trans(pallet_frame, box_pose)');
  out.push('    target = pose_trans(target, p[0, 0, 0, 0, 0, yaw])');
  out.push('    above = pose_add(target, p[0, 0, approach_z, 0, 0, 0])');
  out.push('    movel(pick_pose, acc, vel)');
  out.push('    grip()');
  out.push('    movel(above, acc, vel)');
  out.push('    movel(target, acc, vel * 0.5)');
  out.push('    release()');
  out.push('    movel(above, acc, vel)');
  out.push('  end');
  out.push('  # --- placements: tool centre over box centre, z = box top face ---');
  plan.placements.forEach((p, i) => {
    const cx = p.x + p.l / 2;
    const cy = p.y + p.w / 2;
    const top = p.z + p.h;
    out.push(`  place(p[${m(cx)}, ${m(cy)}, ${m(top)}, 0, 0, 0], ${p.rot === 90 ? '1.5708' : '0.0'})   # ${i + 1} ${p.id} L${p.layer + 1} ${p.weight} kg`);
  });
  if (plan.unplaced.length > 0) {
    out.push(`  # unplaced: ${plan.unplaced.map((u) => `${u.id}(${u.reason})`).join(', ')}`);
  }
  out.push('end');
  out.push('palletizer_stack()');
  return out.join('\n');
}

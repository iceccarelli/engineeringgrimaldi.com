import type { Lang } from '@/lib/i18n';
import { BEVERAGE_ORDER } from '@/lib/palletizer-engine/fixtures';
import { optimizePallet } from '@/lib/palletizer-engine/optimizer';
import type { Placement } from '@/lib/palletizer-engine/types';
import { OPTIMIZER_URL, PALLETIZER_ENGINE_COMMIT } from '@/lib/pilot';

/**
 * The only cinema on this domain: a pallet filling with the geometry the
 * real optimizer emits. The plan is computed at build time by the vendored
 * TypeScript port of palletizer_full/optimizer.py (same shelf packer, same
 * 0.6·support + 0.4·CoM stability model) on the beverage fixture. Every
 * number in the readout is read off that plan. Nothing is drawn that the
 * engine did not place; nothing is a robot.
 *
 * Server component: emits static SVG + CSS animation. Zero client JS,
 * so it cannot hurt LCP. Boxes appear in the optimizer's placement order;
 * prefers-reduced-motion shows the finished pallet with no animation.
 */

const FIXTURE = {
  id: 'beverage-order-42',
  boxes: BEVERAGE_ORDER,
  label: { en: 'Fixture: beverage order — 42 boxes, 5 SKUs, GMA pallet 1219 × 1016 mm', de: 'Fixture: Getränkeauftrag — 42 Kartons, 5 SKUs, GMA-Palette 1219 × 1016 mm' },
};

// Isometric projection. mm → px. Viewer sits at high x+y, high z.
const C30 = Math.cos(Math.PI / 6);
const S30 = Math.sin(Math.PI / 6);
const K = 0.22; // px per mm

function proj(x: number, y: number, z: number): [number, number] {
  return [(x - y) * C30 * K, (x + y) * S30 * K - z * K];
}
function poly(pts: [number, number][]): string {
  return pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
}

// Muted steel tones per SKU. The one signal colour (phosphor) is reserved
// for the readouts — density and stability — not for decoration.
const SKU_TONES: Record<string, string> = {
  SKU001: '#3a4a5e',
  SKU002: '#46586e',
  SKU003: '#2f3d4e',
  SKU004: '#52657c',
  SKU005: '#3d4d61',
};

function shade(hex: string, f: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.round(((n >> 16) & 255) * f));
  const g = Math.min(255, Math.round(((n >> 8) & 255) * f));
  const b = Math.min(255, Math.round((n & 255) * f));
  return `rgb(${r},${g},${b})`;
}

/**
 * Painter's order for axis-aligned boxes under this projection: A is
 * drawn before B when A lies entirely behind B on some axis (smaller x,
 * smaller y, or lower z — all three point away from the viewer). The
 * relation is a partial order, so we topologically sort and break ties
 * by x+y+z. Shelf-packed plans never produce cycles; a cycle would just
 * fall back to the tie-break.
 */
function painterOrder(ps: Placement[]): Placement[] {
  const E = 0.5;
  const n = ps.length;
  const behind = (a: Placement, b: Placement) =>
    a.x_mm + a.length_mm <= b.x_mm + E || a.y_mm + a.width_mm <= b.y_mm + E || a.z_mm + a.height_mm <= b.z_mm + E;
  const indeg = new Array<number>(n).fill(0);
  const out: number[][] = Array.from({ length: n }, () => []);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const ab = behind(ps[i], ps[j]);
      const ba = behind(ps[j], ps[i]);
      if (ab && !ba) { out[i].push(j); indeg[j]++; }
    }
  }
  const key = (p: Placement) => p.x_mm + p.y_mm + p.z_mm;
  const ready = ps.map((_, i) => i).filter((i) => indeg[i] === 0).sort((a, b) => key(ps[a]) - key(ps[b]));
  const result: Placement[] = [];
  const done = new Array<boolean>(n).fill(false);
  while (ready.length) {
    const i = ready.shift() as number;
    if (done[i]) continue;
    done[i] = true;
    result.push(ps[i]);
    for (const j of out[i]) if (--indeg[j] === 0) ready.push(j);
    ready.sort((a, b) => key(ps[a]) - key(ps[b]));
  }
  for (let i = 0; i < n; i++) if (!done[i]) result.push(ps[i]);
  return result;
}

function Box({ p, i }: { p: Placement; i: number }) {
  const x0 = p.x_mm, y0 = p.y_mm, z0 = p.z_mm;
  const x1 = x0 + p.length_mm, y1 = y0 + p.width_mm, z1 = z0 + p.height_mm;
  const base = SKU_TONES[p.sku_id] ?? '#3a4a5e';
  const top = poly([proj(x0, y0, z1), proj(x1, y0, z1), proj(x1, y1, z1), proj(x0, y1, z1)]);
  const front = poly([proj(x0, y1, z0), proj(x1, y1, z0), proj(x1, y1, z1), proj(x0, y1, z1)]);
  const side = poly([proj(x1, y0, z0), proj(x1, y1, z0), proj(x1, y1, z1), proj(x1, y0, z1)]);
  return (
    <g className="pf-box" style={{ ['--i' as string]: i }}>
      <polygon points={top} fill={shade(base, 1.35)} stroke="#0b1119" strokeWidth="0.8" strokeLinejoin="round" />
      <polygon points={front} fill={base} stroke="#0b1119" strokeWidth="0.8" strokeLinejoin="round" />
      <polygon points={side} fill={shade(base, 0.72)} stroke="#0b1119" strokeWidth="0.8" strokeLinejoin="round" />
    </g>
  );
}

export default function PalletFill({ lang, showCaption = true }: { lang: Lang; showCaption?: boolean }) {
  const plan = optimizePallet(FIXTURE.boxes);
  const pallet = { L: 1219, W: 1016, H: 144 };

  const order = painterOrder(plan.placements);
  // Animation order = the optimizer's own placement sequence.
  const seq = new Map(plan.placements.map((p, i) => [p, i]));

  // Frame: project the pallet's bounding block and pad.
  const corners: [number, number][] = [
    proj(0, 0, -pallet.H), proj(pallet.L, 0, -pallet.H), proj(0, pallet.W, -pallet.H), proj(pallet.L, pallet.W, -pallet.H),
    proj(0, 0, plan.stack_height_mm), proj(pallet.L, 0, plan.stack_height_mm), proj(0, pallet.W, plan.stack_height_mm), proj(pallet.L, pallet.W, plan.stack_height_mm),
  ];
  const xs = corners.map((c) => c[0]);
  const ys = corners.map((c) => c[1]);
  const pad = 14;
  const minX = Math.min(...xs) - pad, maxX = Math.max(...xs) + pad;
  const minY = Math.min(...ys) - pad, maxY = Math.max(...ys) + pad;
  const vb = `${minX.toFixed(1)} ${minY.toFixed(1)} ${(maxX - minX).toFixed(1)} ${(maxY - minY).toFixed(1)}`;

  const deckTop = poly([proj(0, 0, 0), proj(pallet.L, 0, 0), proj(pallet.L, pallet.W, 0), proj(0, pallet.W, 0)]);
  const deckFront = poly([proj(0, pallet.W, -pallet.H), proj(pallet.L, pallet.W, -pallet.H), proj(pallet.L, pallet.W, 0), proj(0, pallet.W, 0)]);
  const deckSide = poly([proj(pallet.L, 0, -pallet.H), proj(pallet.L, pallet.W, -pallet.H), proj(pallet.L, pallet.W, 0), proj(pallet.L, 0, 0)]);

  const pct = (v: number) => `${(v * 100).toFixed(1)} %`;
  const t = lang === 'de'
    ? { placed: 'platziert', layers: 'Lagen', height: 'Stapelhöhe', density: 'Volumendichte', baseline: 'naive Basislinie', uplift: 'Dichte-Uplift', stability: 'Stabilität', support: 'Auflage', com: 'Schwerpunkt', open: 'Optimierer öffnen', title: 'Palette füllt sich mit der Geometrie des echten Optimierers' }
    : { placed: 'placed', layers: 'layers', height: 'stack height', density: 'volume density', baseline: 'naive baseline', uplift: 'density uplift', stability: 'stability', support: 'support', com: 'CoM', open: 'Open the optimizer', title: 'Pallet filling with the real optimizer’s geometry' };

  return (
    <figure className="pf" aria-labelledby="pf-title">
      <svg className="pf-svg" viewBox={vb} role="img" aria-labelledby="pf-title" preserveAspectRatio="xMidYMid meet">
        <title id="pf-title">{t.title}</title>
        <polygon points={deckSide} fill="#1a2430" stroke="#0b1119" strokeWidth="0.8" />
        <polygon points={deckFront} fill="#24303f" stroke="#0b1119" strokeWidth="0.8" />
        <polygon points={deckTop} fill="#2c3a4b" stroke="#0b1119" strokeWidth="0.8" />
        {order.map((p) => (
          <Box key={`${p.sku_id}-${p.x_mm}-${p.y_mm}-${p.z_mm}`} p={p} i={seq.get(p) ?? 0} />
        ))}
      </svg>
      <dl className="pf-readout">
        <div><dt>{t.placed}</dt><dd>{plan.placements.length}/{FIXTURE.boxes.length}</dd></div>
        <div><dt>{t.layers}</dt><dd>{plan.num_layers}</dd></div>
        <div><dt>{t.height}</dt><dd>{plan.stack_height_mm.toFixed(0)} mm</dd></div>
        <div className="pf-signal"><dt>{t.density}</dt><dd>{pct(plan.volume_density)}</dd></div>
        <div><dt>{t.baseline}</dt><dd>{pct(plan.baseline_density)}</dd></div>
        <div className="pf-signal"><dt>{t.uplift}</dt><dd>{plan.density_uplift_pct >= 0 ? '+' : ''}{plan.density_uplift_pct.toFixed(1)} %</dd></div>
        <div className="pf-signal"><dt>{t.stability}</dt><dd>{plan.stability_score.toFixed(3)}</dd></div>
        <div><dt>{t.support}</dt><dd>{plan.support_score.toFixed(3)}</dd></div>
        <div><dt>{t.com}</dt><dd>{plan.com_score.toFixed(3)}</dd></div>
      </dl>
      {showCaption && (
        <figcaption className="pf-caption">
          {FIXTURE.label[lang]} · engine {PALLETIZER_ENGINE_COMMIT.slice(0, 7)} · stability = 0.6·support + 0.4·CoM ·{' '}
          <a href={OPTIMIZER_URL} rel="noopener noreferrer">{t.open} →</a>
        </figcaption>
      )}
    </figure>
  );
}

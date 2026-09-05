import Figure from './Figure';
import { MODULES, PRODUCT_BRAND } from '@/lib/energy/architecture';
import { MARK, SVG_TEXT, VIZ, colorOf } from '@/lib/viz';

/**
 * GridOS as a block map: the kernel is the spine, modules hang off it in
 * two columns, coloured by state (exists / merging-specified-research /
 * missing). Probabilistic modules are drawn with a dashed edge so the
 * separation rule is visible without reading the table.
 */
export default function ArchitectureMap({ lang }: { lang: 'en' | 'de' }) {
  const mods = MODULES.filter((m) => m.id !== 'kernel');
  const W = 920; const colW = 300; const rowH = 58; const rows = Math.ceil(mods.length / 2); const top = 70; const H = top + rows * rowH + 30;
  const spineX = W / 2; const leftX = 40; const rightX = W - 40 - colW;
  const t = lang === 'de'
    ? { title: `${PRODUCT_BRAND} — Modulkarte`, exists: 'existiert', spec: 'im Merge / spezifiziert / Forschung', missing: 'fehlt', caption: 'Gestrichelte Kante = probabilistisches Modul; es hat keinen Pfad zu einem Aktor. Volle Kante = deterministisch oder Daten/Integration.' }
    : { title: `${PRODUCT_BRAND} — module map`, exists: 'exists', spec: 'merging / specified / research', missing: 'missing', caption: 'Dashed edge = probabilistic module; it has no path to an actuator. Solid edge = deterministic or data/integration.' };

  return (
    <Figure title={t.title} caption={t.caption} legend={[{ tier: 'keep', label: t.exists }, { tier: 'support', label: t.spec }, { tier: 'kill', label: t.missing }]}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t.title} style={{ width: '100%', height: 'auto' }}>
        {/* kernel spine */}
        <rect x={spineX - 70} y={16} width={140} height={34} rx={MARK.radius} fill={VIZ.ink} />
        <text x={spineX} y={38} textAnchor="middle" fill="#fff" style={{ ...SVG_TEXT, fontWeight: 500, letterSpacing: '.08em' }}>{PRODUCT_BRAND.toUpperCase()} KERNEL</text>
        <line x1={spineX} y1={50} x2={spineX} y2={H - 24} stroke={VIZ.ink} strokeWidth="2" />
        {mods.map((m, i) => {
          const left = i % 2 === 0; const row = Math.floor(i / 2);
          const x = left ? leftX : rightX; const y = top + row * rowH; const c = colorOf(m.state);
          const edgeX = left ? x + colW : x;
          return (
            <g key={m.id}>
              <title>{`${m.name} — ${m.purpose}`}</title>
              <line x1={edgeX} y1={y + 20} x2={spineX} y2={y + 20} stroke={VIZ.line} strokeWidth="1.5" />
              <rect x={x} y={y} width={colW} height={40} rx={MARK.radius} fill={VIZ.panel} stroke={m.kind === 'probabilistic' ? VIZ.hold : VIZ.line} strokeWidth={m.kind === 'probabilistic' ? 1.5 : 1} strokeDasharray={m.kind === 'probabilistic' ? '5 3' : undefined} />
              <rect x={x} y={y} width={6} height={40} rx={2} fill={c} />
              <text x={x + 16} y={y + 17} fill={VIZ.ink} style={{ ...SVG_TEXT, fontWeight: 500 }}>{m.name}</text>
              <text x={x + 16} y={y + 31} fill={VIZ.muted} style={{ ...SVG_TEXT, fontSize: 10 }}>{m.kind} · {m.state} · {m.from[0]}</text>
            </g>
          );
        })}
      </svg>
    </Figure>
  );
}

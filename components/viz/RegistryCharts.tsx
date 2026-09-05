import Figure from './Figure';
import { REGISTRY, REGISTRY_STATUSES, statusCounts } from '@/lib/energy/registry';
import { MARK, SVG_TEXT, VIZ, colorOf, gradeIndex } from '@/lib/viz';

/**
 * Two views of the same registry.
 * 1. Status bar — one stacked bar with a 2 px surface gap per segment and a
 *    direct label on every segment. It answers "how much of the estate are
 *    we keeping" in one glance.
 * 2. Value × risk matrix — strategic value up, security risk right. The
 *    honest quadrant to worry about is top-right: high value, high risk
 *    (GridOS, NeuralBridge). Bottom-left is the archive.
 */
export function StatusBar({ lang, compact }: { lang: 'en' | 'de'; compact?: boolean }) {
  const counts = statusCounts(); const total = REGISTRY.length;
  const W = 920; const H = compact ? 56 : 72; const pad = 0; const y = compact ? 22 : 30;
  let x = pad;
  const t = lang === 'de' ? { title: `Register — ${total} Repositories nach Status` } : { title: `Registry — ${total} repositories by status` };
  return (
    <Figure title={t.title} legend={[{ tier: 'keep', label: 'CORE · MODULE' }, { tier: 'support', label: 'RESEARCH · INTERNAL' }, { tier: 'hold', label: 'EXPERIMENT' }, { tier: 'kill', label: 'ARCHIVE' }]}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t.title} style={{ width: '100%', height: 'auto' }}>
        {REGISTRY_STATUSES.map((s, i) => {
          const n = counts[s]; if (n === 0) return null;
          const w = (n / total) * (W - pad * 2) - MARK.gap; const x0 = x; x += w + MARK.gap;
          const last = i === REGISTRY_STATUSES.length - 1;
          return (
            <g key={s}>
              <title>{`${s}: ${n}`}</title>
              <rect x={x0} y={y} width={w} height={MARK.bar} fill={colorOf(s)} rx={last ? MARK.radius : 0} />
              <text x={x0 + w / 2} y={y + 14} textAnchor="middle" fill="#fff" style={{ ...SVG_TEXT, fontWeight: 500 }}>{w > 70 ? `${s} ${n}` : n}</text>
              {w <= 70 && <text x={x0 + w / 2} y={y - 6} textAnchor="middle" fill={VIZ.muted} style={{ ...SVG_TEXT, fontSize: 10 }}>{s}</text>}
            </g>
          );
        })}
      </svg>
    </Figure>
  );
}

export function ValueRiskMatrix({ lang }: { lang: 'en' | 'de' }) {
  const W = 920; const H = 360; const pl = 120; const pr = 40; const pt = 20; const pb = 50;
  const cw = (W - pl - pr) / 4; const ch = (H - pt - pb) / 4;
  const grades = ['none', 'low', 'medium', 'high'];
  const t = lang === 'de'
    ? { title: 'Strategischer Wert × Sicherheitsrisiko', x: 'Sicherheitsrisiko →', y: 'strategischer Wert →', caption: 'Oben rechts ist die Zone, die Sorgfalt verlangt: hoher Wert, hohes OT-Risiko. Unten links ist das Archiv. Punkte sind nach Status gefärbt und einzeln beschriftet.' }
    : { title: 'Strategic value × security risk', x: 'security risk →', y: 'strategic value →', caption: 'Top-right is the zone that demands care: high value, high OT risk. Bottom-left is the archive. Dots are coloured by status and labelled individually.' };
  // Jitter within a cell so equal grades do not overlap: index within cell.
  const cellCount: Record<string, number> = {};
  return (
    <Figure title={t.title} caption={t.caption} legend={[{ tier: 'keep', label: 'CORE · MODULE' }, { tier: 'support', label: 'RESEARCH · INTERNAL' }, { tier: 'hold', label: 'EXPERIMENT' }, { tier: 'kill', label: 'ARCHIVE' }]}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t.title} style={{ width: '100%', height: 'auto' }}>
        {grades.map((g, i) => (
          <g key={g}>
            <line x1={pl} y1={pt + i * ch} x2={W - pr} y2={pt + i * ch} stroke={VIZ.line} strokeWidth="1" />
            <line x1={pl + i * cw} y1={pt} x2={pl + i * cw} y2={H - pb} stroke={VIZ.line} strokeWidth="1" />
            <text x={pl + i * cw + cw / 2} y={H - pb + 18} textAnchor="middle" fill={VIZ.muted} style={SVG_TEXT}>{g}</text>
            <text x={pl - 10} y={pt + (3 - i) * ch + ch / 2 + 4} textAnchor="end" fill={VIZ.muted} style={SVG_TEXT}>{g}</text>
          </g>
        ))}
        <line x1={pl} y1={H - pb} x2={W - pr} y2={H - pb} stroke={VIZ.line} /><line x1={W - pr} y1={pt} x2={W - pr} y2={H - pb} stroke={VIZ.line} />
        <rect x={pl + 3 * cw} y={pt} width={cw} height={ch} fill={VIZ.hold} opacity="0.08" />
        <text x={W - pr - 6} y={H - pb + 36} textAnchor="end" fill={VIZ.ink} style={{ ...SVG_TEXT, fontWeight: 500 }}>{t.x}</text>
        <text x={pl - 10} y={pt - 6} textAnchor="end" fill={VIZ.ink} style={{ ...SVG_TEXT, fontWeight: 500 }}>{t.y}</text>
        {REGISTRY.map((r) => {
          const gx = gradeIndex(r.securityRisk); const gy = gradeIndex(r.strategicValue);
          const key = `${gx}-${gy}`; const k = (cellCount[key] = (cellCount[key] ?? 0) + 1);
          const cx = pl + gx * cw + 22; const cy = pt + (3 - gy) * ch + 14 + (k - 1) * 18;
          const name = r.repository.length > 26 ? `${r.repository.slice(0, 25)}…` : r.repository;
          return (
            <g key={r.repository}>
              <title>{`${r.repository} — ${r.recommendedStatus} · value ${r.strategicValue} · risk ${r.securityRisk}`}</title>
              <circle cx={cx} cy={cy} r={MARK.dot} fill={colorOf(r.recommendedStatus)} stroke={VIZ.surface} strokeWidth="2" />
              <text x={cx + 10} y={cy + 4} fill={VIZ.ink} style={{ ...SVG_TEXT, fontSize: 10 }}>{name}</text>
            </g>
          );
        })}
      </svg>
    </Figure>
  );
}

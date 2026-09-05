import Figure from './Figure';
import { SAFETY_CHAIN } from '@/lib/energy/architecture';
import { MARK, SVG_TEXT, VIZ, colorOf } from '@/lib/viz';

/**
 * The ten stages as a vertical chain with the one line that matters: the
 * boundary between probabilistic proposal and deterministic enforcement.
 * The actuator is drawn outside every zone — nothing points at it except
 * NeuralBridge.
 */
export default function SafetyChainDiagram({ lang }: { lang: 'en' | 'de' }) {
  const W = 920; const rowH = 44; const top = 40; const boxW = 210; const boxX = 220; const H = top + SAFETY_CHAIN.length * rowH + 24;
  const t = lang === 'de'
    ? { title: 'Sicherheitskette — zehn Stufen, eine Grenze', prob: 'probabilistisch — schlägt vor', det: 'deterministisch — setzt durch', data: 'Daten — typisiert, signiert', caption: 'Nur NeuralBridge spricht mit dem Aktor. Jeder Pfeil ist ein versionierter Vertrag; keiner überspringt eine Stufe.', boundary: 'Sicherheitsgrenze', actuator: 'Kein anderer Pfad existiert.' }
    : { title: 'Safety chain — ten stages, one boundary', prob: 'probabilistic — proposes', det: 'deterministic — enforces', data: 'data — typed, signed', caption: 'Only NeuralBridge talks to the actuator. Every arrow is a versioned contract; none skips a stage.', boundary: 'safety boundary', actuator: 'No other path exists.' };

  // Boundary sits after the candidate-actions record (index 2).
  const boundaryY = top + 3 * rowH - rowH / 2 + MARK.bar / 2 + 2;

  return (
    <Figure title={t.title} caption={t.caption} legend={[{ tier: 'hold', label: t.prob }, { tier: 'support', label: t.data }, { tier: 'keep', label: t.det }]}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t.title} style={{ width: '100%', height: 'auto' }}>
        <defs>
          <marker id="chain-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill={VIZ.ink} /></marker>
        </defs>
        {/* zones */}
        <rect x={boxX - 16} y={top - 20} width={boxW + 32} height={boundaryY - (top - 20)} fill={VIZ.hold} opacity="0.06" rx="4" />
        <rect x={boxX - 16} y={boundaryY} width={boxW + 32} height={H - boundaryY - 8} fill={VIZ.keep} opacity="0.06" rx="4" />
        <line x1={boxX - 60} y1={boundaryY} x2={boxX + boxW + 60} y2={boundaryY} stroke={VIZ.ink} strokeWidth="2" />
        <text x={boxX + boxW + 68} y={boundaryY + 4} fill={VIZ.ink} style={{ ...SVG_TEXT, fontWeight: 500, letterSpacing: '.06em' }}>{t.boundary.toUpperCase()}</text>

        {SAFETY_CHAIN.map((s, i) => {
          const y = top + i * rowH; const last = i === SAFETY_CHAIN.length - 1; const c = colorOf(s.kind);
          return (
            <g key={s.stage}>
              <title>{`${i + 1}. ${s.stage} — ${s.does}`}</title>
              <rect x={boxX} y={y} width={boxW} height={MARK.bar + 8} rx={MARK.radius} fill={last ? VIZ.panel : c} stroke={last ? VIZ.ink : 'none'} strokeWidth={last ? 1.5 : 0} strokeDasharray={last ? '4 3' : undefined} />
              <text x={boxX + 10} y={y + 19} fill={last ? VIZ.ink : '#fff'} style={{ ...SVG_TEXT, fontWeight: 500 }}>{String(i + 1).padStart(2, '0')}  {s.stage}</text>
              <text x={boxX - 24} y={y + 19} textAnchor="end" fill={VIZ.muted} style={SVG_TEXT}>{s.kind}</text>
              <text x={boxX + boxW + 12} y={y + 19} fill={VIZ.muted} style={SVG_TEXT}>{s.does.length > 66 ? `${s.does.slice(0, 65)}…` : s.does}</text>
              {!last && <line x1={boxX + boxW / 2} y1={y + MARK.bar + 8} x2={boxX + boxW / 2} y2={y + rowH - 1} stroke={VIZ.ink} strokeWidth="1.5" markerEnd="url(#chain-arrow)" />}
              {last && <text x={boxX + boxW + 12} y={y + 36} fill={VIZ.ink} style={{ ...SVG_TEXT, fontWeight: 500 }}>{t.actuator}</text>}
            </g>
          );
        })}
      </svg>
    </Figure>
  );
}

import Figure from './Figure';
import { PROGRESSION_STATE } from '@/lib/energy/architecture';
import { MARK, SVG_TEXT, VIZ, colorOf } from '@/lib/viz';

/**
 * OBSERVE → EXECUTE as a rail. Filled segment = the stage runs today,
 * half = being built for the wedge, hatched = locked by D-007. The lock
 * is the point of the picture: the last two stages are not "coming soon",
 * they are forbidden until a safety runtime exists.
 */
export default function ProgressionRail({ lang, compact }: { lang: 'en' | 'de'; compact?: boolean }) {
  const W = 920; const H = compact ? 84 : 84; const pad = 12;
  const n = PROGRESSION_STATE.length;
  const slot = (W - pad * 2) / n;
  const barY = 30; const barH = MARK.bar;
  const t = lang === 'de'
    ? { title: 'Progression — was heute laufen darf', active: 'läuft', building: 'im Bau (Wedge A)', locked: 'gesperrt (D-007)', caption: 'AUTHORIZE und EXECUTE sind per Entscheidung gesperrt, bis ein NeuralBridge-Repository existiert und seine Tests besteht.' }
    : { title: 'Progression — what may run today', active: 'runs', building: 'being built (wedge A)', locked: 'locked (D-007)', caption: 'AUTHORIZE and EXECUTE are locked by decision until a NeuralBridge repository exists and passes its own tests.' };

  return (
    <Figure title={t.title} caption={compact ? undefined : t.caption} legend={[{ tier: 'keep', label: t.active }, { tier: 'support', label: t.building }, { tier: 'kill', label: t.locked }]}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t.title} style={{ width: '100%', height: 'auto' }}>
        <defs>
          <pattern id="rail-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill={VIZ.surface} />
            <line x1="0" y1="0" x2="0" y2="6" stroke={VIZ.kill} strokeWidth="2" />
          </pattern>
        </defs>
        {PROGRESSION_STATE.map((s, i) => {
          const x = pad + i * slot + MARK.gap / 2; const w = slot - MARK.gap;
          const fill = s.state === 'locked' ? 'url(#rail-hatch)' : colorOf(s.state);
          const isLast = i === n - 1;
          return (
            <g key={s.stage}>
              <title>{`${s.stage} — ${s.note}`}</title>
              <rect x={x} y={barY} width={w} height={barH} fill={fill} rx={isLast ? MARK.radius : 0} />
              {s.state === 'building' && <rect x={x} y={barY + barH / 2} width={w} height={barH / 2} fill={VIZ.surface} opacity="0.55" />}
              {s.state === 'locked' && <rect x={x} y={barY} width={w} height={barH} fill="none" stroke={VIZ.kill} strokeWidth="1" />}
              <text x={x + w / 2} y={barY - 10} textAnchor="middle" fill={VIZ.ink} style={{ ...SVG_TEXT, fontWeight: 500, letterSpacing: '.06em' }}>{s.stage}</text>
              {i === 4 && <line x1={x + w + MARK.gap / 2} y1={barY - 26} x2={x + w + MARK.gap / 2} y2={barY + barH + 12} stroke={VIZ.ink} strokeWidth="1.5" strokeDasharray="0" />}
              {i === 4 && <text x={x + w + MARK.gap / 2 + 6} y={barY + barH + 24} fill={VIZ.ink} style={{ ...SVG_TEXT, fontWeight: 500 }}>{lang === 'de' ? 'Sicherheitsgrenze' : 'safety boundary'}</text>}
            </g>
          );
        })}
      </svg>
      {!compact && (
        <dl className="viz-notes">
          {PROGRESSION_STATE.map((s) => (
            <div key={s.stage}><dt><i style={{ background: s.state === 'locked' ? VIZ.kill : colorOf(s.state) }} aria-hidden="true" />{s.stage}</dt><dd>{s.note}</dd></div>
          ))}
        </dl>
      )}
    </Figure>
  );
}

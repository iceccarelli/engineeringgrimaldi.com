import Figure from './Figure';
import { DECISIONS } from '@/lib/energy/decisions';
import { MARK, SVG_TEXT, VIZ, colorOf } from '@/lib/viz';

/**
 * Decisions on a time axis. Same-day decisions fan out vertically so every
 * dot stays a hit target. Proposed items (needing CEO approval) are hollow.
 */
export default function DecisionTimeline({ lang }: { lang: 'en' | 'de' }) {
  const W = 920; const pl = 40; const pr = 40;
  const dates = Array.from(new Set(DECISIONS.map((d) => d.date))).sort();
  const perDate: Record<string, number> = {};
  const maxStack = Math.max(...dates.map((dt) => DECISIONS.filter((d) => d.date === dt).length));
  const rowH = 22; const top = 36; const H = top + maxStack * rowH + 40;
  const x = (dt: string) => dates.length === 1 ? pl + 60 : pl + (dates.indexOf(dt) / (dates.length - 1)) * (W - pl - pr - 120);
  const t = lang === 'de'
    ? { title: 'Entscheidungslog — Zeitachse', decided: 'entschieden', proposed: 'vorgeschlagen (CEO)', caption: 'Ein Log, das nur anhängt: Kreise werden nie entfernt, nur durch neue Kreise aufgehoben.' }
    : { title: 'Decision log — timeline', decided: 'decided', proposed: 'proposed (CEO)', caption: 'An append-only log: dots are never removed, only superseded by new dots.' };
  return (
    <Figure title={t.title} caption={t.caption} legend={[{ tier: 'keep', label: t.decided }, { tier: 'hold', label: t.proposed }]}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t.title} style={{ width: '100%', height: 'auto' }}>
        <line x1={pl} y1={top - 12} x2={W - pr} y2={top - 12} stroke={VIZ.line} strokeWidth="1" />
        {dates.map((dt) => (
          <g key={dt}>
            <line x1={x(dt)} y1={top - 16} x2={x(dt)} y2={top - 8} stroke={VIZ.ink} />
            <text x={x(dt)} y={top - 22} textAnchor="middle" fill={VIZ.muted} style={SVG_TEXT}>{dt}</text>
          </g>
        ))}
        {DECISIONS.map((d) => {
          const k = (perDate[d.date] = (perDate[d.date] ?? 0) + 1);
          const cx = x(d.date); const cy = top + (k - 1) * rowH + 6; const c = colorOf(d.status);
          return (
            <a key={d.id} href={`#${d.id}`}>
              <title>{`${d.id} — ${d.title}`}</title>
              <circle cx={cx} cy={cy} r={MARK.dot} fill={d.status === 'proposed' ? VIZ.surface : c} stroke={c} strokeWidth="2" />
              <text x={cx + 12} y={cy + 4} fill={VIZ.ink} style={{ ...SVG_TEXT, fontSize: 10 }}>{d.id} {d.title.length > 70 ? `${d.title.slice(0, 69)}…` : d.title}</text>
            </a>
          );
        })}
      </svg>
    </Figure>
  );
}

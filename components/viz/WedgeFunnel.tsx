import Figure from './Figure';
import { funnel } from '@/lib/energy/customers';
import { MARK, SVG_TEXT, VIZ } from '@/lib/viz';

/**
 * Horizontal bars: the outline is the 90-day target, the fill is what has
 * been counted. Today every fill is zero; the picture shows the gap
 * honestly instead of hiding an empty chart.
 */
export default function WedgeFunnel({ lang }: { lang: 'en' | 'de' }) {
  const FUNNEL = funnel('A');
  const W = 920; const rowH = 44; const pl = 250; const pr = 60; const top = 16; const H = top + FUNNEL.length * rowH + 8;
  const max = Math.max(...FUNNEL.map((f) => f.target));
  const sx = (v: number) => (v / max) * (W - pl - pr);
  const t = lang === 'de'
    ? { title: 'Wedge A — Trichter: gezählt vs. 90-Tage-Ziel', actual: 'gezählt', target: 'Ziel', caption: 'Nur Geld, ein unterschriebener Pilot oder eine verbindliche Design-Partnerschaft zählen. Komplimente werden nicht gezählt.' }
    : { title: 'Wedge A — funnel: counted vs 90-day target', actual: 'counted', target: 'target', caption: 'Only money, a signed pilot or a committed design partnership counts. Compliments are not counted.' };
  return (
    <Figure title={t.title} caption={t.caption} legend={[{ tier: 'keep', label: t.actual }, { tier: 'support', label: t.target }]}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t.title} style={{ width: '100%', height: 'auto' }}>
        <line x1={pl} y1={top - 6} x2={pl} y2={H - 4} stroke={VIZ.line} />
        {FUNNEL.map((f, i) => {
          const y = top + i * rowH + (rowH - MARK.bar) / 2;
          return (
            <g key={f.step}>
              <title>{`${f.step}: ${f.actual} / ${f.target}`}</title>
              <text x={pl - 12} y={y + 14} textAnchor="end" fill={VIZ.ink} style={SVG_TEXT}>{f.step}</text>
              <rect x={pl} y={y} width={sx(f.target)} height={MARK.bar} rx={MARK.radius} fill="none" stroke={VIZ.support} strokeWidth="1.5" />
              {f.actual > 0 && <rect x={pl} y={y} width={sx(f.actual)} height={MARK.bar} rx={MARK.radius} fill={VIZ.keep} />}
              <text x={pl + sx(f.target) + 10} y={y + 14} fill={VIZ.ink} style={{ ...SVG_TEXT, fontWeight: 500 }}>{f.actual} / {f.target}</text>
            </g>
          );
        })}
      </svg>
    </Figure>
  );
}

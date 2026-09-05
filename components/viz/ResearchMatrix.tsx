import Figure from './Figure';
import { RESEARCH } from '@/lib/energy/research';
import { MARK, SVG_TEXT, VIZ } from '@/lib/viz';

/**
 * Evidence matrix: topics × the nine benchmark-record fields. A filled cell
 * means the field is reported; an empty cell is a gap. The point is that
 * the phrase "state of the art" needs a full row — today no row is full.
 */
const FIELDS: { key: string; label: string }[] = [
  { key: 'dataset', label: 'dataset' }, { key: 'baseline', label: 'baseline' }, { key: 'metric', label: 'metric' }, { key: 'result', label: 'result' },
  { key: 'ci', label: 'CI' }, { key: 'hardware', label: 'hardware' }, { key: 'latency', label: 'latency' }, { key: 'failureCases', label: 'failures' }, { key: 'reproducible', label: 'repro' },
];

function reported(v: unknown): boolean {
  if (v === true) return true;
  if (typeof v !== 'string') return false;
  return !/^(not reported|n\/a|unknown|)$/i.test(v.trim());
}

export default function ResearchMatrix({ lang }: { lang: 'en' | 'de' }) {
  const W = 920; const pl = 330; const cell = 56; const rowH = 30; const top = 30; const H = top + RESEARCH.length * rowH + 10;
  const t = lang === 'de'
    ? { title: 'Evidenzmatrix — Benchmark-Felder je Thema', full: 'berichtet', empty: 'fehlt', caption: 'Eine volle Zeile ist die Bedingung für das Wort „State of the Art“. Heute ist keine Zeile voll.' }
    : { title: 'Evidence matrix — benchmark fields per topic', full: 'reported', empty: 'missing', caption: 'A full row is the condition for the words "state of the art". Today no row is full.' };
  return (
    <Figure title={t.title} caption={t.caption} legend={[{ tier: 'keep', label: t.full }, { tier: 'hold', label: t.empty }]}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t.title} style={{ width: '100%', height: 'auto' }}>
        {FIELDS.map((f, j) => (
          <text key={f.key} x={pl + j * cell + cell / 2} y={top - 10} textAnchor="middle" fill={VIZ.muted} style={{ ...SVG_TEXT, fontSize: 10 }}>{f.label}</text>
        ))}
        {RESEARCH.map((r, i) => {
          const y = top + i * rowH;
          const b = r.benchmark as Record<string, unknown> | undefined;
          return (
            <g key={r.topic}>
              <text x={pl - 12} y={y + 17} textAnchor="end" fill={VIZ.ink} style={{ ...SVG_TEXT, fontSize: 10 }}>{r.topic.length > 44 ? `${r.topic.slice(0, 43)}…` : r.topic}</text>
              {FIELDS.map((f, j) => {
                const ok = b ? reported(b[f.key]) : false;
                return (
                  <g key={f.key}>
                    <title>{`${r.topic} · ${f.label}: ${b ? String(b[f.key]) : 'no benchmark'}`}</title>
                    <rect x={pl + j * cell + MARK.gap / 2} y={y + MARK.gap / 2} width={cell - MARK.gap} height={rowH - MARK.gap - 4} rx={2} fill={ok ? VIZ.keep : VIZ.surface} stroke={ok ? 'none' : VIZ.hold} strokeWidth={ok ? 0 : 1} strokeDasharray={ok ? undefined : '3 2'} />
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    </Figure>
  );
}

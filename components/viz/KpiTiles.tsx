import { KPIS, KPI_AS_OF, type Kpi } from '@/lib/energy/kpis';
import { VIZ, colorOf } from '@/lib/viz';

/**
 * Stat tiles. The hero figure is revenue — exactly one per view, largest.
 * A tile whose value is null renders "not measured" in muted ink with a
 * hollow marker; it is never rendered as 0 and never hidden. The meter under
 * each tile is the value against its target where the target is numeric;
 * otherwise it is an empty track, which is also information.
 */
const NUMERIC_TARGET: Record<string, number> = { qualified: 3, pilots: 1, deployments: 1, benchmarks: 1, pipeline: 3 };

function Tile({ k, hero, lang }: { k: Kpi; hero?: boolean; lang: 'en' | 'de' }) {
  const measured = k.value !== null;
  const target = NUMERIC_TARGET[k.id];
  const pct = measured && target ? Math.min(1, (k.value as number) / target) : 0;
  const notMeasured = lang === 'de' ? 'nicht gemessen' : 'not measured';
  return (
    <div className={hero ? 'kpi kpi-hero' : 'kpi'} id={`kpi-${k.id}`}>
      <span className="kpi-label">{k.label}</span>
      <span className={measured ? 'kpi-value' : 'kpi-value kpi-null'}>{measured ? (k.id === 'revenue' ? `€${(k.value as number).toLocaleString('de-DE')}` : k.value) : notMeasured}</span>
      <span className="kpi-unit">{k.unit}</span>
      <svg className="kpi-meter" viewBox="0 0 100 4" preserveAspectRatio="none" aria-hidden="true">
        <rect x="0" y="0" width="100" height="4" rx="2" fill={VIZ.line} />
        {pct > 0 && <rect x="0" y="0" width={pct * 100} height="4" rx="2" fill={colorOf('active')} />}
      </svg>
      <span className="kpi-target">{lang === 'de' ? 'Ziel' : 'target'}: {k.target}</span>
    </div>
  );
}

export default function KpiTiles({ lang, ids }: { lang: 'en' | 'de'; ids?: string[] }) {
  const list = ids ? KPIS.filter((k) => ids.includes(k.id)) : KPIS;
  return (
    <div className="kpi-grid" aria-label={`KPIs as of ${KPI_AS_OF}`}>
      {list.map((k, i) => <Tile key={k.id} k={k} hero={i === 0 && k.id === 'revenue'} lang={lang} />)}
    </div>
  );
}

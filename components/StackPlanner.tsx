'use client';

/**
 * The tool is the store. A SKU list goes in, a stack comes out.
 *
 * Server-rendered with the sample already stacked (the planner is pure
 * TypeScript and runs during SSR), so the first paint is a layer map and
 * three numbers, not a spinner. On the client every edit re-plans after
 * a short debounce; the Stack button re-plans immediately for keyboard
 * users and for anyone who distrusts debounces. Nothing leaves the
 * browser: no fetch, no analytics event on the SKU data.
 */

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import {
  DEFAULT_PALLET,
  SAMPLE_CSV,
  SECONDS_PER_PICK,
  planFromCsv,
  planToCsv,
  planToUrscript,
  type PalletSpec,
  type Plan,
} from '@/lib/mixedsku';

export type PlannerLabels = {
  csvLabel: string;
  fileLabel: string;
  pallet: string;
  palletEur1: string;
  palletEur2: string;
  palletCustom: string;
  length: string;
  width: string;
  maxHeight: string;
  maxWeight: string;
  stack: string;
  reset: string;
  layerMap: string;
  layer: string;
  allLayers: string;
  stability: string;
  density: string;
  layers: string;
  cycle: string;
  cycleNote: string;
  height: string;
  weight: string;
  placed: string;
  exportUr: string;
  exportCsv: string;
  scriptTitle: string;
  boundary: string;
  state: string;
};

type PresetId = 'eur1' | 'eur2' | 'custom';

const PRESETS: Record<Exclude<PresetId, 'custom'>, Pick<PalletSpec, 'length' | 'width'>> = {
  eur1: { length: 1200, width: 800 },
  eur2: { length: 1200, width: 1000 },
};

function download(name: string, text: string, type: string) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function StackPlanner({
  labels,
  lang,
  compact = false,
}: {
  labels: PlannerLabels;
  lang: 'en' | 'de';
  compact?: boolean;
}) {
  const [csv, setCsv] = useState<string>(SAMPLE_CSV);
  const [committed, setCommitted] = useState<string>(SAMPLE_CSV);
  const [preset, setPreset] = useState<PresetId>('eur1');
  const [pallet, setPallet] = useState<PalletSpec>(DEFAULT_PALLET);
  const [layerView, setLayerView] = useState<number | 'all'>('all');
  const [scriptOpen, setScriptOpen] = useState(false);
  const timer = useRef<number | null>(null);

  const plan: Plan = useMemo(() => planFromCsv(committed, pallet), [committed, pallet]);

  // Debounced re-plan on typing; the Stack button bypasses the delay.
  useEffect(() => {
    if (csv === committed) return;
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCommitted(csv), 150);
    return () => { if (timer.current) window.clearTimeout(timer.current); };
  }, [csv, committed]);

  useEffect(() => {
    if (layerView !== 'all' && layerView >= plan.layers) setLayerView('all');
  }, [plan.layers, layerView]);

  function stackNow() {
    if (timer.current) window.clearTimeout(timer.current);
    setCommitted(csv);
  }

  function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then((text) => { setCsv(text); setCommitted(text); });
  }

  function applyPreset(id: PresetId) {
    setPreset(id);
    if (id !== 'custom') setPallet((p) => ({ ...p, ...PRESETS[id] }));
  }

  const nf = useMemo(() => new Intl.NumberFormat(lang, { maximumFractionDigits: 0 }), [lang]);
  const pct = (v: number) => `${(v * 100).toFixed(0)} %`;

  const visible = plan.placements.filter((p) => layerView === 'all' || p.layer === layerView);
  const pad = 36;
  const vbW = pallet.length + pad * 2;
  const vbH = pallet.width + pad * 2;
  const maxWeight = Math.max(...plan.placements.map((p) => p.weight), 1);

  // Centre of mass marker for the map.
  const tw = plan.placements.reduce((s, p) => s + Math.max(p.weight, 1e-6), 0);
  const comX = tw > 0 ? plan.placements.reduce((s, p) => s + (p.x + p.l / 2) * Math.max(p.weight, 1e-6), 0) / tw : pallet.length / 2;
  const comY = tw > 0 ? plan.placements.reduce((s, p) => s + (p.y + p.w / 2) * Math.max(p.weight, 1e-6), 0) / tw : pallet.width / 2;

  const stabilityTone = plan.stability >= 0.85 ? 'sp-tile-ok' : plan.stability >= 0.6 ? 'sp-tile-hold' : 'sp-tile-fault';
  const stateTone = plan.state === 'RUN' ? 'sp-tile-ok' : plan.state === 'HOLD' ? 'sp-tile-hold' : plan.state === 'FAULT' ? 'sp-tile-fault' : '';
  const stub = planToUrscript(plan, pallet);
  const minutes = Math.floor(plan.cycleSeconds / 60);
  const seconds = plan.cycleSeconds % 60;

  return (
    <div className="sp" id="stack">
      <div className="sp-grid">
        <form
          className="sp-in"
          onSubmit={(e) => { e.preventDefault(); stackNow(); }}
          aria-label={labels.stack}
        >
          <label>
            <span>{labels.csvLabel}</span>
            <textarea
              className="mono"
              name="csv"
              value={csv}
              onChange={(e) => setCsv(e.target.value)}
              spellCheck={false}
              rows={compact ? 8 : 10}
              aria-describedby="sp-boundary"
            />
          </label>
          <label className="sp-file">
            <span>{labels.fileLabel}</span>
            <input type="file" accept=".csv,text/csv,text/plain" onChange={onFile} />
          </label>
          <div className="sp-pallet">
            <label>
              <span>{labels.pallet}</span>
              <select value={preset} onChange={(e) => applyPreset(e.target.value as PresetId)}>
                <option value="eur1">{labels.palletEur1}</option>
                <option value="eur2">{labels.palletEur2}</option>
                <option value="custom">{labels.palletCustom}</option>
              </select>
            </label>
            <label>
              <span>{labels.maxHeight}</span>
              <input type="number" inputMode="numeric" min={100} step={10} value={pallet.maxHeight}
                onChange={(e) => setPallet((p) => ({ ...p, maxHeight: Number(e.target.value) }))} />
            </label>
            {preset === 'custom' && (
              <>
                <label>
                  <span>{labels.length}</span>
                  <input type="number" inputMode="numeric" min={100} step={10} value={pallet.length}
                    onChange={(e) => setPallet((p) => ({ ...p, length: Number(e.target.value) }))} />
                </label>
                <label>
                  <span>{labels.width}</span>
                  <input type="number" inputMode="numeric" min={100} step={10} value={pallet.width}
                    onChange={(e) => setPallet((p) => ({ ...p, width: Number(e.target.value) }))} />
                </label>
              </>
            )}
            <label>
              <span>{labels.maxWeight}</span>
              <input type="number" inputMode="numeric" min={10} step={10} value={pallet.maxWeight}
                onChange={(e) => setPallet((p) => ({ ...p, maxWeight: Number(e.target.value) }))} />
            </label>
          </div>
          <div className="sp-actions">
            <button type="submit" className="btn btn-signal">{labels.stack}</button>
            <button type="button" className="btn btn-line" onClick={() => { setCsv(SAMPLE_CSV); setCommitted(SAMPLE_CSV); }}>{labels.reset}</button>
          </div>
        </form>

        <div className="sp-out">
          <figure className="sp-map" style={{ margin: 0 }}>
            <div className="sp-map-head">
              <strong>{labels.layerMap} · {pallet.length} × {pallet.width} mm</strong>
              <div className="sp-layer-tabs" role="group" aria-label={labels.layer}>
                <button type="button" aria-pressed={layerView === 'all'} onClick={() => setLayerView('all')}>{labels.allLayers}</button>
                {Array.from({ length: plan.layers }, (_, i) => (
                  <button type="button" key={i} aria-pressed={layerView === i} onClick={() => setLayerView(i)}>L{i + 1}</button>
                ))}
              </div>
            </div>
            <svg viewBox={`0 0 ${vbW} ${vbH}`} className="sp-svg" role="img" aria-label={`${labels.layerMap}: ${plan.boxesPlaced} ${labels.placed}`}>
              <rect x={pad} y={pad} width={pallet.length} height={pallet.width} className="sp-deck" />
              {visible.map((p) => {
                const heavy = p.weight >= maxWeight * 0.75;
                const cls = p.crushed ? 'sp-box sp-box-fault' : heavy ? 'sp-box sp-box-heavy' : p.rot === 90 ? 'sp-box sp-box-rot' : 'sp-box';
                const opacity = layerView === 'all' ? 0.55 + 0.45 * ((p.layer + 1) / Math.max(plan.layers, 1)) : 1;
                return (
                  <g key={`${p.seq}`} opacity={opacity}>
                    <rect x={pad + p.x + 2} y={pad + p.y + 2} width={Math.max(p.l - 4, 1)} height={Math.max(p.w - 4, 1)} className={cls} rx={4} />
                    {(layerView !== 'all' || p.layer === plan.layers - 1) && p.l >= 140 && p.w >= 90 && (
                      <text x={pad + p.x + p.l / 2} y={pad + p.y + p.w / 2} className="sp-box-label">{p.id}</text>
                    )}
                  </g>
                );
              })}
              {plan.placements.length > 0 && (
                <g>
                  <circle cx={pad + comX} cy={pad + comY} r={14} className="sp-com" />
                  <circle cx={pad + comX} cy={pad + comY} r={4} className="sp-com-dot" />
                </g>
              )}
              <text x={pad + pallet.length / 2} y={pad - 10} className="sp-dim">{pallet.length} mm</text>
              <text x={pad - 10} y={pad + pallet.width / 2} className="sp-dim" transform={`rotate(-90 ${pad - 10} ${pad + pallet.width / 2})`}>{pallet.width} mm</text>
            </svg>
          </figure>

          <div className="sp-stats">
            <div className="sp-state" role="status" aria-label={labels.state}>
              {(['IDLE', 'RUN', 'HOLD', 'FAULT'] as const).map((s) => (
                <span key={s} className={`chip ${s === 'RUN' ? 'chip-live' : s === 'HOLD' ? 'chip-hold' : s === 'FAULT' ? 'chip-fault' : 'chip-idle'}`} data-on={plan.state === s}>{s}</span>
              ))}
            </div>
            <div className="sp-tiles">
              <div className={`sp-tile ${stabilityTone}`}><span>{labels.stability}</span><strong>{pct(plan.stability)}</strong></div>
              <div className="sp-tile"><span>{labels.density}</span><strong>{pct(plan.density)}</strong></div>
              <div className="sp-tile"><span>{labels.layers}</span><strong>{plan.layers}</strong></div>
              <div className={`sp-tile ${stateTone}`}><span>{labels.placed}</span><strong>{plan.boxesPlaced}/{plan.boxesIn}</strong></div>
              <div className="sp-tile"><span>{labels.height}</span><strong>{nf.format(plan.stackHeight)} mm</strong></div>
              <div className="sp-tile"><span>{labels.weight}</span><strong>{nf.format(plan.totalWeight)} kg</strong></div>
              <div className="sp-tile"><span>{labels.cycle}</span><strong>{minutes}:{seconds.toString().padStart(2, '0')} min</strong></div>
            </div>
            <ul className="sp-faults" aria-live="polite">
              {plan.faults.map((f, i) => (
                <li key={`${f.code}-${i}`} className={f.level}>{f[lang]}</li>
              ))}
            </ul>
            <div className="sp-export">
              <button type="button" className="btn btn-line" onClick={() => download('palletizer-stack.script', stub, 'text/plain;charset=utf-8')} disabled={plan.placements.length === 0}>{labels.exportUr}</button>
              <button type="button" className="btn btn-line" onClick={() => download('palletizer-stack.csv', planToCsv(plan, pallet), 'text/csv;charset=utf-8')} disabled={plan.placements.length === 0}>{labels.exportCsv}</button>
            </div>
            {!compact && (
              <details className="sp-script" open={scriptOpen} onToggle={(e) => setScriptOpen((e.target as HTMLDetailsElement).open)}>
                <summary>{labels.scriptTitle}</summary>
                <pre tabIndex={0}><code>{stub}</code></pre>
              </details>
            )}
          </div>
        </div>
      </div>
      <p className="sp-foot" id="sp-boundary">
        <span>{labels.boundary}</span>
        <span>{labels.cycleNote.replace('{s}', String(SECONDS_PER_PICK))}</span>
      </p>
    </div>
  );
}

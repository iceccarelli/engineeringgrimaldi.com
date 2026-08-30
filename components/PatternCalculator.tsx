'use client';

/**
 * The calculator island. All state is local, all maths runs in
 * lib/palletize.ts on the client — no network call, no tracking of the
 * visitor's box dimensions, nothing to leak. Labels arrive from the
 * server page so the component stays locale-agnostic.
 */

import { useMemo, useState } from 'react';
import {
  PALLET_PRESETS,
  palletize,
  placementsToCsv,
  type BoxSpec,
  type LayerPattern,
  type PalletSpec,
} from '@/lib/palletize';

export type CalculatorLabels = {
  palletLegend: string;
  preset: string;
  custom: string;
  palletLength: string;
  palletWidth: string;
  deckHeight: string;
  maxHeight: string;
  maxWeight: string;
  boxLegend: string;
  boxLength: string;
  boxWidth: string;
  boxHeight: string;
  boxWeight: string;
  resultsLegend: string;
  casesPerLayer: string;
  layers: string;
  totalCases: string;
  areaUtil: string;
  cubeUtil: string;
  loadHeight: string;
  loadWeight: string;
  limitedBy: string;
  limitHeight: string;
  limitWeight: string;
  limitBoth: string;
  patternColumn: string;
  patternTwoBlock: string;
  patternFourBlock: string;
  interlocked: string;
  uniform: string;
  alternatives: string;
  perLayerShort: string;
  errBoxTooLarge: string;
  errNoVerticalRoom: string;
  errInvalid: string;
  downloadCsv: string;
  planView: string;
  disclaimer: string;
};

const MM = (v: number) => `${Math.round(v)} mm`;

export default function PatternCalculator({
  labels,
  lang,
}: {
  labels: CalculatorLabels;
  lang: 'en' | 'de';
}) {
  const [presetId, setPresetId] = useState<string>(PALLET_PRESETS[0].id);
  const [palletLength, setPalletLength] = useState(1200);
  const [palletWidth, setPalletWidth] = useState(800);
  const [deckHeight, setDeckHeight] = useState(144);
  const [maxHeight, setMaxHeight] = useState(1800);
  const [maxWeight, setMaxWeight] = useState(1000);

  const [boxLength, setBoxLength] = useState(400);
  const [boxWidth, setBoxWidth] = useState(300);
  const [boxHeight, setBoxHeight] = useState(250);
  const [boxWeight, setBoxWeight] = useState(5);

  const nf = useMemo(() => new Intl.NumberFormat(lang), [lang]);

  function applyPreset(id: string) {
    setPresetId(id);
    const preset = PALLET_PRESETS.find((p) => p.id === id);
    if (!preset) return;
    setPalletLength(preset.length);
    setPalletWidth(preset.width);
    setDeckHeight(preset.height);
  }

  const pallet: PalletSpec = {
    length: palletLength,
    width: palletWidth,
    height: deckHeight,
    maxLoadHeight: maxHeight,
    maxLoadWeight: maxWeight,
  };
  const box: BoxSpec = { length: boxLength, width: boxWidth, height: boxHeight, weight: boxWeight };

  const result = useMemo(() => palletize(pallet, box), [
    palletLength, palletWidth, deckHeight, maxHeight, maxWeight,
    boxLength, boxWidth, boxHeight, boxWeight,
  ]);

  const patternName = (p: LayerPattern) =>
    p.kind === 'column' ? labels.patternColumn : p.kind === 'two-block' ? labels.patternTwoBlock : labels.patternFourBlock;

  function downloadCsv() {
    const csv = placementsToCsv(result, pallet, box);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = globalThis.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pallet-pattern-${palletLength}x${palletWidth}-${boxLength}x${boxWidth}x${boxHeight}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    globalThis.URL.revokeObjectURL(url);
  }

  const errorText =
    result.reason === 'box-too-large'
      ? labels.errBoxTooLarge
      : result.reason === 'no-vertical-room'
        ? labels.errNoVerticalRoom
        : result.reason === 'invalid-input'
          ? labels.errInvalid
          : null;

  const limitText =
    result.limitedBy === 'height'
      ? labels.limitHeight
      : result.limitedBy === 'weight'
        ? labels.limitWeight
        : result.limitedBy === 'both'
          ? labels.limitBoth
          : '—';

  const pad = 40;
  const vbW = palletLength + pad * 2;
  const vbH = palletWidth + pad * 2;

  return (
    <div className="calc">
      <div className="calc-inputs">
        <fieldset>
          <legend>{labels.palletLegend}</legend>
          <label className="calc-field calc-field-wide">
            <span>{labels.preset}</span>
            <select value={presetId} onChange={(e) => applyPreset(e.target.value)}>
              {PALLET_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
              <option value="custom">{labels.custom}</option>
            </select>
          </label>
          <NumberField label={labels.palletLength} value={palletLength} onChange={(v) => { setPresetId('custom'); setPalletLength(v); }} />
          <NumberField label={labels.palletWidth} value={palletWidth} onChange={(v) => { setPresetId('custom'); setPalletWidth(v); }} />
          <NumberField label={labels.deckHeight} value={deckHeight} onChange={setDeckHeight} />
          <NumberField label={labels.maxHeight} value={maxHeight} onChange={setMaxHeight} />
          <NumberField label={labels.maxWeight} value={maxWeight} onChange={setMaxWeight} unit="kg" />
        </fieldset>

        <fieldset>
          <legend>{labels.boxLegend}</legend>
          <NumberField label={labels.boxLength} value={boxLength} onChange={setBoxLength} />
          <NumberField label={labels.boxWidth} value={boxWidth} onChange={setBoxWidth} />
          <NumberField label={labels.boxHeight} value={boxHeight} onChange={setBoxHeight} />
          <NumberField label={labels.boxWeight} value={boxWeight} onChange={setBoxWeight} unit="kg" step={0.1} />
        </fieldset>
      </div>

      <div className="calc-output">
        <figure className="calc-figure">
          <figcaption>{labels.planView}</figcaption>
          <svg viewBox={`0 0 ${vbW} ${vbH}`} role="img" aria-label={labels.planView} className="calc-svg">
            <rect x={pad} y={pad} width={palletLength} height={palletWidth} className="calc-deck" />
            {(result.best?.placements ?? []).map((p, i) => (
              <g key={`${p.x}-${p.y}-${i}`}>
                <rect
                  x={pad + p.x}
                  y={pad + p.y}
                  width={p.w}
                  height={p.d}
                  className={p.rotated ? 'calc-box calc-box-rot' : 'calc-box'}
                />
                <text x={pad + p.x + p.w / 2} y={pad + p.y + p.d / 2} className="calc-box-label">{i + 1}</text>
              </g>
            ))}
            <text x={pad + palletLength / 2} y={pad - 12} className="calc-dim">{MM(palletLength)}</text>
            <text x={pad - 12} y={pad + palletWidth / 2} className="calc-dim calc-dim-v"
                  transform={`rotate(-90 ${pad - 12} ${pad + palletWidth / 2})`}>{MM(palletWidth)}</text>
          </svg>
        </figure>

        <div className="calc-stats">
          <h3>{labels.resultsLegend}</h3>
          {errorText ? (
            <p className="calc-error" role="alert">{errorText}</p>
          ) : (
            <>
              <dl>
                <Stat label={labels.casesPerLayer} value={nf.format(result.best?.count ?? 0)} strong />
                <Stat label={labels.layers} value={nf.format(result.layers)} />
                <Stat label={labels.totalCases} value={nf.format(result.totalCases)} strong />
                <Stat label={labels.areaUtil} value={`${(result.areaUtilisation * 100).toFixed(1)} %`} />
                <Stat label={labels.cubeUtil} value={`${(result.volumeUtilisation * 100).toFixed(1)} %`} />
                <Stat label={labels.loadHeight} value={MM(result.loadHeight)} />
                <Stat label={labels.loadWeight} value={`${nf.format(Math.round(result.loadWeight))} kg`} />
                <Stat label={labels.limitedBy} value={limitText} />
              </dl>
              {result.best && (
                <p className="calc-pattern-name">
                  {patternName(result.best)} ·{' '}
                  {result.best.interlocked ? labels.interlocked : labels.uniform}
                </p>
              )}
              {result.alternatives.length > 0 && (
                <div className="calc-alts">
                  <h4>{labels.alternatives}</h4>
                  <ul>
                    {result.alternatives.map((alt, i) => (
                      <li key={`${alt.kind}-${alt.count}-${i}`}>
                        {patternName(alt)} — {nf.format(alt.count)} {labels.perLayerShort}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <button type="button" className="btn btn-line calc-download" onClick={downloadCsv}>
                {labels.downloadCsv}
              </button>
            </>
          )}
        </div>
      </div>

      <p className="calc-disclaimer">{labels.disclaimer}</p>
    </div>
  );
}

function NumberField({
  label, value, onChange, unit = 'mm', step = 1,
}: {
  label: string; value: number; onChange: (v: number) => void; unit?: string; step?: number;
}) {
  return (
    <label className="calc-field">
      <span>{label}</span>
      <span className="calc-input-row">
        <input
          type="number"
          inputMode="decimal"
          min={0}
          step={step}
          value={Number.isFinite(value) ? value : ''}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <em>{unit}</em>
      </span>
    </label>
  );
}

function Stat({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={strong ? 'calc-stat calc-stat-strong' : 'calc-stat'}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

'use client';

/**
 * Vehicle load calculator island. Local state, client-side maths,
 * nothing transmitted. Shares the .calc-* styling with the pallet
 * pattern calculator so the two tools read as one instrument family.
 */

import { useMemo, useState } from 'react';
import {
  VEHICLE_PRESETS,
  loadToCsv,
  solveLoad,
  type LoadUnit,
  type Pattern,
  type Vehicle,
} from '@/lib/truckload';

export type LoadLabels = {
  vehicleLegend: string;
  preset: string;
  custom: string;
  floorLength: string;
  floorWidth: string;
  interiorHeight: string;
  payload: string;
  unitLegend: string;
  unitLength: string;
  unitWidth: string;
  unitHeight: string;
  unitWeight: string;
  stackable: string;
  resultsLegend: string;
  floorSpots: string;
  tiers: string;
  totalUnits: string;
  floorUtil: string;
  payloadUsed: string;
  payloadUtil: string;
  stackHeight: string;
  limitedBy: string;
  limitSpace: string;
  limitPayload: string;
  limitBoth: string;
  patternColumn: string;
  patternTwoBlock: string;
  patternFourBlock: string;
  interlocked: string;
  uniform: string;
  alternatives: string;
  spotsShort: string;
  errUnitTooLarge: string;
  errTooTall: string;
  errInvalid: string;
  downloadCsv: string;
  planView: string;
  disclaimer: string;
};

const MM = (v: number) => `${Math.round(v)} mm`;

export default function TruckLoadCalculator({
  labels,
  lang,
}: {
  labels: LoadLabels;
  lang: 'en' | 'de';
}) {
  const [presetId, setPresetId] = useState(VEHICLE_PRESETS[0].id);
  const [floorLength, setFloorLength] = useState(VEHICLE_PRESETS[0].length);
  const [floorWidth, setFloorWidth] = useState(VEHICLE_PRESETS[0].width);
  const [interiorHeight, setInteriorHeight] = useState(VEHICLE_PRESETS[0].height);
  const [payload, setPayload] = useState(VEHICLE_PRESETS[0].payload);

  const [unitLength, setUnitLength] = useState(1200);
  const [unitWidth, setUnitWidth] = useState(800);
  const [unitHeight, setUnitHeight] = useState(1800);
  const [unitWeight, setUnitWeight] = useState(700);
  const [stackable, setStackable] = useState(false);

  const nf = useMemo(() => new Intl.NumberFormat(lang), [lang]);

  function applyPreset(id: string) {
    setPresetId(id);
    const preset = VEHICLE_PRESETS.find((v) => v.id === id);
    if (!preset) return;
    setFloorLength(preset.length);
    setFloorWidth(preset.width);
    setInteriorHeight(preset.height);
    setPayload(preset.payload);
  }

  const vehicle: Vehicle = {
    id: presetId,
    label: VEHICLE_PRESETS.find((v) => v.id === presetId)?.label ?? labels.custom,
    length: floorLength,
    width: floorWidth,
    height: interiorHeight,
    payload,
  };
  const unit: LoadUnit = {
    length: unitLength,
    width: unitWidth,
    height: unitHeight,
    weight: unitWeight,
    stackable,
  };

  const result = useMemo(() => solveLoad(vehicle, unit), [
    presetId, floorLength, floorWidth, interiorHeight, payload,
    unitLength, unitWidth, unitHeight, unitWeight, stackable,
  ]);

  const patternName = (p: Pattern) =>
    p.kind === 'column' ? labels.patternColumn : p.kind === 'two-block' ? labels.patternTwoBlock : labels.patternFourBlock;

  function downloadCsv() {
    const csv = loadToCsv(result, vehicle, unit);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = globalThis.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `load-plan-${presetId}-${unitLength}x${unitWidth}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    globalThis.URL.revokeObjectURL(url);
  }

  const errorText =
    result.reason === 'unit-too-large'
      ? labels.errUnitTooLarge
      : result.reason === 'too-tall'
        ? labels.errTooTall
        : result.reason === 'invalid-input'
          ? labels.errInvalid
          : null;

  const limitText =
    result.limitedBy === 'space'
      ? labels.limitSpace
      : result.limitedBy === 'payload'
        ? labels.limitPayload
        : result.limitedBy === 'both'
          ? labels.limitBoth
          : '—';

  const pad = 120;
  const vbW = floorLength + pad * 2;
  const vbH = floorWidth + pad * 2;
  const spots = result.best?.placements ?? [];

  return (
    <div className="calc">
      <div className="calc-inputs">
        <fieldset>
          <legend>{labels.vehicleLegend}</legend>
          <label className="calc-field calc-field-wide">
            <span>{labels.preset}</span>
            <select value={presetId} onChange={(e) => applyPreset(e.target.value)}>
              {VEHICLE_PRESETS.map((v) => (
                <option key={v.id} value={v.id}>{v.label}</option>
              ))}
              <option value="custom">{labels.custom}</option>
            </select>
          </label>
          <NumberField label={labels.floorLength} value={floorLength} onChange={(v) => { setPresetId('custom'); setFloorLength(v); }} />
          <NumberField label={labels.floorWidth} value={floorWidth} onChange={(v) => { setPresetId('custom'); setFloorWidth(v); }} />
          <NumberField label={labels.interiorHeight} value={interiorHeight} onChange={setInteriorHeight} />
          <NumberField label={labels.payload} value={payload} onChange={setPayload} unit="kg" />
        </fieldset>

        <fieldset>
          <legend>{labels.unitLegend}</legend>
          <NumberField label={labels.unitLength} value={unitLength} onChange={setUnitLength} />
          <NumberField label={labels.unitWidth} value={unitWidth} onChange={setUnitWidth} />
          <NumberField label={labels.unitHeight} value={unitHeight} onChange={setUnitHeight} />
          <NumberField label={labels.unitWeight} value={unitWeight} onChange={setUnitWeight} unit="kg" />
          <label className="calc-field calc-field-wide calc-check">
            <input type="checkbox" checked={stackable} onChange={(e) => setStackable(e.target.checked)} />
            <span>{labels.stackable}</span>
          </label>
        </fieldset>
      </div>

      <div className="calc-output">
        <figure className="calc-figure">
          <figcaption>{labels.planView}</figcaption>
          <svg viewBox={`0 0 ${vbW} ${vbH}`} role="img" aria-label={labels.planView} className="calc-svg">
            <rect x={pad} y={pad} width={floorLength} height={floorWidth} className="calc-deck" />
            {spots.map((p, i) => (
              <g key={`${p.x}-${p.y}-${i}`}>
                <rect
                  x={pad + p.x}
                  y={pad + p.y}
                  width={p.w}
                  height={p.d}
                  className={p.rotated ? 'calc-box calc-box-rot' : 'calc-box'}
                />
                <text x={pad + p.x + p.w / 2} y={pad + p.y + p.d / 2} className="calc-box-label calc-box-label-sm">{i + 1}</text>
              </g>
            ))}
            <text x={pad + floorLength / 2} y={pad - 30} className="calc-dim">{MM(floorLength)}</text>
          </svg>
        </figure>

        <div className="calc-stats">
          <h3>{labels.resultsLegend}</h3>
          {errorText ? (
            <p className="calc-error" role="alert">{errorText}</p>
          ) : (
            <>
              <dl>
                <Stat label={labels.floorSpots} value={nf.format(result.floorSpots)} />
                <Stat label={labels.tiers} value={nf.format(result.tiers)} />
                <Stat label={labels.totalUnits} value={nf.format(result.totalUnits)} strong />
                <Stat label={labels.floorUtil} value={`${(result.floorUtilisation * 100).toFixed(1)} %`} />
                <Stat label={labels.stackHeight} value={MM(result.stackHeight)} />
                <Stat label={labels.payloadUsed} value={`${nf.format(Math.round(result.payloadUsed))} kg`} />
                <Stat label={labels.payloadUtil} value={`${(result.payloadUtilisation * 100).toFixed(1)} %`} />
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
                        {patternName(alt)} — {nf.format(alt.count)} {labels.spotsShort}
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

'use client';

/**
 * Case-size optimiser island. Sweeps thousands of candidate cartons in
 * the browser (the count-only packer makes that cheap) and ranks them
 * against the user's current case.
 */

import { useMemo, useState } from 'react';
import { optimiseCase, type CaseRange, type Candidate, type CurrentCase } from '@/lib/caseoptimizer';
import { PALLET_PRESETS, type PalletSpec } from '@/lib/palletize';

export type OptimizerLabels = {
  palletLegend: string;
  preset: string;
  custom: string;
  palletLength: string;
  palletWidth: string;
  deckHeight: string;
  maxHeight: string;
  maxWeight: string;
  currentLegend: string;
  curLength: string;
  curWidth: string;
  curHeight: string;
  curWeight: string;
  rangeLegend: string;
  minLength: string;
  maxLength: string;
  minWidth: string;
  maxWidth: string;
  minHeight: string;
  maxHeight2: string;
  step: string;
  resultsLegend: string;
  yourCase: string;
  headerCase: string;
  headerPerLayer: string;
  headerLayers: string;
  headerTotal: string;
  headerCube: string;
  headerDelta: string;
  gainHeadline: string;
  gainNone: string;
  evaluated: string;
  coarsened: string;
  errInvalidRange: string;
  errNothingFits: string;
  errInvalid: string;
  downloadCsv: string;
  disclaimer: string;
};

export default function CaseOptimizer({
  labels,
  lang,
}: {
  labels: OptimizerLabels;
  lang: 'en' | 'de';
}) {
  const [presetId, setPresetId] = useState(PALLET_PRESETS[0].id);
  const [palletLength, setPalletLength] = useState(1200);
  const [palletWidth, setPalletWidth] = useState(800);
  const [deckHeight, setDeckHeight] = useState(144);
  const [maxHeight, setMaxHeight] = useState(1800);
  const [maxWeight, setMaxWeight] = useState(1000);

  const [curLength, setCurLength] = useState(400);
  const [curWidth, setCurWidth] = useState(300);
  const [curHeight, setCurHeight] = useState(250);
  const [curWeight, setCurWeight] = useState(5);

  const [minLength, setMinLength] = useState(300);
  const [maxLengthR, setMaxLengthR] = useState(500);
  const [minWidth, setMinWidth] = useState(200);
  const [maxWidthR, setMaxWidthR] = useState(400);
  const [minHeightR, setMinHeightR] = useState(180);
  const [maxHeightR, setMaxHeightR] = useState(320);
  const [step, setStep] = useState(10);

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
  const current: CurrentCase = {
    length: curLength, width: curWidth, height: curHeight, weight: curWeight,
  };
  const range: CaseRange = {
    minLength, maxLength: maxLengthR,
    minWidth, maxWidth: maxWidthR,
    minHeight: minHeightR, maxHeight: maxHeightR,
    step,
  };

  const result = useMemo(() => optimiseCase(pallet, current, range), [
    palletLength, palletWidth, deckHeight, maxHeight, maxWeight,
    curLength, curWidth, curHeight, curWeight,
    minLength, maxLengthR, minWidth, maxWidthR, minHeightR, maxHeightR, step,
  ]);

  function downloadCsv() {
    const rows: string[] = [];
    rows.push('# Grimaldi Engineering - case size candidates (geometry only)');
    rows.push('# Tooling, artwork, shelf fit and board cost are NOT modelled.');
    rows.push(`# pallet_mm,${palletLength},${palletWidth},max_height_mm,${maxHeight},max_payload_kg,${maxWeight}`);
    rows.push(`# current_case_mm,${curLength},${curWidth},${curHeight},kg,${curWeight}`);
    rows.push('rank,length_mm,width_mm,height_mm,cases_per_layer,layers,cases_per_pallet,cube_utilisation_pct,load_height_mm,load_weight_kg');
    if (result.current) {
      const c = result.current;
      rows.push(`current,${c.length},${c.width},${c.height},${c.casesPerLayer},${c.layers},${c.totalCases},${(c.cubeUtilisation * 100).toFixed(2)},${c.loadHeight},${c.loadWeight.toFixed(2)}`);
    }
    result.best.forEach((c, i) => {
      rows.push(`${i + 1},${c.length},${c.width},${c.height},${c.casesPerLayer},${c.layers},${c.totalCases},${(c.cubeUtilisation * 100).toFixed(2)},${c.loadHeight},${c.loadWeight.toFixed(2)}`);
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = globalThis.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `case-size-candidates-${palletLength}x${palletWidth}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    globalThis.URL.revokeObjectURL(url);
  }

  const errorText =
    result.reason === 'invalid-range'
      ? labels.errInvalidRange
      : result.reason === 'nothing-fits'
        ? labels.errNothingFits
        : result.reason === 'invalid-input'
          ? labels.errInvalid
          : null;

  const pct = (v: number) => `${(v * 100).toFixed(1)} %`;
  const dims = (c: Candidate) => `${c.length} × ${c.width} × ${c.height}`;

  return (
    <div className="calc">
      <div className="calc-inputs calc-inputs-3">
        <fieldset>
          <legend>{labels.palletLegend}</legend>
          <label className="calc-field calc-field-wide">
            <span>{labels.preset}</span>
            <select value={presetId} onChange={(e) => applyPreset(e.target.value)}>
              {PALLET_PRESETS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
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
          <legend>{labels.currentLegend}</legend>
          <NumberField label={labels.curLength} value={curLength} onChange={setCurLength} />
          <NumberField label={labels.curWidth} value={curWidth} onChange={setCurWidth} />
          <NumberField label={labels.curHeight} value={curHeight} onChange={setCurHeight} />
          <NumberField label={labels.curWeight} value={curWeight} onChange={setCurWeight} unit="kg" step={0.1} />
        </fieldset>

        <fieldset>
          <legend>{labels.rangeLegend}</legend>
          <NumberField label={labels.minLength} value={minLength} onChange={setMinLength} />
          <NumberField label={labels.maxLength} value={maxLengthR} onChange={setMaxLengthR} />
          <NumberField label={labels.minWidth} value={minWidth} onChange={setMinWidth} />
          <NumberField label={labels.maxWidth} value={maxWidthR} onChange={setMaxWidthR} />
          <NumberField label={labels.minHeight} value={minHeightR} onChange={setMinHeightR} />
          <NumberField label={labels.maxHeight2} value={maxHeightR} onChange={setMaxHeightR} />
          <NumberField label={labels.step} value={step} onChange={setStep} step={5} />
        </fieldset>
      </div>

      <div className="calc-result-block">
        <h3>{labels.resultsLegend}</h3>
        {errorText ? (
          <p className="calc-error" role="alert">{errorText}</p>
        ) : (
          <>
            <p className={result.gainPoints > 0.05 ? 'calc-headline calc-headline-win' : 'calc-headline'}>
              {result.gainPoints > 0.05
                ? labels.gainHeadline
                    .replace('{points}', result.gainPoints.toFixed(1))
                    .replace('{cases}', nf.format(Math.abs(result.gainCases)))
                : labels.gainNone}
            </p>

            <div className="calc-table-wrap">
              <table className="calc-table">
                <thead>
                  <tr>
                    <th>{labels.headerCase}</th>
                    <th>{labels.headerPerLayer}</th>
                    <th>{labels.headerLayers}</th>
                    <th>{labels.headerTotal}</th>
                    <th>{labels.headerCube}</th>
                    <th>{labels.headerDelta}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.current && (
                    <tr className="calc-row-current">
                      <td>{dims(result.current)} <em>{labels.yourCase}</em></td>
                      <td>{nf.format(result.current.casesPerLayer)}</td>
                      <td>{nf.format(result.current.layers)}</td>
                      <td>{nf.format(result.current.totalCases)}</td>
                      <td>{pct(result.current.cubeUtilisation)}</td>
                      <td>—</td>
                    </tr>
                  )}
                  {result.best.map((c) => {
                    const delta = result.current
                      ? (c.cubeUtilisation - result.current.cubeUtilisation) * 100
                      : 0;
                    return (
                      <tr key={`${c.length}-${c.width}-${c.height}`}>
                        <td>{dims(c)}</td>
                        <td>{nf.format(c.casesPerLayer)}</td>
                        <td>{nf.format(c.layers)}</td>
                        <td>{nf.format(c.totalCases)}</td>
                        <td>{pct(c.cubeUtilisation)}</td>
                        <td className={delta > 0 ? 'calc-delta-up' : undefined}>
                          {delta > 0 ? '+' : ''}{delta.toFixed(1)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="calc-meta">
              {labels.evaluated.replace('{n}', nf.format(result.evaluated))}
              {result.coarsened ? ` · ${labels.coarsened.replace('{step}', String(result.effectiveStep))}` : ''}
            </p>

            <button type="button" className="btn btn-line calc-download" onClick={downloadCsv}>
              {labels.downloadCsv}
            </button>
          </>
        )}
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

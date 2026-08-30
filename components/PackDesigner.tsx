'use client';

/** Battery pack topology island. All maths client-side, nothing transmitted. */

import { useMemo, useState } from 'react';
import { CELL_PRESETS, designPack, type Cell, type PackWarning } from '@/lib/battery';

export type PackLabels = {
  cellLegend: string;
  preset: string;
  custom: string;
  nominalVoltage: string;
  maxVoltage: string;
  minVoltage: string;
  capacityAh: string;
  maxDischargeC: string;
  internalResistance: string;
  cellMass: string;
  topologyLegend: string;
  series: string;
  parallel: string;
  loadPower: string;
  depthOfDischarge: string;
  resultsLegend: string;
  cellCount: string;
  packNominal: string;
  packWindow: string;
  packCapacity: string;
  packEnergy: string;
  usableEnergy: string;
  maxCurrent: string;
  maxPower: string;
  loadCurrent: string;
  demandedC: string;
  headroom: string;
  runtime: string;
  packResistance: string;
  resistiveLoss: string;
  voltageSag: string;
  packMass: string;
  specificEnergy: string;
  warningsH: string;
  wCRate: string;
  w60v: string;
  w120v: string;
  wStrings: string;
  wHeadroom: string;
  wIrLoss: string;
  noWarnings: string;
  errInvalid: string;
  downloadCsv: string;
  disclaimer: string;
};

export default function PackDesigner({ labels, lang }: { labels: PackLabels; lang: 'en' | 'de' }) {
  const [presetId, setPresetId] = useState(CELL_PRESETS[3].id);
  const [cell, setCell] = useState<Cell>(CELL_PRESETS[3].cell);
  const [series, setSeries] = useState(16);
  const [parallel, setParallel] = useState(1);
  const [loadPower, setLoadPower] = useState(2000);
  const [dod, setDod] = useState(0.8);

  const nf = useMemo(() => new Intl.NumberFormat(lang, { maximumFractionDigits: 2 }), [lang]);
  const setField = (k: keyof Cell) => (v: number) => { setPresetId('custom'); setCell((c) => ({ ...c, [k]: v })); };

  function applyPreset(id: string) {
    setPresetId(id);
    const p = CELL_PRESETS.find((x) => x.id === id);
    if (p) setCell(p.cell);
  }

  const r = useMemo(
    () => designPack({ cell, series, parallel, loadPower, depthOfDischarge: dod }),
    [cell, series, parallel, loadPower, dod],
  );

  const warningText: Record<PackWarning, string> = {
    'c-rate-exceeded': labels.wCRate,
    'above-60v-dc': labels.w60v,
    'above-120v-dc': labels.w120v,
    'high-string-count': labels.wStrings,
    'low-headroom': labels.wHeadroom,
    'high-ir-loss': labels.wIrLoss,
  };

  function downloadCsv() {
    const rows = [
      '# Grimaldi Engineering - battery pack topology (steady-state duty only)',
      '# NOT a thermal, ageing, fault-propagation or thermal-runaway analysis.',
      '# NOT a substitute for the cell datasheet or IEC 62133 / UN 38.3 qualification.',
      `# cell_V,${cell.nominalVoltage},max_V,${cell.maxVoltage},min_V,${cell.minVoltage},Ah,${cell.capacityAh},maxC,${cell.maxDischargeC},IR_ohm,${cell.internalResistance},mass_kg,${cell.mass}`,
      `# topology,${series}S${parallel}P,load_W,${loadPower},DoD,${dod}`,
      'quantity,value,unit',
      `cell_count,${r.cellCount},`,
      `pack_nominal,${r.nominalVoltage.toFixed(2)},V`,
      `pack_min,${r.minVoltage.toFixed(2)},V`,
      `pack_max,${r.maxVoltage.toFixed(2)},V`,
      `capacity,${r.capacityAh.toFixed(2)},Ah`,
      `energy,${r.energyWh.toFixed(1)},Wh`,
      `usable_energy,${r.usableEnergyWh.toFixed(1)},Wh`,
      `max_continuous_current,${r.maxContinuousCurrent.toFixed(1)},A`,
      `max_continuous_power,${r.maxContinuousPower.toFixed(0)},W`,
      `load_current,${r.loadCurrent.toFixed(2)},A`,
      `demanded_c_rate,${r.demandedC.toFixed(3)},C`,
      `power_headroom,${r.powerHeadroom.toFixed(2)},x`,
      `runtime,${r.runtimeHours.toFixed(3)},h`,
      `pack_resistance,${(r.packResistance * 1000).toFixed(3)},mOhm`,
      `resistive_loss,${r.resistiveLossW.toFixed(1)},W`,
      `voltage_sag,${r.voltageSag.toFixed(3)},V`,
      `mass,${r.mass.toFixed(2)},kg`,
      `specific_energy,${r.specificEnergy.toFixed(1)},Wh/kg`,
      `warnings,"${r.warnings.join(' ')}",`,
    ].join('\n');
    const blob = new Blob([rows], { type: 'text/csv;charset=utf-8' });
    const url = globalThis.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pack-${series}S${parallel}P.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    globalThis.URL.revokeObjectURL(url);
  }

  return (
    <div className="calc">
      <div className="calc-inputs">
        <fieldset>
          <legend>{labels.cellLegend}</legend>
          <label className="calc-field calc-field-wide">
            <span>{labels.preset}</span>
            <select value={presetId} onChange={(e) => applyPreset(e.target.value)}>
              {CELL_PRESETS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
              <option value="custom">{labels.custom}</option>
            </select>
          </label>
          <Num label={labels.nominalVoltage} value={cell.nominalVoltage} onChange={setField('nominalVoltage')} unit="V" step={0.1} />
          <Num label={labels.maxVoltage} value={cell.maxVoltage} onChange={setField('maxVoltage')} unit="V" step={0.05} />
          <Num label={labels.minVoltage} value={cell.minVoltage} onChange={setField('minVoltage')} unit="V" step={0.05} />
          <Num label={labels.capacityAh} value={cell.capacityAh} onChange={setField('capacityAh')} unit="Ah" step={0.5} />
          <Num label={labels.maxDischargeC} value={cell.maxDischargeC} onChange={setField('maxDischargeC')} unit="C" step={0.5} />
          <Num label={labels.internalResistance} value={cell.internalResistance} onChange={setField('internalResistance')} unit="Ω" step={0.0001} />
          <Num label={labels.cellMass} value={cell.mass} onChange={setField('mass')} unit="kg" step={0.005} />
        </fieldset>

        <fieldset>
          <legend>{labels.topologyLegend}</legend>
          <Num label={labels.series} value={series} onChange={setSeries} unit="S" step={1} />
          <Num label={labels.parallel} value={parallel} onChange={setParallel} unit="P" step={1} />
          <Num label={labels.loadPower} value={loadPower} onChange={setLoadPower} unit="W" step={50} />
          <Num label={labels.depthOfDischarge} value={dod} onChange={setDod} unit="" step={0.05} />
        </fieldset>
      </div>

      <div className="calc-result-block">
        <h3>{labels.resultsLegend}</h3>
        {!r.ok ? (
          <p className="calc-error" role="alert">{labels.errInvalid}</p>
        ) : (
          <>
            <div className="calc-stat-grid">
              <Stat label={labels.packNominal} value={`${nf.format(r.nominalVoltage)} V`} strong />
              <Stat label={labels.packEnergy} value={`${nf.format(r.energyWh / 1000)} kWh`} strong />
              <Stat label={labels.runtime} value={`${nf.format(r.runtimeHours)} h`} strong />
              <Stat label={labels.packWindow} value={`${nf.format(r.minVoltage)} – ${nf.format(r.maxVoltage)} V`} />
              <Stat label={labels.cellCount} value={nf.format(r.cellCount)} />
              <Stat label={labels.packCapacity} value={`${nf.format(r.capacityAh)} Ah`} />
              <Stat label={labels.usableEnergy} value={`${nf.format(r.usableEnergyWh)} Wh`} />
              <Stat label={labels.maxCurrent} value={`${nf.format(r.maxContinuousCurrent)} A`} />
              <Stat label={labels.maxPower} value={`${nf.format(r.maxContinuousPower / 1000)} kW`} />
              <Stat label={labels.loadCurrent} value={`${nf.format(r.loadCurrent)} A`} />
              <Stat label={labels.demandedC} value={`${nf.format(r.demandedC)} C`} />
              <Stat label={labels.headroom} value={`${nf.format(r.powerHeadroom)} ×`} />
              <Stat label={labels.packResistance} value={`${nf.format(r.packResistance * 1000)} mΩ`} />
              <Stat label={labels.resistiveLoss} value={`${nf.format(r.resistiveLossW)} W`} />
              <Stat label={labels.voltageSag} value={`${nf.format(r.voltageSag)} V`} />
              <Stat label={labels.packMass} value={`${nf.format(r.mass)} kg`} />
              <Stat label={labels.specificEnergy} value={`${nf.format(r.specificEnergy)} Wh/kg`} />
            </div>

            <div className="calc-flags">
              <h4>{labels.warningsH}</h4>
              {r.warnings.length === 0 ? (
                <p className="calc-flag calc-flag-ok">{labels.noWarnings}</p>
              ) : (
                r.warnings.map((w) => (
                  <p key={w} className="calc-flag calc-flag-warn">{warningText[w]}</p>
                ))
              )}
            </div>

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

function Num({ label, value, onChange, unit, step = 1 }: {
  label: string; value: number; onChange: (v: number) => void; unit: string; step?: number;
}) {
  return (
    <label className="calc-field">
      <span>{label}</span>
      <span className="calc-input-row">
        <input type="number" inputMode="decimal" step={step} value={Number.isFinite(value) ? value : ''}
               onChange={(e) => onChange(Number(e.target.value))} />
        {unit ? <em>{unit}</em> : null}
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

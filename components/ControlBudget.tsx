'use client';

/** Loop timing + fieldbus budget island. Client-side maths only. */

import { useMemo, useState } from 'react';
import { BUS_PRESETS, analyseBus, analyseLoop, type BusFlag, type LoopFlag } from '@/lib/control';

export type ControlLabels = {
  loopLegend: string;
  sampleRate: string;
  sensorLatency: string;
  commsIn: string;
  compute: string;
  commsOut: string;
  actuatorLatency: string;
  phaseBudget: string;
  busLegend: string;
  busPreset: string;
  custom: string;
  axes: string;
  bytesPerAxis: string;
  overheadBytes: string;
  bitrate: string;
  cycleTime: string;
  loopResults: string;
  samplePeriod: string;
  nyquist: string;
  zohDelay: string;
  transportDelay: string;
  deadTime: string;
  deadTimeInSamples: string;
  maxBandwidth: string;
  samplesPerBandwidth: string;
  busResults: string;
  frameBytes: string;
  frameTime: string;
  utilisation: string;
  headroom: string;
  maxAxes: string;
  minCycle: string;
  flagsH: string;
  fSampleMarginal: string;
  fDelayDominates: string;
  fComputeOver: string;
  fDeadtimeExceeds: string;
  fOverCapacity: string;
  fTight: string;
  fHeadroomOk: string;
  noFlags: string;
  errInvalid: string;
  downloadCsv: string;
  disclaimer: string;
};

export default function ControlBudget({ labels, lang }: { labels: ControlLabels; lang: 'en' | 'de' }) {
  const [sampleRateHz, setSampleRateHz] = useState(1000);
  const [sensorLatencyUs, setSensorLatencyUs] = useState(100);
  const [commsInUs, setCommsInUs] = useState(125);
  const [computeUs, setComputeUs] = useState(150);
  const [commsOutUs, setCommsOutUs] = useState(125);
  const [actuatorLatencyUs, setActuatorLatencyUs] = useState(200);
  const [phaseBudgetDeg, setPhaseBudgetDeg] = useState(30);

  const [busPreset, setBusPreset] = useState(BUS_PRESETS[0].id);
  const [axes, setAxes] = useState(8);
  const [bytesPerAxis, setBytesPerAxis] = useState(12);
  const [overheadBytes, setOverheadBytes] = useState(60);
  const [bitrateMbps, setBitrateMbps] = useState(100);
  const [cycleTimeUs, setCycleTimeUs] = useState(1000);

  const nf = useMemo(() => new Intl.NumberFormat(lang, { maximumFractionDigits: 2 }), [lang]);
  const us = (s: number) => `${nf.format(s * 1e6)} µs`;

  function applyBusPreset(id: string) {
    setBusPreset(id);
    const p = BUS_PRESETS.find((x) => x.id === id);
    if (!p) return;
    setBitrateMbps(p.bitrateBps / 1e6);
    setOverheadBytes(p.overheadBytes);
    setCycleTimeUs(p.cycleTimeUs);
  }

  const loop = useMemo(
    () => analyseLoop({ sampleRateHz, sensorLatencyUs, commsInUs, computeUs, commsOutUs, actuatorLatencyUs, phaseBudgetDeg }),
    [sampleRateHz, sensorLatencyUs, commsInUs, computeUs, commsOutUs, actuatorLatencyUs, phaseBudgetDeg],
  );
  const bus = useMemo(
    () => analyseBus({ axes, bytesPerAxis, overheadBytes, bitrateBps: bitrateMbps * 1e6, cycleTimeUs }),
    [axes, bytesPerAxis, overheadBytes, bitrateMbps, cycleTimeUs],
  );

  const loopFlagText: Record<LoopFlag, string> = {
    'sample-rate-marginal': labels.fSampleMarginal,
    'delay-dominates': labels.fDelayDominates,
    'compute-over-budget': labels.fComputeOver,
    'deadtime-exceeds-period': labels.fDeadtimeExceeds,
  };
  const busFlagText: Record<BusFlag, string> = {
    'over-capacity': labels.fOverCapacity,
    'tight-utilisation': labels.fTight,
    'headroom-ok': labels.fHeadroomOk,
  };

  function downloadCsv() {
    const rows = [
      '# Grimaldi Engineering - control loop and fieldbus budget (first-order)',
      '# NOT a stability analysis and NOT a safety-function analysis.',
      `# loop_inputs,fs_Hz,${sampleRateHz},sensor_us,${sensorLatencyUs},comms_in_us,${commsInUs},compute_us,${computeUs},comms_out_us,${commsOutUs},actuator_us,${actuatorLatencyUs},phase_budget_deg,${phaseBudgetDeg}`,
      `# bus_inputs,axes,${axes},bytes_per_axis,${bytesPerAxis},overhead_bytes,${overheadBytes},bitrate_Mbps,${bitrateMbps},cycle_us,${cycleTimeUs}`,
      'quantity,value,unit',
      `sample_period,${(loop.samplePeriodS * 1e6).toFixed(2)},us`,
      `nyquist,${loop.nyquistHz.toFixed(1)},Hz`,
      `zoh_delay,${(loop.zohDelayS * 1e6).toFixed(2)},us`,
      `transport_delay,${(loop.transportDelayS * 1e6).toFixed(2)},us`,
      `dead_time,${(loop.deadTimeS * 1e6).toFixed(2)},us`,
      `dead_time_in_samples,${loop.deadTimeInSamples.toFixed(3)},Ts`,
      `max_bandwidth,${loop.maxBandwidthHz.toFixed(2)},Hz`,
      `samples_per_bandwidth,${loop.samplesPerBandwidth.toFixed(2)},x`,
      `frame_bytes,${bus.frameBytes},B`,
      `frame_time,${(bus.frameTimeS * 1e6).toFixed(3)},us`,
      `bus_utilisation,${(bus.utilisation * 100).toFixed(2)},%`,
      `max_axes_at_cycle,${bus.maxAxesAtCycle},`,
      `min_cycle_time,${(bus.minCycleTimeS * 1e6).toFixed(3)},us`,
      `loop_flags,"${loop.flags.join(' ')}",`,
      `bus_flags,"${bus.flags.join(' ')}",`,
    ].join('\n');
    const blob = new Blob([rows], { type: 'text/csv;charset=utf-8' });
    const url = globalThis.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `control-budget-${sampleRateHz}Hz-${axes}axes.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    globalThis.URL.revokeObjectURL(url);
  }

  return (
    <div className="calc">
      <div className="calc-inputs">
        <fieldset>
          <legend>{labels.loopLegend}</legend>
          <Num label={labels.sampleRate} value={sampleRateHz} onChange={setSampleRateHz} unit="Hz" step={100} />
          <Num label={labels.sensorLatency} value={sensorLatencyUs} onChange={setSensorLatencyUs} unit="µs" step={5} />
          <Num label={labels.commsIn} value={commsInUs} onChange={setCommsInUs} unit="µs" step={5} />
          <Num label={labels.compute} value={computeUs} onChange={setComputeUs} unit="µs" step={5} />
          <Num label={labels.commsOut} value={commsOutUs} onChange={setCommsOutUs} unit="µs" step={5} />
          <Num label={labels.actuatorLatency} value={actuatorLatencyUs} onChange={setActuatorLatencyUs} unit="µs" step={5} />
          <Num label={labels.phaseBudget} value={phaseBudgetDeg} onChange={setPhaseBudgetDeg} unit="°" step={5} />
        </fieldset>

        <fieldset>
          <legend>{labels.busLegend}</legend>
          <label className="calc-field calc-field-wide">
            <span>{labels.busPreset}</span>
            <select value={busPreset} onChange={(e) => applyBusPreset(e.target.value)}>
              {BUS_PRESETS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
              <option value="custom">{labels.custom}</option>
            </select>
          </label>
          <Num label={labels.axes} value={axes} onChange={setAxes} unit="" step={1} />
          <Num label={labels.bytesPerAxis} value={bytesPerAxis} onChange={setBytesPerAxis} unit="B" step={1} />
          <Num label={labels.overheadBytes} value={overheadBytes} onChange={(v) => { setBusPreset('custom'); setOverheadBytes(v); }} unit="B" step={1} />
          <Num label={labels.bitrate} value={bitrateMbps} onChange={(v) => { setBusPreset('custom'); setBitrateMbps(v); }} unit="Mbit/s" step={10} />
          <Num label={labels.cycleTime} value={cycleTimeUs} onChange={(v) => { setBusPreset('custom'); setCycleTimeUs(v); }} unit="µs" step={50} />
        </fieldset>
      </div>

      <div className="calc-result-block">
        <h3>{labels.loopResults}</h3>
        {!loop.ok ? (
          <p className="calc-error" role="alert">{labels.errInvalid}</p>
        ) : (
          <div className="calc-stat-grid">
            <Stat label={labels.maxBandwidth} value={`${nf.format(loop.maxBandwidthHz)} Hz`} strong />
            <Stat label={labels.deadTime} value={us(loop.deadTimeS)} strong />
            <Stat label={labels.samplesPerBandwidth} value={`${nf.format(loop.samplesPerBandwidth)} ×`} strong />
            <Stat label={labels.samplePeriod} value={us(loop.samplePeriodS)} />
            <Stat label={labels.nyquist} value={`${nf.format(loop.nyquistHz)} Hz`} />
            <Stat label={labels.zohDelay} value={us(loop.zohDelayS)} />
            <Stat label={labels.transportDelay} value={us(loop.transportDelayS)} />
            <Stat label={labels.deadTimeInSamples} value={`${nf.format(loop.deadTimeInSamples)} Ts`} />
          </div>
        )}

        <h3 className="calc-second-h">{labels.busResults}</h3>
        {!bus.ok ? (
          <p className="calc-error" role="alert">{labels.errInvalid}</p>
        ) : (
          <div className="calc-stat-grid">
            <Stat label={labels.utilisation} value={`${nf.format(bus.utilisation * 100)} %`} strong />
            <Stat label={labels.maxAxes} value={nf.format(bus.maxAxesAtCycle)} strong />
            <Stat label={labels.minCycle} value={us(bus.minCycleTimeS)} strong />
            <Stat label={labels.frameBytes} value={`${nf.format(bus.frameBytes)} B`} />
            <Stat label={labels.frameTime} value={us(bus.frameTimeS)} />
            <Stat label={labels.headroom} value={us(bus.headroomS)} />
          </div>
        )}

        <div className="calc-flags">
          <h4>{labels.flagsH}</h4>
          {loop.flags.length === 0 && bus.flags.filter((f) => f !== 'headroom-ok').length === 0 ? (
            <p className="calc-flag calc-flag-ok">{labels.noFlags}</p>
          ) : null}
          {loop.flags.map((f) => <p key={f} className="calc-flag calc-flag-warn">{loopFlagText[f]}</p>)}
          {bus.flags.map((f) => (
            <p key={f} className={f === 'headroom-ok' ? 'calc-flag calc-flag-ok' : 'calc-flag calc-flag-warn'}>
              {busFlagText[f]}
            </p>
          ))}
        </div>

        <button type="button" className="btn btn-line calc-download" onClick={downloadCsv}>
          {labels.downloadCsv}
        </button>
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

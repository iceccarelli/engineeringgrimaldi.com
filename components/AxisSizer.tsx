'use client';

/** Rotary axis / joint sizing island. All maths client-side. */

import { useMemo, useState } from 'react';
import { sizeRotaryAxis, type AxisInput } from '@/lib/machines';

export type AxisLabels = {
  loadLegend: string;
  payloadMass: string;
  armLength: string;
  armInertia: string;
  againstGravity: string;
  frictionTorque: string;
  driveLegend: string;
  gearRatio: string;
  efficiency: string;
  rotorInertia: string;
  moveLegend: string;
  moveAngle: string;
  moveTime: string;
  dwellTime: string;
  accelFraction: string;
  resultsLegend: string;
  loadInertia: string;
  reflectedInertia: string;
  inertiaRatio: string;
  peakMotorRpm: string;
  angularAcceleration: string;
  gravityTorque: string;
  torqueAccel: string;
  torqueConstant: string;
  torqueDecel: string;
  torqueRms: string;
  peakPower: string;
  cyclesPerHour: string;
  selectionH: string;
  selectionRms: string;
  selectionPeak: string;
  selectionSpeed: string;
  flagInertiaHigh: string;
  flagRegen: string;
  errInvalid: string;
  downloadCsv: string;
  disclaimer: string;
};

export default function AxisSizer({ labels, lang }: { labels: AxisLabels; lang: 'en' | 'de' }) {
  const [payloadMass, setPayloadMass] = useState(25);
  const [armLength, setArmLength] = useState(1.2);
  const [armInertia, setArmInertia] = useState(8);
  const [againstGravity, setAgainstGravity] = useState(true);
  const [frictionTorque, setFrictionTorque] = useState(5);
  const [gearRatio, setGearRatio] = useState(50);
  const [efficiency, setEfficiency] = useState(0.9);
  const [rotorInertia, setRotorInertia] = useState(0.00035);
  const [moveAngleDeg, setMoveAngleDeg] = useState(90);
  const [moveTime, setMoveTime] = useState(1.2);
  const [dwellTime, setDwellTime] = useState(0.8);
  const [accelFraction, setAccelFraction] = useState(0.33);

  const nf = useMemo(() => new Intl.NumberFormat(lang, { maximumFractionDigits: 2 }), [lang]);

  const input: AxisInput = {
    payloadMass, armLength, armInertia, gearRatio, efficiency, rotorInertia,
    moveAngle: (moveAngleDeg * Math.PI) / 180,
    moveTime, dwellTime, frictionTorque, againstGravity, accelFraction,
  };

  const r = useMemo(() => sizeRotaryAxis(input), [
    payloadMass, armLength, armInertia, gearRatio, efficiency, rotorInertia,
    moveAngleDeg, moveTime, dwellTime, frictionTorque, againstGravity, accelFraction,
  ]);

  function downloadCsv() {
    const rows = [
      '# Grimaldi Engineering - rotary axis sizing (rigid-body, geometry + inertia only)',
      '# NOT a drive qualification: no thermal derating, compliance, backlash or current limits.',
      `# payload_kg,${payloadMass},arm_m,${armLength},arm_inertia_kgm2,${armInertia},gravity,${againstGravity}`,
      `# gear_ratio,${gearRatio},efficiency,${efficiency},rotor_inertia_kgm2,${rotorInertia}`,
      `# move_deg,${moveAngleDeg},move_s,${moveTime},dwell_s,${dwellTime},accel_fraction,${accelFraction}`,
      'quantity,value,unit',
      `load_inertia,${r.loadInertia.toFixed(4)},kg*m2`,
      `reflected_inertia,${r.reflectedInertia.toExponential(4)},kg*m2`,
      `inertia_ratio,${r.inertiaRatio.toFixed(2)},:1`,
      `peak_motor_speed,${r.peakMotorRpm.toFixed(1)},rpm`,
      `gravity_torque_output,${r.gravityTorque.toFixed(2)},Nm`,
      `motor_torque_accel,${r.motorTorqueAccel.toFixed(3)},Nm`,
      `motor_torque_constant,${r.motorTorqueConstant.toFixed(3)},Nm`,
      `motor_torque_decel,${r.motorTorqueDecel.toFixed(3)},Nm`,
      `motor_torque_rms,${r.motorTorqueRms.toFixed(3)},Nm`,
      `peak_power,${r.peakPower.toFixed(1)},W`,
      `cycles_per_hour,${r.cyclesPerHour.toFixed(0)},1/h`,
    ].join('\n');
    const blob = new Blob([rows], { type: 'text/csv;charset=utf-8' });
    const url = globalThis.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `axis-sizing-${payloadMass}kg-${armLength}m.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    globalThis.URL.revokeObjectURL(url);
  }

  return (
    <div className="calc">
      <div className="calc-inputs calc-inputs-3">
        <fieldset>
          <legend>{labels.loadLegend}</legend>
          <Num label={labels.payloadMass} value={payloadMass} onChange={setPayloadMass} unit="kg" step={0.5} />
          <Num label={labels.armLength} value={armLength} onChange={setArmLength} unit="m" step={0.05} />
          <Num label={labels.armInertia} value={armInertia} onChange={setArmInertia} unit="kg·m²" step={0.1} />
          <Num label={labels.frictionTorque} value={frictionTorque} onChange={setFrictionTorque} unit="N·m" step={0.5} />
          <label className="calc-field calc-field-wide calc-check">
            <input type="checkbox" checked={againstGravity} onChange={(e) => setAgainstGravity(e.target.checked)} />
            <span>{labels.againstGravity}</span>
          </label>
        </fieldset>

        <fieldset>
          <legend>{labels.driveLegend}</legend>
          <Num label={labels.gearRatio} value={gearRatio} onChange={setGearRatio} unit=":1" step={1} />
          <Num label={labels.efficiency} value={efficiency} onChange={setEfficiency} unit="" step={0.01} />
          <Num label={labels.rotorInertia} value={rotorInertia} onChange={setRotorInertia} unit="kg·m²" step={0.00001} />
        </fieldset>

        <fieldset>
          <legend>{labels.moveLegend}</legend>
          <Num label={labels.moveAngle} value={moveAngleDeg} onChange={setMoveAngleDeg} unit="°" step={5} />
          <Num label={labels.moveTime} value={moveTime} onChange={setMoveTime} unit="s" step={0.1} />
          <Num label={labels.dwellTime} value={dwellTime} onChange={setDwellTime} unit="s" step={0.1} />
          <Num label={labels.accelFraction} value={accelFraction} onChange={setAccelFraction} unit="" step={0.01} />
        </fieldset>
      </div>

      <div className="calc-result-block">
        <h3>{labels.resultsLegend}</h3>
        {!r.ok ? (
          <p className="calc-error" role="alert">{labels.errInvalid}</p>
        ) : (
          <>
            <div className="calc-stat-grid">
              <Stat label={labels.torqueRms} value={`${nf.format(r.motorTorqueRms)} N·m`} strong />
              <Stat label={labels.torqueAccel} value={`${nf.format(r.motorTorqueAccel)} N·m`} strong />
              <Stat label={labels.peakMotorRpm} value={`${nf.format(r.peakMotorRpm)} rpm`} strong />
              <Stat label={labels.peakPower} value={`${nf.format(r.peakPower / 1000)} kW`} />
              <Stat label={labels.loadInertia} value={`${nf.format(r.loadInertia)} kg·m²`} />
              <Stat label={labels.reflectedInertia} value={`${r.reflectedInertia.toExponential(2)} kg·m²`} />
              <Stat label={labels.inertiaRatio} value={`${nf.format(r.inertiaRatio)} : 1`} />
              <Stat label={labels.gravityTorque} value={`${nf.format(r.gravityTorque)} N·m`} />
              <Stat label={labels.angularAcceleration} value={`${nf.format(r.angularAcceleration)} rad/s²`} />
              <Stat label={labels.torqueConstant} value={`${nf.format(r.motorTorqueConstant)} N·m`} />
              <Stat label={labels.torqueDecel} value={`${nf.format(r.motorTorqueDecel)} N·m`} />
              <Stat label={labels.cyclesPerHour} value={nf.format(r.cyclesPerHour)} />
            </div>

            <div className="calc-flags">
              {r.inertiaRatio > 10 && <p className="calc-flag calc-flag-warn">{labels.flagInertiaHigh}</p>}
              {r.motorTorqueDecel < 0 && <p className="calc-flag">{labels.flagRegen}</p>}
            </div>

            <div className="calc-selection">
              <h4>{labels.selectionH}</h4>
              <ul>
                <li>{labels.selectionRms.replace('{v}', nf.format(r.motorTorqueRms))}</li>
                <li>{labels.selectionPeak.replace('{v}', nf.format(r.motorTorqueAccel))}</li>
                <li>{labels.selectionSpeed.replace('{v}', nf.format(r.peakMotorRpm))}</li>
              </ul>
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

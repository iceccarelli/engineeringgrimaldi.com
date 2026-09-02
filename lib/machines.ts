/**
 * Electrical machines and actuators — the physics of the moving layer.
 *
 * Two things live here:
 *
 * 1. ROTARY AXIS SIZING. What a robot joint, a palletizer arm or any
 *    geared servo axis actually demands of its motor: reflected inertia,
 *    gravity torque, the trapezoidal move that dominates the duty cycle,
 *    and the RMS torque that decides whether the motor survives it. This
 *    is the calculation that decides whether a Forge cell works.
 *
 * 2. MACHINE RELATIONS. Synchronous speed, slip and rotor frequency for
 *    AC machines — the arithmetic behind every async/sync selection.
 *
 * All SI: metres, kilograms, seconds, newton-metres, radians. Conversions
 * to rpm and degrees happen at the UI edge, never in here.
 *
 * HONESTY BOUNDARY: this is rigid-body dynamics with a gearbox
 * efficiency. It does not model friction beyond a stated constant,
 * compliance, backlash, thermal derating, drive current limits or
 * field weakening. It sizes a candidate; it does not qualify a drive.
 */

export const G = 9.80665;

/* ── Rotary axis sizing ─────────────────────────────────────────────── */

export type AxisInput = {
  /** Payload mass at the end of the arm, kg. */
  payloadMass: number;
  /** Distance from the joint axis to the payload centre of mass, m. */
  armLength: number;
  /** Inertia of the arm structure itself about the joint, kg·m². */
  armInertia: number;
  /** Gear ratio i (motor revolutions per output revolution), > 1 reduces. */
  gearRatio: number;
  /** Gearbox efficiency, 0..1. */
  efficiency: number;
  /** Motor rotor inertia, kg·m². */
  rotorInertia: number;
  /** Move angle at the output, radians. */
  moveAngle: number;
  /** Move duration, s. */
  moveTime: number;
  /** Dwell between moves, s. */
  dwellTime: number;
  /** Constant friction torque at the output, N·m. */
  frictionTorque: number;
  /** True when the arm lifts against gravity (horizontal axis of rotation). */
  againstGravity: boolean;
  /** Fraction of the move spent accelerating (and again decelerating). */
  accelFraction: number;
};

export type AxisResult = {
  ok: boolean;
  reason?: 'invalid-input' | 'impossible-profile';
  /** Load inertia at the output, kg·m². */
  loadInertia: number;
  /** Load inertia reflected to the motor shaft, kg·m². */
  reflectedInertia: number;
  /** Reflected load inertia / rotor inertia. */
  inertiaRatio: number;
  /** Peak output angular velocity, rad/s. */
  peakOutputSpeed: number;
  /** Peak motor speed, rad/s. */
  peakMotorSpeed: number;
  /** Peak motor speed, rpm. */
  peakMotorRpm: number;
  /** Output angular acceleration, rad/s². */
  angularAcceleration: number;
  /** Worst-case gravity torque at the output, N·m. */
  gravityTorque: number;
  /** Motor torque during acceleration, N·m. */
  motorTorqueAccel: number;
  /** Motor torque at constant speed, N·m. */
  motorTorqueConstant: number;
  /** Motor torque during deceleration (may be negative = regenerative). */
  motorTorqueDecel: number;
  /** RMS motor torque over the whole cycle including dwell, N·m. */
  motorTorqueRms: number;
  /** Peak mechanical power at the motor, W. */
  peakPower: number;
  /** Total cycle time, s. */
  cycleTime: number;
  /** Moves per hour at this cycle. */
  cyclesPerHour: number;
};

export function sizeRotaryAxis(input: AxisInput): AxisResult {
  const empty: AxisResult = {
    ok: false,
    loadInertia: 0, reflectedInertia: 0, inertiaRatio: 0,
    peakOutputSpeed: 0, peakMotorSpeed: 0, peakMotorRpm: 0,
    angularAcceleration: 0, gravityTorque: 0,
    motorTorqueAccel: 0, motorTorqueConstant: 0, motorTorqueDecel: 0,
    motorTorqueRms: 0, peakPower: 0, cycleTime: 0, cyclesPerHour: 0,
  };

  const positive = [
    input.payloadMass, input.armLength, input.gearRatio,
    input.rotorInertia, input.moveAngle, input.moveTime,
  ].every((v) => Number.isFinite(v) && v > 0);
  const bounded =
    Number.isFinite(input.armInertia) && input.armInertia >= 0 &&
    Number.isFinite(input.dwellTime) && input.dwellTime >= 0 &&
    Number.isFinite(input.frictionTorque) && input.frictionTorque >= 0 &&
    input.efficiency > 0 && input.efficiency <= 1 &&
    input.accelFraction > 0 && input.accelFraction < 0.5;
  if (!positive || !bounded) return { ...empty, reason: 'invalid-input' };

  // Load side.
  const loadInertia = input.payloadMass * input.armLength ** 2 + input.armInertia;
  const reflectedInertia = loadInertia / input.gearRatio ** 2;
  const inertiaRatio = reflectedInertia / input.rotorInertia;

  // Trapezoidal profile: accelerate for f·T, cruise, decelerate for f·T.
  // Area under the velocity trapezoid must equal the move angle:
  //   theta = w_max * T * (1 - f)
  const f = input.accelFraction;
  const accelTime = f * input.moveTime;
  const cruiseTime = input.moveTime * (1 - 2 * f);
  const peakOutputSpeed = input.moveAngle / (input.moveTime * (1 - f));
  if (!Number.isFinite(peakOutputSpeed) || peakOutputSpeed <= 0) {
    return { ...empty, reason: 'impossible-profile' };
  }
  const angularAcceleration = peakOutputSpeed / accelTime;

  // Torques at the output.
  const gravityTorque = input.againstGravity
    ? input.payloadMass * G * input.armLength
    : 0;
  const inertialTorque = loadInertia * angularAcceleration;
  const staticTorque = gravityTorque + input.frictionTorque;

  // Reflect to the motor. Motor also accelerates its own rotor at i·alpha.
  const motorAccelRate = angularAcceleration * input.gearRatio;
  const rotorTorque = input.rotorInertia * motorAccelRate;
  const reflect = (outputTorque: number) =>
    outputTorque / (input.gearRatio * input.efficiency);

  const motorTorqueAccel = rotorTorque + reflect(inertialTorque + staticTorque);
  const motorTorqueConstant = reflect(staticTorque);
  // Deceleration: inertia now helps, so the term is negative. Gravity and
  // friction still act. A negative result means the drive must absorb energy.
  const motorTorqueDecel = -rotorTorque + reflect(staticTorque - inertialTorque);

  // RMS over accel + cruise + decel + dwell.
  const cycleTime = input.moveTime + input.dwellTime;
  const sumSquares =
    motorTorqueAccel ** 2 * accelTime +
    motorTorqueConstant ** 2 * Math.max(0, cruiseTime) +
    motorTorqueDecel ** 2 * accelTime +
    // During dwell a gravity-loaded axis still holds its load.
    reflect(staticTorque) ** 2 * input.dwellTime;
  const motorTorqueRms = Math.sqrt(sumSquares / cycleTime);

  const peakMotorSpeed = peakOutputSpeed * input.gearRatio;

  return {
    ok: true,
    loadInertia,
    reflectedInertia,
    inertiaRatio,
    peakOutputSpeed,
    peakMotorSpeed,
    peakMotorRpm: (peakMotorSpeed * 60) / (2 * Math.PI),
    angularAcceleration,
    gravityTorque,
    motorTorqueAccel,
    motorTorqueConstant,
    motorTorqueDecel,
    motorTorqueRms,
    peakPower: Math.abs(motorTorqueAccel) * peakMotorSpeed,
    cycleTime,
    cyclesPerHour: cycleTime > 0 ? 3600 / cycleTime : 0,
  };
}

/* ── AC machine relations ───────────────────────────────────────────── */

/** Synchronous speed in rpm: n_s = 120 f / p, with p the POLE count. */
export function synchronousSpeedRpm(frequencyHz: number, poles: number): number {
  if (poles <= 0) return 0;
  return (120 * frequencyHz) / poles;
}

/** Slip s = (n_s − n) / n_s, dimensionless. */
export function slip(synchronousRpm: number, rotorRpm: number): number {
  if (synchronousRpm === 0) return 0;
  return (synchronousRpm - rotorRpm) / synchronousRpm;
}

/** Rotor (slip) frequency f_r = s · f. */
export function rotorFrequency(slipValue: number, frequencyHz: number): number {
  return slipValue * frequencyHz;
}

/** Shaft torque from mechanical power and speed: T = P / ω. */
export function torqueFromPower(powerW: number, rpm: number): number {
  const omega = (rpm * 2 * Math.PI) / 60;
  return omega === 0 ? 0 : powerW / omega;
}

/** Synchronous speed table for the common pole counts, at one frequency. */
export function synchronousSpeedTable(frequencyHz: number): { poles: number; rpm: number }[] {
  return [2, 4, 6, 8, 10, 12].map((poles) => ({
    poles,
    rpm: synchronousSpeedRpm(frequencyHz, poles),
  }));
}

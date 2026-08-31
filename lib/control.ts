/**
 * The software-to-hardware boundary, quantified.
 *
 * Two budgets decide whether a control system built in software actually
 * works on a machine, and both are usually discovered late:
 *
 * 1. THE LOOP BUDGET. Every element between measuring and acting adds
 *    dead time — sensor acquisition, the bus in, computation, the bus
 *    out, actuator response — and the sample-and-hold adds half a sample
 *    period on top. Dead time cannot be tuned away. It spends phase
 *    margin at a rate proportional to frequency, and that is what caps
 *    achievable closed-loop bandwidth.
 *
 * 2. THE BUS BUDGET. A fieldbus cycle must carry every axis's process
 *    data and still finish inside the cycle time. Axis count, bytes per
 *    axis and bitrate decide how many joints a controller can actually
 *    coordinate — the number that quietly limits cell architecture.
 *
 * HONESTY BOUNDARY: these are first-order budgets. Real loops have plant
 * dynamics, resonances, quantisation, jitter distributions and non-linear
 * friction that decide stability alongside dead time. A bandwidth figure
 * here is an upper bound set by delay, not a promise about your plant,
 * and nothing here is a safety-function analysis.
 */

/* ── Loop timing budget ─────────────────────────────────────────────── */

export type LoopInput = {
  /** Control loop sample rate, Hz. */
  sampleRateHz: number;
  /** Sensor acquisition and conversion, microseconds. */
  sensorLatencyUs: number;
  /** Transport from sensor to controller, microseconds. */
  commsInUs: number;
  /** Controller computation, microseconds. */
  computeUs: number;
  /** Transport from controller to drive, microseconds. */
  commsOutUs: number;
  /** Drive and actuator response, microseconds. */
  actuatorLatencyUs: number;
  /** Degrees of phase margin you are willing to spend on dead time. */
  phaseBudgetDeg: number;
};

export type LoopResult = {
  ok: boolean;
  reason?: 'invalid-input';
  /** Sample period, seconds. */
  samplePeriodS: number;
  /** Nyquist frequency, Hz. */
  nyquistHz: number;
  /** Average zero-order-hold delay, seconds (Ts/2). */
  zohDelayS: number;
  /** Sum of the transport and processing latencies, seconds. */
  transportDelayS: number;
  /** Total loop dead time, seconds. */
  deadTimeS: number;
  /** Dead time as a multiple of the sample period. */
  deadTimeInSamples: number;
  /** Bandwidth at which dead time alone consumes the phase budget, Hz. */
  maxBandwidthHz: number;
  /** Sample rate divided by that bandwidth. */
  samplesPerBandwidth: number;
  /** Phase lag from dead time at the achievable bandwidth, degrees. */
  phaseLagAtBandwidthDeg: number;
  /** True when the loop is delay-limited rather than sample-rate-limited. */
  delayDominated: boolean;
  /** Verdict codes for the UI to translate. */
  flags: LoopFlag[];
};

export type LoopFlag =
  | 'sample-rate-marginal'
  | 'delay-dominates'
  | 'compute-over-budget'
  | 'deadtime-exceeds-period';

/** Phase lag in degrees contributed by a pure delay at a frequency. */
export function delayPhaseLagDeg(frequencyHz: number, deadTimeS: number): number {
  return 360 * frequencyHz * deadTimeS;
}

export function analyseLoop(input: LoopInput): LoopResult {
  const empty: LoopResult = {
    ok: false,
    samplePeriodS: 0, nyquistHz: 0, zohDelayS: 0, transportDelayS: 0,
    deadTimeS: 0, deadTimeInSamples: 0, maxBandwidthHz: 0,
    samplesPerBandwidth: 0, phaseLagAtBandwidthDeg: 0,
    delayDominated: false, flags: [],
  };

  const latencies = [
    input.sensorLatencyUs, input.commsInUs, input.computeUs,
    input.commsOutUs, input.actuatorLatencyUs,
  ];
  if (
    !Number.isFinite(input.sampleRateHz) || input.sampleRateHz <= 0 ||
    !latencies.every((v) => Number.isFinite(v) && v >= 0) ||
    !Number.isFinite(input.phaseBudgetDeg) || input.phaseBudgetDeg <= 0 || input.phaseBudgetDeg >= 180
  ) {
    return { ...empty, reason: 'invalid-input' };
  }

  const samplePeriodS = 1 / input.sampleRateHz;
  const zohDelayS = samplePeriodS / 2;
  const transportDelayS = latencies.reduce((a, b) => a + b, 0) * 1e-6;
  const deadTimeS = zohDelayS + transportDelayS;

  // Dead time spends phase linearly with frequency: phi = 360 * f * Td.
  // Solving for the frequency at which it consumes the whole budget.
  const maxBandwidthHz = deadTimeS > 0 ? input.phaseBudgetDeg / (360 * deadTimeS) : Infinity;
  const samplesPerBandwidth = maxBandwidthHz > 0 ? input.sampleRateHz / maxBandwidthHz : Infinity;

  const flags: LoopFlag[] = [];
  // The classic rule of thumb: sample at 10-20x the closed-loop bandwidth.
  if (samplesPerBandwidth < 10) flags.push('sample-rate-marginal');
  // Transport delay larger than the ZOH term means the architecture, not
  // the sample rate, is the limiting factor.
  if (transportDelayS > zohDelayS) flags.push('delay-dominates');
  if (input.computeUs * 1e-6 > samplePeriodS * 0.5) flags.push('compute-over-budget');
  if (deadTimeS > samplePeriodS) flags.push('deadtime-exceeds-period');

  return {
    ok: true,
    samplePeriodS,
    nyquistHz: input.sampleRateHz / 2,
    zohDelayS,
    transportDelayS,
    deadTimeS,
    deadTimeInSamples: deadTimeS / samplePeriodS,
    maxBandwidthHz,
    samplesPerBandwidth,
    phaseLagAtBandwidthDeg: delayPhaseLagDeg(maxBandwidthHz, deadTimeS),
    delayDominated: transportDelayS > zohDelayS,
    flags,
  };
}

/* ── Fieldbus budget ────────────────────────────────────────────────── */

export type BusInput = {
  /** Number of coordinated axes or nodes. */
  axes: number;
  /** Process data per axis per cycle, bytes (both directions). */
  bytesPerAxis: number;
  /** Protocol and frame overhead per cycle, bytes. */
  overheadBytes: number;
  /** Line rate, bits per second. */
  bitrateBps: number;
  /** Target cycle time, microseconds. */
  cycleTimeUs: number;
};

export type BusResult = {
  ok: boolean;
  reason?: 'invalid-input';
  frameBytes: number;
  /** Wire time for one cycle's data, seconds. */
  frameTimeS: number;
  /** frameTime / cycleTime. */
  utilisation: number;
  /** Cycle time headroom, seconds. */
  headroomS: number;
  /** Axes that still fit at this cycle time. */
  maxAxesAtCycle: number;
  /** Fastest cycle this axis count supports at 100 % utilisation, seconds. */
  minCycleTimeS: number;
  flags: BusFlag[];
};

export type BusFlag = 'over-capacity' | 'tight-utilisation' | 'headroom-ok';

export function analyseBus(input: BusInput): BusResult {
  const empty: BusResult = {
    ok: false, frameBytes: 0, frameTimeS: 0, utilisation: 0,
    headroomS: 0, maxAxesAtCycle: 0, minCycleTimeS: 0, flags: [],
  };

  const valid =
    Number.isFinite(input.axes) && input.axes > 0 &&
    Number.isFinite(input.bytesPerAxis) && input.bytesPerAxis > 0 &&
    Number.isFinite(input.overheadBytes) && input.overheadBytes >= 0 &&
    Number.isFinite(input.bitrateBps) && input.bitrateBps > 0 &&
    Number.isFinite(input.cycleTimeUs) && input.cycleTimeUs > 0;
  if (!valid) return { ...empty, reason: 'invalid-input' };

  const frameBytes = input.axes * input.bytesPerAxis + input.overheadBytes;
  const frameTimeS = (frameBytes * 8) / input.bitrateBps;
  const cycleTimeS = input.cycleTimeUs * 1e-6;
  const utilisation = frameTimeS / cycleTimeS;

  // How many axes still fit inside the cycle, overhead accounted for.
  const budgetBytes = (cycleTimeS * input.bitrateBps) / 8;
  const maxAxesAtCycle = Math.max(
    0,
    Math.floor((budgetBytes - input.overheadBytes) / input.bytesPerAxis),
  );

  const flags: BusFlag[] = [];
  if (utilisation > 1) flags.push('over-capacity');
  else if (utilisation > 0.7) flags.push('tight-utilisation');
  else flags.push('headroom-ok');

  return {
    ok: true,
    frameBytes,
    frameTimeS,
    utilisation,
    headroomS: cycleTimeS - frameTimeS,
    maxAxesAtCycle,
    minCycleTimeS: frameTimeS,
    flags,
  };
}

/** Common industrial line rates, as starting points. */
export const BUS_PRESETS: { id: string; label: string; bitrateBps: number; overheadBytes: number; cycleTimeUs: number }[] = [
  { id: 'fast-ethernet', label: '100 Mbit/s industrial Ethernet — 1 ms cycle', bitrateBps: 100e6, overheadBytes: 60, cycleTimeUs: 1000 },
  { id: 'fast-ethernet-250', label: '100 Mbit/s industrial Ethernet — 250 µs cycle', bitrateBps: 100e6, overheadBytes: 60, cycleTimeUs: 250 },
  { id: 'gig-ethernet', label: '1 Gbit/s industrial Ethernet — 250 µs cycle', bitrateBps: 1e9, overheadBytes: 60, cycleTimeUs: 250 },
  { id: 'canopen', label: 'CAN 1 Mbit/s — 10 ms cycle', bitrateBps: 1e6, overheadBytes: 8, cycleTimeUs: 10000 },
];

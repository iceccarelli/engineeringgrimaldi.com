/**
 * Battery pack topology and duty — the arithmetic behind a BMS spec.
 *
 * Given a cell and an S/P arrangement, this returns the pack's voltage
 * window, energy, current and power ceilings, the C-rate the load
 * actually demands, runtime at that load, and the flags an engineer
 * needs before anyone builds it.
 *
 * The flags matter more than the numbers. A pack that "works" on paper
 * at 4C on a 2C cell, or that quietly crosses the 60 V DC touch-safety
 * boundary, is the kind of design that reaches a prototype before anyone
 * notices. They are surfaced as codes, translated at the UI edge.
 *
 * HONESTY BOUNDARY: topology and steady-state duty only. This is NOT a
 * thermal model, not a cell-ageing model, not a fault-propagation or
 * thermal-runaway analysis, and not a substitute for the cell
 * datasheet or for IEC 62133 / UN 38.3 qualification. Cell limits vary
 * with temperature and state of charge; this assumes the ratings you
 * enter hold across the whole operating envelope, which they do not.
 */

export type Cell = {
  /** Nominal terminal voltage, V. */
  nominalVoltage: number;
  /** Maximum charge voltage, V. */
  maxVoltage: number;
  /** Discharge cut-off voltage, V. */
  minVoltage: number;
  /** Rated capacity, Ah. */
  capacityAh: number;
  /** Maximum continuous discharge rate, in multiples of capacity (C). */
  maxDischargeC: number;
  /** Internal resistance, ohms. */
  internalResistance: number;
  /** Mass, kg. */
  mass: number;
};

export type PackInput = {
  cell: Cell;
  /** Cells in series. */
  series: number;
  /** Strings in parallel. */
  parallel: number;
  /** Continuous load power, W. */
  loadPower: number;
  /** Usable fraction of nominal capacity, 0..1. */
  depthOfDischarge: number;
};

export type PackWarning =
  | 'c-rate-exceeded'
  | 'above-60v-dc'
  | 'above-120v-dc'
  | 'high-string-count'
  | 'low-headroom'
  | 'high-ir-loss';

export type PackResult = {
  ok: boolean;
  reason?: 'invalid-input';
  cellCount: number;
  nominalVoltage: number;
  maxVoltage: number;
  minVoltage: number;
  capacityAh: number;
  energyWh: number;
  usableEnergyWh: number;
  /** Ceiling from the cell's own continuous rating, A. */
  maxContinuousCurrent: number;
  maxContinuousPower: number;
  /** What the load actually pulls at nominal voltage, A. */
  loadCurrent: number;
  /** Load current expressed as a C-rate on this pack. */
  demandedC: number;
  /** maxContinuousPower / loadPower. */
  powerHeadroom: number;
  /** Runtime on usable energy at the stated load, hours. */
  runtimeHours: number;
  /** Pack internal resistance from the S/P arrangement, ohms. */
  packResistance: number;
  /** I²R loss at the load current, W. */
  resistiveLossW: number;
  /** Sag at the load current, V. */
  voltageSag: number;
  mass: number;
  /** Wh per kg of cells only — no housing, BMS or busbars. */
  specificEnergy: number;
  warnings: PackWarning[];
};

export function designPack(input: PackInput): PackResult {
  const { cell, series, parallel, loadPower, depthOfDischarge } = input;

  const empty: PackResult = {
    ok: false,
    cellCount: 0, nominalVoltage: 0, maxVoltage: 0, minVoltage: 0,
    capacityAh: 0, energyWh: 0, usableEnergyWh: 0,
    maxContinuousCurrent: 0, maxContinuousPower: 0,
    loadCurrent: 0, demandedC: 0, powerHeadroom: 0, runtimeHours: 0,
    packResistance: 0, resistiveLossW: 0, voltageSag: 0,
    mass: 0, specificEnergy: 0, warnings: [],
  };

  const positive = [
    cell.nominalVoltage, cell.maxVoltage, cell.minVoltage,
    cell.capacityAh, cell.maxDischargeC, cell.mass,
    series, parallel, loadPower,
  ].every((v) => Number.isFinite(v) && v > 0);
  const sane =
    Number.isFinite(cell.internalResistance) && cell.internalResistance >= 0 &&
    depthOfDischarge > 0 && depthOfDischarge <= 1 &&
    Number.isInteger(series) && Number.isInteger(parallel) &&
    cell.maxVoltage >= cell.nominalVoltage && cell.nominalVoltage >= cell.minVoltage;
  if (!positive || !sane) return { ...empty, reason: 'invalid-input' };

  const cellCount = series * parallel;
  const nominalVoltage = series * cell.nominalVoltage;
  const maxVoltage = series * cell.maxVoltage;
  const minVoltage = series * cell.minVoltage;
  const capacityAh = parallel * cell.capacityAh;
  const energyWh = nominalVoltage * capacityAh;
  const usableEnergyWh = energyWh * depthOfDischarge;

  const maxContinuousCurrent = parallel * cell.maxDischargeC * cell.capacityAh;
  const maxContinuousPower = nominalVoltage * maxContinuousCurrent;

  const loadCurrent = loadPower / nominalVoltage;
  const demandedC = capacityAh > 0 ? loadCurrent / capacityAh : 0;
  const powerHeadroom = loadPower > 0 ? maxContinuousPower / loadPower : 0;
  const runtimeHours = loadPower > 0 ? usableEnergyWh / loadPower : 0;

  // Series adds resistance, parallel divides it.
  const packResistance = (cell.internalResistance * series) / parallel;
  const resistiveLossW = loadCurrent ** 2 * packResistance;
  const voltageSag = loadCurrent * packResistance;

  const mass = cellCount * cell.mass;
  const specificEnergy = mass > 0 ? energyWh / mass : 0;

  const warnings: PackWarning[] = [];
  if (demandedC > cell.maxDischargeC) warnings.push('c-rate-exceeded');
  if (maxVoltage > 120) warnings.push('above-120v-dc');
  else if (maxVoltage > 60) warnings.push('above-60v-dc');
  if (parallel > 4) warnings.push('high-string-count');
  if (powerHeadroom < 1.25 && powerHeadroom >= 1) warnings.push('low-headroom');
  if (loadPower > 0 && resistiveLossW / loadPower > 0.05) warnings.push('high-ir-loss');

  return {
    ok: true,
    cellCount, nominalVoltage, maxVoltage, minVoltage,
    capacityAh, energyWh, usableEnergyWh,
    maxContinuousCurrent, maxContinuousPower,
    loadCurrent, demandedC, powerHeadroom, runtimeHours,
    packResistance, resistiveLossW, voltageSag,
    mass, specificEnergy, warnings,
  };
}

/** Common cell chemistries as starting points, not recommendations. */
export const CELL_PRESETS: { id: string; label: string; cell: Cell }[] = [
  {
    id: 'nmc-21700',
    label: 'Li-ion NMC 21700 — 3.6 V, 5.0 Ah',
    cell: { nominalVoltage: 3.6, maxVoltage: 4.2, minVoltage: 2.5, capacityAh: 5.0, maxDischargeC: 2, internalResistance: 0.016, mass: 0.070 },
  },
  {
    id: 'nmc-18650',
    label: 'Li-ion NMC 18650 — 3.6 V, 3.0 Ah',
    cell: { nominalVoltage: 3.6, maxVoltage: 4.2, minVoltage: 2.5, capacityAh: 3.0, maxDischargeC: 2, internalResistance: 0.030, mass: 0.048 },
  },
  {
    id: 'lfp-32700',
    label: 'LiFePO₄ 32700 — 3.2 V, 6.0 Ah',
    cell: { nominalVoltage: 3.2, maxVoltage: 3.65, minVoltage: 2.5, capacityAh: 6.0, maxDischargeC: 3, internalResistance: 0.014, mass: 0.145 },
  },
  {
    id: 'lfp-prismatic',
    label: 'LiFePO₄ prismatic — 3.2 V, 100 Ah',
    cell: { nominalVoltage: 3.2, maxVoltage: 3.65, minVoltage: 2.5, capacityAh: 100, maxDischargeC: 1, internalResistance: 0.0006, mass: 1.95 },
  },
  {
    id: 'lto',
    label: 'LTO — 2.3 V, 30 Ah',
    cell: { nominalVoltage: 2.3, maxVoltage: 2.8, minVoltage: 1.5, capacityAh: 30, maxDischargeC: 6, internalResistance: 0.0011, mass: 0.72 },
  },
];

/**
 * Vehicle load solver — how many pallets fit a trailer or container.
 *
 * Same geometry engine as the pallet layer solver (lib/rectpack.ts):
 * the loading floor is a region, the pallet footprint is the item. On
 * top of that this module adds the two constraints that actually decide
 * a shipment: interior height (can the load be double-stacked?) and
 * payload mass.
 *
 * HONESTY BOUNDARY: geometry and mass arithmetic only. Axle-load
 * distribution, load securing (EN 12195), dangerous goods and
 * door/tolerance allowances are separate engineering problems and are
 * NOT modelled here. Real-world loading also leaves working clearance,
 * which is why the classic 13.6 m trailer is quoted as 33 pallets in
 * practice even when the raw geometry allows 34.
 *
 * Lengths in millimetres, masses in kilograms.
 */

import {
  enumeratePatterns,
  shortlistPatterns,
  type Pattern,
  type Placement,
} from './rectpack';

export type { Placement, Pattern };

export type Vehicle = {
  id: string;
  label: string;
  /** Usable floor length. */
  length: number;
  /** Usable floor width. */
  width: number;
  /** Usable interior height. */
  height: number;
  /** Maximum payload mass. */
  payload: number;
};

export type LoadUnit = {
  /** Pallet footprint length. */
  length: number;
  /** Pallet footprint width. */
  width: number;
  /** Loaded height including the pallet itself. */
  height: number;
  /** Gross mass including pallet and goods. */
  weight: number;
  /** Whether a second unit may be placed on top. */
  stackable: boolean;
};

export type LoadResult = {
  ok: boolean;
  reason?: 'unit-too-large' | 'too-tall' | 'invalid-input';
  best: Pattern | null;
  alternatives: Pattern[];
  /** Units in a single floor course. */
  floorSpots: number;
  /** 1, or 2 when stacking is allowed and fits. */
  tiers: number;
  /** Units the geometry allows before the mass limit is applied. */
  unitsByGeometry: number;
  /** Units the payload limit allows. */
  unitsByPayload: number;
  totalUnits: number;
  limitedBy: 'space' | 'payload' | 'both' | 'none';
  floorUtilisation: number;
  payloadUsed: number;
  payloadUtilisation: number;
  /** Loaded height of the stack actually used. */
  stackHeight: number;
};

export const VEHICLE_PRESETS: Vehicle[] = [
  { id: 'tautliner', label: 'Curtainsider / tautliner — 13.6 m', length: 13600, width: 2480, height: 2700, payload: 24000 },
  { id: 'rigid', label: 'Rigid truck — 7.2 m', length: 7200, width: 2450, height: 2500, payload: 10000 },
  { id: 'cont20', label: "20 ft container", length: 5898, width: 2352, height: 2393, payload: 28200 },
  { id: 'cont40', label: '40 ft container', length: 12032, width: 2352, height: 2393, payload: 26600 },
  { id: 'cont40hc', label: '40 ft high cube', length: 12032, width: 2352, height: 2698, payload: 26460 },
  { id: 'van', label: 'Box van — 4.3 m', length: 4300, width: 1800, height: 1900, payload: 1200 },
];

export function solveLoad(vehicle: Vehicle, unit: LoadUnit): LoadResult {
  const empty: LoadResult = {
    ok: false,
    best: null,
    alternatives: [],
    floorSpots: 0,
    tiers: 0,
    unitsByGeometry: 0,
    unitsByPayload: 0,
    totalUnits: 0,
    limitedBy: 'none',
    floorUtilisation: 0,
    payloadUsed: 0,
    payloadUtilisation: 0,
    stackHeight: 0,
  };

  const positive = [
    vehicle.length, vehicle.width, vehicle.height, vehicle.payload,
    unit.length, unit.width, unit.height, unit.weight,
  ].every((v) => Number.isFinite(v) && v > 0);
  if (!positive) return { ...empty, reason: 'invalid-input' };

  if (unit.height > vehicle.height) return { ...empty, reason: 'too-tall' };

  const ranked = enumeratePatterns(vehicle.length, vehicle.width, {
    length: unit.length,
    width: unit.width,
  });
  const best = ranked[0];
  if (!best || best.count === 0) return { ...empty, reason: 'unit-too-large' };

  const tiers = unit.stackable && unit.height * 2 <= vehicle.height ? 2 : 1;
  const floorSpots = best.count;
  const unitsByGeometry = floorSpots * tiers;
  const unitsByPayload = Math.floor(vehicle.payload / unit.weight);
  const totalUnits = Math.max(0, Math.min(unitsByGeometry, unitsByPayload));

  let limitedBy: LoadResult['limitedBy'] = 'none';
  if (unitsByGeometry === unitsByPayload) limitedBy = 'both';
  else if (totalUnits === unitsByGeometry) limitedBy = 'space';
  else limitedBy = 'payload';

  const floorArea = vehicle.length * vehicle.width;
  const usedArea = floorSpots * unit.length * unit.width;
  const payloadUsed = totalUnits * unit.weight;

  return {
    ok: totalUnits > 0,
    best,
    alternatives: shortlistPatterns(ranked.slice(1), 3),
    floorSpots,
    tiers,
    unitsByGeometry,
    unitsByPayload,
    totalUnits,
    limitedBy,
    floorUtilisation: floorArea > 0 ? usedArea / floorArea : 0,
    payloadUsed,
    payloadUtilisation: vehicle.payload > 0 ? payloadUsed / vehicle.payload : 0,
    stackHeight: unit.height * tiers,
  };
}

export function loadToCsv(result: LoadResult, vehicle: Vehicle, unit: LoadUnit): string {
  const rows: string[] = [];
  rows.push('# Grimaldi Engineering - vehicle load plan (geometry and mass only)');
  rows.push('# NOT a load-securing, axle-load or dangerous-goods calculation.');
  rows.push(`# vehicle,${vehicle.label},floor_mm,${vehicle.length},${vehicle.width},height_mm,${vehicle.height},payload_kg,${vehicle.payload}`);
  rows.push(`# unit_mm,${unit.length},${unit.width},${unit.height},unit_kg,${unit.weight},stackable,${unit.stackable}`);
  rows.push(`# floor_spots,${result.floorSpots},tiers,${result.tiers},total_units,${result.totalUnits},payload_used_kg,${result.payloadUsed}`);
  rows.push('index,x_mm,y_mm,footprint_x_mm,footprint_y_mm,rotated_deg,tier');
  const spots = result.best?.placements ?? [];
  let index = 0;
  for (let tier = 1; tier <= result.tiers; tier++) {
    for (const p of spots) {
      index += 1;
      if (index > result.totalUnits) break;
      rows.push(`${index},${p.x},${p.y},${p.w},${p.d},${p.rotated ? 90 : 0},${tier}`);
    }
  }
  return rows.join('\n');
}

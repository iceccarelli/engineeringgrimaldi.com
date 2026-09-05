/**
 * CUSTOMER EVIDENCE — the only file that can move the money KPIs.
 *
 * Every conversation is one record. The public control engine renders the
 * evidence ANONYMISED: segment, region, size band, cost band, budget-owner
 * role, stage. Never an organisation name, never a person, never an email
 * — those live in the private CRM sheet referenced by `ref`. A record here
 * without a `ref` did not happen.
 *
 * The funnel on /energy and /energy/wedge is DERIVED from these records.
 * There is no hand-typed "actual" anywhere; if the list is empty the funnel
 * is zero, and that is the truth.
 *
 * Validation, in the mandate's words: compliments are not validation.
 *   contacted   → we asked; no answer yet
 *   conversation → the five questions were asked and answered
 *   cost-named  → a budget owner put a number on today's cost
 *   data-shared → they sent real schedule / price / asset data
 *   paid-trial  → money changed hands
 *   declined    → a no, with the reason recorded
 */

export type Segment = 'stadtwerke' | 'mieterstrom-operator' | 'bess-operator' | 'c-and-i' | 'aggregator' | 'energy-community' | 'renewable-developer' | 'dso' | 'other';
export type Stage = 'contacted' | 'conversation' | 'cost-named' | 'data-shared' | 'paid-trial' | 'declined';
export type CostBand = 'unknown' | '<10k' | '10k-50k' | '50k-250k' | '>250k';
export type SizeBand = 'micro' | 'small' | 'mid' | 'large';

export type Conversation = {
  /** Private CRM reference (row id). Never a name. */
  ref: string;
  date: string;
  segment: Segment;
  region: string;          // Bundesland or country, nothing finer
  size: SizeBand;
  stage: Stage;
  wedge: 'A' | 'B' | 'C';
  /** Answers to the five questions, anonymised. */
  costsToday: string;      // what costs them money today
  costBand: CostBand;      // how much, per year
  budgetOwner: string;     // role, e.g. "Leiter Energiewirtschaft"
  currentSolution: string; // how they solve it now
  successWorth: string;    // what success would be worth to them
  nextStep: string;
  declinedBecause?: string;
};

export const CUSTOMERS_UPDATED = '2026-09-05';

/** Empty on purpose. The first record is the first real conversation. */
export const CONVERSATIONS: readonly Conversation[] = [] as const;

export const STAGES: readonly { stage: Stage; label: string; counts: boolean }[] = [
  { stage: 'contacted', label: 'Contacted', counts: false },
  { stage: 'conversation', label: 'Conversation (five questions answered)', counts: true },
  { stage: 'cost-named', label: 'Cost named by budget owner', counts: true },
  { stage: 'data-shared', label: 'Data-sharing agreed', counts: true },
  { stage: 'paid-trial', label: 'Paid trial', counts: true },
  { stage: 'declined', label: 'Declined (reason recorded)', counts: false },
] as const;

/** A record at a later stage also satisfies every earlier counting stage. */
const ORDER: Stage[] = ['contacted', 'conversation', 'cost-named', 'data-shared', 'paid-trial'];

export function reached(c: Conversation, stage: Stage): boolean {
  if (c.stage === 'declined') return false;
  return ORDER.indexOf(c.stage) >= ORDER.indexOf(stage);
}

export function countAtLeast(stage: Stage, wedge?: 'A' | 'B' | 'C'): number {
  return CONVERSATIONS.filter((c) => (!wedge || c.wedge === wedge) && reached(c, stage)).length;
}

/** The wedge-A funnel, derived. Targets are the 90-day objective (D-009). */
export const FUNNEL_TARGETS: readonly { stage: Stage; step: string; target: number }[] = [
  { stage: 'conversation', step: 'Conversations', target: 10 },
  { stage: 'cost-named', step: 'Cost named by budget owner', target: 5 },
  { stage: 'data-shared', step: 'Data-sharing agreed', target: 2 },
  { stage: 'paid-trial', step: 'Paid trial', target: 1 },
] as const;

export function funnel(wedge: 'A' | 'B' | 'C' = 'A'): { step: string; actual: number; target: number }[] {
  return FUNNEL_TARGETS.map((f) => ({ step: f.step, actual: countAtLeast(f.stage, wedge), target: f.target }));
}

export function bySegment(): Record<Segment, number> {
  const out: Record<Segment, number> = { stadtwerke: 0, 'mieterstrom-operator': 0, 'bess-operator': 0, 'c-and-i': 0, aggregator: 0, 'energy-community': 0, 'renewable-developer': 0, dso: 0, other: 0 };
  for (const c of CONVERSATIONS) out[c.segment] += 1;
  return out;
}

export const SEGMENT_LABEL: Record<Segment, string> = {
  stadtwerke: 'Stadtwerke', 'mieterstrom-operator': 'Mieterstrom / GGV operator', 'bess-operator': 'BESS operator', 'c-and-i': 'C&I energy operator',
  aggregator: 'Aggregator', 'energy-community': 'Energy community', 'renewable-developer': 'Renewable developer', dso: 'DSO / network operator', other: 'Other',
};

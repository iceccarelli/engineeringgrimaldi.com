/**
 * COMMERCIAL EXECUTION. One paid customer is the objective. The wedge is a
 * proposal until a customer pays; the questions are the ones asked in
 * every conversation — never "would you use this?".
 */

export type Wedge = {
  id: 'A' | 'B' | 'C';
  name: string;
  customer: string;
  problem: string;
  costsThemToday: string;
  build: string[];
  doNotBuild: string[];
  roiMetric: string;
  entry: string;
  status: 'proposed' | 'validating' | 'sold' | 'killed';
  decision: string;
};

export const WEDGES: readonly Wedge[] = [
  { id: 'A', name: 'Dispatch decision support for BESS / energy communities', status: 'proposed', decision: 'D-009',
    customer: 'Stadtwerke, Mieterstrom / gemeinschaftliche Gebäudeversorgung operators, small BESS operators',
    problem: 'Batteries and community assets run on rule-based schedules that leave money on the table against day-ahead / intraday prices and §42b allocation rules.',
    costsThemToday: 'Unknown until asked — the first ten conversations quantify it. Hypothesis: 5–15 % of achievable storage revenue.',
    build: ['optimize_dispatch on the existing MILP', 'validate_constraints (SoC, power, grid connection)', 'generate_explanation in German', 'weekly PDF/CSV recommendation, € gap vs their schedule'],
    doNotBuild: ['any write path to inverters or BMS', 'a portal', 'multi-tenant UI', 'new forecasting models before a baseline'],
    roiMetric: '€ per month vs the customer\'s own schedule, measured on their data, reported with the assumptions listed.',
    entry: 'Energie Teilen paid intake (Stripe) → data-sharing agreement → four-week recommendation trial.' },
  { id: 'B', name: 'Time-to-power / behind-the-meter siting analysis', status: 'proposed', decision: '—',
    customer: 'Data-centre and industrial developers (US first via EIA data)',
    problem: 'Grid connection lead times decide project viability; developers pay for defensible BTM scenarios.',
    costsThemToday: 'Cost of delay per MW-month — the calculator exists; the price the buyer pays for the answer does not yet.',
    build: ['nothing new until wedge A has a customer or B has an inbound paying user'],
    doNotBuild: ['EU data integration before a paying US user'],
    roiMetric: 'Subscription revenue; months of delay avoided as reported by the buyer.',
    entry: 'timetopower.ai subscription (exists).' },
  { id: 'C', name: 'Constraint prediction / hosting capacity for DSOs', status: 'proposed', decision: '—',
    customer: 'DSOs, Stadtwerke network arms',
    problem: 'Connection requests are refused or delayed for lack of feeder-level constraint forecasts.',
    costsThemToday: 'Long sales cycle, procurement, NIS2 scope. Not the first wedge.',
    build: ['nothing before A is sold'],
    doNotBuild: ['DSO integrations on speculation'],
    roiMetric: 'Connections approved per feeder per year; engineering hours per request.',
    entry: 'Warm DSO contact only after A produces a reference.' },
] as const;

export const DISCOVERY_QUESTIONS = [
  'What costs you money today?',
  'How much?',
  'Who owns the budget?',
  'How do you solve it now?',
  'What would success be worth?',
] as const;

export const NEVER_ASK = 'Would you use this?';

export const PRIORITY_CUSTOMERS = [
  'C&I energy operators', 'BESS operators', 'renewable developers', 'microgrid operators',
  'aggregators', 'energy communities', 'Stadtwerke', 'selected DSO / utility partners',
] as const;

/** The commercial funnel for wedge A is DERIVED from customer records —
 *  see lib/energy/customers.ts. Nothing here is typed by hand. */
export { funnel as wedgeFunnel } from './customers';

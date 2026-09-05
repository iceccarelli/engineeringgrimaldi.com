/**
 * KPI SYSTEM. Reported weekly. `value: null` means "not measured yet" and is
 * rendered as exactly that — never as 0, never as a dash that hides it.
 * `source` names where the number comes from; a KPI without a source is
 * not a KPI. Update `asOf` with every weekly report.
 */

export type Kpi = {
  id: string;
  label: string;
  unit: string;
  value: number | null;
  target: string;
  source: string;
  /** Which part of the CEO report it feeds. */
  reportSection: 'MONEY' | 'CUSTOMERS' | 'PRODUCT' | 'TECHNOLOGY' | 'RESEARCH' | 'RISKS';
};

export const KPI_AS_OF = '2026-09-05';

export const KPIS: readonly Kpi[] = [
  { id: 'revenue', label: 'Revenue', unit: '€ / month', value: 0, target: 'First paid customer', source: 'Stripe (energie-teilen) + invoices', reportSection: 'MONEY' },
  { id: 'pipeline', label: 'Pipeline', unit: '€ weighted', value: 0, target: '≥ 3 qualified opportunities', source: 'Decision log, customer evidence file', reportSection: 'MONEY' },
  { id: 'qualified', label: 'Qualified customers', unit: 'count', value: 0, target: '≥ 3 (budget owner named, cost quantified)', source: 'Customer evidence file', reportSection: 'CUSTOMERS' },
  { id: 'pilots', label: 'Pilots', unit: 'count', value: 0, target: '1 signed', source: 'Signed pilot agreement', reportSection: 'CUSTOMERS' },
  { id: 'deployments', label: 'Deployments', unit: 'count', value: 0, target: '1', source: 'Kernel deployment registry', reportSection: 'PRODUCT' },
  { id: 'assets', label: 'MW / assets connected', unit: 'MW · assets', value: 0, target: 'First real asset stream', source: 'Telemetry ingestion primitive', reportSection: 'PRODUCT' },
  { id: 'forecast-error', label: 'Forecast error', unit: 'MAPE / pinball', value: null, target: 'Beat persistence baseline on customer data', source: 'Experiment tracking', reportSection: 'TECHNOLOGY' },
  { id: 'opt-value', label: 'Optimization value', unit: '€ vs baseline schedule', value: null, target: 'Positive on customer data, CI reported', source: 'optimize_dispatch objective vs baseline_value', reportSection: 'TECHNOLOGY' },
  { id: 'latency', label: 'Latency', unit: 'ms p95 per tool', value: null, target: 'Within each tool timeout at p95', source: 'Tool telemetry', reportSection: 'TECHNOLOGY' },
  { id: 'uptime', label: 'Uptime', unit: '%', value: null, target: '99.5 % for read tools', source: 'Observability', reportSection: 'TECHNOLOGY' },
  { id: 'intervention', label: 'Intervention rate', unit: 'human overrides / plans', value: null, target: 'Measured before it is optimized', source: 'Authorization records', reportSection: 'RISKS' },
  { id: 'security', label: 'Security findings', unit: 'open', value: null, target: '0 high; public repos scanned for secrets', source: 'Dependency + secret scanning', reportSection: 'RISKS' },
  { id: 'benchmarks', label: 'Research benchmarks', unit: 'published with CI', value: 0, target: 'PINN vs Newton on IEEE 9-bus, published', source: 'Research page', reportSection: 'RESEARCH' },
] as const;

export const CEO_REPORT_SECTIONS = [
  'MONEY', 'CUSTOMERS', 'PRODUCT', 'TECHNOLOGY', 'RESEARCH', 'COMPETITION', 'RISKS', 'DECISIONS', 'KILLED WORK', 'NEXT 7 DAYS',
] as const;

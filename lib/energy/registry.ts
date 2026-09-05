/**
 * ENERGY INTELLIGENCE — REPOSITORY REGISTRY (machine-readable).
 *
 * This is the single source of truth for what the cluster owns, what each
 * repository is for, and what happens to it. It is rendered at
 * /energy/registry and served as JSON at /api/energy/registry so that
 * humans, procurement, search engines and AI agents read the same record.
 *
 * Rules (from the cluster mandate):
 *  - status is one of exactly six values; no other status exists;
 *  - every field is a statement about evidence, not a hope;
 *  - names are what the live inventory returned, not what the plan assumed;
 *  - "unlocated" is recorded, never hidden: a repository the mandate names
 *    that the inventory could not find is an EXPERIMENT with a locate-or-
 *    archive deadline, not a CORE component nobody can see.
 *
 * Inventory method (2026-09-05): git ls-remote against github.com/iceccarelli
 * for every repository the mandate names plus known aliases; shallow clone
 * and README read of the public hits; owner-stated facts for private repos.
 * The GitHub REST listing endpoint is not reachable from the build
 * environment, so private repositories can only be described from owner
 * statements — those lines say so in `visibility`.
 */

export const REGISTRY_STATUSES = ['CORE', 'MODULE', 'RESEARCH', 'INTERNAL', 'EXPERIMENT', 'ARCHIVE'] as const;
export type RegistryStatus = (typeof REGISTRY_STATUSES)[number];

export type Visibility = 'public' | 'private' | 'unlocated';
export type Maturity = 'idea' | 'prototype' | 'alpha' | 'beta' | 'production' | 'abandoned';
export type Grade = 'none' | 'low' | 'medium' | 'high';

export type RegistryEntry = {
  repository: string;
  url: string;
  visibility: Visibility;
  description: string;
  language: string;
  /** Last observed push (ISO date) or 'unknown'. */
  lastCommit: string;
  activity: 'active' | 'dormant' | 'unknown';
  architecture: string;
  dependencies: string[];
  maturity: Maturity;
  businessHypothesis: string;
  customer: string;
  technicalRole: string;
  duplicateFunctionality: string[];
  strategicValue: Grade;
  ipValue: Grade;
  revenuePotential: Grade;
  integrationPotential: Grade;
  securityRisk: Grade;
  regulatoryImplications: string[];
  recommendedStatus: RegistryStatus;
  /** The module of the target architecture this repository maps to. */
  targetModule: string;
  /** What is done with it, in one sentence. */
  action: string;
  /** Evidence the recommendation rests on. */
  evidence: string[];
};

export const REGISTRY_UPDATED = '2026-09-05';

export const REGISTRY: readonly RegistryEntry[] = [
  {
    repository: 'GridOS',
    url: 'https://github.com/iceccarelli/gridos',
    visibility: 'private',
    description: 'FastAPI DER middleware, PyPI-published. MILP battery dispatch scheduler, anomaly detection, OPC UA adapter, MPC forecast loop, TimescaleDB / InfluxDB backends.',
    language: 'Python',
    lastCommit: 'unknown',
    activity: 'unknown',
    architecture: 'FastAPI service · scheduler (MILP) · adapters (OPC UA) · time-series backends · MPC loop',
    dependencies: ['fastapi', 'pulp/or-tools (MILP)', 'opcua', 'timescaledb | influxdb'],
    maturity: 'beta',
    businessHypothesis: 'Operators of BESS / C&I sites pay for dispatch decisions that are measurably better than the rule-based schedule they run today.',
    customer: 'BESS operators, C&I energy managers, microgrid operators, Stadtwerke',
    technicalRole: 'Kernel: telemetry ingestion, asset identity, dispatch optimization, adapter host.',
    duplicateFunctionality: ['derim-middleware (DER adapters)', 'powergrid-pro (positioning, dashboard)'],
    strategicValue: 'high',
    ipValue: 'medium',
    revenuePotential: 'high',
    integrationPotential: 'high',
    securityRisk: 'high',
    regulatoryImplications: ['NIS2 (if operating for essential entities)', 'CRA (product with digital elements)', 'IEC 62443 for OT adapters', 'AI Act — limited-risk unless used for critical-infrastructure control'],
    recommendedStatus: 'CORE',
    targetModule: 'GRIDOS (kernel)',
    action: 'Becomes the one product brand of the cluster. Absorbs DERIM adapters. Ships nothing new until the wedge has a customer.',
    evidence: ['121 passing tests (owner-stated)', 'PyPI package published', 'No customer deployment recorded'],
  },
  {
    repository: 'derim-middleware',
    url: 'https://github.com/iceccarelli/derim-middleware',
    visibility: 'private',
    description: 'DER integration middleware. Commercial-readiness pass done: overclaims removed, lead capture, analytics, legal pages, honest Beta positioning.',
    language: 'TypeScript / Python',
    lastCommit: 'unknown',
    activity: 'unknown',
    architecture: 'Integration middleware · protocol adapters · beta web front',
    dependencies: ['formspree', 'plausible'],
    maturity: 'beta',
    businessHypothesis: 'Same buyer as GridOS. As a separate brand it splits one small pipeline in two.',
    customer: 'Same as GridOS',
    technicalRole: 'DER integration layer — protocol adapters and device onboarding.',
    duplicateFunctionality: ['GridOS OPC UA adapter', 'GridOS ingestion'],
    strategicValue: 'medium',
    ipValue: 'low',
    revenuePotential: 'low',
    integrationPotential: 'high',
    securityRisk: 'high',
    regulatoryImplications: ['IEC 62443', 'VDE-AR-N 4110/4105 device behaviour where devices are controlled'],
    recommendedStatus: 'MODULE',
    targetModule: 'GRIDOS › DERIM (integration layer)',
    action: 'Merge into GridOS as the DERIM module. Brand retired; adapters kept; web front archived.',
    evidence: ['Phase-1 commercial pass on a feature branch (owner-stated)', 'Functional overlap with GridOS adapters'],
  },
  {
    repository: 'energie-teilen',
    url: 'https://github.com/iceccarelli/energie-teilen',
    visibility: 'private',
    description: 'German Mieterstrom / energy-sharing platform under §42b EnWG. Paid pilot intake (Stripe), PDF report, sensitivity tornado, break-even solver, plain-German interpretation.',
    language: 'TypeScript',
    lastCommit: 'unknown',
    activity: 'unknown',
    architecture: 'Vite + React 19 front · Express API · Stripe · jsPDF',
    dependencies: ['react 19', 'express', 'stripe', 'jspdf'],
    maturity: 'production',
    businessHypothesis: 'Landlords, WEGs and Stadtwerke pay for a defensible §42b economics report before committing to a Mieterstrom / gemeinschaftliche Gebäudeversorgung project.',
    customer: 'Vermieter, WEG-Verwalter, Stadtwerke, Projektierer',
    technicalRole: 'Product surface: economics, reporting, community-energy tariff logic.',
    duplicateFunctionality: [],
    strategicValue: 'high',
    ipValue: 'medium',
    revenuePotential: 'medium',
    integrationPotential: 'medium',
    securityRisk: 'low',
    regulatoryImplications: ['§42b EnWG', 'EEG Mieterstromzuschlag', 'MsbG metering', 'DSGVO (tenant data)'],
    recommendedStatus: 'MODULE',
    targetModule: 'GRIDOS › Energie Teilen (energy-community product)',
    action: 'Kept as product surface. Only repository with a live paid-intake path — it anchors the commercial wedge candidate.',
    evidence: ['Production deployment confirmed (owner-stated)', 'Stripe pilot intake exists', 'No paid pilot recorded'],
  },
  {
    repository: 'NeuralBridge',
    url: 'https://github.com/iceccarelli/NeuralBridge',
    visibility: 'unlocated',
    description: 'Named in the mandate as the deterministic safety runtime between authorized actions and actuators. Not found under github.com/iceccarelli on 2026-09-05.',
    language: 'unknown',
    lastCommit: 'unknown',
    activity: 'unknown',
    architecture: 'Target: policy engine · risk evaluation · authorization · actuator gateway — deterministic, no ML in the path',
    dependencies: [],
    maturity: 'idea',
    businessHypothesis: 'No one buys a safety runtime alone; it is the precondition for any EXECUTE stage and for OT certification conversations.',
    customer: 'Internal precondition; later DSO / utility partners',
    technicalRole: 'Safety runtime — the only component allowed to talk to an actuator.',
    duplicateFunctionality: ['mcp-foundry governance kernel (token gate, hash-chained audit) covers part of the role'],
    strategicValue: 'high',
    ipValue: 'high',
    revenuePotential: 'low',
    integrationPotential: 'high',
    securityRisk: 'high',
    regulatoryImplications: ['IEC 61508 / 62443 if ever in a certified path', 'NIS2'],
    recommendedStatus: 'EXPERIMENT',
    targetModule: 'GRIDOS › NeuralBridge Safety Runtime',
    action: 'Locate or create. Until a repository exists, the safety runtime is a specification on /energy/safety, and no EXECUTE-stage work is permitted anywhere in the cluster.',
    evidence: ['git ls-remote: not found (NeuralBridge, neuralbridge)'],
  },
  {
    repository: 'ai-agent-control',
    url: 'https://github.com/iceccarelli/ai-agent-control',
    visibility: 'public',
    description: 'Public repository containing a one-line README and three zip archives of trading-bot slices (tradingbot_slice31, tradingbot_slice76). No energy code.',
    language: 'none (zip archives)',
    lastCommit: '2026-09-05',
    activity: 'active',
    architecture: 'none — archive drop',
    dependencies: [],
    maturity: 'prototype',
    businessHypothesis: 'None in this cluster. Content belongs to the trading / mcp-foundry line.',
    customer: 'none',
    technicalRole: 'none',
    duplicateFunctionality: ['bybit trading bot slices'],
    strategicValue: 'none',
    ipValue: 'none',
    revenuePotential: 'none',
    integrationPotential: 'none',
    securityRisk: 'medium',
    regulatoryImplications: ['Zip drops of trading code in a public repo: check for secrets before anything else'],
    recommendedStatus: 'ARCHIVE',
    targetModule: '—',
    action: 'Removed from the Energy registry scope. Move zips to the trading line or delete; archive the repository. The "AI planning" role the mandate assigned to this name goes to the GridOS AI Planning module instead.',
    evidence: ['Clone 2026-09-05: README.md + 3 × .zip only'],
  },
  {
    repository: 'physics-informed',
    url: 'https://github.com/iceccarelli/physics-informed',
    visibility: 'private',
    description: 'GridPINNs — physics-informed neural network library for power systems. DC and AC PINNs validated on IEEE 9-bus.',
    language: 'Python',
    lastCommit: 'unknown',
    activity: 'unknown',
    architecture: 'PINN training library · DC power-flow explorer · PDF report generator',
    dependencies: ['torch | jax', 'pandapower (baseline)'],
    maturity: 'alpha',
    businessHypothesis: 'Faster-than-Newton surrogate power flow lets the optimizer evaluate more candidate actions per second. Value only if the latency / accuracy trade beats the classical solver on a real feeder.',
    customer: 'Internal (optimizer, simulator); scientific output',
    technicalRole: 'Physics engine research — surrogate power flow, constraint prediction.',
    duplicateFunctionality: [],
    strategicValue: 'medium',
    ipValue: 'high',
    revenuePotential: 'low',
    integrationPotential: 'medium',
    securityRisk: 'low',
    regulatoryImplications: [],
    recommendedStatus: 'RESEARCH',
    targetModule: 'GRIDOS › Physics Engine',
    action: 'Kept as research. Must publish the 9-bus benchmark against Newton-Raphson with CI, latency and failure cases before any "state of the art" wording appears anywhere.',
    evidence: ['DC PINN 0.0124° RMSE, AC PINN 0.0035° RMSE on IEEE 9-bus (owner-stated)', 'A fabricated 1,803-line simulator was removed and replaced by an honest DC explorer (owner-stated)'],
  },
  {
    repository: 'powergrid-pro---grimaldi-engineering',
    url: 'https://github.com/iceccarelli/powergrid-pro---grimaldi-engineering',
    visibility: 'public',
    description: '"PowerGrid Pro" — React Native / Expo mock dashboard with login screen. README carries a strong DERMS / asset-health / OT-security positioning; the code is a UI shell.',
    language: 'JavaScript (Expo)',
    lastCommit: '2026-06-21',
    activity: 'dormant',
    architecture: 'Expo app · App.js · AppContext · LoginScreen · MainDashboard · static assets',
    dependencies: ['expo', 'react-native'],
    maturity: 'prototype',
    businessHypothesis: 'Same buyer and thesis as GridOS, restated under a second brand.',
    customer: 'Utilities, asset owners (per README)',
    technicalRole: 'none — no backend, no data path',
    duplicateFunctionality: ['GridOS positioning', 'GridOS dashboard'],
    strategicValue: 'low',
    ipValue: 'none',
    revenuePotential: 'none',
    integrationPotential: 'none',
    securityRisk: 'low',
    regulatoryImplications: [],
    recommendedStatus: 'ARCHIVE',
    targetModule: '— (README thesis absorbed into /energy positioning)',
    action: 'Archive the repository. Keep the README problem statement (DER orchestration, predictive asset health, OT security) as positioning input for GridOS. Second brand retired.',
    evidence: ['Clone 2026-09-05: 6 JS files, 5 PNG, no backend', 'Last push 2026-06-21'],
  },
  {
    repository: 'Renewables_Migration_Chapter1…10_Proof_Engine',
    url: 'https://github.com/iceccarelli/Renewables_Migration_Chapter1_Proof_Engine',
    visibility: 'public',
    description: 'Ten public Python repositories, one per chapter of "The Renewables Migration". Chapter 1: extended swing equation, RoCoF arrest, stability surface, 48 tests, MIT.',
    language: 'Python',
    lastCommit: '2026-04-06 (chapter 1)',
    activity: 'dormant',
    architecture: 'per chapter: core module · interactive main · notebooks · tests · data',
    dependencies: ['numpy', 'scipy', 'matplotlib', 'pytest'],
    maturity: 'alpha',
    businessHypothesis: 'Credibility asset: reproducible computation behind published claims. No direct revenue.',
    customer: 'Researchers, technical evaluators, readers',
    technicalRole: 'Scientific companion code; candidate test fixtures for the physics engine (inertia, RoCoF, grid-forming).',
    duplicateFunctionality: ['ten repositories sharing one utils layout'],
    strategicValue: 'medium',
    ipValue: 'medium',
    revenuePotential: 'none',
    integrationPotential: 'medium',
    securityRisk: 'low',
    regulatoryImplications: [],
    recommendedStatus: 'RESEARCH',
    targetModule: 'GRIDOS › Physics Engine (fixtures) · Research',
    action: 'Consolidate the ten repositories into one `renewables-migration-proof-engines` monorepo with one test runner; archive the ten. Claims stay tied to the book; none is reused as product marketing.',
    evidence: ['git ls-remote: chapters 1–10 present', 'Chapter 1: 48 tests, MIT licence'],
  },
  {
    repository: 'gridforge (timetopower.ai)',
    url: 'https://timetopower.ai/',
    visibility: 'private',
    description: 'Behind-the-meter power engineering for AI data centres: siting dashboard with EIA feed, AI siting analyst, cost-of-delay calculator, scenarios, board-brief PDF, Tier-3 subscription.',
    language: 'TypeScript',
    lastCommit: 'unknown',
    activity: 'unknown',
    architecture: 'Next.js 15.5 · Tailwind v4 · EIA feed · Claude-powered analyst · subscription',
    dependencies: ['next 15', 'tailwind 4', 'EIA API', 'anthropic'],
    maturity: 'beta',
    businessHypothesis: 'Data-centre developers pay for time-to-power analysis. Adjacent to the cluster (BTM planning), same physics, different buyer.',
    customer: 'AI data-centre developers, BTM power developers',
    technicalRole: 'Planning / siting front for behind-the-meter generation and storage.',
    duplicateFunctionality: ['GridOS forecasting inputs (partial)'],
    strategicValue: 'medium',
    ipValue: 'low',
    revenuePotential: 'medium',
    integrationPotential: 'medium',
    securityRisk: 'low',
    regulatoryImplications: ['US market data (EIA); EU version would need ENTSO-E / Bundesnetzagentur sources'],
    recommendedStatus: 'MODULE',
    targetModule: 'GRIDOS › AI Planning (siting & BTM scenarios)',
    action: 'Kept as a module and as wedge candidate B. Shares forecasting and scenario primitives with GridOS through contracts, not a shared database.',
    evidence: ['Subscription product completed (owner-stated)', 'Live siting dashboard (owner-stated)', 'Revenue not recorded'],
  },
  {
    repository: 'mcp-foundry',
    url: 'https://github.com/iceccarelli/mcp-foundry',
    visibility: 'private',
    description: 'AI-agent governance layer: HMAC-signed token gate, hash-chained audit log, MCP FastAPI server. Built for trading agents.',
    language: 'Python',
    lastCommit: 'unknown',
    activity: 'unknown',
    architecture: 'Governance kernel · token gate · append-only audit log · MCP server · CCXT connectors',
    dependencies: ['fastapi', 'mcp', 'ccxt'],
    maturity: 'beta',
    businessHypothesis: 'None in this cluster as a product. The governance kernel is exactly the shared primitive the agent tool layer needs (authorization, provenance, audit).',
    customer: 'Internal',
    technicalRole: 'Shared primitive: agent authorization gate + audit record. Trading connectors stay out of the cluster.',
    duplicateFunctionality: ['overlaps the NeuralBridge policy / audit role'],
    strategicValue: 'medium',
    ipValue: 'medium',
    revenuePotential: 'none',
    integrationPotential: 'high',
    securityRisk: 'medium',
    regulatoryImplications: ['AI Act logging / traceability obligations map onto the audit chain'],
    recommendedStatus: 'INTERNAL',
    targetModule: 'Shared primitives › authorization · audit · provenance',
    action: 'Extract the governance kernel as an internal package consumed by the agent tool layer. The trading side is not this cluster.',
    evidence: ['89 tests passing (owner-stated)', 'Zero reference deployments (owner-stated)'],
  },
  {
    repository: 'BatteryTrack*',
    url: 'https://github.com/iceccarelli?q=battery',
    visibility: 'unlocated',
    description: 'Named in the mandate. Not found under github.com/iceccarelli (BatteryTrack, batterytrack).',
    language: 'unknown',
    lastCommit: 'unknown',
    activity: 'unknown',
    architecture: 'unknown',
    dependencies: [],
    maturity: 'idea',
    businessHypothesis: 'If it exists: BESS state-of-health tracking feeds the anomaly-detection and dispatch modules.',
    customer: 'BESS operators',
    technicalRole: 'Candidate: asset health for storage.',
    duplicateFunctionality: ['GridOS anomaly detection', 'this site: /tools/battery-pack-calculator'],
    strategicValue: 'low',
    ipValue: 'none',
    revenuePotential: 'low',
    integrationPotential: 'medium',
    securityRisk: 'low',
    regulatoryImplications: [],
    recommendedStatus: 'EXPERIMENT',
    targetModule: 'GRIDOS › Asset / SCADA integrations (if located)',
    action: 'Locate by 2026-09-19 or strike from the registry.',
    evidence: ['git ls-remote: not found'],
  },
  {
    repository: 'UtilityPulse*',
    url: 'https://github.com/iceccarelli?q=utility',
    visibility: 'unlocated',
    description: 'Named in the mandate. Not found under github.com/iceccarelli (UtilityPulse, utilitypulse).',
    language: 'unknown',
    lastCommit: 'unknown',
    activity: 'unknown',
    architecture: 'unknown',
    dependencies: [],
    maturity: 'idea',
    businessHypothesis: 'unknown',
    customer: 'unknown',
    technicalRole: 'unknown',
    duplicateFunctionality: [],
    strategicValue: 'none',
    ipValue: 'none',
    revenuePotential: 'none',
    integrationPotential: 'none',
    securityRisk: 'low',
    regulatoryImplications: [],
    recommendedStatus: 'EXPERIMENT',
    targetModule: '—',
    action: 'Locate by 2026-09-19 or strike from the registry.',
    evidence: ['git ls-remote: not found'],
  },
  {
    repository: 'Advanced Asset Insight',
    url: 'https://github.com/iceccarelli?q=asset',
    visibility: 'unlocated',
    description: 'Named in the mandate. Not found under github.com/iceccarelli (advanced-asset-insight).',
    language: 'unknown',
    lastCommit: 'unknown',
    activity: 'unknown',
    architecture: 'unknown',
    dependencies: [],
    maturity: 'idea',
    businessHypothesis: 'If it exists: predictive asset health (transformers, feeders) — the second problem the PowerGrid Pro README says utilities pay for.',
    customer: 'DSOs, asset owners',
    technicalRole: 'Candidate: asset anomaly detection.',
    duplicateFunctionality: ['GridOS anomaly detection'],
    strategicValue: 'low',
    ipValue: 'none',
    revenuePotential: 'medium',
    integrationPotential: 'medium',
    securityRisk: 'low',
    regulatoryImplications: [],
    recommendedStatus: 'EXPERIMENT',
    targetModule: 'GRIDOS › Asset / SCADA integrations (if located)',
    action: 'Locate by 2026-09-19 or strike from the registry.',
    evidence: ['git ls-remote: not found'],
  },
  {
    repository: 'Advanced Mobile SCADA Suite',
    url: 'https://github.com/iceccarelli?q=scada',
    visibility: 'unlocated',
    description: 'Named in the mandate. Not found under github.com/iceccarelli (advanced-mobile-scada-suite).',
    language: 'unknown',
    lastCommit: 'unknown',
    activity: 'unknown',
    architecture: 'unknown',
    dependencies: [],
    maturity: 'idea',
    businessHypothesis: 'A mobile SCADA client is a read path into OT — high security cost, low differentiation.',
    customer: 'Field operators',
    technicalRole: 'Candidate: read-only SCADA view.',
    duplicateFunctionality: ['powergrid-pro dashboard'],
    strategicValue: 'low',
    ipValue: 'none',
    revenuePotential: 'low',
    integrationPotential: 'low',
    securityRisk: 'high',
    regulatoryImplications: ['IEC 62443 zones/conduits for any OT read path'],
    recommendedStatus: 'EXPERIMENT',
    targetModule: '—',
    action: 'Locate by 2026-09-19 or strike. Default recommendation on locate: ARCHIVE (OT blast radius, no differentiation).',
    evidence: ['git ls-remote: not found'],
  },
] as const;

export function byStatus(status: RegistryStatus): RegistryEntry[] {
  return REGISTRY.filter((r) => r.recommendedStatus === status);
}

export function statusCounts(): Record<RegistryStatus, number> {
  const out = Object.fromEntries(REGISTRY_STATUSES.map((s) => [s, 0])) as Record<RegistryStatus, number>;
  for (const r of REGISTRY) out[r.recommendedStatus] += 1;
  return out;
}

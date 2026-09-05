/**
 * TARGET ARCHITECTURE + HARD SEPARATION RULES + SAFETY CHAIN.
 *
 * One product brand (GridOS), nine modules, one shared-primitives layer.
 * Every module answers "why does it exist" in one line; a module without
 * that line does not get added. The safety chain is the non-negotiable
 * order of stages between an AI agent and an actuator.
 */

export type ModuleState = 'exists' | 'merging' | 'specified' | 'research' | 'missing';

export type ArchModule = {
  id: string;
  name: string;
  /** Repositories from the registry that land in this module. */
  from: string[];
  purpose: string;
  /** Why the module exists separately rather than inside its neighbour. */
  separateBecause: string;
  state: ModuleState;
  /** Deterministic modules may sit in the safety path; probabilistic never do. */
  kind: 'deterministic' | 'probabilistic' | 'data' | 'integration';
};

export const PRODUCT_BRAND = 'GridOS';

export const MODULES: readonly ArchModule[] = [
  { id: 'kernel', name: 'GridOS kernel', from: ['GridOS'], kind: 'data', state: 'exists',
    purpose: 'Telemetry ingestion, asset identity, time-series storage, API surface, tenant boundary.',
    separateBecause: 'It is the product. Everything else plugs in here through versioned contracts.' },
  { id: 'derim', name: 'DERIM — DER integration', from: ['derim-middleware', 'GridOS (OPC UA adapter)'], kind: 'integration', state: 'merging',
    purpose: 'Protocol adapters (OPC UA, Modbus, IEC 61850, EEBus/SunSpec) and device onboarding.',
    separateBecause: 'Adapters touch OT networks. Their blast radius is isolated from the analytics and from the planner.' },
  { id: 'energie-teilen', name: 'Energie Teilen', from: ['energie-teilen'], kind: 'data', state: 'exists',
    purpose: '§42b EnWG energy-community economics, tariff logic, reports and paid pilot intake.',
    separateBecause: 'A different buyer (Vermieter, WEG, Stadtwerke) and a regulatory surface that changes on its own clock.' },
  { id: 'assets', name: 'Asset / SCADA integrations', from: ['Advanced Asset Insight*', 'Advanced Mobile SCADA Suite*', 'BatteryTrack*'], kind: 'integration', state: 'missing',
    purpose: 'Read paths into existing SCADA / asset systems and asset-health features for the anomaly module.',
    separateBecause: 'Read-only OT access needs IEC 62443 zoning independent of any write path. Nothing here may write.' },
  { id: 'twin', name: 'Digital twin', from: ['GridOS', 'physics-informed (schemas)'], kind: 'data', state: 'specified',
    purpose: 'Network model, asset parameters and state — the single schema the simulator, optimizer and agents read.',
    separateBecause: 'CIM-derived schemas outlive any solver or model; they are a contract, not a feature.' },
  { id: 'forecast', name: 'Forecasting', from: ['GridOS (MPC loop)', 'gridforge (feeds)'], kind: 'probabilistic', state: 'exists',
    purpose: 'Probabilistic load, PV, price and constraint forecasts with tracked error.',
    separateBecause: 'Models are swapped and re-trained on their own cadence; the optimizer only sees a distribution interface.' },
  { id: 'optimize', name: 'Optimization', from: ['GridOS (MILP dispatch)'], kind: 'deterministic', state: 'exists',
    purpose: 'Dispatch, flexibility and curtailment optimization against explicit constraints; MILP first, learned surrogates only with benchmarks.',
    separateBecause: 'Deterministic, auditable, reproducible — it is the last stage before the policy engine that may propose an action.' },
  { id: 'physics', name: 'Physics engine', from: ['physics-informed', 'Renewables_Migration_*_Proof_Engine'], kind: 'deterministic', state: 'research',
    purpose: 'Power flow (Newton baseline), contingency, inertia / RoCoF checks; PINN surrogates when they beat the baseline.',
    separateBecause: 'The constraint check must be independent of the model that proposed the action.' },
  { id: 'planning', name: 'AI planning', from: ['gridforge (analyst)', 'GridOS (agent tools)'], kind: 'probabilistic', state: 'specified',
    purpose: 'LLM / agent planner: reads state, proposes candidate actions and explanations through the tool interface only.',
    separateBecause: 'Probabilistic intelligence is isolated from deterministic safety enforcement. It never touches an actuator.' },
  { id: 'neuralbridge', name: 'NeuralBridge safety runtime', from: ['NeuralBridge (unlocated)', 'mcp-foundry (governance kernel)'], kind: 'deterministic', state: 'missing',
    purpose: 'Policy engine, risk evaluation, authorization, actuator gateway, hash-chained audit.',
    separateBecause: 'The only component allowed to talk to an actuator. Certifiable in isolation; no ML dependency; own release cadence.' },
] as const;

/** The mandated order. Rendered verbatim; never shortened. */
export const SAFETY_CHAIN = [
  { stage: 'LLM / Agent', kind: 'probabilistic', does: 'Reads state through tools. Proposes.' },
  { stage: 'Planner', kind: 'probabilistic', does: 'Turns intent into candidate action sets with assumptions.' },
  { stage: 'Candidate actions', kind: 'data', does: 'Typed, versioned, signed by the proposer. Nothing executes here.' },
  { stage: 'Simulator', kind: 'deterministic', does: 'Runs the twin forward under each candidate.' },
  { stage: 'Physics constraints', kind: 'deterministic', does: 'Voltage, thermal, frequency, RoCoF, SoC bounds — pass / fail with margins.' },
  { stage: 'Policy engine', kind: 'deterministic', does: 'Tenant rules, market rules, grid-code rules, operator vetoes.' },
  { stage: 'Risk evaluation', kind: 'deterministic', does: 'Quantifies downside, reversibility, blast radius.' },
  { stage: 'Authorization', kind: 'deterministic', does: 'Human or pre-approved envelope. Signed. Time-boxed.' },
  { stage: 'NeuralBridge', kind: 'deterministic', does: 'Validates signature, envelope, freshness. Writes audit record.' },
  { stage: 'Actuator', kind: 'deterministic', does: 'The setpoint. Nothing upstream may reach it directly.' },
] as const;

export const SEPARATION_TRIGGERS = [
  'cybersecurity risk', 'OT risk', 'certification risk', 'deployment risk',
  'vendor lock-in', 'unnecessary dependencies', 'excessive blast radius', 'unclear ownership',
] as const;

/** Shared primitives: each one must name users, duplication removed, cost, security benefit, product unlocked. */
export type Primitive = {
  name: string;
  users: string[];
  eliminates: string;
  reducesCost: string;
  securityBenefit: string;
  unlocks: string;
  from: string;
  state: 'exists' | 'extract' | 'specified';
};

export const PRIMITIVES: readonly Primitive[] = [
  { name: 'Authorization & audit (governance kernel)', users: ['AI planning', 'NeuralBridge', 'API'], eliminates: 'Three separate permission checks and two log formats', reducesCost: 'One audit format to review, one place to revoke', securityBenefit: 'HMAC token gate, hash-chained append-only log', unlocks: 'AI-Act traceability, certifiable authorization path', from: 'mcp-foundry', state: 'extract' },
  { name: 'Asset identity & digital-twin schema', users: ['kernel', 'DERIM', 'simulator', 'optimizer', 'agents'], eliminates: 'Per-module asset tables', reducesCost: 'One migration when a device type changes', securityBenefit: 'One place to scope tenant access to assets', unlocks: 'Contingency analysis, hosting-capacity products', from: 'GridOS + CIM (RWTH thesis lineage)', state: 'specified' },
  { name: 'Telemetry ingestion & time-series abstraction', users: ['kernel', 'forecasting', 'anomaly'], eliminates: 'Two backends (Timescale, Influx) addressed twice', reducesCost: 'Backend swap without touching models', securityBenefit: 'One ingress to rate-limit and authenticate', unlocks: 'MW/assets-connected KPI becomes measurable', from: 'GridOS', state: 'exists' },
  { name: 'Event & candidate-action schemas', users: ['planner', 'simulator', 'policy', 'NeuralBridge'], eliminates: 'Ad-hoc JSON between stages', reducesCost: 'Contract tests replace integration debugging', securityBenefit: 'Signed, versioned, replayable', unlocks: 'Cross-cluster events (GridOS anomaly → work order) without coupling', from: 'new, small', state: 'specified' },
  { name: 'Simulation & policy interfaces', users: ['optimizer', 'physics', 'agents'], eliminates: 'Solver-specific call sites', reducesCost: 'Newton vs PINN swap is one adapter', securityBenefit: 'Constraint check independent of proposer', unlocks: 'Benchmarks with identical harness', from: 'physics-informed', state: 'specified' },
  { name: 'Experiment tracking & model registry', users: ['forecasting', 'physics', 'research'], eliminates: 'Notebook-only results', reducesCost: 'Reproducible runs, no re-derivation', securityBenefit: 'Provenance of every deployed model', unlocks: 'Honest "state of the art" claims', from: 'new (MLflow or equivalent)', state: 'specified' },
] as const;

/** Which stages of the progression the cluster is allowed to operate today.
 *  AUTHORIZE and EXECUTE are locked by decision D-007 until NeuralBridge exists. */
export const PROGRESSION_STATE: readonly { stage: string; state: 'active' | 'building' | 'locked'; note: string }[] = [
  { stage: 'OBSERVE', state: 'active', note: 'GridOS ingestion, OPC UA adapter' },
  { stage: 'PREDICT', state: 'active', note: 'MPC forecast loop — error not yet measured' },
  { stage: 'SIMULATE', state: 'building', note: 'Newton baseline; PINN surrogate in research' },
  { stage: 'OPTIMIZE', state: 'active', note: 'MILP dispatch scheduler' },
  { stage: 'RECOMMEND', state: 'building', note: 'Wedge A: explanation + € gap report' },
  { stage: 'AUTHORIZE', state: 'locked', note: 'D-007 — no safety runtime exists' },
  { stage: 'EXECUTE', state: 'locked', note: 'D-007 — never before NeuralBridge' },
] as const;

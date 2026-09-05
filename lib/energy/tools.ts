/**
 * AGENTIC PRIMITIVES — the controlled agent tool interface.
 *
 * An agent reaches infrastructure only through these tools. Each tool has
 * a schema, authentication, authorization scope, deterministic validation,
 * timeout, provenance, logging, failure behaviour and a test requirement.
 * `sideEffect` is the safety classification: `write` tools never exist in
 * this list — the only write is request_authorization, which produces a
 * signed request for NeuralBridge, never a setpoint.
 *
 * Status is honest: `specified` means the contract is fixed here and the
 * implementation does not exist yet.
 */

export type SideEffect = 'read' | 'compute' | 'simulate' | 'request' | 'record';

export type AgentTool = {
  name: string;
  purpose: string;
  sideEffect: SideEffect;
  input: string;
  output: string;
  scope: string;
  timeoutMs: number;
  validation: string;
  onFailure: string;
  module: string;
  status: 'specified' | 'implemented' | 'tested';
};

export const AGENT_TOOLS: readonly AgentTool[] = [
  { name: 'inspect_grid_state', purpose: 'Snapshot of the twin at a timestamp: buses, branches, assets, measurements, active alarms.', sideEffect: 'read', input: '{ tenant, network_id, at?: iso8601, depth?: 1|2|3 }', output: '{ snapshot_id, state, provenance }', scope: 'tenant:read', timeoutMs: 2000, validation: 'network_id belongs to tenant; at within retention', onFailure: 'Return last consistent snapshot with stale=true; never partial state.', module: 'kernel · twin', status: 'specified' },
  { name: 'retrieve_asset', purpose: 'Asset record, parameters, limits, connection point, health features.', sideEffect: 'read', input: '{ tenant, asset_id }', output: '{ asset, limits, provenance }', scope: 'tenant:read', timeoutMs: 1000, validation: 'asset_id in tenant scope', onFailure: '404 typed error; no fuzzy match.', module: 'kernel', status: 'specified' },
  { name: 'run_power_flow', purpose: 'AC (Newton) or DC power flow on a snapshot with optional modifications.', sideEffect: 'compute', input: '{ snapshot_id, method: ac|dc|pinn, modifications?: Action[] }', output: '{ result_id, voltages, flows, converged, iterations, solver, latency_ms }', scope: 'tenant:simulate', timeoutMs: 10000, validation: 'modifications typed and within asset limits', onFailure: 'converged=false is a result, not an error; solver exception → typed error, no retry with another method silently.', module: 'physics', status: 'specified' },
  { name: 'run_contingency', purpose: 'N-1 / N-k screening over a snapshot.', sideEffect: 'compute', input: '{ snapshot_id, set: n-1|list, limit_margin_pct }', output: '{ violations[], worst_case, latency_ms }', scope: 'tenant:simulate', timeoutMs: 30000, validation: 'contingency list ⊂ network elements', onFailure: 'Partial results carry completed=false and the list of unevaluated cases.', module: 'physics', status: 'specified' },
  { name: 'run_forecast', purpose: 'Probabilistic forecast for load, PV, price or constraint at a node.', sideEffect: 'compute', input: '{ tenant, target, horizon_h, quantiles[] }', output: '{ forecast_id, series[quantile], model_version, backtest_error }', scope: 'tenant:read', timeoutMs: 5000, validation: 'horizon ≤ model max; quantiles in (0,1)', onFailure: 'Fallback to persistence baseline, flagged baseline=true.', module: 'forecast', status: 'specified' },
  { name: 'simulate_action', purpose: 'Roll the twin forward under a candidate action set.', sideEffect: 'simulate', input: '{ snapshot_id, actions: Action[], horizon_min }', output: '{ sim_id, trajectory, constraint_report }', scope: 'tenant:simulate', timeoutMs: 20000, validation: 'actions signed by proposer; within declared envelopes', onFailure: 'Any constraint evaluation failure marks the sim invalid; invalid sims cannot be cited by request_authorization.', module: 'twin · physics', status: 'specified' },
  { name: 'calculate_flexibility', purpose: 'Available up/down flexibility per asset and aggregate over a window.', sideEffect: 'compute', input: '{ tenant, asset_ids[], window }', output: '{ per_asset[], aggregate, assumptions[] }', scope: 'tenant:read', timeoutMs: 5000, validation: 'window within forecast horizon', onFailure: 'Assets with unknown limits are excluded and listed.', module: 'optimize', status: 'specified' },
  { name: 'optimize_dispatch', purpose: 'MILP dispatch for BESS / DER portfolio against price, constraints and SoC.', sideEffect: 'compute', input: '{ tenant, portfolio, objective, horizon_h, constraints }', output: '{ plan_id, schedule, objective_value, baseline_value, gap, solver_status }', scope: 'tenant:simulate', timeoutMs: 60000, validation: 'constraints reference known assets; objective from an enum', onFailure: 'Infeasible → return the infeasibility certificate; time-limit → best bound with gap.', module: 'optimize', status: 'specified' },
  { name: 'validate_constraints', purpose: 'Deterministic pass/fail of a plan against physics and policy, with margins.', sideEffect: 'compute', input: '{ plan_id | sim_id }', output: '{ pass, violations[], margins }', scope: 'tenant:simulate', timeoutMs: 10000, validation: 'input exists and is not stale', onFailure: 'Fail closed: any evaluation error is a fail.', module: 'physics · policy', status: 'specified' },
  { name: 'request_authorization', purpose: 'Submit a validated plan for human or envelope authorization. The only tool that leaves the sandbox — and it produces a request, not a setpoint.', sideEffect: 'request', input: '{ plan_id, sim_id, validation_id, explanation_id, requested_window }', output: '{ request_id, status: pending|approved|denied, expires_at }', scope: 'tenant:request', timeoutMs: 3000, validation: 'plan, sim and validation ids agree; validation.pass = true; explanation present', onFailure: 'Denied by default on any inconsistency. Never retried automatically.', module: 'NeuralBridge', status: 'specified' },
  { name: 'generate_explanation', purpose: 'Plain-language and structured explanation of a plan: assumptions, trade-offs, what was rejected.', sideEffect: 'compute', input: '{ plan_id, audience: operator|manager|auditor, lang: en|de }', output: '{ explanation_id, text, structured }', scope: 'tenant:read', timeoutMs: 15000, validation: 'plan exists', onFailure: 'No explanation → no authorization request possible.', module: 'planning', status: 'specified' },
  { name: 'create_incident', purpose: 'Open an incident with evidence attached (snapshots, sims, forecasts).', sideEffect: 'record', input: '{ tenant, severity, title, evidence_ids[] }', output: '{ incident_id }', scope: 'tenant:write:incident', timeoutMs: 3000, validation: 'evidence ids exist in tenant', onFailure: 'Queued locally, retried, never dropped.', module: 'kernel', status: 'specified' },
  { name: 'generate_audit_record', purpose: 'Append a hash-chained record of who asked what, what was computed, what was decided.', sideEffect: 'record', input: '{ actor, tool, inputs_hash, outputs_hash, decision? }', output: '{ record_id, chain_hash }', scope: 'system', timeoutMs: 1000, validation: 'previous chain hash matches', onFailure: 'Chain break halts all request tools until resolved.', module: 'shared › audit', status: 'specified' },
] as const;

export const TOOL_REQUIREMENTS = [
  'schema', 'authentication', 'authorization', 'deterministic validation', 'timeout',
  'provenance', 'logging', 'failure behaviour', 'test coverage',
] as const;

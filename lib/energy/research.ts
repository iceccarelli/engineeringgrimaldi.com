/**
 * RESEARCH FRONTIER. A topic survives here only if it can improve a product,
 * create defensible IP, or produce credible scientific output. A "benchmark"
 * is a dataset + baseline + metric + CI + hardware + latency + failure cases.
 * Until all of those are published, the wording is "unbenchmarked".
 */

export type Benchmark = {
  dataset: string;
  baseline: string;
  metric: string;
  result: string;
  ci: string;
  hardware: string;
  latency: string;
  failureCases: string;
  reproducible: boolean;
};

export type ResearchTopic = {
  topic: string;
  productUse: string;
  module: string;
  repo: string;
  state: 'unbenchmarked' | 'partial' | 'benchmarked' | 'watch';
  benchmark?: Benchmark;
  next: string;
};

export const RESEARCH: readonly ResearchTopic[] = [
  { topic: 'PINNs for AC/DC power flow', productUse: 'Surrogate power flow for fast candidate screening', module: 'physics', repo: 'physics-informed', state: 'partial',
    benchmark: { dataset: 'IEEE 9-bus', baseline: 'Newton-Raphson (pandapower)', metric: 'Voltage-angle RMSE', result: 'DC 0.0124° · AC 0.0035° (owner-stated)', ci: 'not reported', hardware: 'not reported', latency: 'not reported', failureCases: 'not reported', reproducible: false },
    next: 'Publish the full record with CI, latency vs Newton, and behaviour on 39-bus / 118-bus (generalization).' },
  { topic: 'MILP dispatch vs learned dispatch', productUse: 'Wedge A — BESS / community dispatch', module: 'optimize', repo: 'GridOS', state: 'unbenchmarked',
    next: 'Benchmark MILP against the customer\'s rule-based schedule on real prices; learned policies only after MILP is deployed.' },
  { topic: 'Probabilistic forecasting (load, PV, price)', productUse: 'Forecast inputs to dispatch; forecast-error KPI', module: 'forecast', repo: 'GridOS (MPC loop)', state: 'unbenchmarked',
    next: 'Persistence and seasonal-naive baselines first; pinball loss on open data (e.g. ENTSO-E Transparency, Open Power System Data).' },
  { topic: 'Inertia / RoCoF with grid-forming inverters', productUse: 'Physics constraint checks; credibility', module: 'physics', repo: 'Renewables_Migration_*_Proof_Engine', state: 'partial',
    benchmark: { dataset: 'Book appendix figures (chapter 1)', baseline: 'Swing equation', metric: 'Test pass against stated figures', result: '48 tests pass', ci: 'n/a', hardware: 'n/a', latency: 'n/a', failureCases: 'n/a', reproducible: true },
    next: 'Separate book-consistency tests from physical validation against a public dynamics case.' },
  { topic: 'Safe / constrained RL for dispatch', productUse: 'Not before MILP is in production', module: 'optimize', repo: '—', state: 'watch',
    next: 'Watch only. Revisit when there is customer data and a deployed baseline.' },
  { topic: 'GNNs / neural operators for grid state', productUse: 'State estimation with sparse measurements', module: 'twin', repo: '—', state: 'watch',
    next: 'Watch only.' },
  { topic: 'Runtime assurance & agent verification', productUse: 'NeuralBridge design', module: 'neuralbridge', repo: 'NeuralBridge (unlocated) · mcp-foundry', state: 'unbenchmarked',
    next: 'Specify the simplex-architecture style monitor; formalize the envelope check; property tests before any code.' },
  { topic: 'Uncertainty quantification & distribution shift', productUse: 'Forecast intervals; refusal to act under shift', module: 'forecast · planning', repo: '—', state: 'watch',
    next: 'Conformal intervals on the forecasting module once it has a backtest.' },
] as const;

export const FRONTIER = [
  'OPF', 'AC/DC power flow', 'MPC', 'GNNs', 'neural operators', 'PINNs', 'differentiable simulation',
  'safe RL', 'constrained RL', 'uncertainty quantification', 'distribution shift', 'causal inference',
  'probabilistic forecasting', 'digital twins', 'multi-agent optimization', 'formal methods', 'runtime assurance', 'agent verification',
] as const;

export const BENCHMARK_RECORD = ['dataset', 'baseline', 'metric', 'confidence interval', 'hardware', 'latency', 'failure cases', 'generalization', 'ablation'] as const;

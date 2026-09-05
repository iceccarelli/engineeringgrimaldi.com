/**
 * DECISION LOG + KILL LIST. Append-only. A decision is reversed by a new
 * decision that names the one it reverses — never by editing history.
 */

export type Decision = {
  id: string;
  date: string;
  title: string;
  decision: string;
  because: string[];
  status: 'decided' | 'proposed' | 'reversed';
  /** CEO approval is required for cluster moves and archive of a CORE/MODULE. */
  needsCeo: boolean;
};

export const DECISIONS: readonly Decision[] = [
  { id: 'D-001', date: '2026-09-05', title: 'engineeringgrimaldi.com becomes the cluster control engine', status: 'decided', needsCeo: false,
    decision: 'This site publishes the registry, architecture, safety chain, agent tool contracts, KPIs, decisions, research and intelligence for the Energy Intelligence cluster, and links the other two clusters. It is the reference agents and evaluators read.',
    because: ['One authoritative source beats scattered READMEs', 'AI discoverability requires structured, stable URLs and JSON', 'The Palletizer product surface is preserved unchanged'] },
  { id: 'D-002', date: '2026-09-05', title: 'Energy Intelligence is cluster 1 and the primary section', status: 'decided', needsCeo: false,
    decision: 'Home leads with the Energy cluster; /energy is the first navigation item. Physical AI (Palletizer) is cluster 2 and keeps every existing URL.',
    because: ['CEO command structure: Agent 1 — Energy: "Create the highest-value deep-tech company"', 'No URL of the palletizer product is broken or moved'] },
  { id: 'D-003', date: '2026-09-05', title: 'GridOS is the only product brand; DERIM becomes a module', status: 'decided', needsCeo: true,
    decision: 'The DERIM brand is retired. Its adapters merge into GridOS as the DERIM integration module. Energie Teilen stays a named product surface inside GridOS.',
    because: ['Two brands split one small pipeline', 'Adapter functionality overlaps GridOS OPC UA', 'Mandate: do not create multiple energy brands because multiple repositories exist'] },
  { id: 'D-004', date: '2026-09-05', title: 'ARCHIVE powergrid-pro---grimaldi-engineering', status: 'decided', needsCeo: false,
    decision: 'Archive the repository. Absorb its README problem statement into GridOS positioning.',
    because: ['Expo UI shell, no backend, no data path', 'Duplicates GridOS positioning under a second brand', 'Last push 2026-06-21'] },
  { id: 'D-005', date: '2026-09-05', title: 'ai-agent-control leaves the Energy scope', status: 'decided', needsCeo: false,
    decision: 'The public repository holds trading-bot zip slices only. It is not the AI-planning component; that role moves to the GridOS AI Planning module. Repository to be scanned for secrets, contents moved to the trading line, then archived.',
    because: ['Clone shows README + 3 zips, no energy code', 'Public zips of trading code are a security-hygiene issue'] },
  { id: 'D-006', date: '2026-09-05', title: 'Consolidate the ten proof-engine repositories', status: 'decided', needsCeo: false,
    decision: 'Create one renewables-migration-proof-engines monorepo with one test runner; archive the ten chapter repositories after migration.',
    because: ['Ten repositories, one layout, one author', 'Research status — credibility asset, not a product'] },
  { id: 'D-007', date: '2026-09-05', title: 'No EXECUTE-stage work until NeuralBridge exists', status: 'decided', needsCeo: false,
    decision: 'Until a safety runtime repository exists and passes its own tests, every module stops at RECOMMEND. request_authorization is the last tool; nothing writes a setpoint.',
    because: ['Mandate: the LLM/agent must never directly control a physical system', 'NeuralBridge is unlocated in the live inventory'] },
  { id: 'D-008', date: '2026-09-05', title: 'Extract the mcp-foundry governance kernel as a shared primitive', status: 'decided', needsCeo: false,
    decision: 'Token gate, hash-chained audit log and MCP server pattern become an internal package used by the agent tool layer. Trading connectors stay outside the cluster.',
    because: ['Exactly the authorization + audit primitive the tool layer requires', '89 tests exist; zero reference deployments — internal use is the honest first deployment'] },
  { id: 'D-009', date: '2026-09-05', title: 'Commercial wedge A: BESS / energy-community dispatch decision support for Stadtwerke and Mieterstrom operators', status: 'proposed', needsCeo: true,
    decision: 'Build only: optimize_dispatch + validate_constraints + generate_explanation on top of the existing MILP scheduler, sold as a weekly dispatch recommendation with a measured € gap against the customer\'s current schedule. Entry through Energie Teilen\'s existing paid intake.',
    because: ['Only asset with a live paid-intake path (energie-teilen)', 'MILP dispatch already exists in GridOS', 'ROI is one number the customer can check: € vs their schedule', 'Requires no write path, so no NeuralBridge dependency'] },
  { id: 'D-010', date: '2026-09-05', title: 'Locate-or-strike deadline for unlocated repositories', status: 'decided', needsCeo: false,
    decision: 'NeuralBridge, BatteryTrack*, UtilityPulse*, Advanced Asset Insight, Advanced Mobile SCADA Suite: provide a URL by 2026-09-19 or they are struck from the registry.',
    because: ['A registry entry nobody can open is not an asset'] },
  { id: 'D-011', date: '2026-09-05', title: 'Customer evidence is public but anonymised; the funnel is derived, never typed', status: 'decided', needsCeo: false,
    decision: 'lib/energy/customers.ts holds one record per conversation with segment, region, size band, cost band, budget-owner role and stage. Names and contacts stay in the private CRM. Funnel counts and the qualified / pilot KPIs are computed from these records.',
    because: ['Compliments are not validation; a record has to reach a stage', 'A hand-typed funnel drifts; a derived one cannot', 'DSGVO: no personal data on a public page'] },
  { id: 'D-012', date: '2026-09-05', title: 'Energy intake goes live on home and /energy/wedge', status: 'decided', needsCeo: false,
    decision: 'A second intake path asks the five discovery questions (what costs money, how much, who owns the budget, how it is solved today, what success is worth) and forwards to the same webhook as the SKU intake with cluster=energy.',
    because: ['The only thing on this site that turns into money is a lead', 'The SKU intake cannot carry an energy conversation'] },
  { id: 'D-013', date: '2026-09-05', title: 'Weekly CEO report is generated, not written', status: 'decided', needsCeo: false,
    decision: 'scripts/ceo-report.mjs reads /api/energy/* and writes docs/energy/reports/YYYY-MM-DD.md with exactly the ten sections. A GitHub Action runs it every Friday and opens a pull request.',
    because: ['Outcomes come from the constants; prose comes from a human only in DECISIONS and NEXT 7 DAYS', 'A report that is not produced on schedule is not a KPI system'] },
] as const;

export type Kill = { what: string; date: string; reason: string; decision: string };

export const KILL_LIST: readonly Kill[] = [
  { what: 'PowerGrid Pro (brand + Expo app)', date: '2026-09-05', reason: 'duplicated functionality · no data path · no customer', decision: 'D-004' },
  { what: 'DERIM as a brand', date: '2026-09-05', reason: 'second brand for the same buyer', decision: 'D-003' },
  { what: 'ai-agent-control in Energy scope', date: '2026-09-05', reason: 'no energy code; trading zips', decision: 'D-005' },
  { what: 'Ten separate proof-engine repositories', date: '2026-09-05', reason: 'consolidation', decision: 'D-006' },
  { what: 'Any EXECUTE-stage feature', date: '2026-09-05', reason: 'no safety runtime exists', decision: 'D-007' },
] as const;

# MIGRATION RECORD — engineeringgrimaldi.com becomes the cluster control engine

Date: 2026-09-05 · Decision: D-001, D-002 · Patch: `0001-feat-energy-cluster-control-engine.patch`

## What changed on the site

| Before | After |
|---|---|
| Single-product palletizer site; five nav items (Product, Integrators, Tools, Work, Contact) | Cluster control engine; five nav items (**Energy**, Palletizer, Tools, Work, Contact). Integrators folded into the Palletizer menu group; URL unchanged |
| Home = planner + three doors | Home = three clusters in resource order, cluster 1 carrying live registry counts, KPIs, wedge and last decision; rewards / non-rewards; JSON endpoints; intake |
| No cluster data | `lib/clusters.ts` + `lib/energy/*` — typed, single-source constants |
| — | `/energy` + nine control pages (registry, decisions, kpis, architecture, safety, agent-tools, wedge, research, intelligence), EN + DE |
| — | `/api/energy/{index,clusters,registry,architecture,tools,kpis,decisions,research,intelligence,wedge}` — static JSON, cached, read-only |
| Site metadata = palletizing | Site metadata = three clusters; Person / ProfessionalService schema widened; Organization + Dataset + ItemList JSON-LD added |
| — | `AGENTS.md`, `docs/energy/{MANDATE,CONSTITUTION,MIGRATION}.md` |

Untouched: `/palletizer`, `/docs`, `/integrators`, `/tools/*`, `/reference/*`, `/work`, `/contact`, all calculators, all parked routes, all redirects, CSP, i18n middleware.

## Live inventory result (github.com/iceccarelli, 2026-09-05)

Method: `git ls-remote` for every name the mandate lists plus aliases; shallow clone + README for public hits. The GitHub listing API was not reachable from the build environment; private repositories are described from owner statements and say so.

| Named in mandate | Found as | Visibility | Registry status |
|---|---|---|---|
| GridOS | (private) | private | CORE |
| DERIM / derim-middleware | (private) | private | MODULE → merges into GridOS |
| energie-teilen | (private) | private | MODULE |
| NeuralBridge | — | unlocated | EXPERIMENT (locate by 2026-09-19) |
| ai-agent-control | `ai-agent-control` (README + 3 trading-bot zips) | public | ARCHIVE — not energy code |
| physics-informed | (private) | private | RESEARCH |
| powergrid-pro---grimaldi-engineering | `powergrid-pro---grimaldi-engineering` (Expo UI shell) | public | ARCHIVE |
| Renewables_Migration_Chapter*_Proof_Engine | chapters 1–10 | public | RESEARCH → consolidate |
| BatteryTrack* | — | unlocated | EXPERIMENT |
| UtilityPulse* | — | unlocated | EXPERIMENT |
| Advanced Asset Insight | — | unlocated | EXPERIMENT |
| Advanced Mobile SCADA Suite | — | unlocated | EXPERIMENT |
| (added) gridforge / timetopower.ai | (private) | private | MODULE — wedge candidate B |
| (added) mcp-foundry | (private) | private | INTERNAL — governance kernel as shared primitive |

Counts: CORE 1 · MODULE 3 · RESEARCH 2 · INTERNAL 1 · EXPERIMENT 5 · ARCHIVE 2.

## Repository-side actions this patch does NOT perform (they need the owner)

```bash
# 1. ai-agent-control: scan for secrets, move zips to the trading line, archive (D-005)
gh repo view iceccarelli/ai-agent-control
# → after moving the zips:
gh repo archive iceccarelli/ai-agent-control --yes

# 2. powergrid-pro: archive (D-004)
gh repo archive iceccarelli/powergrid-pro---grimaldi-engineering --yes

# 3. Proof engines: consolidate (D-006)
gh repo create iceccarelli/renewables-migration-proof-engines --public --description "Reproducible companion code to The Renewables Migration, chapters 1-10"
for c in 1 2 3 4 5 6 7 8 9 10; do
  git subtree add --prefix="chapter$c" "https://github.com/iceccarelli/Renewables_Migration_Chapter${c}_Proof_Engine" main
done
# then archive the ten chapter repos once tests pass in the monorepo

# 4. Unlocated repositories (D-010): provide URLs or strike by 2026-09-19
#    NeuralBridge · BatteryTrack* · UtilityPulse* · Advanced Asset Insight · Advanced Mobile SCADA Suite

# 5. DERIM → GridOS module (D-003, needs CEO approval): open the merge PR in gridos, retire the derim web front
```

## Weekly loop from here

1. Update `KPI_AS_OF`, `REGISTRY_UPDATED`, KPI values (with sources) in `lib/energy/kpis.ts`, `lib/energy/registry.ts`.
2. Append decisions to `lib/energy/decisions.ts`; never edit old ones.
3. Log findings in `lib/energy/intel.ts` only if all six questions are answered.
4. `npm run build` — all `/energy/*` and `/api/energy/*` must prerender.
5. Produce the ten-section CEO report.

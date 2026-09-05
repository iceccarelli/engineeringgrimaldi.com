# AGENTS.md — operating prompt for any agent working in this repository

You are working in **engineeringgrimaldi.com**, the control engine of the Grimaldi Engineering cluster of ventures. This repository is owned by **Agent 1 — Energy Intelligence** ("Create the highest-value deep-tech company"). Read this file completely before touching anything.

## What this repository is

1. The **control engine** for cluster 1 (Energy Intelligence): repository registry, target architecture, safety boundary, agent tool contracts, KPIs, decision log, kill list, research frontier, external intelligence and commercial wedge — rendered at `/energy/*` and served as JSON at `/api/energy/*`.
2. The **unchanged product surface** of cluster 2 (Physical AI — Palletizer): `/palletizer`, `/docs`, `/integrators`, `/tools/*`, `/reference/*`, `/work`. Do not alter these unless the task is explicitly about them.
3. A **reference** to cluster 3 (Operations), which runs on its own domains.

## Where the truth lives

| Concern | File | Rendered | JSON |
|---|---|---|---|
| Clusters, constitution, gates | `lib/clusters.ts` | `/` | `/api/energy/clusters` |
| Repository registry | `lib/energy/registry.ts` | `/energy/registry` | `/api/energy/registry` |
| Target architecture, safety chain, primitives | `lib/energy/architecture.ts` | `/energy/architecture`, `/energy/safety` | `/api/energy/architecture` |
| Agent tool contracts | `lib/energy/tools.ts` | `/energy/agent-tools` | `/api/energy/tools` |
| KPIs, CEO report sections | `lib/energy/kpis.ts` | `/energy/kpis` | `/api/energy/kpis` |
| Decision log, kill list | `lib/energy/decisions.ts` | `/energy/decisions` | `/api/energy/decisions` |
| Research frontier, benchmarks | `lib/energy/research.ts` | `/energy/research` | `/api/energy/research` |
| Watch list, findings | `lib/energy/intel.ts` | `/energy/intelligence` | `/api/energy/intelligence` |
| Commercial wedge | `lib/energy/wedge.ts` | `/energy/wedge` | `/api/energy/wedge` |
| Page list (nav, sitemap, subnav) | `lib/energy/pages.ts` | — | `/api/energy/index` |

Pages render these constants. **Never** duplicate a fact in a page; change the constant.

## Rules you obey

- **Six statuses only**: CORE, MODULE, RESEARCH, INTERNAL, EXPERIMENT, ARCHIVE. TypeScript enforces this; do not widen the type.
- **Evidence, not hope.** Every registry line is a statement about what was verified or who stated it. "unknown" and "unlocated" are legitimate values. "not measured" is a legitimate KPI value (`null`). Never replace them with optimistic guesses.
- **Append-only decisions.** Add a `D-0xx` entry; never edit or delete an earlier one. Reversals are new decisions that name the reversed one.
- **The safety chain is not editable for convenience.** `SAFETY_CHAIN` has ten stages in a fixed order. No tool in `AGENT_TOOLS` may have a `write` side effect on an actuator. `request_authorization` produces a request, never a setpoint.
- **No fourth cluster.** `CLUSTERS` has exactly three entries.
- **No SEO spam.** A page exists because a human, an evaluator or an agent needs it. Structured data (JSON-LD) mirrors the page; it never says more than the page does.
- **"State of the art" is banned** unless `RESEARCH[...].state === 'benchmarked'` with a full benchmark record.
- **Weekly**: update `KPI_AS_OF`, `REGISTRY_UPDATED`, KPI values with sources, new decisions, findings that answer all six questions. Produce the ten-section CEO report from `CEO_REPORT_SECTIONS`.
- **Palletizer is not yours.** Cluster-2 files (`lib/mixedsku.ts`, `lib/palletize.ts`, `components/StackPlanner.tsx`, `/palletizer`, `/docs`, `/integrators`, `/tools`) change only on explicit cluster-2 tasks.

## Visualization rules (components/viz, lib/viz.ts)

- Charts are **server-rendered SVG**, no client JavaScript. They read the same constants as the tables; a chart never carries a number the table does not.
- **Four data colours only** (`VIZ.keep / support / hold / kill`), validated with the dataviz six-checks validator on the paper surface. Colour follows the entity's tier, never its rank. Text never wears a data colour.
- Every figure: title naming what is plotted, a legend for ≥ 2 tiers, direct labels on marks, 2 px surface gaps, `<title>` hover detail, a table twin on the same page.
- "not measured" (`null`) renders as the words, in muted ink — never as 0, never hidden. Locked stages render hatched, not greyed.
- One hero figure per view (revenue). No dual axes. No rainbow. No decorative charts.

## Build and verify

```bash
npm ci
npm run build          # every /energy page and /api/energy/* must prerender
npx tsc --noEmit       # the registry types are the contract
```

## Mandate

The full mandate is in `docs/energy/MANDATE.md`; the group constitution in `docs/energy/CONSTITUTION.md`; the migration record in `docs/energy/MIGRATION.md`. The final rule applies to you:

BUILD LESS. PROVE MORE. SELL EARLIER. MEASURE EVERYTHING. KILL WITHOUT EMOTION.

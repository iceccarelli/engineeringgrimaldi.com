import { NextResponse } from 'next/server';
import { CLUSTERS, CLUSTER_MOVE_RECORD, NOT_REWARDED_FOR, PROJECT_GATES, REWARDED_FOR } from '@/lib/clusters';
import { MODULES, PRIMITIVES, PRODUCT_BRAND, SAFETY_CHAIN, SEPARATION_TRIGGERS } from '@/lib/energy/architecture';
import { DECISIONS, KILL_LIST } from '@/lib/energy/decisions';
import { FINDINGS, WATCH } from '@/lib/energy/intel';
import { CEO_REPORT_SECTIONS, KPIS, KPI_AS_OF } from '@/lib/energy/kpis';
import { ENERGY_PAGES } from '@/lib/energy/pages';
import { REGISTRY, REGISTRY_STATUSES, REGISTRY_UPDATED } from '@/lib/energy/registry';
import { BENCHMARK_RECORD, RESEARCH } from '@/lib/energy/research';
import { AGENT_TOOLS, TOOL_REQUIREMENTS } from '@/lib/energy/tools';
import { DISCOVERY_QUESTIONS, PRIORITY_CUSTOMERS, WEDGES } from '@/lib/energy/wedge';
import { SITE_URL } from '@/lib/site';

/**
 * Machine-readable control surface. The same TypeScript constants the
 * pages render are served here as JSON, so an AI agent, a procurement
 * script or a researcher reads exactly what a human reads — no second
 * copy to drift. Read-only. No secrets, no tenant data, ever.
 *
 * GET /api/energy/index        → list of resources
 * GET /api/energy/<resource>   → the resource
 */

const RESOURCES = {
  index: () => ({
    cluster: 'energy',
    site: SITE_URL,
    updated: REGISTRY_UPDATED,
    resources: Object.keys(RESOURCES).filter((k) => k !== 'index').map((k) => ({ name: k, url: `${SITE_URL}/api/energy/${k}` })),
    pages: ENERGY_PAGES.map((p) => ({ path: p.path, label: p.label.en, api: p.api ? `${SITE_URL}/api/energy/${p.api}` : null })),
  }),
  clusters: () => ({ clusters: CLUSTERS, projectGates: PROJECT_GATES, rewardedFor: REWARDED_FOR, notRewardedFor: NOT_REWARDED_FOR, clusterMoveRecord: CLUSTER_MOVE_RECORD }),
  registry: () => ({ updated: REGISTRY_UPDATED, statuses: REGISTRY_STATUSES, count: REGISTRY.length, repositories: REGISTRY }),
  architecture: () => ({ product: PRODUCT_BRAND, modules: MODULES, safetyChain: SAFETY_CHAIN, separationTriggers: SEPARATION_TRIGGERS, primitives: PRIMITIVES }),
  tools: () => ({ requirements: TOOL_REQUIREMENTS, invariant: 'No tool writes a setpoint. request_authorization produces a signed request for NeuralBridge.', tools: AGENT_TOOLS }),
  kpis: () => ({ asOf: KPI_AS_OF, note: 'null means not measured', kpis: KPIS, ceoReportSections: CEO_REPORT_SECTIONS }),
  decisions: () => ({ decisions: DECISIONS, killList: KILL_LIST }),
  research: () => ({ benchmarkRecord: BENCHMARK_RECORD, topics: RESEARCH }),
  intelligence: () => ({ watch: WATCH, findings: FINDINGS }),
  wedge: () => ({ wedges: WEDGES, priorityCustomers: PRIORITY_CUSTOMERS, discoveryQuestions: DISCOVERY_QUESTIONS }),
} as const;

type Resource = keyof typeof RESOURCES;

export function generateStaticParams(): { resource: Resource }[] {
  return (Object.keys(RESOURCES) as Resource[]).map((resource) => ({ resource }));
}

export const dynamic = 'force-static';

export function GET(_req: Request, { params }: { params: { resource: string } }) {
  const key = params.resource as Resource;
  const build = RESOURCES[key];
  if (!build) {
    return NextResponse.json({ error: 'unknown_resource', resources: Object.keys(RESOURCES) }, { status: 404 });
  }
  return NextResponse.json(
    { '@context': `${SITE_URL}/energy`, resource: key, generated: REGISTRY_UPDATED, ...build() },
    { headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400', 'X-Robots-Tag': 'all' } },
  );
}

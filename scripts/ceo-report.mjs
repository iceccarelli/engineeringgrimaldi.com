#!/usr/bin/env node
/**
 * Weekly CEO report — generated, not written (D-013).
 *
 * Reads the control engine's own JSON (/api/energy/*) and writes exactly
 * the ten mandated sections to docs/energy/reports/YYYY-MM-DD.md.
 * Outcomes come from the constants. Two sections are for a human to fill
 * in the PR that this script's Action opens: DECISIONS (beyond what the
 * log already says) and NEXT 7 DAYS.
 *
 *   node scripts/ceo-report.mjs                       # against production
 *   BASE=http://localhost:3000 node scripts/ceo-report.mjs
 *
 * Node ≥ 18, no dependencies.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.env.BASE ?? 'https://engineeringgrimaldi.com';
const today = new Date().toISOString().slice(0, 10);

async function get(name) {
  const res = await fetch(`${BASE}/api/energy/${name}`, { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
  return res.json();
}

const [kpis, customers, registry, decisions, research, intel, wedge, arch] = await Promise.all(
  ['kpis', 'customers', 'registry', 'decisions', 'research', 'intelligence', 'wedge', 'architecture'].map(get),
);

const kpi = (id) => kpis.kpis.find((k) => k.id === id);
const val = (id) => { const k = kpi(id); return k == null ? 'n/a' : k.value === null ? 'not measured' : `${k.value} ${k.unit}`; };
const weekAgo = new Date(Date.now() - 7 * 86400e3).toISOString().slice(0, 10);
const recentDecisions = decisions.decisions.filter((d) => d.date >= weekAgo);
const recentKills = decisions.killList.filter((k) => k.date >= weekAgo);
const recentFindings = intel.findings.filter((f) => f.date >= weekAgo);
const counts = registry.repositories.reduce((m, r) => ((m[r.recommendedStatus] = (m[r.recommendedStatus] ?? 0) + 1), m), {});
const funnel = customers.funnel.map((f) => `${f.step}: ${f.actual} / ${f.target}`).join(' · ');
const benchmarked = research.topics.filter((t) => t.state === 'benchmarked').length;
const locked = arch.modules.filter((m) => m.state === 'missing').map((m) => m.name);
const wedgeA = wedge.wedges.find((w) => w.id === 'A');

const md = `# CEO report — Energy Intelligence — ${today}

Generated from ${BASE}/api/energy/* by scripts/ceo-report.mjs. Outcomes only.

## 1. MONEY
- Revenue: ${val('revenue')}
- Pipeline: ${val('pipeline')}
- Wedge A funnel: ${funnel}

## 2. CUSTOMERS
- Qualified (cost named by budget owner): ${val('qualified')}
- Pilots (paid trial): ${val('pilots')}
- Conversations recorded: ${customers.count}
- By segment: ${Object.entries(customers.bySegment).filter(([, n]) => n > 0).map(([s, n]) => `${s} ${n}`).join(', ') || 'none'}

## 3. PRODUCT
- Deployments: ${val('deployments')} · MW/assets connected: ${val('assets')}
- Wedge A (${wedgeA?.status ?? 'n/a'}): ${wedgeA?.name ?? ''}
- Build scope: ${wedgeA?.build?.join('; ') ?? ''}

## 4. TECHNOLOGY
- Forecast error: ${val('forecast-error')} · Optimization value: ${val('opt-value')}
- Latency: ${val('latency')} · Uptime: ${val('uptime')}
- Modules missing: ${locked.join(', ') || 'none'}

## 5. RESEARCH
- Benchmarks published with CI: ${val('benchmarks')} (topics benchmarked: ${benchmarked} / ${research.topics.length})
- ${research.topics.filter((t) => t.state !== 'watch').map((t) => `${t.topic} — ${t.state}`).join('\n- ')}

## 6. COMPETITION
${recentFindings.length ? recentFindings.map((f) => `- ${f.date} ${f.source}: ${f.whatChanged} → ${f.build || 'build nothing'}`).join('\n') : '- No findings logged this week (a finding must answer all six questions).'}

## 7. RISKS
- Security findings: ${val('security')} · Intervention rate: ${val('intervention')}
- Registry: ${Object.entries(counts).map(([s, n]) => `${s} ${n}`).join(' · ')}
- Unlocated repositories: ${registry.repositories.filter((r) => r.visibility === 'unlocated').map((r) => r.repository).join(', ') || 'none'}

## 8. DECISIONS
${recentDecisions.length ? recentDecisions.map((d) => `- ${d.id} (${d.status}${d.needsCeo ? ', CEO approval required' : ''}): ${d.title}`).join('\n') : '- None this week.'}
- _Human addendum (fill in PR):_

## 9. KILLED WORK
${recentKills.length ? recentKills.map((k) => `- ${k.what} — ${k.reason} (${k.decision})`).join('\n') : '- Nothing killed this week.'}

## 10. NEXT 7 DAYS
- _Human: three lines maximum, each ending in a number._
`;

const dir = join(process.cwd(), 'docs', 'energy', 'reports');
mkdirSync(dir, { recursive: true });
const file = join(dir, `${today}.md`);
writeFileSync(file, md);
console.log(`wrote ${file}`);

/**
 * The /energy tree. nav.ts, the section sub-navigation, the sitemap and the
 * JSON index all read this list, so a page cannot exist without being
 * discoverable — and nothing is linked that does not exist.
 */

import type { Localized } from '../i18n';

export type EnergyPage = {
  path: string;
  slug: string;
  label: Localized;
  blurb: Localized;
  /** JSON resource name under /api/energy/, if the page has one. */
  api?: string;
  group: 'control' | 'architecture' | 'execution';
};

export const ENERGY_ROOT = '/energy';

export const ENERGY_PAGES: readonly EnergyPage[] = [
  { path: '/energy/registry', slug: 'registry', group: 'control', api: 'registry',
    label: { en: 'Repository registry', de: 'Repository-Register' },
    blurb: { en: 'Every repository, its evidence, and one of six statuses.', de: 'Jedes Repository, seine Evidenz und einer von sechs Status.' } },
  { path: '/energy/decisions', slug: 'decisions', group: 'control', api: 'decisions',
    label: { en: 'Decision log & kill list', de: 'Entscheidungslog & Kill-Liste' },
    blurb: { en: 'Append-only. What was decided, why, and what was killed.', de: 'Nur anhängend. Was entschieden wurde, warum, und was gestrichen wurde.' } },
  { path: '/energy/customers', slug: 'customers', group: 'control', api: 'customers',
    label: { en: 'Customer evidence', de: 'Kundenevidenz' },
    blurb: { en: 'Every conversation, anonymised. The funnel is derived from this list, never typed.', de: 'Jedes Gespräch, anonymisiert. Der Trichter wird aus dieser Liste abgeleitet, nie getippt.' } },
  { path: '/energy/kpis', slug: 'kpis', group: 'control', api: 'kpis',
    label: { en: 'KPIs & CEO report', de: 'KPIs & CEO-Report' },
    blurb: { en: 'Thirteen numbers, their sources, and "not measured" where true.', de: 'Dreizehn Zahlen, ihre Quellen und „nicht gemessen“, wo es zutrifft.' } },
  { path: '/energy/architecture', slug: 'architecture', group: 'architecture', api: 'architecture',
    label: { en: 'Target architecture', de: 'Zielarchitektur' },
    blurb: { en: 'GridOS and its nine modules; the shared primitives and why each exists.', de: 'GridOS und seine neun Module; die gemeinsamen Primitive und ihr Daseinsgrund.' } },
  { path: '/energy/safety', slug: 'safety', group: 'architecture',
    label: { en: 'Safety boundary', de: 'Sicherheitsgrenze' },
    blurb: { en: 'The ten-stage chain between an agent and an actuator. Never bypassed.', de: 'Die zehnstufige Kette zwischen Agent und Aktor. Nie umgangen.' } },
  { path: '/energy/agent-tools', slug: 'agent-tools', group: 'architecture', api: 'tools',
    label: { en: 'Agent tool contracts', de: 'Agent-Tool-Verträge' },
    blurb: { en: 'Thirteen tools with schema, scope, timeout and failure behaviour.', de: 'Dreizehn Tools mit Schema, Scope, Timeout und Fehlerverhalten.' } },
  { path: '/energy/wedge', slug: 'wedge', group: 'execution', api: 'wedge',
    label: { en: 'Commercial wedge', de: 'Kommerzieller Wedge' },
    blurb: { en: 'One paid customer first. Three candidates, one proposed.', de: 'Zuerst ein zahlender Kunde. Drei Kandidaten, einer vorgeschlagen.' } },
  { path: '/energy/research', slug: 'research', group: 'execution', api: 'research',
    label: { en: 'Research frontier', de: 'Forschungsfront' },
    blurb: { en: 'Topics, benchmarks and the word "unbenchmarked" where it applies.', de: 'Themen, Benchmarks und das Wort „unbenchmarked“, wo es zutrifft.' } },
  { path: '/energy/intelligence', slug: 'intelligence', group: 'execution', api: 'intelligence',
    label: { en: 'External intelligence', de: 'Externe Intelligenz' },
    blurb: { en: 'Primary sources watched; findings that answer six questions.', de: 'Beobachtete Primärquellen; Erkenntnisse, die sechs Fragen beantworten.' } },
] as const;

export const ENERGY_GROUP_LABEL: Record<EnergyPage['group'], Localized> = {
  control: { en: 'Control', de: 'Steuerung' },
  architecture: { en: 'Architecture', de: 'Architektur' },
  execution: { en: 'Execution', de: 'Umsetzung' },
};

export function energyPage(slug: string): EnergyPage | undefined {
  return ENERGY_PAGES.find((p) => p.slug === slug);
}

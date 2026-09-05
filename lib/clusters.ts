/**
 * THE GROUP CONSTITUTION, AS DATA.
 *
 * engineeringgrimaldi.com is the control engine for the Grimaldi Engineering
 * cluster of ventures. There are exactly three strategic clusters. No page,
 * registry entry or agent may create a fourth. This file is the only place
 * the clusters are declared; everything that renders a cluster reads it.
 *
 * Cluster 1 (Energy Intelligence) is the primary cluster of this site and
 * owns the /energy tree. Cluster 2 keeps its existing product surface
 * (/palletizer, /integrators, /docs, /tools) unchanged. Cluster 3 lives on
 * its own domains and is only referenced here.
 */

import type { Localized } from './i18n';

export type ClusterId = 'energy' | 'physical-ai' | 'operations';

export type Cluster = {
  id: ClusterId;
  /** 1-based order of display and of resource priority. */
  order: 1 | 2 | 3;
  name: Localized;
  /** The one-line mission the CEO layer judges the cluster by. */
  mission: Localized;
  /** The progression the cluster's software follows. */
  progression: string[];
  /** Where the cluster is controlled from. Internal path or external URL. */
  controlPath: string;
  external: boolean;
  /** What the cluster is judged by — outcomes, never activity. */
  judgedBy: string[];
  status: Localized;
};

export const CLUSTERS: readonly Cluster[] = [
  {
    id: 'energy',
    order: 1,
    name: { en: 'Energy Intelligence', de: 'Energy Intelligence' },
    mission: {
      en: 'Create the highest-value deep-tech company: software that observes, predicts, simulates, optimizes, coordinates and — behind a deterministic safety boundary — controls distributed energy infrastructure.',
      de: 'Das wertvollste Deep-Tech-Unternehmen aufbauen: Software, die verteilte Energieinfrastruktur beobachtet, prognostiziert, simuliert, optimiert, koordiniert und — hinter einer deterministischen Sicherheitsgrenze — steuert.',
    },
    progression: ['OBSERVE', 'PREDICT', 'SIMULATE', 'OPTIMIZE', 'RECOMMEND', 'AUTHORIZE', 'EXECUTE'],
    controlPath: '/energy',
    external: false,
    judgedBy: ['customers', 'revenue', 'deployments', 'technical moat', 'research quality'],
    status: {
      en: 'Consolidating. Registry live, target architecture fixed, wedge proposed, zero paid customers.',
      de: 'Konsolidierung. Register live, Zielarchitektur festgelegt, Wedge vorgeschlagen, null zahlende Kunden.',
    },
  },
  {
    id: 'physical-ai',
    order: 2,
    name: { en: 'Physical AI & Robotics', de: 'Physical AI & Robotik' },
    mission: {
      en: 'Prove whether physical autonomy can create a defensible second moat. First candidate: robot-agnostic mixed-SKU palletizing.',
      de: 'Beweisen, ob physische Autonomie einen zweiten verteidigbaren Graben schaffen kann. Erster Kandidat: roboterunabhängiges Mixed-SKU-Palettieren.',
    },
    progression: ['PERCEIVE', 'MODEL', 'PLAN', 'ACT', 'VERIFY', 'RECOVER', 'LEARN'],
    controlPath: '/palletizer',
    external: false,
    judgedBy: ['customer signal', 'robot performance', 'benchmark results', 'ROI'],
    status: {
      en: 'Software shipped, cell not commissioned. Product surface unchanged by the energy migration.',
      de: 'Software ausgeliefert, Zelle nicht in Betrieb genommen. Produktoberfläche von der Energie-Migration unberührt.',
    },
  },
  {
    id: 'operations',
    order: 3,
    name: { en: 'Operations & Commercial Automation', de: 'Operations & Commercial Automation' },
    mission: {
      en: 'Make money and build distribution. Revenue first; platform only after repeated customer evidence.',
      de: 'Geld verdienen und Distribution aufbauen. Umsatz zuerst; Plattform erst nach wiederholter Kundenevidenz.',
    },
    progression: ['LEAD', 'ESTIMATE', 'QUOTE', 'SCHEDULE', 'JOB', 'DOCUMENT', 'INVOICE', 'PAYMENT'],
    controlPath: 'https://igrimaldi.engineering/',
    external: true,
    judgedBy: ['revenue', 'retention', 'gross margin', 'CAC payback'],
    status: {
      en: 'Runs on its own domains. Referenced here, not controlled here.',
      de: 'Läuft auf eigenen Domains. Hier referenziert, nicht gesteuert.',
    },
  },
] as const;

export function clusterById(id: ClusterId): Cluster {
  const c = CLUSTERS.find((x) => x.id === id);
  if (!c) throw new Error(`unknown cluster ${id}`);
  return c;
}

/** The seven gates every proposed project must pass. Fail two → ARCHIVE. */
export const PROJECT_GATES = [
  'CUSTOMER PAIN',
  'BUYER',
  'MONEY',
  'DIFFERENTIATION',
  'TECHNICAL FEASIBILITY',
  'STRATEGIC FIT',
  'EXECUTION COST',
] as const;

/** What an agent is — and is not — rewarded for. Rendered verbatim. */
export const REWARDED_FOR = [
  'revenue', 'customers', 'deployments', 'measurable ROI', 'technical benchmarks',
  'proprietary IP', 'research quality', 'reduced engineering complexity',
] as const;
export const NOT_REWARDED_FOR = [
  'number of commits', 'number of repositories', 'lines of code', 'number of features', 'architectural complexity',
] as const;

/** Moving a repository between clusters requires all of these on record. */
export const CLUSTER_MOVE_RECORD = [
  'reason', 'commercial benefit', 'technical benefit', 'migration cost', 'dependency impact', 'CEO approval',
] as const;

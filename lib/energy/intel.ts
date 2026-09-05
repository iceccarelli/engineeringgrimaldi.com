/**
 * EXTERNAL INTELLIGENCE LAYER. A watch list of primary sources and a log
 * of findings. A finding is not a link: it answers six questions. The log
 * starts empty on purpose — an empty log is more honest than a pasted
 * news feed.
 */

export type WatchSource = { name: string; url: string; why: string; group: 'standards' | 'regulation' | 'market' | 'research' | 'competition' };

export const WATCH: readonly WatchSource[] = [
  { name: 'IEC (TC 57, TC 65)', url: 'https://www.iec.ch/', why: 'CIM (61970/61968), 61850, 62443 — the schemas and security zones the twin and DERIM follow.', group: 'standards' },
  { name: 'IEEE PES', url: 'https://ieee-pes.org/', why: 'Benchmarks, test cases, standards for DER interconnection (1547).', group: 'standards' },
  { name: 'ENTSO-E', url: 'https://www.entsoe.eu/', why: 'Grid codes, transparency platform (forecast baselines), system-inertia work.', group: 'regulation' },
  { name: 'ACER', url: 'https://www.acer.europa.eu/', why: 'EU market rules, flexibility market design.', group: 'regulation' },
  { name: 'European Commission — Energy', url: 'https://energy.ec.europa.eu/', why: 'Network-code amendments, demand response, EU grid action plan.', group: 'regulation' },
  { name: 'Bundesnetzagentur', url: 'https://www.bundesnetzagentur.de/', why: '§14a EnWG steuerbare Verbrauchseinrichtungen, Mieterstrom, Festlegungen.', group: 'regulation' },
  { name: 'NIS2 / CRA / AI Act (EUR-Lex)', url: 'https://eur-lex.europa.eu/', why: 'Obligations for essential entities, products with digital elements, and AI in critical infrastructure.', group: 'regulation' },
  { name: 'BDEW / VDE FNN', url: 'https://www.vde.com/de/fnn', why: 'VDE-AR-N 4105/4110 — device behaviour DERIM must respect.', group: 'standards' },
  { name: 'TED — EU tenders', url: 'https://ted.europa.eu/', why: 'Utility and Stadtwerke software tenders: what they actually buy.', group: 'market' },
  { name: 'arXiv eess.SY / cs.LG', url: 'https://arxiv.org/list/eess.SY/recent', why: 'OPF learning, PINNs, safe RL, forecasting — reproduce before believing.', group: 'research' },
  { name: 'DERMS / flexibility competitors', url: 'https://www.google.com/search?q=DERMS+vendor', why: 'What incumbents ship and price; acquisitions; funding rounds.', group: 'competition' },
  { name: 'GitHub — pandapower, PyPSA, GridCal, OpenDSS', url: 'https://github.com/e2nIEE/pandapower', why: 'Open baselines every claim is compared against.', group: 'competition' },
] as const;

export type Finding = {
  date: string;
  source: string;
  whatChanged: string;
  whyItMatters: string;
  affects: string;
  build: string;
  doNotBuild: string;
  contact: string;
};

export const FINDINGS: readonly Finding[] = [] as const;

export const FINDING_QUESTIONS = [
  'WHAT CHANGED?', 'WHY DOES IT MATTER?', 'WHICH PRODUCT DOES IT AFFECT?',
  'WHAT SHOULD WE BUILD?', 'WHAT SHOULD WE NOT BUILD?', 'WHAT CUSTOMER SHOULD WE CONTACT?',
] as const;

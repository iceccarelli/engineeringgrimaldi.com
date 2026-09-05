import type { Metadata } from 'next';
import EnergyShell, { Status } from '@/components/EnergyShell';
import { energyPage } from '@/lib/energy/pages';
import { ENERGY_KICKER, energyMetadata, langOf } from '@/lib/energy/seo';
import { AGENT_TOOLS, TOOL_REQUIREMENTS } from '@/lib/energy/tools';

type PageProps = { params: { lang: string } };
const PAGE = energyPage('agent-tools')!;

const COPY = {
  en: {
    lead: 'Agents reach infrastructure only through these tools. No tool writes a setpoint. Every tool carries the nine requirements below; "specified" means the contract is fixed and the implementation does not exist yet.',
    reqH2: 'Every tool must have',
    toolsH2: 'Tools',
    effect: 'Side effect', scope: 'Scope', timeout: 'Timeout', input: 'Input', output: 'Output', validation: 'Validation', failure: 'On failure', module: 'Module',
  },
  de: {
    lead: 'Agenten erreichen Infrastruktur nur über diese Tools. Kein Tool schreibt einen Sollwert. Jedes Tool trägt die neun Anforderungen unten; „specified“ heißt: Vertrag fixiert, Implementierung existiert noch nicht.',
    reqH2: 'Jedes Tool braucht',
    toolsH2: 'Tools',
    effect: 'Seiteneffekt', scope: 'Scope', timeout: 'Timeout', input: 'Eingabe', output: 'Ausgabe', validation: 'Validierung', failure: 'Bei Fehler', module: 'Modul',
  },
} as const;

export function generateMetadata({ params }: PageProps): Metadata {
  return energyMetadata(langOf(params), PAGE);
}

export default function AgentToolsPage({ params }: PageProps) {
  const lang = langOf(params);
  const c = COPY[lang];
  return (
    <EnergyShell lang={lang} path={PAGE.path} kicker={ENERGY_KICKER} h1={PAGE.label[lang]} lead={c.lead} api={PAGE.api}>
      <section className="index-group">
        <h2>{c.reqH2}</h2>
        <p className="energy-chips">{TOOL_REQUIREMENTS.map((r) => <span className="chip" key={r}>{r}</span>)}</p>
      </section>
      <section className="index-group">
        <h2>{c.toolsH2}</h2>
        <div className="grid grid-2">
          {AGENT_TOOLS.map((t) => (
            <article className="card energy-tool" key={t.name} id={t.name}>
              <h3><code>{t.name}()</code></h3>
              <p>{t.purpose}</p>
              <dl className="defs">
                <dt>{c.effect}</dt><dd><Status value={t.sideEffect} /> · <Status value={t.status} /></dd>
                <dt>{c.scope}</dt><dd><code>{t.scope}</code></dd>
                <dt>{c.timeout}</dt><dd><code>{t.timeoutMs} ms</code></dd>
                <dt>{c.input}</dt><dd><code>{t.input}</code></dd>
                <dt>{c.output}</dt><dd><code>{t.output}</code></dd>
                <dt>{c.validation}</dt><dd>{t.validation}</dd>
                <dt>{c.failure}</dt><dd>{t.onFailure}</dd>
                <dt>{c.module}</dt><dd>{t.module}</dd>
              </dl>
            </article>
          ))}
        </div>
      </section>
    </EnergyShell>
  );
}

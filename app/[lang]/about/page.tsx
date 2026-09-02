import type { Metadata } from 'next';
import BookCTA from '@/components/BookCTA';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import { getDict } from '@/lib/dict';
import { isLang, langHref, pageAlternates, type Lang } from '@/lib/i18n';
import { ogImages } from '@/lib/meta';
import { personSchema } from '@/lib/schema';
import { SAME_AS } from '@/lib/site';

/**
 * The page someone lands on from LinkedIn to answer one question: is this
 * person real and worth twenty minutes?
 *
 * Every claim here is either verifiable by clicking a link on this page,
 * or is stated as an intention rather than an achievement. Fields only the
 * operator can supply are marked TODO in the source rather than filled
 * with something plausible.
 */

type PageProps = { params: { lang: string } };

const COPY = {
  en: {
    title: 'About — Vincenzo Ceccarelli Grimaldi',
    description:
      'Frankfurt-based engineer working on electrical machines, battery systems, high voltage and the software that controls them. What is published, what is claimed, and what is deliberately not.',
    kicker: 'Grimaldi Engineering · Frankfurt am Main',
    h1: 'About',
    lead: 'Grimaldi Engineering is the working surface of one engineer: Vincenzo Ceccarelli Grimaldi, based in Frankfurt am Main, working across electrical machines and actuators, battery systems, high voltage and power electronics, and the control software that connects them to real hardware.',
    whatH2: 'What this site actually is',
    what: [
      'A working surface, not a brochure. Six calculators run real physics in your browser: rectangle packing for pallet and vehicle loading, rigid-body dynamics with gearbox reflection for axis sizing, series-parallel topology and duty for battery packs, and dead-time and phase-budget arithmetic for control loops. Each one was checked against hand calculations or textbook values before it was published, and each one names what it does not model.',
      'The reference tables cite their sources on the page. The container pallet counts are not copied from a chart — they are produced by the same solver that powers the load calculator, and a test asserts they match.',
    ],
    honestH2: 'What is not claimed',
    honest: [
      'No customers are named, because none have agreed to be. No case studies, no logos, no testimonials, and no throughput numbers from installations that would have to be described to be credible.',
      'Of the four Forge products, only Palletizer has a public repository and a live optimizer you can open. FloorForge, PaintForge and DryForge are public repositories in active development and are labelled exactly that on every page they appear.',
      'The hardware build logs are in preparation. Until the first one ships with instrument captures, every discipline page says so rather than implying a body of published work that does not exist yet.',
    ],
    boundariesH2: 'Boundaries held on purpose',
    boundaries: [
      'Nothing on this site describes employer systems, operator installations or critical-infrastructure configurations. High-voltage content is generic engineering or explicitly cleared material. This is not a limitation to apologise for — it is the reason the content can be published at all.',
      'No safety-function design is offered or implied. An AI agent may interpret, propose and explain; it may not close a cycle-time-critical loop and may never implement a safety function. Safety-rated stopping, monitoring and interlocks belong on qualified hardware under their own standards.',
    ],
    backgroundH2: 'Background',
    background:
      'High-voltage engineering work on German rail infrastructure, and a 2025 RWTH Aachen M.Sc. thesis whose interactive CIM–ThreMA cross-domain ontology simulator is publicly deployed and linked below. Further detail on roles and dates lives on LinkedIn rather than being restated here.',
    linksH2: 'Verify any of it',
    workH2: 'How to work together',
    workBody:
      'A twenty-minute bench review costs nothing and is the honest way to find out whether a problem is one I can help with. If it is not, you will hear that on the call rather than in a proposal.',
    todo: 'Operator note: add a short line on years of practice and current focus if you want it here — this page deliberately contains no unverifiable claim.',
  },
  de: {
    title: 'Über — Vincenzo Ceccarelli Grimaldi',
    description:
      'Ingenieur aus Frankfurt für elektrische Maschinen, Batteriesysteme, Hochspannung und die Software, die sie steuert. Was veröffentlicht ist, was behauptet wird und was bewusst nicht.',
    kicker: 'Grimaldi Engineering · Frankfurt am Main',
    h1: 'Über',
    lead: 'Grimaldi Engineering ist die Arbeitsfläche eines Ingenieurs: Vincenzo Ceccarelli Grimaldi, Frankfurt am Main, tätig in elektrischen Maschinen und Aktorik, Batteriesystemen, Hochspannung und Leistungselektronik sowie in der Regelungssoftware, die beides mit echter Hardware verbindet.',
    whatH2: 'Was diese Seite tatsächlich ist',
    what: [
      'Eine Arbeitsfläche, kein Prospekt. Sechs Rechner führen echte Physik im Browser aus: Rechteckpackung für Paletten- und Fahrzeugbeladung, Starrkörperdynamik mit Getriebereduktion für die Achsenauslegung, Reihen-Parallel-Topologie und Belastung für Batteriepacks sowie Totzeit- und Phasenbudget-Arithmetik für Regelkreise. Jeder wurde vor der Veröffentlichung gegen Handrechnungen oder Lehrbuchwerte geprüft, und jeder nennt, was er nicht modelliert.',
      'Die Referenztabellen nennen ihre Quellen auf der Seite. Die Palettenzahlen je Container sind nicht abgeschrieben — sie stammen aus demselben Löser, der den Laderechner antreibt, und ein Test prüft die Übereinstimmung.',
    ],
    honestH2: 'Was nicht behauptet wird',
    honest: [
      'Es werden keine Kunden genannt, weil keiner zugestimmt hat. Keine Fallstudien, keine Logos, keine Referenzzitate und keine Durchsatzzahlen aus Anlagen, die man beschreiben müsste, um glaubwürdig zu sein.',
      'Von den vier Forge-Produkten hat allein Palletizer ein öffentliches Repository und einen Optimierer, den Sie sofort öffnen können. FloorForge, PaintForge und DryForge sind öffentliche Repositories in aktiver Entwicklung — und genau so sind sie auf jeder Seite gekennzeichnet.',
      'Die Hardware-Baujournale sind in Vorbereitung. Bis das erste mit Instrumenten-Messungen erscheint, sagt jede Disziplinseite genau das, statt ein Werk zu suggerieren, das es noch nicht gibt.',
    ],
    boundariesH2: 'Bewusst gehaltene Grenzen',
    boundaries: [
      'Nichts auf dieser Seite beschreibt Arbeitgebersysteme, Betreiberanlagen oder KRITIS-Konfigurationen. Hochspannungsinhalte sind generische Ingenieursarbeit oder ausdrücklich freigegebenes Material. Das ist keine Einschränkung, für die man sich entschuldigt — es ist der Grund, warum die Inhalte überhaupt veröffentlicht werden können.',
      'Es wird keine Auslegung von Sicherheitsfunktionen angeboten oder suggeriert. Ein KI-Agent darf interpretieren, vorschlagen und erklären; er darf keinen zykluszeitkritischen Regelkreis schließen und niemals eine Sicherheitsfunktion umsetzen. Sicherheitsgerichtetes Stillsetzen, Überwachung und Verriegelungen gehören auf qualifizierte Hardware nach eigenen Normen.',
    ],
    backgroundH2: 'Hintergrund',
    background:
      'Hochspannungstechnik an deutscher Bahninfrastruktur sowie eine RWTH-Aachen-Masterarbeit von 2025, deren interaktiver CIM–ThreMA-Ontologie-Simulator öffentlich deployt und unten verlinkt ist. Weitere Angaben zu Rollen und Zeiträumen stehen auf LinkedIn statt hier wiederholt zu werden.',
    linksH2: 'Alles nachprüfbar',
    workH2: 'Zusammenarbeit',
    workBody:
      'Ein zwanzigminütiges Bench-Review kostet nichts und ist der ehrliche Weg herauszufinden, ob ich bei einem Problem helfen kann. Wenn nicht, hören Sie das im Gespräch und nicht in einem Angebot.',
    todo: 'Hinweis für den Betreiber: Ergänzen Sie hier bei Bedarf eine Zeile zu Praxisjahren und aktuellem Fokus — diese Seite enthält bewusst keine nicht überprüfbare Aussage.',
  },
} as const;

const LINKS: { label: string; url: string }[] = [
  { label: 'GitHub — iceccarelli', url: 'https://github.com/iceccarelli' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/vincenzo-ceccarelli-grimaldi-2912b42a0' },
  { label: 'igrimaldi.engineering — software & AI portfolio', url: 'https://igrimaldi.engineering/' },
  { label: 'CIM–ThreMA thesis simulator', url: 'https://physics-informed.vercel.app/' },
  { label: 'grimaldi.ca — personal', url: 'https://grimaldi.ca/' },
];

export function generateMetadata({ params }: PageProps): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  return {
    title: COPY[lang].title,
    description: COPY[lang].description,
    alternates: pageAlternates(lang, '/about'),
    robots: { index: false, follow: true },
    openGraph: {
      title: COPY[lang].title,
      description: COPY[lang].description,
      type: 'profile',
      images: ogImages('Vincenzo Ceccarelli Grimaldi', COPY[lang].kicker),
    },
    twitter: { card: 'summary_large_image', images: ogImages('Vincenzo Ceccarelli Grimaldi', COPY[lang].kicker) },
  };
}

export default function AboutPage({ params }: PageProps) {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const t = getDict(lang);
  const copy = COPY[lang];

  return (
    <main>
      <div className="sheet sheet-top">
        <div className="section">
          <Breadcrumbs lang={lang} crumbs={[
            { name: 'Grimaldi Engineering', path: '/' },
            { name: copy.h1, path: '/about' },
          ]} />
          <span className="kicker">{copy.kicker}</span>
          <h1>{copy.h1}</h1>
          <p className="intro">{copy.lead}</p>

          <div className="prose">
            <h2>{copy.whatH2}</h2>
            {copy.what.map((p) => <p key={p.slice(0, 40)}>{p}</p>)}

            <h2>{copy.honestH2}</h2>
            {copy.honest.map((p) => <p key={p.slice(0, 40)}>{p}</p>)}

            <h2>{copy.boundariesH2}</h2>
            {copy.boundaries.map((p) => <p key={p.slice(0, 40)} className="boundary-note">{p}</p>)}

            <h2>{copy.backgroundH2}</h2>
            <p>{copy.background}</p>
            {/* TODO(operator): optional line on years of practice / current focus. */}

            <h2>{copy.linksH2}</h2>
            <ul>
              {LINKS.map((l) => (
                <li key={l.url}><a href={l.url} rel="noopener noreferrer">{l.label}</a></li>
              ))}
            </ul>

            <h2>{copy.workH2}</h2>
            <p>{copy.workBody}</p>
          </div>

          <div className="cta-row">
            <BookCTA label={t.ctaBook} lang={lang} />
            <a className="btn btn-line" href={langHref(lang, '/pricing')}>
              {lang === 'de' ? 'Preise ansehen →' : 'See pricing →'}
            </a>
          </div>

          <p className="author-block">{t.authorLine}</p>
        </div>
      </div>

      <JsonLd data={{ ...personSchema(), sameAs: [...SAME_AS] }} />
    </main>
  );
}

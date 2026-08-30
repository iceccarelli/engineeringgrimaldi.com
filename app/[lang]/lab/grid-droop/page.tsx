import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import Oscilloscope from '@/components/Oscilloscope';
import { getDict } from '@/lib/dict';
import { isLang, pageAlternates, type Lang } from '@/lib/i18n';
import { breadcrumbSchema } from '@/lib/schema';

/**
 * The droop instrument at a dedicated URL. The page is a server
 * component: the physics — formulas and explanation — is server-rendered
 * text a crawler reads with zero JavaScript. The drag UI (Oscilloscope)
 * is the only client island and hydrates on top.
 */

type PageProps = { params: { lang: string } };

export function generateMetadata({ params }: PageProps): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  return {
    title:
      lang === 'de'
        ? 'Netzfrequenz-Statik-Simulator — physikbasiert, interaktiv'
        : 'Grid Frequency Droop Simulator — Physics-Informed, Interactive',
    description:
      lang === 'de'
        ? 'Interaktiver Netzfrequenz-Simulator mit echtem Statik-Modell: Δf = −f·0,04·ΔP, RoCoF durch Trägheit H begrenzt. Drei Phasen bei 50 Hz, Anzeigen aus dem Integrator.'
        : 'Interactive grid-frequency simulator driven by a real droop model: Δf = −f·0.04·ΔP with RoCoF bounded by inertia H. Three phases at 50 Hz, readouts from the integrator.',
    alternates: pageAlternates(lang, '/lab/grid-droop'),
  };
}

export default function GridDroopPage({ params }: PageProps) {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const t = getDict(lang);

  return (
    <main>
      <div className="sheet sheet-top">
        <div className="section">
          <span className="kicker">{t.labKicker}</span>
          <h1>{t.labTitle}</h1>

          {/* SSR fallback: the physics as crawlable text — rendered whether
              or not JavaScript ever loads. */}
          <div className="prose">
            <p>
              {lang === 'de'
                ? 'Ein synchrones Netz hält seine Frequenz über das Gleichgewicht von Erzeugung und Last. Steigt die Last über die Erzeugung, sinkt die Frequenz entlang der Statik-Kennlinie:'
                : 'A synchronous grid holds its frequency through the balance of generation and load. When load exceeds generation, frequency falls along the droop characteristic:'}
            </p>
            <p className="formula">Δf = −f<sub>n</sub> · 0.04 · ΔP</p>
            <p>
              {lang === 'de'
                ? 'Wie schnell sie fällt, begrenzt die Systemträgheit H (RoCoF — Rate of Change of Frequency):'
                : 'How fast it falls is bounded by system inertia H (RoCoF — rate of change of frequency):'}
            </p>
            <p className="formula">|df/dt| ≤ f<sub>n</sub> · ΔP / (2H)</p>
            <p>
              {lang === 'de'
                ? 'Das Instrument unten integriert genau diese beiden Gleichungen. Ziehen Sie die Last über die Erzeugung und die Frequenz sackt mit einer Rate, die H setzt — die Anzeigen kommen aus dem Integrator, nicht aus einer Animation. Niedrige Trägheit (viele Umrichter, wenige rotierende Massen) ist der Grund, warum moderne Netze schnelle Leistungselektronik brauchen.'
                : 'The instrument below integrates exactly these two equations. Drag the load above generation and the frequency sags at a rate set by H — the readouts come out of the integrator, not a canned animation. Low inertia (many inverters, few rotating masses) is why modern grids need fast power electronics.'}
            </p>
          </div>

          <Oscilloscope
            labels={{
              phases: lang === 'de' ? 'L1 · L2 · L3 — 230-V-Phasenspannungen' : 'L1 · L2 · L3 — 230 V phase voltages',
              freq: lang === 'de' ? 'Frequenz' : 'Frequency',
              rocof: 'RoCoF',
              load: lang === 'de' ? 'Systemlast' : 'System load',
              inertia: lang === 'de' ? 'Trägheit H' : 'Inertia H',
            }}
          />
          <noscript>
            <p className="prose">
              {lang === 'de'
                ? 'Das interaktive Instrument benötigt JavaScript; die Physik oben gilt ohne.'
                : 'The interactive instrument needs JavaScript; the physics above stands without it.'}
            </p>
          </noscript>

          <p className="author-block">{t.authorLine}</p>
        </div>
      </div>
      <JsonLd
        data={breadcrumbSchema(lang, [
          { name: 'Grimaldi Engineering', path: '/' },
          { name: 'Lab', path: '/lab' },
          { name: lang === 'de' ? 'Netzfrequenz-Statik' : 'Grid droop', path: '/lab/grid-droop' },
        ])}
      />
    </main>
  );
}

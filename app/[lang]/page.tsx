import type { Metadata } from 'next';
import IntakeForm from '@/components/IntakeForm';
import JsonLd from '@/components/JsonLd';
import StackPlanner from '@/components/StackPlanner';
import { getDict } from '@/lib/dict';
import { INTAKE_LABELS, PLANNER_LABELS } from '@/lib/labels';
import { isLang, langHref, pageAlternates, type Lang } from '@/lib/i18n';
import { ogImages } from '@/lib/meta';
import { professionalServiceSchema } from '@/lib/schema';
import { PRODUCT_REPO, SITE_URL } from '@/lib/site';

/**
 * Home, top to bottom: kicker · H1 · physics line · the live planner with
 * the sample already stacked · honesty line · three doors · intake.
 * No price, no calendar, no newsletter. The tool is the store.
 */

type PageProps = { params: { lang: string } };

const COPY = {
  en: {
    physics: 'Density, stability and cycle time from your real SKU list. Robot-agnostic planner; the arm stays yours.',
    honestyA: 'software shipped',
    honestyB: 'cell not commissioned',
    honestyC: 'UR URScript stub ships · FANUC / KUKA / ABB planned',
    doorsH2: 'Three doors',
    doors: [
      { kicker: 'Plant', h3: 'You palletize mixed SKUs', p: 'Drop the list above. If the stack holds, send it below and get the unstable SKUs named.', cta: 'Product →', path: '/palletizer' },
      { kicker: 'Integrator', h3: 'You build the cell', p: 'You keep CE, fence, service and the customer. You get the planner, the state-machine doc, a gripper class and an acceptance test.', cta: 'Integrators →', path: '/integrators' },
      { kicker: 'Tools', h3: 'You need a number today', p: 'Pallet pattern, case size, truck load. Browser only, CSV out, no sign-up.', cta: 'Tools →', path: '/tools' },
    ],
    intakeH2: 'Send the SKU list',
    intakeLead: 'Company, city, robot brand, the file. You get a stack and the unstable SKUs back.',
    source: 'Source',
  },
  de: {
    physics: 'Dichte, Stabilität und Taktzeit aus Ihrer echten SKU-Liste. Roboterunabhängiger Planer; der Arm bleibt Ihrer.',
    honestyA: 'Software ausgeliefert',
    honestyB: 'Zelle nicht in Betrieb genommen',
    honestyC: 'UR-URScript-Stub verfügbar · FANUC / KUKA / ABB geplant',
    doorsH2: 'Drei Türen',
    doors: [
      { kicker: 'Werk', h3: 'Sie palettieren Misch-SKUs', p: 'Liste oben einfügen. Hält der Stapel, unten senden — Sie erhalten die instabilen SKUs benannt.', cta: 'Produkt →', path: '/palletizer' },
      { kicker: 'Integrator', h3: 'Sie bauen die Zelle', p: 'Sie behalten CE, Zaun, Service und den Kunden. Sie erhalten Planer, Zustandsautomat-Dokumentation, Greiferklasse und Abnahmetest.', cta: 'Integratoren →', path: '/integrators' },
      { kicker: 'Werkzeuge', h3: 'Sie brauchen heute eine Zahl', p: 'Palettenmuster, Kartongröße, Lkw-Ladung. Nur im Browser, CSV-Export, ohne Anmeldung.', cta: 'Werkzeuge →', path: '/tools' },
    ],
    intakeH2: 'SKU-Liste senden',
    intakeLead: 'Firma, Stadt, Robotermarke, die Datei. Sie erhalten einen Stapel und die instabilen SKUs zurück.',
    source: 'Quellcode',
  },
} as const;

export function generateMetadata({ params }: PageProps): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const t = getDict(lang);
  const description = lang === 'de'
    ? 'Mixed-SKU-Palettiersoftware aus Frankfurt: SKU-Liste einfügen, Stapel, Stabilität und Dichte lesen, URScript-Stub exportieren. Für UR, FANUC, KUKA, ABB — der Roboter bleibt Ihrer.'
    : 'Mixed-SKU palletizing software from Frankfurt: paste a SKU list, read the stack, stability and density, export a URScript stub. For UR, FANUC, KUKA, ABB — the robot stays yours.';
  return {
    title: { absolute: `${t.homeH1} | Grimaldi Engineering` },
    description,
    alternates: pageAlternates(lang, '/'),
    openGraph: { title: t.homeH1, description, images: ogImages(t.homeH1, 'Palletizing software · Frankfurt') },
    twitter: { card: 'summary_large_image', title: t.homeH1, description, images: ogImages(t.homeH1, 'Palletizing software · Frankfurt') },
  };
}

export default function Home({ params }: PageProps) {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const t = getDict(lang);
  const copy = COPY[lang];
  const href = (path: string) => langHref(lang, path);

  return (
    <main>
      <section className="hero">
        <div className="hero-in">
          <div className="hero-card">
            <span className="kicker kicker-signal">{t.homeKicker}</span>
            <h1>{t.homeH1}</h1>
            <p className="lead">{copy.physics}</p>
          </div>
          <StackPlanner labels={PLANNER_LABELS[lang]} lang={lang} compact />
          <p className="honesty" role="note">
            <span className="chip chip-live">{copy.honestyA}</span>
            <span className="sep">|</span>
            <span className="chip chip-hold">{copy.honestyB}</span>
            <span className="sep">|</span>
            <span>{copy.honestyC}</span>
            <span className="sep">|</span>
            <a href={PRODUCT_REPO} rel="noopener noreferrer">{copy.source}: github.com/iceccarelli/palletizer</a>
          </p>
        </div>
      </section>

      <div className="section" id="doors">
        <h2>{copy.doorsH2}</h2>
        <div className="doors">
          {copy.doors.map((d) => (
            <a className="door" key={d.path} href={href(d.path)}>
              <span className="kicker">{d.kicker}</span>
              <h3>{d.h3}</h3>
              <p>{d.p}</p>
              <span className="cta">{d.cta}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="section" id="intake">
        <h2>{copy.intakeH2}</h2>
        <p className="intro">{copy.intakeLead}</p>
        <IntakeForm labels={INTAKE_LABELS[lang]} lang={lang} />
      </div>

      <JsonLd data={professionalServiceSchema()} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          '@id': `${SITE_URL}/palletizer#software`,
          name: 'Palletizer',
          url: `${SITE_URL}${href('/palletizer')}`,
          applicationCategory: 'IndustrialApplication',
          operatingSystem: 'Web, Linux',
          description: t.homeH1,
          author: { '@id': `${SITE_URL}/#person` },
          codeRepository: PRODUCT_REPO,
        }}
      />
    </main>
  );
}

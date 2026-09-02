import type { Metadata } from 'next';
import BookCTA from '@/components/BookCTA';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import PackDesigner, { type PackLabels } from '@/components/PackDesigner';
import { getDict } from '@/lib/dict';
import { isLang, langHref, pageAlternates, type Lang } from '@/lib/i18n';
import { ogImages } from '@/lib/meta';
import { SITE_URL } from '@/lib/site';

type PageProps = { params: { lang: string } };
const PATH = '/tools/battery-pack-calculator';

const META = {
  en: {
    title: 'Battery Pack Calculator — S/P Topology, C-Rate and Runtime',
    description:
      'Free battery pack calculator: enter a cell and an S/P arrangement, get pack voltage window, energy, continuous current and power ceilings, demanded C-rate, runtime, internal resistance loss and BMS design flags.',
  },
  de: {
    title: 'Batteriepack-Rechner — S/P-Topologie, C-Rate und Laufzeit',
    description:
      'Kostenloser Batteriepack-Rechner: Zelle und S/P-Anordnung eingeben und Spannungsfenster, Energie, Dauerstrom- und Leistungsgrenzen, geforderte C-Rate, Laufzeit, Innenwiderstandsverluste und BMS-Hinweise erhalten.',
  },
} as const;

export function generateMetadata({ params }: PageProps): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  return {
    title: META[lang].title,
    description: META[lang].description,
    alternates: pageAlternates(lang, PATH),
    robots: { index: false, follow: true },
    openGraph: {
      title: `${META[lang].title} | Grimaldi Engineering`,
      description: META[lang].description,
      type: 'website',
      images: ogImages(META[lang].title),
    },
    twitter: { card: 'summary_large_image', images: ogImages(META[lang].title) },
  };
}

const LABELS: Record<Lang, PackLabels> = {
  en: {
    cellLegend: 'Cell',
    preset: 'Cell type',
    custom: 'Custom',
    nominalVoltage: 'Nominal voltage',
    maxVoltage: 'Charge voltage',
    minVoltage: 'Cut-off voltage',
    capacityAh: 'Capacity',
    maxDischargeC: 'Max continuous discharge',
    internalResistance: 'Internal resistance',
    cellMass: 'Cell mass',
    topologyLegend: 'Topology & duty',
    series: 'Cells in series',
    parallel: 'Strings in parallel',
    loadPower: 'Continuous load',
    depthOfDischarge: 'Usable depth of discharge',
    resultsLegend: 'Pack',
    cellCount: 'Cell count',
    packNominal: 'Nominal voltage',
    packWindow: 'Voltage window',
    packCapacity: 'Capacity',
    packEnergy: 'Energy',
    usableEnergy: 'Usable energy',
    maxCurrent: 'Max continuous current',
    maxPower: 'Max continuous power',
    loadCurrent: 'Load current',
    demandedC: 'Demanded C-rate',
    headroom: 'Power headroom',
    runtime: 'Runtime at load',
    packResistance: 'Pack resistance',
    resistiveLoss: 'I²R loss at load',
    voltageSag: 'Voltage sag at load',
    packMass: 'Cell mass total',
    specificEnergy: 'Specific energy (cells only)',
    warningsH: 'Design flags',
    wCRate: 'The load demands more current than the cell rating allows. Add parallel strings, choose a higher-rate cell, or reduce the load.',
    w60v: 'Maximum pack voltage exceeds 60 V DC — above the usual touch-safe threshold. Insulation, connector and service-disconnect requirements change from here.',
    w120v: 'Maximum pack voltage exceeds 120 V DC. This is high-voltage territory: interlocks, insulation monitoring, isolation testing and qualified-personnel rules apply.',
    wStrings: 'More than four parallel strings. Cell-to-cell variation and fusing per string need explicit attention; unfused parallel strings can back-feed a shorted cell.',
    wHeadroom: 'Less than 25 % power headroom. Any transient, cold start, or aged capacity will push this pack past its continuous rating.',
    wIrLoss: 'Resistive loss exceeds 5 % of load power. Check busbar and interconnect design as well as cell choice; this heat has to leave the pack.',
    noWarnings: 'No flags raised for this arrangement at this load.',
    errInvalid: 'Check the inputs: positive values, integer S and P counts, and cut-off ≤ nominal ≤ charge voltage.',
    downloadCsv: 'Download pack sheet (CSV)',
    disclaimer:
      'Topology and steady-state duty only. This is NOT a thermal model, NOT a cell-ageing or capacity-fade model, and NOT a fault-propagation or thermal-runaway analysis. Cell limits vary strongly with temperature and state of charge; this assumes the ratings you enter hold across the whole envelope, which they do not. It is no substitute for the cell datasheet, for a BMS specification, or for IEC 62133 / UN 38.3 qualification. Lithium cells fail dangerously when abused — have any pack design reviewed by a qualified engineer before building it.',
  },
  de: {
    cellLegend: 'Zelle',
    preset: 'Zelltyp',
    custom: 'Benutzerdefiniert',
    nominalVoltage: 'Nennspannung',
    maxVoltage: 'Ladeschlussspannung',
    minVoltage: 'Entladeschlussspannung',
    capacityAh: 'Kapazität',
    maxDischargeC: 'Max. Dauerentladung',
    internalResistance: 'Innenwiderstand',
    cellMass: 'Zellmasse',
    topologyLegend: 'Topologie & Belastung',
    series: 'Zellen in Reihe',
    parallel: 'Stränge parallel',
    loadPower: 'Dauerlast',
    depthOfDischarge: 'Nutzbare Entladetiefe',
    resultsLegend: 'Pack',
    cellCount: 'Zellenzahl',
    packNominal: 'Nennspannung',
    packWindow: 'Spannungsfenster',
    packCapacity: 'Kapazität',
    packEnergy: 'Energie',
    usableEnergy: 'Nutzbare Energie',
    maxCurrent: 'Max. Dauerstrom',
    maxPower: 'Max. Dauerleistung',
    loadCurrent: 'Laststrom',
    demandedC: 'Geforderte C-Rate',
    headroom: 'Leistungsreserve',
    runtime: 'Laufzeit bei Last',
    packResistance: 'Packwiderstand',
    resistiveLoss: 'I²R-Verlust bei Last',
    voltageSag: 'Spannungseinbruch bei Last',
    packMass: 'Zellmasse gesamt',
    specificEnergy: 'Spezifische Energie (nur Zellen)',
    warningsH: 'Auslegungshinweise',
    wCRate: 'Die Last fordert mehr Strom, als die Zelle zulässt. Parallelstränge ergänzen, höher belastbare Zelle wählen oder Last reduzieren.',
    w60v: 'Die maximale Packspannung überschreitet 60 V DC — oberhalb der üblichen Berührungsschutzgrenze. Isolation, Steckverbinder und Service-Trenneinrichtung ändern sich ab hier.',
    w120v: 'Die maximale Packspannung überschreitet 120 V DC. Das ist Hochspannungsbereich: Verriegelungen, Isolationsüberwachung, Isolationsprüfung und Regeln für Elektrofachkräfte gelten.',
    wStrings: 'Mehr als vier Parallelstränge. Zellstreuung und Absicherung je Strang brauchen ausdrückliche Betrachtung; ungesicherte Parallelstränge können in eine kurzgeschlossene Zelle rückspeisen.',
    wHeadroom: 'Weniger als 25 % Leistungsreserve. Jede Transiente, jeder Kaltstart und jede Alterung schiebt dieses Pack über den Dauerwert.',
    wIrLoss: 'Der ohmsche Verlust übersteigt 5 % der Lastleistung. Neben der Zellwahl auch Stromschienen und Verbinder prüfen; diese Wärme muss aus dem Pack heraus.',
    noWarnings: 'Für diese Anordnung bei dieser Last wurden keine Hinweise ausgelöst.',
    errInvalid: 'Eingaben prüfen: positive Werte, ganzzahlige S- und P-Zahlen, Entladeschluss ≤ Nenn ≤ Ladeschluss.',
    downloadCsv: 'Packdatenblatt herunterladen (CSV)',
    disclaimer:
      'Nur Topologie und stationäre Belastung. Dies ist KEIN thermisches Modell, KEIN Alterungs- oder Kapazitätsverlustmodell und KEINE Fehlerfortpflanzungs- oder Thermal-Runaway-Analyse. Zellgrenzen hängen stark von Temperatur und Ladezustand ab; hier wird angenommen, dass die eingegebenen Werte über den gesamten Bereich gelten — das tun sie nicht. Kein Ersatz für Zelldatenblatt, BMS-Spezifikation oder Qualifizierung nach IEC 62133 / UN 38.3. Lithiumzellen versagen bei Missbrauch gefährlich — lassen Sie jede Packauslegung vor dem Bau von einer Fachkraft prüfen.',
  },
};

const FAQS: Record<Lang, { q: string; a: string }[]> = {
  en: [
    { q: 'What does S and P actually change?', a: 'Series count sets voltage and nothing else: 16S of a 3.2 V cell is a 51.2 V nominal pack whose window runs from the cut-off to the charge voltage times sixteen. Parallel count sets capacity, current ceiling and how far the internal resistance falls. Energy is the product, so 16S1P and 8S2P of the same cell store identical energy at very different voltages and currents.' },
    { q: 'Why flag 60 V and 120 V DC?', a: 'Because the engineering obligations change at those boundaries, not because the arithmetic does. Below roughly 60 V DC a pack is generally treated as touch-safe; above it, insulation, connector and service-disconnect requirements tighten. Above 120 V DC you are in high-voltage territory with interlocks, insulation monitoring and qualified-personnel rules. A pack that crosses a threshold by a few volts is worth knowing about at design time.' },
    { q: 'Is the runtime figure realistic?', a: 'It is usable energy divided by load power, which is the optimistic bound. Real runtime is shorter: capacity falls with discharge rate and with temperature, ages downward over cycles, and the usable window narrows as the pack sags toward cut-off under load. Treat it as a ceiling, not a specification.' },
    { q: 'Does it size the BMS?', a: 'No. It gives the numbers a BMS specification starts from — cell count and series positions to monitor, voltage window, continuous and peak current, and the resistive loss the thermal design has to remove. Balancing strategy, contactor sizing, fusing, isolation monitoring and fault response are engineering decisions this tool deliberately does not make for you.' },
  ],
  de: [
    { q: 'Was ändern S und P tatsächlich?', a: 'Die Reihenzahl setzt allein die Spannung: 16S einer 3,2-V-Zelle ergibt ein 51,2-V-Pack, dessen Fenster vom Entlade- bis zum Ladeschluss mal sechzehn reicht. Die Parallelzahl setzt Kapazität, Stromgrenze und den Abfall des Innenwiderstands. Die Energie ist das Produkt — 16S1P und 8S2P derselben Zelle speichern gleich viel bei sehr unterschiedlicher Spannung und Strom.' },
    { q: 'Warum die Marken 60 V und 120 V DC?', a: 'Weil sich dort die technischen Pflichten ändern, nicht die Rechnung. Unterhalb von etwa 60 V DC gilt ein Pack allgemein als berührungssicher; darüber verschärfen sich Anforderungen an Isolation, Steckverbinder und Service-Trennung. Über 120 V DC ist es Hochspannung mit Verriegelungen, Isolationsüberwachung und Fachkraftregeln. Ein Pack, das eine Schwelle um wenige Volt überschreitet, sollte man in der Auslegung kennen.' },
    { q: 'Ist die Laufzeitangabe realistisch?', a: 'Sie ist nutzbare Energie geteilt durch Lastleistung — die optimistische Grenze. Real ist die Laufzeit kürzer: Die Kapazität sinkt mit Entladerate und Temperatur, altert über Zyklen und das nutzbare Fenster verengt sich, wenn das Pack unter Last zur Entladeschlussspannung absackt. Als Obergrenze behandeln, nicht als Spezifikation.' },
    { q: 'Legt das Werkzeug das BMS aus?', a: 'Nein. Es liefert die Zahlen, mit denen eine BMS-Spezifikation beginnt — Zellenzahl und zu überwachende Reihenpositionen, Spannungsfenster, Dauer- und Spitzenstrom sowie den ohmschen Verlust, den die Kühlung abführen muss. Balancing-Strategie, Schützauslegung, Absicherung, Isolationsüberwachung und Fehlerreaktion sind Ingenieursentscheidungen, die dieses Werkzeug bewusst nicht für Sie trifft.' },
  ],
};

const BODY: Record<Lang, { kicker: string; h1: string; lead: string; methodH2: string; method: string[]; faqH2: string; ctaH2: string; ctaBody: string; link: string }> = {
  en: {
    kicker: 'Free tool · Battery systems',
    h1: 'Battery pack calculator',
    lead: 'A cell and an S/P arrangement in — voltage window, energy, current and power ceilings, demanded C-rate, runtime and the design flags worth catching before anyone builds it.',
    methodH2: 'What it computes',
    method: [
      'Series count sets the voltage window, parallel count sets capacity and the current ceiling, and pack resistance follows the arrangement directly — series multiplies it, parallel divides it. From those three the energy, the continuous power ceiling and the resistive loss at your load all fall out.',
      'The load is then expressed as a C-rate on this specific pack and compared against the cell rating, because that comparison is where most first-pass pack designs fail. Power headroom below 1.25× is flagged too: transients, cold starts and aged capacity all eat into it.',
      'The flags are the point of the tool. Crossing 60 V or 120 V DC changes what the design legally and practically has to include; more than four parallel strings raises fusing and back-feed questions; resistive loss above 5 % of load power is heat the thermal design has to remove.',
    ],
    faqH2: 'Questions',
    ctaH2: 'Before you order cells',
    ctaBody: 'Pack topology is cheap to change on a spreadsheet and expensive to change after tooling, harnesses and a BMS have been specified around it. Twenty minutes, no slides — bring the CSV.',
    link: 'Servo motor sizing calculator →',
  },
  de: {
    kicker: 'Kostenloses Werkzeug · Batteriesysteme',
    h1: 'Batteriepack-Rechner',
    lead: 'Zelle und S/P-Anordnung hinein — Spannungsfenster, Energie, Strom- und Leistungsgrenzen, geforderte C-Rate, Laufzeit und die Hinweise, die man kennen sollte, bevor gebaut wird.',
    methodH2: 'Was berechnet wird',
    method: [
      'Die Reihenzahl setzt das Spannungsfenster, die Parallelzahl Kapazität und Stromgrenze, und der Packwiderstand folgt unmittelbar der Anordnung — Reihe multipliziert, parallel teilt. Daraus ergeben sich Energie, Dauerleistungsgrenze und der ohmsche Verlust bei Ihrer Last.',
      'Die Last wird anschließend als C-Rate dieses konkreten Packs ausgedrückt und gegen die Zellangabe geprüft — an diesem Vergleich scheitern die meisten ersten Packentwürfe. Auch eine Leistungsreserve unter 1,25× wird markiert: Transienten, Kaltstarts und Alterung zehren daran.',
      'Die Hinweise sind der eigentliche Zweck. Das Überschreiten von 60 V oder 120 V DC ändert, was die Auslegung rechtlich und praktisch enthalten muss; mehr als vier Parallelstränge werfen Fragen zu Absicherung und Rückspeisung auf; ohmsche Verluste über 5 % der Lastleistung sind Wärme, die abgeführt werden muss.',
    ],
    faqH2: 'Fragen',
    ctaH2: 'Bevor Zellen bestellt werden',
    ctaBody: 'Die Packtopologie lässt sich in der Tabelle billig ändern und nach Werkzeugen, Kabelbäumen und einer darauf spezifizierten BMS teuer. Zwanzig Minuten, keine Folien — bringen Sie die CSV mit.',
    link: 'Servomotor-Auslegungsrechner →',
  },
};

export default function BatteryPackPage({ params }: PageProps) {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const t = getDict(lang);
  const copy = BODY[lang];
  const faqs = FAQS[lang];

  return (
    <main>
      <div className="sheet sheet-top">
        <div className="section">
          <Breadcrumbs lang={lang} crumbs={[
            { name: 'Grimaldi Engineering', path: '/' },
            { name: lang === 'de' ? 'Werkzeuge' : 'Tools', path: '/tools' },
            { name: copy.h1, path: PATH },
          ]} />
          <span className="kicker">{copy.kicker}</span>
          <h1>{copy.h1}</h1>
          <p className="intro">{copy.lead}</p>

          <PackDesigner labels={LABELS[lang]} lang={lang} />

          <div className="prose">
            <h2>{copy.methodH2}</h2>
            {copy.method.map((p) => <p key={p.slice(0, 40)}>{p}</p>)}
            <h2>{copy.faqH2}</h2>
            {faqs.map((f) => (<div key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>))}
            <h2>{copy.ctaH2}</h2>
            <p>{copy.ctaBody}</p>
          </div>

          <div className="cta-row">
            <BookCTA label={t.ctaBook} lang={lang} />
            <a className="btn btn-line" href={langHref(lang, '/tools/motor-sizing-calculator')}>{copy.link}</a>
          </div>

          <p className="author-block">{t.authorLine}</p>
        </div>
      </div>

      <JsonLd data={{
        '@context': 'https://schema.org', '@type': 'SoftwareApplication',
        '@id': `${SITE_URL}${PATH}#tool`, name: META[lang].title,
        url: `${SITE_URL}${langHref(lang, PATH)}`,
        applicationCategory: 'EngineeringApplication', operatingSystem: 'Web',
        description: META[lang].description, author: { '@id': `${SITE_URL}/#person` },
        isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
      }} />
      <JsonLd data={{
        '@context': 'https://schema.org', '@type': 'FAQPage', '@id': `${SITE_URL}${PATH}#faq`,
        mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      }} />
    </main>
  );
}

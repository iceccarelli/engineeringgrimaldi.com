import type { Metadata } from 'next';
import BookCTA from '@/components/BookCTA';
import Breadcrumbs from '@/components/Breadcrumbs';
import ControlBudget, { type ControlLabels } from '@/components/ControlBudget';
import JsonLd from '@/components/JsonLd';
import { getDict } from '@/lib/dict';
import { isLang, langHref, pageAlternates, type Lang } from '@/lib/i18n';
import { ogImages } from '@/lib/meta';
import { SITE_URL } from '@/lib/site';

type PageProps = { params: { lang: string } };
const PATH = '/tools/control-loop-calculator';

const META = {
  en: {
    title: 'Control Loop & Fieldbus Budget Calculator — Latency, Bandwidth, Bus Load',
    description:
      'Free control loop calculator: sample period, zero-order-hold and transport dead time, achievable closed-loop bandwidth for a phase budget, plus fieldbus frame time, bus utilisation and axes per cycle.',
  },
  de: {
    title: 'Regelkreis- & Feldbus-Budgetrechner — Latenz, Bandbreite, Buslast',
    description:
      'Kostenloser Regelkreisrechner: Abtastperiode, Halteglied- und Transporttotzeit, erreichbare Regelbandbreite für ein Phasenbudget sowie Feldbus-Rahmenzeit, Busauslastung und Achsen pro Zyklus.',
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

const LABELS: Record<Lang, ControlLabels> = {
  en: {
    loopLegend: 'Control loop',
    sampleRate: 'Sample rate',
    sensorLatency: 'Sensor acquisition',
    commsIn: 'Transport in',
    compute: 'Computation',
    commsOut: 'Transport out',
    actuatorLatency: 'Drive & actuator',
    phaseBudget: 'Phase budget for delay',
    busLegend: 'Fieldbus',
    busPreset: 'Bus',
    custom: 'Custom',
    axes: 'Coordinated axes',
    bytesPerAxis: 'Process data per axis',
    overheadBytes: 'Frame overhead',
    bitrate: 'Line rate',
    cycleTime: 'Cycle time',
    loopResults: 'Loop budget',
    samplePeriod: 'Sample period',
    nyquist: 'Nyquist frequency',
    zohDelay: 'Zero-order-hold delay',
    transportDelay: 'Transport + compute delay',
    deadTime: 'Total dead time',
    deadTimeInSamples: 'Dead time in samples',
    maxBandwidth: 'Achievable bandwidth',
    samplesPerBandwidth: 'Samples per bandwidth',
    busResults: 'Bus budget',
    frameBytes: 'Frame size',
    frameTime: 'Wire time per cycle',
    utilisation: 'Bus utilisation',
    headroom: 'Cycle headroom',
    maxAxes: 'Axes that fit this cycle',
    minCycle: 'Fastest cycle for these axes',
    flagsH: 'Verdicts',
    fSampleMarginal: 'Sample rate is under ten times the achievable bandwidth. The usual guidance is 10–20×; below that, discretisation starts shaping the response you tuned.',
    fDelayDominates: 'Transport and computation exceed the hold delay: the architecture, not the sample rate, is limiting this loop. Raising the sample rate will not help until the path gets shorter.',
    fComputeOver: 'Computation consumes more than half the sample period. Jitter and worst-case execution time need bounding before this schedule is trustworthy.',
    fDeadtimeExceeds: 'Total dead time exceeds one sample period. The controller is acting on information already older than its own cycle.',
    fOverCapacity: 'Bus data does not fit the cycle. Reduce axes or process data, shorten the frame, raise the line rate, or lengthen the cycle.',
    fTight: 'Bus utilisation above 70 %. Little room for diagnostics, asynchronous traffic or added axes.',
    fHeadroomOk: 'Bus has comfortable headroom at this cycle.',
    noFlags: 'No verdicts raised for this budget.',
    errInvalid: 'Check the inputs: sample rate and bus parameters positive, latencies non-negative, phase budget between 0 and 180°.',
    downloadCsv: 'Download budget (CSV)',
    disclaimer:
      'First-order budgets. The bandwidth figure is the ceiling imposed by dead time alone, for the phase you chose to spend on it — it is not a stability result. Real loops are also shaped by plant dynamics, mechanical resonance, quantisation, jitter distribution and non-linear friction. Bus figures assume the stated payload every cycle with no retransmission, topology delay or asynchronous traffic. Nothing here is a safety-function analysis: safety-rated stopping, monitoring and interlocks are designed and validated under their own standards, not budgeted on this page.',
  },
  de: {
    loopLegend: 'Regelkreis',
    sampleRate: 'Abtastrate',
    sensorLatency: 'Sensorerfassung',
    commsIn: 'Transport hin',
    compute: 'Berechnung',
    commsOut: 'Transport zurück',
    actuatorLatency: 'Antrieb & Aktor',
    phaseBudget: 'Phasenbudget für Totzeit',
    busLegend: 'Feldbus',
    busPreset: 'Bus',
    custom: 'Benutzerdefiniert',
    axes: 'Koordinierte Achsen',
    bytesPerAxis: 'Prozessdaten je Achse',
    overheadBytes: 'Rahmen-Overhead',
    bitrate: 'Übertragungsrate',
    cycleTime: 'Zykluszeit',
    loopResults: 'Regelkreis-Budget',
    samplePeriod: 'Abtastperiode',
    nyquist: 'Nyquist-Frequenz',
    zohDelay: 'Halteglied-Totzeit',
    transportDelay: 'Transport- und Rechenzeit',
    deadTime: 'Gesamttotzeit',
    deadTimeInSamples: 'Totzeit in Abtastschritten',
    maxBandwidth: 'Erreichbare Bandbreite',
    samplesPerBandwidth: 'Abtastungen je Bandbreite',
    busResults: 'Bus-Budget',
    frameBytes: 'Rahmengröße',
    frameTime: 'Übertragungszeit je Zyklus',
    utilisation: 'Busauslastung',
    headroom: 'Zyklusreserve',
    maxAxes: 'Achsen in diesem Zyklus',
    minCycle: 'Schnellster Zyklus für diese Achsen',
    flagsH: 'Bewertungen',
    fSampleMarginal: 'Die Abtastrate liegt unter dem Zehnfachen der erreichbaren Bandbreite. Üblich sind 10–20×; darunter prägt die Diskretisierung das Verhalten, das Sie eingestellt haben.',
    fDelayDominates: 'Transport und Berechnung übersteigen die Halteglied-Totzeit: Nicht die Abtastrate, sondern die Architektur begrenzt diesen Kreis. Eine höhere Abtastrate hilft erst, wenn der Pfad kürzer wird.',
    fComputeOver: 'Die Berechnung belegt mehr als die halbe Abtastperiode. Jitter und Worst-Case-Ausführungszeit müssen begrenzt werden, bevor dieser Zeitplan belastbar ist.',
    fDeadtimeExceeds: 'Die Gesamttotzeit übersteigt eine Abtastperiode. Der Regler handelt auf Basis von Information, die älter ist als sein eigener Zyklus.',
    fOverCapacity: 'Die Busdaten passen nicht in den Zyklus. Achsen oder Prozessdaten reduzieren, Rahmen verkürzen, Übertragungsrate erhöhen oder Zyklus verlängern.',
    fTight: 'Busauslastung über 70 %. Wenig Raum für Diagnose, azyklischen Verkehr oder zusätzliche Achsen.',
    fHeadroomOk: 'Der Bus hat bei diesem Zyklus komfortable Reserve.',
    noFlags: 'Für dieses Budget wurden keine Bewertungen ausgelöst.',
    errInvalid: 'Eingaben prüfen: Abtastrate und Busparameter positiv, Latenzen nicht negativ, Phasenbudget zwischen 0 und 180°.',
    downloadCsv: 'Budget herunterladen (CSV)',
    disclaimer:
      'Budgets erster Ordnung. Der Bandbreitenwert ist die allein durch die Totzeit gesetzte Obergrenze für die von Ihnen dafür aufgewendete Phase — kein Stabilitätsnachweis. Reale Kreise werden zusätzlich von Streckendynamik, mechanischen Resonanzen, Quantisierung, Jitter-Verteilung und nichtlinearer Reibung geprägt. Die Buswerte unterstellen die angegebene Nutzlast in jedem Zyklus ohne Wiederholungen, Topologielaufzeit oder azyklischen Verkehr. Nichts hiervon ist eine Sicherheitsfunktionsanalyse: sicherheitsgerichtetes Stillsetzen, Überwachung und Verriegelungen werden nach eigenen Normen ausgelegt und validiert, nicht auf dieser Seite budgetiert.',
  },
};

const FAQS: Record<Lang, { q: string; a: string }[]> = {
  en: [
    { q: 'Why does dead time cap bandwidth?', a: 'A pure delay contributes phase lag proportional to frequency — 360·f·Td degrees — while contributing no attenuation. Gain cannot buy that back and a PID cannot tune it away. Decide how much phase margin you are willing to spend on delay, and that fixes the crossover frequency you can reach. Everything else in the loop then has to fit inside what is left.' },
    { q: 'Why add half a sample period?', a: 'A zero-order hold applies each computed output until the next update, so on average the actuator acts on a command half a period old. It is the cheapest delay to describe and one of the easiest to forget, and at low sample rates it dominates everything else in the budget.' },
    { q: 'What does "delay dominates" actually mean for me?', a: 'That transport and computation together exceed the hold delay — so the loop is limited by where the code runs and how it gets to the drive, not by how often it runs. Doubling the sample rate in that regime buys almost nothing. Moving the loop closer to the actuator, or shortening the communication path, buys everything.' },
    { q: 'Is the bus calculation specific to one protocol?', a: 'No, deliberately. You give payload per axis, frame overhead and line rate, so it applies to any cyclic industrial network. Protocol-specific behaviour — summation frames, distributed clocks, topology propagation, retransmission — is not modelled, so treat the result as the floor of what the wire costs you, not the whole story.' },
  ],
  de: [
    { q: 'Warum begrenzt die Totzeit die Bandbreite?', a: 'Eine reine Totzeit erzeugt eine frequenzproportionale Phasendrehung — 360·f·Td Grad — ohne jede Dämpfung. Verstärkung holt das nicht zurück, und ein PID kann es nicht wegregeln. Legen Sie fest, wie viel Phasenreserve Sie für die Totzeit ausgeben, und damit steht die erreichbare Durchtrittsfrequenz fest. Alles Übrige muss in den Rest passen.' },
    { q: 'Warum eine halbe Abtastperiode?', a: 'Ein Halteglied hält jeden berechneten Stellwert bis zur nächsten Aktualisierung, sodass der Aktor im Mittel auf einen halbe Periode alten Befehl reagiert. Es ist die am einfachsten zu beschreibende und am leichtesten zu vergessende Totzeit — bei niedrigen Abtastraten dominiert sie das gesamte Budget.' },
    { q: 'Was bedeutet „Totzeit dominiert“ praktisch?', a: 'Dass Transport und Berechnung zusammen die Halteglied-Totzeit übersteigen — der Kreis wird also davon begrenzt, wo der Code läuft und wie er zum Antrieb gelangt, nicht davon, wie oft er läuft. Eine verdoppelte Abtastrate bringt in diesem Bereich fast nichts. Den Regler näher an den Aktor zu holen oder den Kommunikationsweg zu verkürzen bringt alles.' },
    { q: 'Gilt die Busrechnung für ein bestimmtes Protokoll?', a: 'Bewusst nein. Sie geben Nutzlast je Achse, Rahmen-Overhead und Übertragungsrate an — damit gilt sie für jedes zyklische Industrienetz. Protokollspezifisches Verhalten wie Summenrahmen, verteilte Uhren, Topologielaufzeit oder Wiederholungen wird nicht modelliert; das Ergebnis ist die Untergrenze der Leitungskosten, nicht die ganze Geschichte.' },
  ],
};

const BODY: Record<Lang, { kicker: string; h1: string; lead: string; methodH2: string; method: string[]; faqH2: string; safetyH2: string; safety: string; ctaH2: string; ctaBody: string; link: string }> = {
  en: {
    kicker: 'Free tool · Control & integration',
    h1: 'Control loop & fieldbus budget',
    lead: 'Where software meets a machine, two budgets decide whether it works: the dead time around the loop, and the data that has to cross the bus every cycle. Both are computed here.',
    methodH2: 'What it computes',
    method: [
      'The loop budget adds every delay between measuring and acting — sensor acquisition, transport in, computation, transport out, drive and actuator response — and puts half a sample period on top for the zero-order hold. That total is dead time, and dead time is the one term in a control loop that neither gain nor clever tuning can remove.',
      'Because a pure delay costs phase in proportion to frequency, the achievable closed-loop bandwidth follows directly from how much phase margin you are willing to spend on it. The tool inverts that relation: choose a phase budget, get the crossover frequency dead time still allows, and check it against the classic guidance of sampling ten to twenty times faster than the bandwidth you want.',
      'The bus budget is simpler arithmetic with sharper consequences: axis count times process data per axis, plus frame overhead, over the line rate. It answers how many joints one controller can actually coordinate at a given cycle, and how fast a cycle a given axis count can support — the constraint that quietly decides cell architecture.',
    ],
    faqH2: 'Questions',
    safetyH2: 'Where the agent layer stops',
    safety:
      'Language models and planning agents belong on the supervisory side of this boundary: interpreting a task, generating a candidate plan, selecting a pattern, explaining a fault, writing a recipe a deterministic controller will then execute. They do not belong inside a cycle-time-critical loop, and they never belong inside a safety function. Safety-rated stopping, speed and separation monitoring, interlocks and emergency stop are designed, implemented and validated under their own standards on hardware qualified for it. Any architecture that puts a probabilistic component in that path is not an innovation; it is a defect. This is the line the tool above exists to make explicit — one side is budgeted in microseconds, the other is not budgeted at all.',
    ctaH2: 'Integrating software with a real machine',
    ctaBody: 'Most integration problems present as a tuning problem and turn out to be a topology problem — the loop is closed in the wrong place, or the bus was specified before the axis count was known. Twenty minutes, no slides — bring the CSV.',
    link: 'Servo motor sizing calculator →',
  },
  de: {
    kicker: 'Kostenloses Werkzeug · Regelung & Integration',
    h1: 'Regelkreis- & Feldbus-Budget',
    lead: 'Wo Software auf eine Maschine trifft, entscheiden zwei Budgets: die Totzeit im Kreis und die Daten, die jeden Zyklus über den Bus müssen. Beide werden hier berechnet.',
    methodH2: 'Was berechnet wird',
    method: [
      'Das Kreisbudget summiert jede Verzögerung zwischen Messen und Stellen — Sensorerfassung, Transport hin, Berechnung, Transport zurück, Antriebs- und Aktorreaktion — und addiert eine halbe Abtastperiode für das Halteglied. Diese Summe ist die Totzeit, und sie ist der eine Term im Regelkreis, den weder Verstärkung noch geschickte Einstellung entfernen kann.',
      'Da eine reine Totzeit Phase proportional zur Frequenz kostet, folgt die erreichbare Regelbandbreite unmittelbar daraus, wie viel Phasenreserve Sie dafür ausgeben. Das Werkzeug kehrt diese Beziehung um: Phasenbudget wählen, die von der Totzeit noch erlaubte Durchtrittsfrequenz erhalten und gegen die klassische Regel prüfen, zehn- bis zwanzigmal schneller abzutasten als die gewünschte Bandbreite.',
      'Das Busbudget ist einfachere Arithmetik mit schärferen Folgen: Achsenzahl mal Prozessdaten je Achse plus Rahmen-Overhead, geteilt durch die Übertragungsrate. Es beantwortet, wie viele Gelenke eine Steuerung bei gegebenem Zyklus tatsächlich koordinieren kann und welchen Zyklus eine gegebene Achsenzahl trägt — die Randbedingung, die still über die Zellenarchitektur entscheidet.',
    ],
    faqH2: 'Fragen',
    safetyH2: 'Wo die Agentenebene aufhört',
    safety:
      'Sprachmodelle und planende Agenten gehören auf die übergeordnete Seite dieser Grenze: eine Aufgabe interpretieren, einen Planvorschlag erzeugen, ein Muster auswählen, einen Fehler erklären, ein Rezept schreiben, das anschließend ein deterministischer Regler ausführt. Sie gehören nicht in einen zykluszeitkritischen Kreis und niemals in eine Sicherheitsfunktion. Sicherheitsgerichtetes Stillsetzen, Geschwindigkeits- und Abstandsüberwachung, Verriegelungen und Not-Halt werden nach eigenen Normen auf dafür qualifizierter Hardware ausgelegt, umgesetzt und validiert. Eine Architektur, die eine probabilistische Komponente in diesen Pfad setzt, ist keine Innovation, sondern ein Mangel. Genau diese Linie soll das Werkzeug oben sichtbar machen — die eine Seite wird in Mikrosekunden budgetiert, die andere gar nicht.',
    ctaH2: 'Software mit einer echten Maschine integrieren',
    ctaBody: 'Die meisten Integrationsprobleme treten als Einstellproblem auf und sind Topologieprobleme — der Kreis wird an der falschen Stelle geschlossen, oder der Bus wurde vor der Achsenzahl festgelegt. Zwanzig Minuten, keine Folien — bringen Sie die CSV mit.',
    link: 'Servomotor-Auslegungsrechner →',
  },
};

export default function ControlLoopPage({ params }: PageProps) {
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

          <ControlBudget labels={LABELS[lang]} lang={lang} />

          <div className="prose">
            <h2>{copy.methodH2}</h2>
            <p className="formula">φ(f) = 360 · f · T_d&nbsp;&nbsp;·&nbsp;&nbsp;T_d = T_s/2 + Σ latencies&nbsp;&nbsp;·&nbsp;&nbsp;f_max = φ_budget / (360 · T_d)</p>
            {copy.method.map((p) => <p key={p.slice(0, 40)}>{p}</p>)}

            <h2>{copy.safetyH2}</h2>
            <p className="boundary-note">{copy.safety}</p>

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

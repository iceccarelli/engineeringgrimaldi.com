import type { Metadata } from 'next';
import AxisSizer, { type AxisLabels } from '@/components/AxisSizer';
import BookCTA from '@/components/BookCTA';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import { getDict } from '@/lib/dict';
import { isLang, langHref, pageAlternates, type Lang } from '@/lib/i18n';
import { SITE_URL } from '@/lib/site';

type PageProps = { params: { lang: string } };
const PATH = '/tools/motor-sizing-calculator';

const META = {
  en: {
    title: 'Servo Motor Sizing Calculator — Robot Joint & Rotary Axis Torque',
    description:
      'Free servo sizing calculator for a geared rotary axis: reflected inertia, inertia ratio, gravity torque, trapezoidal move profile, peak and RMS motor torque, speed and power. Runs in your browser.',
  },
  de: {
    title: 'Servomotor-Auslegungsrechner — Drehmoment für Roboterachsen',
    description:
      'Kostenloser Auslegungsrechner für geregelte Drehachsen: reduziertes Trägheitsmoment, Trägheitsverhältnis, Gravitationsmoment, Trapezprofil, Spitzen- und Effektivmoment, Drehzahl und Leistung. Läuft im Browser.',
  },
} as const;

export function generateMetadata({ params }: PageProps): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  return {
    title: META[lang].title,
    description: META[lang].description,
    alternates: pageAlternates(lang, PATH),
    openGraph: { title: `${META[lang].title} | Grimaldi Engineering`, description: META[lang].description, type: 'website' },
  };
}

const LABELS: Record<Lang, AxisLabels> = {
  en: {
    loadLegend: 'Load at the joint',
    payloadMass: 'Payload mass',
    armLength: 'Arm length to payload',
    armInertia: 'Arm inertia about the joint',
    againstGravity: 'Axis lifts against gravity',
    frictionTorque: 'Friction torque (output)',
    driveLegend: 'Drive train',
    gearRatio: 'Gear ratio',
    efficiency: 'Gearbox efficiency',
    rotorInertia: 'Motor rotor inertia',
    moveLegend: 'Move profile',
    moveAngle: 'Move angle',
    moveTime: 'Move time',
    dwellTime: 'Dwell between moves',
    accelFraction: 'Accel fraction of move',
    resultsLegend: 'Motor demand',
    loadInertia: 'Load inertia (output)',
    reflectedInertia: 'Reflected inertia',
    inertiaRatio: 'Inertia ratio',
    peakMotorRpm: 'Peak motor speed',
    angularAcceleration: 'Output acceleration',
    gravityTorque: 'Gravity torque (output)',
    torqueAccel: 'Peak torque (accel)',
    torqueConstant: 'Torque at constant speed',
    torqueDecel: 'Torque (decel)',
    torqueRms: 'RMS torque',
    peakPower: 'Peak mechanical power',
    cyclesPerHour: 'Moves per hour',
    selectionH: 'What to look for on the datasheet',
    selectionRms: 'Continuous (rated) torque above {v} N·m — the RMS figure is what heats the motor.',
    selectionPeak: 'Peak/stall torque above {v} N·m, available at the speed below.',
    selectionSpeed: 'Rated speed above {v} rpm, with peak torque still available there.',
    flagInertiaHigh: 'Inertia ratio above 10:1 — tuning gets difficult and disturbance rejection suffers. Consider a higher gear ratio or a larger rotor.',
    flagRegen: 'Deceleration torque is negative: the drive absorbs energy on every stop. Size the braking resistor or DC-link accordingly.',
    errInvalid: 'Check the inputs: all values positive, efficiency between 0 and 1, accel fraction between 0 and 0.5.',
    downloadCsv: 'Download sizing sheet (CSV)',
    disclaimer:
      'Rigid-body dynamics with a constant gearbox efficiency and a constant friction term. It does NOT model compliance, backlash, thermal derating, drive current limits, field weakening, cable and bearing losses, or duty-cycle temperature rise. It sizes a candidate motor; it does not qualify a drive. Confirm against the manufacturer speed–torque curve at your supply voltage.',
  },
  de: {
    loadLegend: 'Last an der Achse',
    payloadMass: 'Nutzlast',
    armLength: 'Armlänge zur Nutzlast',
    armInertia: 'Armträgheit um die Achse',
    againstGravity: 'Achse hebt gegen die Schwerkraft',
    frictionTorque: 'Reibmoment (Abtrieb)',
    driveLegend: 'Antriebsstrang',
    gearRatio: 'Übersetzung',
    efficiency: 'Getriebewirkungsgrad',
    rotorInertia: 'Rotorträgheit des Motors',
    moveLegend: 'Bewegungsprofil',
    moveAngle: 'Schwenkwinkel',
    moveTime: 'Bewegungszeit',
    dwellTime: 'Pause zwischen Bewegungen',
    accelFraction: 'Beschleunigungsanteil',
    resultsLegend: 'Motoranforderung',
    loadInertia: 'Lastträgheit (Abtrieb)',
    reflectedInertia: 'Reduzierte Trägheit',
    inertiaRatio: 'Trägheitsverhältnis',
    peakMotorRpm: 'Max. Motordrehzahl',
    angularAcceleration: 'Winkelbeschleunigung',
    gravityTorque: 'Gravitationsmoment (Abtrieb)',
    torqueAccel: 'Spitzenmoment (Beschl.)',
    torqueConstant: 'Moment bei konstanter Drehzahl',
    torqueDecel: 'Moment (Verzögerung)',
    torqueRms: 'Effektivmoment',
    peakPower: 'Mechanische Spitzenleistung',
    cyclesPerHour: 'Bewegungen pro Stunde',
    selectionH: 'Worauf im Datenblatt zu achten ist',
    selectionRms: 'Dauerdrehmoment über {v} N·m — der Effektivwert erwärmt den Motor.',
    selectionPeak: 'Spitzen-/Stillstandsmoment über {v} N·m, verfügbar bei der Drehzahl unten.',
    selectionSpeed: 'Nenndrehzahl über {v} min⁻¹, mit dort noch verfügbarem Spitzenmoment.',
    flagInertiaHigh: 'Trägheitsverhältnis über 10:1 — die Regelung wird schwierig und die Störgrößenunterdrückung leidet. Höhere Übersetzung oder größerer Rotor erwägen.',
    flagRegen: 'Das Verzögerungsmoment ist negativ: Der Antrieb nimmt bei jedem Stopp Energie auf. Bremswiderstand bzw. Zwischenkreis entsprechend auslegen.',
    errInvalid: 'Eingaben prüfen: alle Werte positiv, Wirkungsgrad zwischen 0 und 1, Beschleunigungsanteil zwischen 0 und 0,5.',
    downloadCsv: 'Auslegungsblatt herunterladen (CSV)',
    disclaimer:
      'Starrkörperdynamik mit konstantem Getriebewirkungsgrad und konstantem Reibterm. NICHT modelliert werden Nachgiebigkeit, Umkehrspiel, thermische Derating-Effekte, Stromgrenzen des Umrichters, Feldschwächung, Kabel- und Lagerverluste sowie die Erwärmung über den Arbeitszyklus. Es wird ein Motorkandidat ausgelegt, kein Antrieb qualifiziert. Gegen die Drehzahl-Drehmoment-Kennlinie des Herstellers bei Ihrer Versorgungsspannung prüfen.',
  },
};

const FAQS: Record<Lang, { q: string; a: string }[]> = {
  en: [
    { q: 'Why does RMS torque matter more than peak torque?', a: 'Peak torque decides whether the axis can make the move at all; RMS torque decides whether the motor survives repeating it. Motor heating follows the square of current, and current follows torque, so the root-mean-square over the full cycle — including dwell, where a gravity-loaded axis still holds its load — is what must sit under the continuous rating.' },
    { q: 'What is the inertia ratio and why flag 10:1?', a: 'It is reflected load inertia divided by rotor inertia. Because reflection divides by the square of the gear ratio, it moves fast: doubling the ratio quarters the reflected inertia. Above roughly 10:1 a stiff, well-damped loop gets hard to tune and disturbance rejection degrades. It is a design smell, not a hard limit — direct-drive axes live far above it deliberately.' },
    { q: 'Why is deceleration torque sometimes negative?', a: 'Because the load is giving energy back. On a gravity-assisted stop the inertia term exceeds gravity and friction, the motor acts as a generator, and that energy has to go somewhere — a braking resistor, the DC link, or back to the supply. If the sign is negative here, that path needs sizing.' },
    { q: 'What move profile is assumed?', a: 'A symmetric trapezoid: accelerate for a fixed fraction of the move, cruise, decelerate for the same fraction. The area under the velocity profile is checked to equal the commanded angle exactly, so the peak speed and acceleration are consistent with the move you asked for rather than approximated.' },
  ],
  de: [
    { q: 'Warum zählt das Effektivmoment mehr als das Spitzenmoment?', a: 'Das Spitzenmoment entscheidet, ob die Bewegung überhaupt möglich ist; das Effektivmoment entscheidet, ob der Motor die Wiederholung übersteht. Die Erwärmung folgt dem Quadrat des Stroms und der Strom dem Moment — der quadratische Mittelwert über den gesamten Zyklus, inklusive Pause, in der eine schwerkraftbelastete Achse ihre Last weiter hält, muss unter dem Dauerwert liegen.' },
    { q: 'Was ist das Trägheitsverhältnis, und warum die Marke 10:1?', a: 'Es ist die reduzierte Lastträgheit geteilt durch die Rotorträgheit. Da die Reduktion mit dem Quadrat der Übersetzung erfolgt, ändert es sich schnell: doppelte Übersetzung, ein Viertel der reduzierten Trägheit. Oberhalb von etwa 10:1 wird ein steifer, gut gedämpfter Regelkreis schwer einstellbar. Das ist ein Warnzeichen, keine harte Grenze — Direktantriebe liegen bewusst weit darüber.' },
    { q: 'Warum ist das Verzögerungsmoment manchmal negativ?', a: 'Weil die Last Energie zurückgibt. Übersteigt der Trägheitsterm Schwerkraft und Reibung, arbeitet der Motor als Generator, und diese Energie muss irgendwohin — Bremswiderstand, Zwischenkreis oder zurück ins Netz. Ist das Vorzeichen negativ, muss dieser Pfad ausgelegt werden.' },
    { q: 'Welches Bewegungsprofil wird angenommen?', a: 'Ein symmetrisches Trapez: Beschleunigen über einen festen Anteil der Bewegung, konstante Fahrt, Verzögern über denselben Anteil. Die Fläche unter dem Geschwindigkeitsprofil wird exakt gegen den kommandierten Winkel geprüft, sodass Spitzendrehzahl und Beschleunigung zur gewünschten Bewegung passen und nicht genähert sind.' },
  ],
};

const BODY: Record<Lang, { kicker: string; h1: string; lead: string; methodH2: string; method: string[]; faqH2: string; ctaH2: string; ctaBody: string; link: string }> = {
  en: {
    kicker: 'Free tool · Actuators',
    h1: 'Servo motor sizing for a rotary axis',
    lead: 'Payload, arm, gearbox and move time in — reflected inertia, peak and RMS torque, speed and power out. The calculation that decides whether a robot joint works before anyone buys a motor.',
    methodH2: 'What it computes',
    method: [
      'Load inertia about the joint is the payload as a point mass at radius r plus the arm structure. Reflecting it through the gearbox divides by the square of the ratio, which is why gear selection dominates this problem: doubling the ratio quarters the reflected inertia but halves the available output speed.',
      'The move is a symmetric trapezoid. Peak speed and angular acceleration follow from the commanded angle and time, and the area under the velocity profile is checked against the commanded angle exactly rather than approximated.',
      'Torque is then evaluated at three points — accelerating, cruising, decelerating — with gravity and friction reflected through gearbox efficiency, and the motor rotor accelerated at its own multiplied rate. The RMS over the full cycle, dwell included, is what you compare against a continuous rating.',
    ],
    faqH2: 'Questions',
    ctaH2: 'Sizing a real cell',
    ctaBody: 'If the inertia ratio is fighting you, or the duty cycle puts RMS torque uncomfortably close to the continuous rating, the fix is usually in the gearbox or the profile rather than a bigger motor. Twenty minutes, no slides — bring the CSV.',
    link: 'Battery pack calculator →',
  },
  de: {
    kicker: 'Kostenloses Werkzeug · Aktorik',
    h1: 'Servomotor-Auslegung für eine Drehachse',
    lead: 'Nutzlast, Arm, Getriebe und Bewegungszeit hinein — reduzierte Trägheit, Spitzen- und Effektivmoment, Drehzahl und Leistung heraus. Die Rechnung, die über eine Roboterachse entscheidet, bevor ein Motor gekauft wird.',
    methodH2: 'Was berechnet wird',
    method: [
      'Die Lastträgheit um die Achse ist die Nutzlast als Punktmasse im Radius r plus die Armstruktur. Die Reduktion über das Getriebe teilt durch das Quadrat der Übersetzung — deshalb dominiert die Getriebewahl dieses Problem: doppelte Übersetzung, ein Viertel der reduzierten Trägheit, aber nur die halbe Abtriebsdrehzahl.',
      'Die Bewegung ist ein symmetrisches Trapez. Spitzendrehzahl und Winkelbeschleunigung folgen aus kommandiertem Winkel und Zeit, und die Fläche unter dem Geschwindigkeitsprofil wird exakt gegen den Winkel geprüft, nicht genähert.',
      'Das Drehmoment wird an drei Punkten ausgewertet — Beschleunigen, konstante Fahrt, Verzögern — mit über den Getriebewirkungsgrad reduzierter Schwerkraft und Reibung und dem mit erhöhter Rate beschleunigten Rotor. Der Effektivwert über den gesamten Zyklus samt Pause ist der Vergleichswert zum Dauerdrehmoment.',
    ],
    faqH2: 'Fragen',
    ctaH2: 'Eine echte Zelle auslegen',
    ctaBody: 'Wenn das Trägheitsverhältnis gegen Sie arbeitet oder der Arbeitszyklus das Effektivmoment nahe an den Dauerwert bringt, liegt die Lösung meist im Getriebe oder im Profil, nicht in einem größeren Motor. Zwanzig Minuten, keine Folien — bringen Sie die CSV mit.',
    link: 'Batteriepack-Rechner →',
  },
};

export default function MotorSizingPage({ params }: PageProps) {
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

          <AxisSizer labels={LABELS[lang]} lang={lang} />

          <div className="prose">
            <h2>{copy.methodH2}</h2>
            {copy.method.map((p) => <p key={p.slice(0, 40)}>{p}</p>)}
            <h2>{copy.faqH2}</h2>
            {faqs.map((f) => (<div key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>))}
            <h2>{copy.ctaH2}</h2>
            <p>{copy.ctaBody}</p>
          </div>

          <div className="cta-row">
            <BookCTA label={t.ctaBook} />
            <a className="btn btn-line" href={langHref(lang, '/tools/battery-pack-calculator')}>{copy.link}</a>
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

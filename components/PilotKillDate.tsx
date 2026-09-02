import type { Lang } from '@/lib/i18n';
import { PILOT_MAILTO, PILOT_SUBJECT } from '@/lib/pilot';

/**
 * The money object: a 30-day software pilot with a kill date the customer
 * puts on their own calendar at week 0. Four rows, two buttons, no
 * manifesto. Weeks are relative on purpose — the absolute date is the
 * customer's, not ours.
 */
const COPY = {
  en: {
    kicker: '30-day pilot · kill date on the calendar',
    h2: 'Price a pilot without a manifesto',
    lead: 'Software only. Your SKU master in, a density and stability report out, a go / no-go on a date you set at week 0. No robot, no integrator, no site visit inside the pilot.',
    weeks: [
      { w: 'Week 0', what: 'Your CSV', detail: 'SKU id, length, width, height, weight. Messy is fine — the parser and the audit trail are the product.' },
      { w: 'Week 2', what: 'Density / stability report', detail: 'Every plan with its stability number (0.6·support + 0.4·CoM), density vs the naive baseline on your own boxes, plan JSON you can diff.' },
      { w: 'Week 4', what: 'Go / no-go', detail: 'Either the numbers justify an arm-and-integration quote, or the pilot ends on the date you set. No rolling extension.' },
      { w: 'Kill date', what: 'On your calendar at week 0', detail: 'Fixed fee, quoted within one working day of receiving the CSV. Nothing is invoiced past the kill date.' },
    ],
    primary: 'Run your SKU list',
    secondary: 'Book the 30-day pilot',
    fine: 'Primary button opens the live optimizer (palletizer-app.vercel.app) — same math as the Python core. Secondary is an email; the subject line is pre-filled so it lands in the right queue.',
  },
  de: {
    kicker: '30-Tage-Pilot · Abbruchdatum im Kalender',
    h2: 'Einen Piloten bepreisen — ohne Manifest',
    lead: 'Nur Software. Ihr SKU-Stamm hinein, ein Dichte- und Stabilitätsbericht heraus, ein Go / No-Go an einem Datum, das Sie in Woche 0 festlegen. Kein Roboter, kein Integrator, kein Vor-Ort-Termin innerhalb des Piloten.',
    weeks: [
      { w: 'Woche 0', what: 'Ihre CSV', detail: 'SKU-ID, Länge, Breite, Höhe, Gewicht. Unordentlich ist in Ordnung — Parser und Audit-Trail sind das Produkt.' },
      { w: 'Woche 2', what: 'Dichte- / Stabilitätsbericht', detail: 'Jeder Plan mit seiner Stabilitätszahl (0,6·Auflage + 0,4·Schwerpunkt), Dichte gegen die naive Basislinie auf Ihren eigenen Kartons, Plan-JSON zum Diffen.' },
      { w: 'Woche 4', what: 'Go / No-Go', detail: 'Entweder rechtfertigen die Zahlen ein Angebot für Arm und Integration, oder der Pilot endet am gesetzten Datum. Keine stillschweigende Verlängerung.' },
      { w: 'Abbruchdatum', what: 'In Woche 0 in Ihrem Kalender', detail: 'Festpreis, angeboten innerhalb eines Werktags nach Erhalt der CSV. Nach dem Abbruchdatum wird nichts berechnet.' },
    ],
    primary: 'Ihre SKU-Liste rechnen',
    secondary: '30-Tage-Pilot anfragen',
    fine: 'Der erste Button öffnet den Live-Optimierer (palletizer-app.vercel.app) — dieselbe Mathematik wie der Python-Kern. Der zweite ist eine E-Mail; der Betreff ist vorausgefüllt, damit sie in der richtigen Warteschlange landet.',
  },
} as const;

export default function PilotKillDate({ lang, compact = false }: { lang: Lang; compact?: boolean }) {
  const c = COPY[lang];
  return (
    <section className={compact ? 'pilot pilot-compact' : 'pilot'} id="pilot" aria-labelledby="pilot-h2">
      <span className="kicker">{c.kicker}</span>
      <h2 id="pilot-h2">{c.h2}</h2>
      <p className="intro">{c.lead}</p>
      <ol className="pilot-weeks">
        {c.weeks.map((row) => (
          <li key={row.w} className={row.w.startsWith('Kill') || row.w.startsWith('Abbruch') ? 'pilot-week pilot-kill' : 'pilot-week'}>
            <span className="pilot-w">{row.w}</span>
            <span className="pilot-what">{row.what}</span>
            {!compact && <span className="pilot-detail">{row.detail}</span>}
          </li>
        ))}
      </ol>
      <div className="cta-row">
        <a className="btn btn-glow" href="https://palletizer-app.vercel.app/" rel="noopener noreferrer" data-cta="optimizer">
          {c.primary} →
        </a>
        <a className="btn btn-line" href={PILOT_MAILTO} data-cta="pilot-mail">
          {c.secondary}
        </a>
      </div>
      <p className="calc-meta">{c.fine} <code className="mono">{PILOT_SUBJECT}</code></p>
    </section>
  );
}

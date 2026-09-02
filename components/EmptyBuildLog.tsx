import type { Lang } from '@/lib/i18n';
import HonestyBanner from './HonestyBanner';

/**
 * The lab-notebook empty state for a discipline with no published log.
 * Two slots — photograph and instrument capture — drawn as empty frames
 * with the fields a real entry would carry. The red banner is not
 * optional: it is what allows "instrument captures" to be mentioned on
 * the same page at all.
 */
const COPY = {
  en: {
    banner: 'NO LOG YET',
    bannerBody: 'No instrument photo or capture has been published for this track. Nothing below is a render passed off as a photograph. The slots are empty until a real one fills them.',
    photo: 'Photograph slot',
    photoHint: 'Bench, DUT, instrument in frame. Camera EXIF kept. No renders.',
    capture: 'Instrument capture slot',
    captureHint: 'Scope / analyser screenshot or CSV export, with probe, range and timebase stated.',
    fields: ['Date', 'Instrument / probe', 'Setup', 'Measured result', 'What failed'],
    footer: 'When the first entry ships, this page changes status. Not before.',
  },
  de: {
    banner: 'NOCH KEIN JOURNAL',
    bannerBody: 'Für diesen Strang ist kein Instrumentenfoto und keine Messung veröffentlicht. Nichts unten ist ein Rendering, das als Foto ausgegeben wird. Die Felder bleiben leer, bis ein echtes sie füllt.',
    photo: 'Foto-Feld',
    photoHint: 'Werkbank, Prüfling, Messgerät im Bild. Kamera-EXIF bleibt. Keine Renderings.',
    capture: 'Messungs-Feld',
    captureHint: 'Scope- / Analysator-Screenshot oder CSV-Export, mit Tastkopf, Bereich und Zeitbasis.',
    fields: ['Datum', 'Instrument / Tastkopf', 'Aufbau', 'Messergebnis', 'Was fehlgeschlagen ist'],
    footer: 'Wenn der erste Eintrag erscheint, ändert diese Seite ihren Status. Nicht vorher.',
  },
} as const;

export default function EmptyBuildLog({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  return (
    <section className="ebl" aria-label={c.banner}>
      <HonestyBanner tone="red" title={c.banner}>{c.bannerBody}</HonestyBanner>
      <div className="ebl-slots">
        <div className="ebl-slot" aria-hidden="true">
          <span className="ebl-slot-label">{c.photo}</span>
          <span className="ebl-slot-hint">{c.photoHint}</span>
        </div>
        <div className="ebl-slot" aria-hidden="true">
          <span className="ebl-slot-label">{c.capture}</span>
          <span className="ebl-slot-hint">{c.captureHint}</span>
        </div>
      </div>
      <dl className="ebl-fields">
        {c.fields.map((f) => (
          <div key={f}><dt>{f}</dt><dd>—</dd></div>
        ))}
      </dl>
      <p className="calc-meta">{c.footer}</p>
    </section>
  );
}

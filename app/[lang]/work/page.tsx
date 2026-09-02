import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getDict } from '@/lib/dict';
import { isLang, langHref, pageAlternates, type Lang } from '@/lib/i18n';

/** Work: empty until a commissioned cell exists, and it says so. */

type PageProps = { params: { lang: string } };
const PATH = '/work';

const COPY = {
  en: {
    title: 'Work — Commissioned Cells',
    description: 'Commissioned palletizing cells running this software. Published only once they run.',
    kicker: 'Work',
    h1: 'No commissioned cell published.',
    lead: 'The software is shipped and the planner is public. A cell appears here when one runs it: robot, gripper, SKU count, layers per hour as measured, integrator named with consent. Not before.',
    what: 'What will appear per cell: robot brand and payload class, gripper class, SKU count and mix, pallet type, measured cycle time, stability floor at acceptance, the integrator who built it.',
    cta: 'Be the first cell →',
  },
  de: {
    title: 'Referenzen — In Betrieb genommene Zellen',
    description: 'In Betrieb genommene Palettierzellen mit dieser Software. Veröffentlicht erst, wenn sie laufen.',
    kicker: 'Referenzen',
    h1: 'Keine in Betrieb genommene Zelle veröffentlicht.',
    lead: 'Die Software ist ausgeliefert, der Planer öffentlich. Eine Zelle erscheint hier, sobald eine damit läuft: Roboter, Greifer, SKU-Anzahl, gemessene Lagen pro Stunde, Integrator mit Einverständnis genannt. Nicht vorher.',
    what: 'Was pro Zelle erscheinen wird: Robotermarke und Nutzlastklasse, Greiferklasse, SKU-Anzahl und -Mix, Palettentyp, gemessene Taktzeit, Stabilitätsuntergrenze bei Abnahme, der Integrator, der sie gebaut hat.',
    cta: 'Die erste Zelle sein →',
  },
} as const;

export function generateMetadata({ params }: PageProps): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  return { title: COPY[lang].title, description: COPY[lang].description, alternates: pageAlternates(lang, PATH) };
}

export default function WorkPage({ params }: PageProps) {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const t = getDict(lang);
  const c = COPY[lang];
  return (
    <main>
      <div className="section">
        <Breadcrumbs lang={lang} crumbs={[{ name: 'Grimaldi Engineering', path: '/' }, { name: c.kicker, path: PATH }]} />
        <span className="kicker kicker-signal">{c.kicker}</span>
        <h1>{c.h1}</h1>
        <p className="lead">{c.lead}</p>
        <p className="honesty" role="note">
          <span className="chip chip-live">{lang === 'de' ? 'Software ausgeliefert' : 'software shipped'}</span>
          <span className="sep">|</span>
          <span className="chip chip-hold">{lang === 'de' ? 'Zelle nicht in Betrieb genommen' : 'cell not commissioned'}</span>
        </p>
        <p className="prose">{c.what}</p>
        <div className="cta-row">
          <a className="btn btn-signal" href={langHref(lang, '/contact')}>{c.cta}</a>
        </div>
        <p className="author-block">{t.authorLine}</p>
      </div>
    </main>
  );
}

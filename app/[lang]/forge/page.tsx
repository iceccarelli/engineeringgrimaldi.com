import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import ForgeIndex from '@/components/ForgeIndex';
import StatusBadge from '@/components/StatusBadge';
import WaitlistForm from '@/components/WaitlistForm';
import { getDict } from '@/lib/dict';
import { forgeRest, getProduct } from '@/lib/forge';
import { isLang, langHref, pageAlternates, type Lang } from '@/lib/i18n';
import { STATUS_META, type Status } from '@/lib/status';

type PageProps = { params: { lang: string } };

const COPY = {
  en: {
    title: 'The Forge Line — status index',
    description: 'Every Forge Line product with its status in capitals: Palletizer SHIPPED, FloorForge IN DEVELOPMENT, PaintForge / DryForge / ForgeOS PARKED. Nothing is deleted; nothing is promoted.',
    kicker: 'The Forge Line',
    h1: 'One product per trade. One is shipped.',
    lead: 'This is the index that keeps everything reachable and nothing over-sold. The wedge is Palletizer and it has its own page. The rest is listed here with the badge it earned, and only here — the homepage does not link these pages.',
    wedge: 'The wedge',
    restH2: 'The rest of the line',
    legendH2: 'What the badges mean',
    wl: 'One email when a badge changes',
  },
  de: {
    title: 'Die Forge-Linie — Status-Index',
    description: 'Jedes Forge-Linie-Produkt mit Status in Großbuchstaben: Palletizer AUSGELIEFERT, FloorForge IN ENTWICKLUNG, PaintForge / DryForge / ForgeOS GEPARKT. Nichts wird gelöscht; nichts wird hochgestuft.',
    kicker: 'Die Forge-Linie',
    h1: 'Ein Produkt pro Gewerk. Eines ist ausgeliefert.',
    lead: 'Dies ist der Index, der alles erreichbar hält und nichts überverkauft. Der Keil ist Palletizer und hat seine eigene Seite. Der Rest steht hier mit dem verdienten Badge — und nur hier; die Startseite verlinkt diese Seiten nicht.',
    wedge: 'Der Keil',
    restH2: 'Der Rest der Linie',
    legendH2: 'Was die Badges bedeuten',
    wl: 'Eine E-Mail, wenn sich ein Badge ändert',
  },
} as const;

const LEGEND: Status[] = ['SHIPPED', 'SHIPPED_DEMO', 'PILOT', 'IN_DEVELOPMENT', 'CLIENT_BUILD', 'RESEARCH', 'PARKED', 'DO_NOT_LINK', 'NO_LOG_YET'];

export function generateMetadata({ params }: PageProps): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const c = COPY[lang];
  return { title: c.title, description: c.description, alternates: pageAlternates(lang, '/forge') };
}

export default function ForgePage({ params }: PageProps) {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const t = getDict(lang);
  const c = COPY[lang];
  const wedge = getProduct('palletizer');

  return (
    <main>
      <div className="sheet sheet-top">
        <div className="section">
          <Breadcrumbs lang={lang} crumbs={[{ name: 'Grimaldi Engineering', path: '/' }, { name: 'Forge Line', path: '/forge' }]} />
          <span className="kicker">{c.kicker}</span>
          <h1>{c.h1}</h1>
          <p className="intro">{c.lead}</p>

          {wedge && (
            <section className="index-group">
              <h2>{c.wedge}</h2>
              <ForgeIndex lang={lang} products={[wedge]} />
              <p className="home-more"><a href={langHref(lang, '/palletizer')}>/palletizer →</a></p>
            </section>
          )}

          <section className="index-group">
            <h2>{c.restH2}</h2>
            <ForgeIndex lang={lang} products={forgeRest} />
          </section>

          <section className="index-group">
            <h2>{c.legendH2}</h2>
            <dl className="legend">
              {LEGEND.map((s) => (
                <div key={s}>
                  <dt><StatusBadge status={s} lang={lang} size="sm" /></dt>
                  <dd>{STATUS_META[s].hint[lang]}</dd>
                </div>
              ))}
            </dl>
          </section>

          <div className="banner banner-stack">
            <div>
              <h2>{c.wl}</h2>
              <p>{t.wlBody}</p>
            </div>
            <WaitlistForm t={t} />
          </div>
          <p className="author-block">{t.authorLine}</p>
        </div>
      </div>
    </main>
  );
}

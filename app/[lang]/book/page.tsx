import type { Metadata } from 'next';
import BookCTA from '@/components/BookCTA';
import { getDict } from '@/lib/dict';
import { isLang, pageAlternates, type Lang } from '@/lib/i18n';

type PageProps = { params: { lang: string } };

export function generateMetadata({ params }: PageProps): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  return {
    title: lang === 'de' ? 'Bench-Review buchen — 20 Minuten, 0 €' : 'Book a Bench Review — 20 Minutes, €0',
    description:
      lang === 'de'
        ? 'Buchen Sie ein 20-minütiges Bench-Review mit Vincenzo Ceccarelli Grimaldi: Palettierzellen, HV-/OT-Fragen, Architektur. Danach: Session 280 €, Retainer 3.200 €/Monat, Forge-Integration nach Angebot.'
        : 'Book a 20-minute bench review with Vincenzo Ceccarelli Grimaldi: palletizing cells, HV/OT questions, architecture. Then: session €280, retainer €3,200/mo, Forge integration by quote.',
    alternates: pageAlternates(lang, '/book'),
  };
}

export default function BookPage({ params }: PageProps) {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const t = getDict(lang);

  const offers = [
    { title: t.offerSession, body: t.offerSessionBody },
    { title: t.offerRetainer, body: t.offerRetainerBody },
    { title: t.offerIntegration, body: t.offerIntegrationBody },
  ];

  return (
    <main>
      <div className="sheet sheet-top">
        <div className="section">
          <span className="kicker">Grimaldi Engineering</span>
          <h1>{t.bookTitle}</h1>
          <p className="intro">{t.bookLead}</p>
          <div className="cta-row">
            <BookCTA label={t.bookCta} />
          </div>
          <p className="book-bring">{t.bookBring}</p>

          <h2>{t.offersTitle}</h2>
          <div className="grid">
            {offers.map((offer) => (
              <div className="card" key={offer.title}>
                <h3>{offer.title}</h3>
                <p>{offer.body}</p>
              </div>
            ))}
          </div>

          <p className="author-block">{t.authorLine}</p>
        </div>
      </div>
    </main>
  );
}

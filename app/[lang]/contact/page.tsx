import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import IntakeForm from '@/components/IntakeForm';
import { getDict } from '@/lib/dict';
import { INTAKE_LABELS } from '@/lib/labels';
import { isLang, pageAlternates, type Lang } from '@/lib/i18n';
import { CONTACT_EMAIL } from '@/lib/site';

/** Contact = the same intake. No calendar, no price. */

type PageProps = { params: { lang: string } };
const PATH = '/contact';

const COPY = {
  en: {
    title: 'Contact — Send a SKU List',
    description: 'Send company, city, robot brand and a SKU CSV. You get a stack and the unstable SKUs back.',
    kicker: 'Contact',
    h1: 'Send the SKU list.',
    lead: 'Company, city, robot brand, the file, an optional cell layout. You get a stack and the unstable SKUs back — usually within two working days.',
    received: 'Received. We answer with a stack and the unstable SKUs.',
    error: 'Sending failed. Please email the file to',
    where: 'Frankfurt am Main. Legal contact only:',
  },
  de: {
    title: 'Kontakt — SKU-Liste senden',
    description: 'Senden Sie Firma, Stadt, Robotermarke und eine SKU-CSV. Sie erhalten einen Stapel und die instabilen SKUs zurück.',
    kicker: 'Kontakt',
    h1: 'SKU-Liste senden.',
    lead: 'Firma, Stadt, Robotermarke, die Datei, optional ein Zellenlayout. Sie erhalten einen Stapel und die instabilen SKUs zurück — in der Regel innerhalb von zwei Werktagen.',
    received: 'Erhalten. Sie bekommen einen Stapel und die instabilen SKUs.',
    error: 'Das Senden ist fehlgeschlagen. Bitte senden Sie die Datei per E-Mail an',
    where: 'Frankfurt am Main. Nur für rechtliche Anfragen:',
  },
} as const;

export function generateMetadata({ params }: PageProps): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  return { title: COPY[lang].title, description: COPY[lang].description, alternates: pageAlternates(lang, PATH) };
}

export default function ContactPage({ params }: PageProps) {
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
        {/* No-JS outcomes: the intake route redirects here with a fragment. */}
        <p id="received" className="intake-ok" role="status">{c.received}</p>
        <p id="error" className="intake-err" role="alert">{c.error} <code>{CONTACT_EMAIL}</code></p>
        <IntakeForm labels={INTAKE_LABELS[lang]} lang={lang} />
        <p className="book-bring">{c.where} {CONTACT_EMAIL}</p>
        <p className="author-block">{t.authorLine}</p>
      </div>
    </main>
  );
}

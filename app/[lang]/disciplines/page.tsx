import type { Metadata } from 'next';
import SectionIndex from '@/components/SectionIndex';
import { isLang, pageAlternates, type Lang } from '@/lib/i18n';
import { findSection } from '@/lib/nav';

type PageProps = { params: { lang: string } };

export function generateMetadata({ params }: PageProps): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  return {
    title: lang === 'de' ? 'Kompetenzen — sechs Ingenieursstränge' : 'Capabilities — Six Engineering Tracks',
    description:
      lang === 'de'
        ? 'Elektrische Maschinen und Aktorik, Batteriesysteme und BMS, Regelung und Integration, Embedded, Leistungselektronik, Hochspannung — Umfang, Grenzen und Stand je Strang.'
        : 'Electrical machines and actuators, battery systems and BMS, control and integration, embedded, power electronics, high voltage — scope, boundary and status for each track.',
    alternates: pageAlternates(lang, '/disciplines'),
    robots: { index: false, follow: true },
  };
}

export default function DisciplinesIndex({ params }: PageProps) {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const section = findSection('capabilities');
  if (!section) return null;
  return <SectionIndex lang={lang} section={section} />;
}

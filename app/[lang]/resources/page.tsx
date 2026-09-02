import type { Metadata } from 'next';
import SectionIndex from '@/components/SectionIndex';
import { isLang, pageAlternates, type Lang } from '@/lib/i18n';
import { findSection } from '@/lib/nav';

type PageProps = { params: { lang: string } };

export function generateMetadata({ params }: PageProps): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  return {
    title: lang === 'de' ? 'Ressourcen — Referenzdaten und Labor' : 'Resources — Reference Data and Lab',
    description:
      lang === 'de'
        ? 'Palettenmaße und Container-Abmessungen mit genannten Quellen, dazu das Labor (ein funktionierendes Instrument, noch kein Hardware-Baujournal) und die Netzwerk-Verweise.'
        : 'Pallet sizes and container dimensions with sources cited, plus the lab (one working instrument, no hardware build log yet) and the network pointers.',
    alternates: pageAlternates(lang, '/resources'),
  };
}

export default function ResourcesIndex({ params }: PageProps) {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const section = findSection('resources');
  if (!section) return null;
  return <SectionIndex lang={lang} section={section} />;
}

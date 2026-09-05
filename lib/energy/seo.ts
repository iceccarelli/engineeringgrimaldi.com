import type { Metadata } from 'next';
import { pageAlternates, type Lang } from '../i18n';
import { ogImages } from '../meta';
import type { EnergyPage } from './pages';

export const ENERGY_KICKER = 'Energy Intelligence · Cluster 1';

/** Metadata for one /energy page from its registry entry — one place, no drift. */
export function energyMetadata(lang: Lang, page: EnergyPage): Metadata {
  const title = `${page.label[lang]} — Energy Intelligence`;
  const description = page.blurb[lang];
  return {
    title,
    description,
    alternates: pageAlternates(lang, page.path),
    openGraph: { title, description, images: ogImages(page.label[lang], ENERGY_KICKER) },
    twitter: { card: 'summary_large_image', title, description, images: ogImages(page.label[lang], ENERGY_KICKER) },
  };
}

export function langOf(params: { lang: string }): Lang {
  return params.lang === 'de' ? 'de' : 'en';
}

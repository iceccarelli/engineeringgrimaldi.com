import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Chrome from '@/components/Chrome';
import JsonLd from '@/components/JsonLd';
import { LANGS, isLang, pageAlternates, type Lang } from '@/lib/i18n';
import { personSchema, websiteSchema } from '@/lib/schema';
import { SITE_URL } from '@/lib/site';
import '../globals.css';

/**
 * Root layout — lives inside [lang] so <html lang> is correct per locale.
 * middleware.ts guarantees every page request carries lang = en | de.
 */

export function generateStaticParams(): { lang: Lang }[] {
  return LANGS.map((lang) => ({ lang }));
}

type LayoutProps = { children: ReactNode; params: { lang: string } };

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  // <title> law: until an instrument photo or capture is published, the
  // document title is the product that ships — never "Hardware & Electrical
  // Engineering — lab". The hardware positioning survives as a section.
  const title =
    lang === 'de'
      ? 'Palletizer OS — Misch-SKU-Planung | Grimaldi Engineering'
      : 'Palletizer OS — mixed-SKU planning | Grimaldi Engineering';
  const description =
    lang === 'de'
      ? 'Misch-SKU-Palettenpläne mit einer Stabilitätszahl, die Sie nachrechnen können. Open-Core-Optimierer v0.2, dieselbe Mathematik im Browser und in Python, 30-Tage-Software-Pilot mit Abbruchdatum. Noch kein Zellen-Betriebssystem. Von Vincenzo Ceccarelli Grimaldi, Frankfurt.'
      : 'Mixed-SKU pallet plans with a stability number you can check. Open-core optimizer v0.2, same math in the browser and in Python, 30-day software pilot with a kill date. Not a cell OS yet. By Vincenzo Ceccarelli Grimaldi, Frankfurt.';
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: '%s | Grimaldi Engineering',
    },
    description,
    alternates: pageAlternates(lang, '/'),
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${lang === 'de' ? '/de' : '/'}`,
      siteName: 'Grimaldi Engineering',
      type: 'website',
      locale: lang === 'de' ? 'de_DE' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function RootLayout({ children, params }: LayoutProps) {
  if (!isLang(params.lang)) notFound();
  const lang: Lang = params.lang;

  return (
    <html lang={lang} id="top">
      <body>
        <Chrome lang={lang}>{children}</Chrome>
        <JsonLd data={websiteSchema()} />
        <JsonLd data={personSchema()} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

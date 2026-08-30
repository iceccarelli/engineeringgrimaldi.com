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
  const title =
    lang === 'de'
      ? 'Grimaldi Engineering | Elektrische Maschinen, Batteriesysteme & Automatisierung'
      : 'Grimaldi Engineering | Electrical Machines, Battery Systems & Automation';
  const description =
    lang === 'de'
      ? 'Grimaldi Engineering (Frankfurt): elektrische Maschinen und Aktorik, Batteriesysteme und BMS, Hochspannung, Leistungselektronik und Embedded-Regelung — mit kostenlosen Rechnern für Achsenauslegung, Batteriepacks und Palettierung. Von Vincenzo Ceccarelli Grimaldi.'
      : 'Grimaldi Engineering (Frankfurt): electrical machines and actuators, battery systems and BMS, high voltage, power electronics and embedded control — with free calculators for axis sizing, battery packs and palletizing. By Vincenzo Ceccarelli Grimaldi.';
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

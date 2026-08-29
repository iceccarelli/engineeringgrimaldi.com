import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { LanguageProvider } from '@/lib/i18n';
import Chrome from '@/components/Chrome';
import './globals.css';

const SITE_URL = 'https://engineeringgrimaldi.com';

export const metadata: Metadata = {
  metadataBase: new globalThis.URL(SITE_URL),
  title: 'Grimaldi Engineering — Hardware & Electrical Engineering',
  description:
    'The hardware surface of the Grimaldi Network: high-voltage systems, embedded control boards and power electronics — build logs with schematics, measurements and honest failure notes, plus a live grid-frequency instrument.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Grimaldi Engineering — Hardware & Electrical Engineering',
    description:
      'High-voltage systems, embedded control and power electronics — documented with schematics, measurements and honest failure notes.',
    url: `${SITE_URL}/`,
    type: 'website',
  },
};

const jsonld = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: 'Grimaldi Engineering',
  description:
    'Hardware and electrical engineering build logs: high-voltage systems, embedded control, power electronics.',
  inLanguage: 'en',
  publisher: {
    '@type': 'Person',
    '@id': 'https://igrimaldi.engineering/#person',
    name: 'Vincenzo Grimaldi',
    url: 'https://igrimaldi.engineering/',
    jobTitle: 'Physics-Informed Cyber-Physical Systems Engineer',
    sameAs: [
      'https://github.com/iceccarelli',
      'https://www.linkedin.com/in/vincenzo-ceccarelli-grimaldi-2912b42a0',
      'https://x.com/Vince87Grimaldi',
      'https://www.instagram.com/grimaldiengineering/',
      'https://igrimaldi.engineering/',
      'https://grimaldi.ca/',
    ],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" id="top">
      <body>
        <LanguageProvider>
          <Chrome>{children}</Chrome>
        </LanguageProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }} />
      </body>
    </html>
  );
}

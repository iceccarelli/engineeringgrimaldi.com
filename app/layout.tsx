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
    'Trades 2.0 by Grimaldi Engineering: the Forge Line migrates palletizing, flooring, painting and drying from manual craft to automated systems — plus high-voltage, embedded and power-electronics engineering documented with instruments.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Grimaldi Engineering — Hardware & Electrical Engineering',
    description:
      'The Forge Line: one automation product per trade — palletizing, flooring, painting, drying. Trades 2.0, with the engineering documented underneath.',
    url: `${SITE_URL}/`,
    type: 'website',
  },
};

const forgeList = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${'https://engineeringgrimaldi.com'}/#forge-line`,
  name: 'The Forge Line — Trades 2.0',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Palletizer OS', url: 'https://github.com/iceccarelli/palletizer' },
    { '@type': 'ListItem', position: 2, name: 'FloorForge AI', url: 'https://github.com/iceccarelli/floorforge-ai' },
    { '@type': 'ListItem', position: 3, name: 'PaintForge AI', url: 'https://github.com/iceccarelli/paintforge-ai' },
    { '@type': 'ListItem', position: 4, name: 'DryForge AI', url: 'https://github.com/iceccarelli/dryforge-ai' },
  ],
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(forgeList) }} />
      </body>
    </html>
  );
}

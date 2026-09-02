/**
 * JSON-LD builders. Plain objects, serialized by <JsonLd/>.
 * Person lives on THIS origin (with @id continuity to the portfolio),
 * plus ProfessionalService, SoftwareApplication, FAQPage, BreadcrumbList.
 */

import type { Lang } from './i18n';
import { langHref } from './i18n';
import type { ForgeProduct } from './forge';
import { PERSON_NAME, SAME_AS, SITE_NAME, SITE_URL } from './site';

type JsonLdObject = Record<string, unknown>;

export function personSchema(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: PERSON_NAME,
    alternateName: 'Vincenzo Grimaldi',
    url: `${SITE_URL}/`,
    jobTitle: 'Engineer — palletizing software, high-voltage rail digitalisation',
    workLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: 'Frankfurt am Main', addressCountry: 'DE' } },
    sameAs: [...SAME_AS],
  };
}

export function websiteSchema(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    inLanguage: ['en', 'de'],
    publisher: { '@id': `${SITE_URL}/#person` },
  };
}

export function professionalServiceSchema(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#service`,
    name: `${SITE_NAME} — Engineering Advisory`,
    url: `${SITE_URL}/book`,
    founder: { '@id': `${SITE_URL}/#person` },
    areaServed: [
      { '@type': 'Country', name: 'Germany' },
      { '@type': 'AdministrativeArea', name: 'European Union' },
    ],
    knowsAbout: [
      'electrical machines',
      'actuators and servo drives',
      'asynchronous and synchronous machines',
      'battery management systems',
      'battery pack architecture',
      'power electronics',
      'high-voltage engineering',
      'embedded control',
      'real-time machine control',
      'fieldbus and motion control integration',
      'robot cell architecture',
      'palletizing automation',
      'grid physics',
    ],
  };
}

export function softwareApplicationSchema(lang: Lang, product: ForgeProduct): JsonLdObject {
  const path = product.slug === 'palletizer' ? '/palletizer' : `/forge/${product.slug}`;
  const url = `${SITE_URL}${langHref(lang, path)}`;
  const schema: JsonLdObject = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${SITE_URL}${path}#software`,
    name: product.name,
    url,
    applicationCategory: 'IndustrialApplication',
    operatingSystem: 'Web',
    description: product.metaDescription[lang],
    author: { '@id': `${SITE_URL}/#person` },
  };
  if (product.repo) {
    schema.codeRepository = product.repo;
  }
  if (product.demo) {
    schema.installUrl = product.demo;
  }
  // Offers only for the shipped product, and honestly: fixed fee quoted per CSV.
  if (product.status === 'SHIPPED') {
    schema.offers = {
      '@type': 'Offer',
      url: `${SITE_URL}/palletizer#pilot`,
      priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'EUR' },
      description: '30-day software pilot on the customer CSV with a kill date at week 0; fixed fee quoted within one working day.',
      availability: 'https://schema.org/InStock',
    };
  }
  return schema;
}

export function faqSchema(lang: Lang, product: ForgeProduct): JsonLdObject | null {
  if (product.faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${SITE_URL}${product.slug === 'palletizer' ? '/palletizer' : `/forge/${product.slug}`}#faq`,
    mainEntity: product.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q[lang],
      acceptedAnswer: { '@type': 'Answer', text: f.a[lang] },
    })),
  };
}

export function breadcrumbSchema(
  lang: Lang,
  crumbs: { name: string; path: string }[],
): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${langHref(lang, c.path)}`,
    })),
  };
}

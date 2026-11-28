import React from 'react';
import { BOOKS_DATA } from '@/data/mockData';
import { CLASS_6_DIGITAL_BOOK, HIDE_DIGITAL_CLASS_6 } from '@/data/digitalBooksData';
import type { BookProduct, DigitalBook } from '@/types';

export const SITE_URL = 'https://belesu.in';
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

/** Safely serialize JSON-LD so product text cannot terminate the script element. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const serialized = JSON.stringify(data).replace(/</g, '\\u003c');
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialized }}
    />
  );
}

export function createOrganizationSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: 'Belesu',
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/Belesu-logo1.png`,
    telephone: '+919606636804',
    sameAs: [
      'https://www.facebook.com/belesu.in',
      'https://www.instagram.com/belesu.in/',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+919606636804',
      contactType: 'customer support',
      url: `${SITE_URL}/contact/`,
    },
  };
}

export function createWebsiteSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: 'Belesu',
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: 'en-IN',
  };
}

function absoluteUrl(path: string): string {
  return path.startsWith('http://') || path.startsWith('https://')
    ? path
    : `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

function createOffer(price: number, url: string): Record<string, unknown> {
  return {
    '@type': 'Offer',
    url,
    priceCurrency: 'INR',
    price: Number(price).toFixed(2),
    itemCondition: 'https://schema.org/NewCondition',
    seller: { '@id': ORGANIZATION_ID },
  };
}

function createBreadcrumbSchema(name: string, productUrl: string, middleLabel = 'Books', middleUrl = '/books/'): Record<string, unknown> {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: middleLabel, item: absoluteUrl(middleUrl) },
      { '@type': 'ListItem', position: 3, name, item: productUrl },
    ],
  };
}

export function createPhysicalBookSchema(book: BookProduct): Record<string, unknown> {
  const url = absoluteUrl(`/books/${book.slug}/`);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        '@id': `${url}#product`,
        name: book.title,
        description: book.description,
        image: [absoluteUrl(book.coverImage)],
        sku: book.sku,
        category: 'Educational Books',
        brand: { '@type': 'Brand', name: 'Belesu' },
        offers: createOffer(book.price, url),
      },
      createBreadcrumbSchema(book.title, url),
    ],
  };
}

export function createDigitalBookSchema(book: DigitalBook): Record<string, unknown> {
  const url = absoluteUrl(`/digital/${book.slug}/`);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        '@id': `${url}#product`,
        name: book.title,
        description: book.description,
        image: [absoluteUrl(book.coverImage)],
        sku: book.sku,
        category: 'Digital Educational Books',
        brand: { '@type': 'Brand', name: 'Belesu' },
        offers: createOffer(book.price, url),
      },
      createBreadcrumbSchema(book.title, url, 'Digital Guidebooks', '/digital/'),
    ],
  };
}

export function createBooksCollectionSchema(): Record<string, unknown> {
  const physicalBooks = BOOKS_DATA.filter(
    (book) => book.series !== 'Spoken' && book.gradeClass > 0
  );
  const activeDigitalBooks = !HIDE_DIGITAL_CLASS_6 &&
    CLASS_6_DIGITAL_BOOK.isPriceConfirmed &&
    !CLASS_6_DIGITAL_BOOK.isComingSoon
      ? [CLASS_6_DIGITAL_BOOK]
      : [];
  const items = [
    ...physicalBooks.map((book) => ({ name: book.title, url: absoluteUrl(`/books/${book.slug}/`) })),
    ...activeDigitalBooks.map((book) => ({ name: book.title, url: absoluteUrl(`/digital/${book.slug}/`) })),
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_URL}/books/#webpage`,
    url: `${SITE_URL}/books/`,
    name: 'Buy Kannada Guidebooks Online | Belesu',
    description: 'Explore Belesu English-translated Kannada guidebooks for school students.',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: item.url,
      })),
    },
  };
}

export function getPhysicalBookBySlug(slug: string): BookProduct | undefined {
  return BOOKS_DATA.find((book) => book.slug === slug);
}

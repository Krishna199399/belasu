import { JsonLd, getPhysicalBookBySlug, createPhysicalBookSchema } from '@/lib/structuredData';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Buy A Destination to Speak Kannada Book | Belesu',
  description:
    'Buy A Destination to Speak Kannada by Belesu for ₹295. Learn everyday Kannada conversations, basic Kannada words and useful phrases with this illustrated book for beginners and non-Kannada speakers.',
  keywords: [
    'Kannada Learning Book',
    'Buy Kannada Book',
    'Kannada Conversation Book',
    'Kannada Learning Book for Beginners',
    'Spoken Kannada Book',
    'Learn Kannada',
    'Basic Kannada Words',
  ],
  alternates: {
    canonical: '/books/a-destination-to-speak-kannada/',
  },
  openGraph: {
    title: 'Buy A Destination to Speak Kannada Book | Belesu',
    description: 'Buy A Destination to Speak Kannada by Belesu for ₹295. Learn everyday Kannada conversations, basic Kannada words and useful phrases with this illustrated book for beginners and non-Kannada speakers.',
    url: 'https://belesu.in/books/a-destination-to-speak-kannada/',
    siteName: 'Belesu',
    images: [{ url: 'https://belesu.in/covers/a-destination-to-speak-kannada.png', alt: 'A Destination to Speak Kannada' }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buy A Destination to Speak Kannada Book | Belesu',
    description: 'Learn everyday Kannada conversations, basic Kannada words and useful phrases.',
    images: ['https://belesu.in/covers/a-destination-to-speak-kannada.png'],
  },
};

export default function DestinationLayout({ children }: { children: React.ReactNode }) {
  const book = getPhysicalBookBySlug('a-destination-to-speak-kannada');
  return (
    <>
      {book && <JsonLd data={createPhysicalBookSchema(book)} />}
      {children}
    </>
  );
}

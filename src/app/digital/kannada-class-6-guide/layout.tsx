import { JsonLd, createDigitalBookSchema } from '@/lib/structuredData';
import { CLASS_6_DIGITAL_BOOK, HIDE_DIGITAL_CLASS_6 } from '@/data/digitalBooksData';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Class 6 Kannada Digital Guidebook in English | Belesu',
  description:
    'Buy the Belesu Class 6 Kannada digital guidebook with English translations, solved exercises and chapter summaries. Get lifetime access for ₹295.',
  keywords: [
    'Class 6 Kannada Digital Guidebook',
    'Class 6 Kannada guide',
    '6th standard Kannada guide',
    'Kannada guidebook in English',
    'digital Kannada book',
    'Karnataka State Board Class 6 Kannada',
  ],
  alternates: {
    canonical: '/digital/kannada-class-6-guide/',
  },
  openGraph: {
    title: 'Class 6 Kannada Digital Guidebook in English | Belesu',
    description: 'Buy the Belesu Class 6 Kannada digital guidebook with English translations, solved exercises and chapter summaries. Get lifetime access for ₹295.',
    url: 'https://belesu.in/digital/kannada-class-6-guide/',
    siteName: 'Belesu',
    images: [{ url: 'https://belesu.in/digital/class-6-siri/cover.jpeg', alt: 'Belesu Class 6 Kannada Digital Guidebook' }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Class 6 Kannada Digital Guidebook in English | Belesu',
    description: 'Explore the Belesu Class 6 Kannada digital guidebook with English translations and solved exercises.',
    images: ['https://belesu.in/digital/class-6-siri/cover.jpeg'],
  },
};

export default function DigitalClass6Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {!HIDE_DIGITAL_CLASS_6 && CLASS_6_DIGITAL_BOOK.isPriceConfirmed && !CLASS_6_DIGITAL_BOOK.isComingSoon && (
        <JsonLd data={createDigitalBookSchema(CLASS_6_DIGITAL_BOOK)} />
      )}
      {children}
    </>
  );
}

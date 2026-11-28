import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Buy Kannada Guidebooks Online | Belesu',
  description:
    'Buy Kannada guidebooks online from Belesu. Explore English-translated Kannada books for Classes 1–5 and the Class 6 Siri digital guidebook.',
  keywords: [
    'Kannada guidebooks',
    'Buy Kannada guidebooks online',
    'Kannada guidebooks online',
    'English-translated Kannada guidebooks',
    'Kannada academic guidebooks',
    'Kannada guidebooks by class',
    'Kannada study books',
  ],
  alternates: {
    canonical: '/books/',
  },
  openGraph: {
    title: 'Buy Kannada Guidebooks Online | Belesu',
    description: 'Buy Kannada guidebooks online from Belesu. Explore English-translated Kannada books for Classes 1–5 and the Class 6 Siri digital guidebook.',
    url: 'https://belesu.in/books/',
    siteName: 'Belesu',
    images: [{ url: 'https://belesu.in/Belesu-logo1.png', width: 788, height: 296, alt: 'Belesu' }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buy Kannada Guidebooks Online | Belesu',
    description: 'Explore Belesu English-translated Kannada guidebooks for school students.',
    images: ['https://belesu.in/Belesu-logo1.png'],
  },
};

export default function BooksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import { Suspense } from 'react';
import type { Metadata } from 'next';
import SaviClass3Client from './SaviClass3Client';

export const metadata: Metadata = {
  title: 'Buy Savi Kannada Class 3 Guidebook Online | Belesu',
  description:
    'Buy the Savi Kannada Class 3 English-translated guidebook for lesson translations, Kannada grammar, vocabulary support and exam practice.',
  keywords: [
    'Savi Kannada Class 3',
    'Savi Kannada English translated guidebook',
    'Kannada guidebook for Class 3',
    'English-translated Kannada book',
    'Kannada academic guidebook Class 3',
  ],
  alternates: {
    canonical: '/books/savi-kannada-class-3/',
  },
  openGraph: {
    title: 'Buy Savi Kannada Class 3 Guidebook Online | Belesu',
    description: 'Buy the Savi Kannada Class 3 English-translated guidebook for lesson translations, Kannada grammar, vocabulary support and exam practice.',
    url: 'https://belesu.in/books/savi-kannada-class-3/',
    siteName: 'Belesu',
    images: [{ url: 'https://belesu.in/covers/savi-3.png', alt: 'Buy Savi Kannada Class 3 Guidebook Online | Belesu' }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buy Savi Kannada Class 3 Guidebook Online | Belesu',
    description: 'Buy the Savi Kannada Class 3 English-translated guidebook for lesson translations, Kannada grammar, vocabulary support and exam practice.',
    images: ['https://belesu.in/covers/savi-3.png'],
  },
};

export default function SaviClass3Page() {
  return (
    <Suspense fallback={null}>
      <SaviClass3Client />
    </Suspense>
  );
}

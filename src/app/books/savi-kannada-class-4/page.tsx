import { Suspense } from 'react';
import type { Metadata } from 'next';
import SaviClass4Client from './SaviClass4Client';

export const metadata: Metadata = {
  title: 'Buy Savi Kannada Class 4 Guidebook Online | Belesu',
  description:
    'Buy the Savi Kannada Class 4 English-translated guidebook for prose, poetry, Kannada grammar, textbook answers and exam preparation.',
  keywords: [
    'Savi Kannada Class 4',
    'Savi Kannada English translated guidebook',
    'Kannada guidebook for Class 4',
    'English-translated Kannada book',
    'Kannada academic guidebook Class 4',
  ],
  alternates: {
    canonical: '/books/savi-kannada-class-4/',
  },
  openGraph: {
    title: 'Buy Savi Kannada Class 4 Guidebook Online | Belesu',
    description: 'Buy the Savi Kannada Class 4 English-translated guidebook for prose, poetry, Kannada grammar, textbook answers and exam preparation.',
    url: 'https://belesu.in/books/savi-kannada-class-4/',
    siteName: 'Belesu',
    images: [{ url: 'https://belesu.in/covers/savi-4.png', alt: 'Buy Savi Kannada Class 4 Guidebook Online | Belesu' }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buy Savi Kannada Class 4 Guidebook Online | Belesu',
    description: 'Buy the Savi Kannada Class 4 English-translated guidebook for prose, poetry, Kannada grammar, textbook answers and exam preparation.',
    images: ['https://belesu.in/covers/savi-4.png'],
  },
};

export default function SaviClass4Page() {
  return (
    <Suspense fallback={null}>
      <SaviClass4Client />
    </Suspense>
  );
}

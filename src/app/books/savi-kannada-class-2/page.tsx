import type { Metadata } from 'next';
import SaviClass2Client from './SaviClass2Client';

export const metadata: Metadata = {
  title: 'Buy Savi Kannada Class 2 Guidebook Online | Belesu',
  description:
    'Buy the Savi Kannada Class 2 English-translated guidebook for academic support, Kannada grammar, lesson translations and textbook exercises.',
  keywords: [
    'Savi Kannada Class 2',
    'Savi Kannada English translated guidebook',
    'Kannada guidebook for Class 2',
    'English-translated Kannada book',
    'Kannada academic guidebook Class 2',
  ],
  alternates: {
    canonical: '/books/savi-kannada-class-2/',
  },
  openGraph: {
    title: 'Buy Savi Kannada Class 2 Guidebook Online | Belesu',
    description: 'Buy the Savi Kannada Class 2 English-translated guidebook for academic support, Kannada grammar, lesson translations and textbook exercises.',
    url: 'https://belesu.in/books/savi-kannada-class-2/',
    siteName: 'Belesu',
    images: [{ url: 'https://belesu.in/covers/savi-2.png', alt: 'Buy Savi Kannada Class 2 Guidebook Online | Belesu' }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buy Savi Kannada Class 2 Guidebook Online | Belesu',
    description: 'Buy the Savi Kannada Class 2 English-translated guidebook for academic support, Kannada grammar, lesson translations and textbook exercises.',
    images: ['https://belesu.in/covers/savi-2.png'],
  },
};

export default function SaviClass2Page() {
  return <SaviClass2Client />;
}

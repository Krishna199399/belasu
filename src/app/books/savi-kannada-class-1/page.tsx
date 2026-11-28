import type { Metadata } from 'next';
import SaviClass1Client from './SaviClass1Client';

export const metadata: Metadata = {
  title: 'Buy Savi Kannada Class 1 Guidebook Online | Belesu',
  description:
    'Buy the Savi Kannada Class 1 English-translated guidebook for academic support, Kannada pronunciation, lesson translations and textbook exercises.',
  keywords: [
    'Savi Kannada Class 1',
    'Savi Kannada English translated guidebook',
    'Kannada guidebook for Class 1',
    'English-translated Kannada book',
    'Kannada academic guidebook Class 1',
  ],
  alternates: {
    canonical: '/books/savi-kannada-class-1/',
  },
  openGraph: {
    title: 'Buy Savi Kannada Class 1 Guidebook Online | Belesu',
    description: 'Buy the Savi Kannada Class 1 English-translated guidebook for academic support, Kannada pronunciation, lesson translations and textbook exercises.',
    url: 'https://belesu.in/books/savi-kannada-class-1/',
    siteName: 'Belesu',
    images: [{ url: 'https://belesu.in/covers/savi-1.png', alt: 'Buy Savi Kannada Class 1 Guidebook Online | Belesu' }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buy Savi Kannada Class 1 Guidebook Online | Belesu',
    description: 'Buy the Savi Kannada Class 1 English-translated guidebook for academic support, Kannada pronunciation, lesson translations and textbook exercises.',
    images: ['https://belesu.in/covers/savi-1.png'],
  },
};

export default function SaviClass1Page() {
  return <SaviClass1Client />;
}

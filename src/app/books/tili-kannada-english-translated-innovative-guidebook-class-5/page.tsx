import type { Metadata } from 'next';
import TiliClass5Client from './TiliClass5Client';

export const metadata: Metadata = {
  title: 'Buy Tili Kannada Class 5 Guidebook Online | Belesu',
  description:
    'Buy the Tili Kannada Class 5 English-translated innovative guidebook for reading comprehension, vocabulary, Kannada grammar and exam preparation.',
  keywords: [
    'Tili Kannada Class 5',
    'Tili Kannada English translated guidebook',
    'Kannada guidebook for Class 5',
    'Tili Kannada guidebook online',
    'English-translated Kannada book',
    'Kannada grammar guidebook Class 5',
    'Kannada academic guidebook Class 5',
  ],
  alternates: {
    canonical: '/books/tili-kannada-english-translated-innovative-guidebook-class-5/',
  },
  openGraph: {
    title: 'Buy Tili Kannada Class 5 Guidebook Online | Belesu',
    description: 'Buy the Tili Kannada Class 5 English-translated innovative guidebook for reading comprehension, vocabulary, Kannada grammar and exam preparation.',
    url: 'https://belesu.in/books/tili-kannada-english-translated-innovative-guidebook-class-5/',
    siteName: 'Belesu',
    images: [{ url: 'https://belesu.in/covers/tili-5.png', alt: 'Buy Tili Kannada Class 5 Guidebook Online | Belesu' }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buy Tili Kannada Class 5 Guidebook Online | Belesu',
    description: 'Buy the Tili Kannada Class 5 English-translated innovative guidebook for reading comprehension, vocabulary, Kannada grammar and exam preparation.',
    images: ['https://belesu.in/covers/tili-5.png'],
  },
};

export default function TiliClass5Page() {
  return <TiliClass5Client />;
}

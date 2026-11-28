import type { Metadata } from 'next';
import KaliClass4Client from './KaliClass4Client';

export const metadata: Metadata = {
  title: 'Buy Kali Kannada Class 4 Guidebook Online | Belesu',
  description:
    'Buy the Kali Kannada Class 4 English-translated guidebook for lesson translations, Kannada grammar, textbook answers and exam revision.',
  keywords: [
    'Kali Kannada Class 4',
    'Kali Kannada English translated guidebook',
    'Kannada guidebook for Class 4',
    'English-translated Kannada book',
    'Kannada academic guidebook Class 4',
  ],
  alternates: {
    canonical: '/books/kali-kannada-english-translated-innovative-guidebook-class-4/',
  },
  openGraph: {
    title: 'Buy Kali Kannada Class 4 Guidebook Online | Belesu',
    description: 'Buy the Kali Kannada Class 4 English-translated guidebook for lesson translations, Kannada grammar, textbook answers and exam revision.',
    url: 'https://belesu.in/books/kali-kannada-english-translated-innovative-guidebook-class-4/',
    siteName: 'Belesu',
    images: [{ url: 'https://belesu.in/covers/kali-4.png', alt: 'Buy Kali Kannada Class 4 Guidebook Online | Belesu' }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buy Kali Kannada Class 4 Guidebook Online | Belesu',
    description: 'Buy the Kali Kannada Class 4 English-translated guidebook for lesson translations, Kannada grammar, textbook answers and exam revision.',
    images: ['https://belesu.in/covers/kali-4.png'],
  },
};

export default function KaliClass4Page() {
  return <KaliClass4Client />;
}

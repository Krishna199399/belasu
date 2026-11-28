import type { Metadata } from 'next';
import KaliClass3Client from './KaliClass3Client';

export const metadata: Metadata = {
  title: 'Buy Kali Kannada Class 3 Guidebook Online | Belesu',
  description:
    'Buy the Kali Kannada Class 3 English-translated guidebook for lesson translations, vocabulary, Kannada grammar and exam preparation.',
  keywords: [
    'Kali Kannada Class 3',
    'Kali Kannada English translated guidebook',
    'Kannada guidebook for Class 3',
    'English-translated Kannada book',
    'Kannada academic guidebook Class 3',
  ],
  alternates: {
    canonical: '/books/kali-kannada-english-translated-innovative-guidebook-class-3/',
  },
  openGraph: {
    title: 'Buy Kali Kannada Class 3 Guidebook Online | Belesu',
    description: 'Buy the Kali Kannada Class 3 English-translated guidebook for lesson translations, vocabulary, Kannada grammar and exam preparation.',
    url: 'https://belesu.in/books/kali-kannada-english-translated-innovative-guidebook-class-3/',
    siteName: 'Belesu',
    images: [{ url: 'https://belesu.in/covers/kali-3.png', alt: 'Buy Kali Kannada Class 3 Guidebook Online | Belesu' }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buy Kali Kannada Class 3 Guidebook Online | Belesu',
    description: 'Buy the Kali Kannada Class 3 English-translated guidebook for lesson translations, vocabulary, Kannada grammar and exam preparation.',
    images: ['https://belesu.in/covers/kali-3.png'],
  },
};

export default function KaliClass3Page() {
  return <KaliClass3Client />;
}

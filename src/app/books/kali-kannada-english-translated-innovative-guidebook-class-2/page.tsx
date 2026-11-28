import type { Metadata } from 'next';
import KaliClass2Client from './KaliClass2Client';

export const metadata: Metadata = {
  title: 'Buy Kali Kannada Class 2 Guidebook Online | Belesu',
  description:
    'Buy the Kali Kannada Class 2 English-translated guidebook for lesson translations, Kannada grammar, pronunciation support and solved exercises.',
  keywords: [
    'Kali Kannada Class 2',
    'Kali Kannada English translated guidebook',
    'Kannada guidebook for Class 2',
    'English-translated Kannada book',
    'Kannada academic guidebook Class 2',
  ],
  alternates: {
    canonical: '/books/kali-kannada-english-translated-innovative-guidebook-class-2/',
  },
  openGraph: {
    title: 'Buy Kali Kannada Class 2 Guidebook Online | Belesu',
    description: 'Buy the Kali Kannada Class 2 English-translated guidebook for lesson translations, Kannada grammar, pronunciation support and solved exercises.',
    url: 'https://belesu.in/books/kali-kannada-english-translated-innovative-guidebook-class-2/',
    siteName: 'Belesu',
    images: [{ url: 'https://belesu.in/covers/kali-2.png', alt: 'Buy Kali Kannada Class 2 Guidebook Online | Belesu' }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buy Kali Kannada Class 2 Guidebook Online | Belesu',
    description: 'Buy the Kali Kannada Class 2 English-translated guidebook for lesson translations, Kannada grammar, pronunciation support and solved exercises.',
    images: ['https://belesu.in/covers/kali-2.png'],
  },
};

export default function KaliClass2Page() {
  return <KaliClass2Client />;
}

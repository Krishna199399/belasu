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
};

export default function KaliClass2Page() {
  return <KaliClass2Client />;
}

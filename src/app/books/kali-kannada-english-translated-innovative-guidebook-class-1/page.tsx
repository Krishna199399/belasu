import type { Metadata } from 'next';
import KaliClass1Client from './KaliClass1Client';

export const metadata: Metadata = {
  title: 'Buy Kali Kannada Class 1 Guidebook Online | Belesu',
  description:
    'Buy the Kali Kannada Class 1 English-translated guidebook for Kannada pronunciation, alphabet practice, basic vocabulary and beginner learning support.',
  keywords: [
    'Kali Kannada Class 1',
    'Kali Kannada English translated guidebook',
    'Kannada guidebook for Class 1',
    'English-translated Kannada book',
    'Kannada academic guidebook Class 1',
  ],
  alternates: {
    canonical: '/books/kali-kannada-english-translated-innovative-guidebook-class-1/',
  },
};

export default function KaliClass1Page() {
  return <KaliClass1Client />;
}

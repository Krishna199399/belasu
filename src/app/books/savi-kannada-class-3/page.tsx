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
};

export default function SaviClass3Page() {
  return <SaviClass3Client />;
}

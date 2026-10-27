import type { Metadata } from 'next';
import SiriClass5Client from './SiriClass5Client';

export const metadata: Metadata = {
  title: 'Buy Siri Kannada Class 5 Guidebook Online | Belesu',
  description:
    'Buy the Siri Kannada Class 5 English-translated guidebook for Kannada literature, essay writing, letter writing, grammar and exam preparation.',
  keywords: [
    'Siri Kannada Class 5',
    'Siri Kannada English translated guidebook',
    'Kannada guidebook for Class 5',
    'Siri Kannada guidebook online',
    'English-translated Kannada book',
    'Kannada essay and letter writing guide',
    'Kannada academic guidebook Class 5',
  ],
  alternates: {
    canonical: '/books/siri-kannada-english-translated-guidebook-class-5/',
  },
};

export default function SiriClass5Page() {
  return <SiriClass5Client />;
}

import type { Metadata } from 'next';
import React from 'react';

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
    canonical: '/books/tili-kannada-english-translated-innovative-guidebook-class-5',
  },
};

export default function TiliClass5Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

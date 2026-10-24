import type { Metadata } from 'next';
import React from 'react';

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
    canonical: '/books/kali-kannada-english-translated-innovative-guidebook-class-4',
  },
};

export default function KaliClass4Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

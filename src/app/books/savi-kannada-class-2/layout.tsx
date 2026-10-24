import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Buy Savi Kannada Class 2 Guidebook Online | Belesu',
  description:
    'Buy the Savi Kannada Class 2 English-translated guidebook for academic support, Kannada grammar, lesson translations and textbook exercises.',
  keywords: [
    'Savi Kannada Class 2',
    'Savi Kannada English translated guidebook',
    'Kannada guidebook for Class 2',
    'English-translated Kannada book',
    'Kannada academic guidebook Class 2',
  ],
  alternates: {
    canonical: '/books/savi-kannada-class-2',
  },
};

export default function SaviClass2Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

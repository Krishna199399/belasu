import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Buy Savi Kannada Class 1 Guidebook Online | Belesu',
  description:
    'Buy the Savi Kannada Class 1 English-translated guidebook for academic support, Kannada pronunciation, lesson translations and textbook exercises.',
  keywords: [
    'Savi Kannada Class 1',
    'Savi Kannada English translated guidebook',
    'Kannada guidebook for Class 1',
    'English-translated Kannada book',
    'Kannada academic guidebook Class 1',
  ],
  alternates: {
    canonical: '/books/savi-kannada-class-1',
  },
};

export default function SaviClass1Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

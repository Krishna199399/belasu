import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Buy Kannada Guidebooks Online | Belesu',
  description:
    'Buy Kannada guidebooks online from Belesu. Explore English-translated Kannada books for Classes 1–5 and the Class 6 Siri digital guidebook.',
  keywords: [
    'Kannada guidebooks',
    'Buy Kannada guidebooks online',
    'Kannada guidebooks online',
    'English-translated Kannada guidebooks',
    'Kannada academic guidebooks',
    'Kannada guidebooks by class',
    'Kannada study books',
  ],
  alternates: {
    canonical: '/books',
  },
};

export default function BooksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

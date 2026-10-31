import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Class 6 Kannada Digital Guidebook in English | Belesu',
  description:
    'Buy the Belesu Class 6 Kannada digital guidebook with English translations, solved exercises and chapter summaries. Get lifetime access for ₹295.',
  keywords: [
    'Class 6 Kannada Digital Guidebook',
    'Class 6 Kannada guide',
    '6th standard Kannada guide',
    'Kannada guidebook in English',
    'digital Kannada book',
    'Karnataka State Board Class 6 Kannada',
  ],
  alternates: {
    canonical: '/digital/kannada-class-6-guide',
  },
};

export default function DigitalClass6Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

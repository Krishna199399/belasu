import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Digital Kannada Learning Platform for Students | Belesu',
  description:
    "Discover Belesu's digital Kannada academic guidebooks with English translations, online reading and lifetime access through a one-time purchase.",
  keywords: [
    'Digital Kannada Guidebooks',
    'Digital Kannada learning',
    'Kannada digital books',
    'online Kannada guidebooks',
    'digital academic books',
    'English-translated Kannada guidebooks',
  ],
  alternates: {
    canonical: '/digital',
  },
};

export default function DigitalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

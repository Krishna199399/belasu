import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Buy A Destination to Speak Kannada Book | Belesu',
  description:
    'Buy A Destination to Speak Kannada by Belesu for ₹295. Learn everyday Kannada conversations, basic Kannada words and useful phrases with this illustrated book for beginners and non-Kannada speakers.',
  keywords: [
    'Kannada Learning Book',
    'Buy Kannada Book',
    'Kannada Conversation Book',
    'Kannada Learning Book for Beginners',
    'Spoken Kannada Book',
    'Learn Kannada',
    'Basic Kannada Words',
  ],
  alternates: {
    canonical: '/books/a-destination-to-speak-kannada',
  },
};

export default function DestinationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

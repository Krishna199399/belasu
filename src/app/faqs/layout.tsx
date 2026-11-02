import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQs) | Belesu',
  description:
    'Find answers to common questions about Belesu Kannada guidebooks, shipping timelines across Karnataka, payment options, and book replacements.',
  alternates: {
    canonical: '/faqs/',
  },
};

export default function FAQsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}


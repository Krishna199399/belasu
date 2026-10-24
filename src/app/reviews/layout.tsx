import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Kannada Guidebook Reviews from Students & Parents | Belesu',
  description:
    'Read reviews and feedback about Belesu Kannada guidebooks and academic learning resources from students and parents.',
  alternates: {
    canonical: '/reviews',
  },
};

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

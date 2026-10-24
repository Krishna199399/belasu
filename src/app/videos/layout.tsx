import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Kannada Learning Videos for Students | Belesu',
  description:
    'Explore Belesu videos for Kannada learning, lesson explanations and academic support for students.',
  alternates: {
    canonical: '/videos',
  },
};

export default function VideosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

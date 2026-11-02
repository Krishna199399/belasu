import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Video Gallery | Belesu',
  description:
    'Explore Belesu video gallery for Kannada learning, classroom walkthroughs, parent-child study routines, and book demonstrations.',
  alternates: {
    canonical: '/video-gallery/',
  },
};

export default function VideoGalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}


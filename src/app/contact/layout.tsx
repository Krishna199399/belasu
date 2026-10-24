import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Contact Belesu | Call 9606636804 for Support',
  description:
    'Contact Belesu at 9606636804 for questions about Kannada guidebooks, orders, delivery or academic learning resources.',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

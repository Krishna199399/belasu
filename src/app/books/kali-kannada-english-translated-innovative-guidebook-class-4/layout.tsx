import { JsonLd, getPhysicalBookBySlug, createPhysicalBookSchema } from '@/lib/structuredData';
import React from 'react';

export default function KaliClass4Layout({ children }: { children: React.ReactNode }) {
  const book = getPhysicalBookBySlug('kali-kannada-english-translated-innovative-guidebook-class-4');
  return (
    <>
      {book && <JsonLd data={createPhysicalBookSchema(book)} />}
      {children}
    </>
  );
}

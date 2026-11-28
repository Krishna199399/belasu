import { JsonLd, getPhysicalBookBySlug, createPhysicalBookSchema } from '@/lib/structuredData';
import React from 'react';

export default function SiriClass5Layout({ children }: { children: React.ReactNode }) {
  const book = getPhysicalBookBySlug('siri-kannada-english-translated-guidebook-class-5');
  return (
    <>
      {book && <JsonLd data={createPhysicalBookSchema(book)} />}
      {children}
    </>
  );
}

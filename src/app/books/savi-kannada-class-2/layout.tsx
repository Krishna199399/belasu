import { JsonLd, getPhysicalBookBySlug, createPhysicalBookSchema } from '@/lib/structuredData';
import React from 'react';

export default function SaviClass2Layout({ children }: { children: React.ReactNode }) {
  const book = getPhysicalBookBySlug('savi-kannada-class-2');
  return (
    <>
      {book && <JsonLd data={createPhysicalBookSchema(book)} />}
      {children}
    </>
  );
}

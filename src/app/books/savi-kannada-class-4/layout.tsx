import { JsonLd, getPhysicalBookBySlug, createPhysicalBookSchema } from '@/lib/structuredData';
import React from 'react';

export default function SaviClass4Layout({ children }: { children: React.ReactNode }) {
  const book = getPhysicalBookBySlug('savi-kannada-class-4');
  return (
    <>
      {book && <JsonLd data={createPhysicalBookSchema(book)} />}
      {children}
    </>
  );
}

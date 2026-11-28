import { JsonLd, getPhysicalBookBySlug, createPhysicalBookSchema } from '@/lib/structuredData';
import React from 'react';

export default function TiliClass5Layout({ children }: { children: React.ReactNode }) {
  const book = getPhysicalBookBySlug('tili-kannada-english-translated-innovative-guidebook-class-5');
  return (
    <>
      {book && <JsonLd data={createPhysicalBookSchema(book)} />}
      {children}
    </>
  );
}

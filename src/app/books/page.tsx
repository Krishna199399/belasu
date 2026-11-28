import BooksPageClient from './BooksPageClient';
import { JsonLd, createBooksCollectionSchema } from '@/lib/structuredData';

export const dynamic = 'force-dynamic';

export default function BooksPage() {
  return (
    <>
      <JsonLd data={createBooksCollectionSchema()} />
      <BooksPageClient />
    </>
  );
}

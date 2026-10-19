import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { mapDbRowToBook } from '@/lib/digital';
import { DIGITAL_BOOKS_DATA, getDigitalBookBySlug } from '@/data/digitalBooksData';
import { DigitalBook } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const slug = searchParams.get('slug');
  const id = searchParams.get('id');

  try {
    const supabase = createAdminClient();

    // If specific slug is requested:
    if (slug) {
      const { data: dbBook, error } = await supabase
        .from('digital_books')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (!error && dbBook) {
        return Response.json(
          { success: true, book: mapDbRowToBook(dbBook) },
          { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
        );
      }

      if (error) {
        console.warn(`DB error fetching slug "${slug}":`, error.message);
        const fallback = getDigitalBookBySlug(slug);
        if (fallback) {
          return Response.json(
            { success: true, book: fallback },
            { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
          );
        }
      }

      return Response.json(
        { success: false, error: 'Book not found' },
        { status: 404, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
      );
    }

    // If specific id is requested:
    if (id) {
      const { data: dbBook, error } = await supabase
        .from('digital_books')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .maybeSingle();

      if (!error && dbBook) {
        return Response.json(
          { success: true, book: mapDbRowToBook(dbBook) },
          { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
        );
      }

      return Response.json(
        { success: false, error: 'Book not found' },
        { status: 404, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
      );
    }

    // Return all active digital books
    const { data: dbBooks, error } = await supabase
      .from('digital_books')
      .select('*')
      .eq('is_active', true)
      .order('grade_class', { ascending: true });

    if (!error && Array.isArray(dbBooks)) {
      const books: DigitalBook[] = dbBooks.map(mapDbRowToBook);
      return Response.json(
        { success: true, books },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
      );
    }

    if (error) {
      console.warn('DB error fetching digital_books, falling back to static:', error.message);
      return Response.json(
        { success: true, books: DIGITAL_BOOKS_DATA },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
      );
    }

    return Response.json(
      { success: true, books: [] },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
    );
  } catch (err: any) {
    console.error('Fatal error in /api/digital/books:', err);
    return Response.json(
      { success: true, books: DIGITAL_BOOKS_DATA },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
    );
  }
}

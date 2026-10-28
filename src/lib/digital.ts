import { DigitalBook } from '@/types';
import { createAdminClient } from '@/lib/supabase';
import { DIGITAL_BOOKS_DATA, getDigitalBookBySlug } from '@/data/digitalBooksData';

/**
 * Maps a Supabase row from public.digital_books to the application DigitalBook interface
 */
export function mapDbRowToBook(row: any): DigitalBook {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    sku: row.sku,
    subject: row.subject,
    gradeClass: Number(row.grade_class),
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    coverImage: row.cover_image || '/digital/class-6-siri/cover.jpeg',
    totalPages: Number(row.total_pages) || 50,
    isFreePreviewPages: row.is_free_preview_pages !== undefined ? Number(row.is_free_preview_pages) : 5,
    description: row.description || '',
    author: row.author || 'Belesu Academic Team',
    language: row.language || 'Kannada with English Translations',
    badge: row.badge || undefined,
    rating: row.rating ? Number(row.rating) : 5.0,
    reviewCount: row.review_count ? Number(row.review_count) : 0,
    features: Array.isArray(row.features) ? row.features : [],
    tableOfContents: Array.isArray(row.table_of_contents) ? row.table_of_contents : [],
  };
}

/**
 * Maps partial DigitalBook object to public.digital_books database columns
 */
export function mapBookToDbRow(book: Partial<DigitalBook>) {
  return {
    id: book.id,
    slug: book.slug?.trim(),
    title: book.title?.trim(),
    sku: book.sku?.trim(),
    subject: book.subject,
    grade_class: Number(book.gradeClass),
    price: Number(book.price),
    original_price: book.originalPrice ? Number(book.originalPrice) : null,
    cover_image: book.coverImage?.trim() || '/digital-covers/kn-6.webp',
    total_pages: Number(book.totalPages) || 50,
    is_free_preview_pages: book.isFreePreviewPages !== undefined ? Number(book.isFreePreviewPages) : 5,
    description: book.description?.trim() || '',
    author: book.author?.trim() || 'Belesu Academic Team',
    language: book.language?.trim() || 'Kannada with English Translations',
    badge: book.badge?.trim() || null,
    features: Array.isArray(book.features) ? book.features : [],
    table_of_contents: Array.isArray(book.tableOfContents) ? book.tableOfContents : [],
    is_active: true,
    updated_at: new Date().toISOString(),
  };
}

/**
 * Loads all active digital books directly from Supabase DB.
 * Falls back to static data only if the database is unreachable.
 */
export async function getAllActiveDigitalBooks(): Promise<DigitalBook[]> {
  try {
    const supabase = createAdminClient();
    const { data: dbBooks, error } = await supabase
      .from('digital_books')
      .select('*')
      .eq('is_active', true)
      .order('grade_class', { ascending: true });

    if (error) {
      console.warn('Database error fetching digital_books, falling back to static:', error.message);
      return DIGITAL_BOOKS_DATA;
    }

    if (Array.isArray(dbBooks)) {
      return dbBooks.map(mapDbRowToBook);
    }

    return [];
  } catch (err: any) {
    console.error('Fatal error loading digital books from DB:', err.message);
    return DIGITAL_BOOKS_DATA;
  }
}

/**
 * Loads a single digital book by slug directly from Supabase DB.
 * Guaranteed to reflect live admin updates immediately.
 */
export async function getLiveDigitalBookBySlug(slug: string): Promise<DigitalBook | null> {
  try {
    const supabase = createAdminClient();
    const { data: dbBook, error } = await supabase
      .from('digital_books')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();

    if (!error && dbBook) {
      return mapDbRowToBook(dbBook);
    }

    if (error) {
      console.warn(`Database error fetching book slug "${slug}", checking static fallback:`, error.message);
      return getDigitalBookBySlug(slug) || null;
    }

    // Database responded normally and found no active book with this slug
    return null;
  } catch (err: any) {
    console.error(`Fatal error in getLiveDigitalBookBySlug for "${slug}":`, err.message);
    return getDigitalBookBySlug(slug) || null;
  }
}

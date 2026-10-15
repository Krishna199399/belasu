import { createAdminClient } from '@/lib/supabase';
import { DIGITAL_BOOKS_DATA } from '@/data/digitalBooksData';
import { DigitalBook } from '@/types';

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data: dbBooks, error } = await supabase
      .from('digital_books')
      .select('*')
      .eq('is_active', true)
      .order('grade_class', { ascending: true });

    if (!error && dbBooks && dbBooks.length > 0) {
      const books: DigitalBook[] = dbBooks.map((row: any) => ({
        id: row.id,
        slug: row.slug,
        title: row.title,
        sku: row.sku,
        subject: row.subject,
        gradeClass: Number(row.grade_class),
        price: Number(row.price),
        originalPrice: row.original_price ? Number(row.original_price) : undefined,
        coverImage: row.cover_image || '/digital-covers/kn-6.webp',
        totalPages: Number(row.total_pages) || 50,
        isFreePreviewPages: Number(row.is_free_preview_pages) || 5,
        description: row.description || '',
        author: row.author || 'Belesu Academic Team',
        language: row.language || 'Kannada with English Translations',
        badge: row.badge || undefined,
        rating: row.rating ? Number(row.rating) : 5.0,
        reviewCount: row.review_count ? Number(row.review_count) : 0,
        features: Array.isArray(row.features) ? row.features : [],
        tableOfContents: Array.isArray(row.table_of_contents) ? row.table_of_contents : [],
      }));

      return Response.json({ success: true, books });
    }

    return Response.json({ success: true, books: DIGITAL_BOOKS_DATA });
  } catch (err: any) {
    return Response.json({ success: true, books: DIGITAL_BOOKS_DATA });
  }
}

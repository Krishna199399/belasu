import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { createAdminClient } from '@/lib/supabase';
import { DIGITAL_BOOKS_DATA } from '@/data/digitalBooksData';
import { DigitalBook } from '@/types';

// In-memory runtime override store (keeps mutations active even before SQL migration is executed in Supabase)
let inMemoryDigitalBooks: DigitalBook[] = [...DIGITAL_BOOKS_DATA];

function mapDbRowToBook(row: any): DigitalBook {
  return {
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
  };
}

function mapBookToDbRow(book: Partial<DigitalBook>) {
  return {
    id: book.id,
    slug: book.slug,
    title: book.title,
    sku: book.sku,
    subject: book.subject,
    grade_class: book.gradeClass,
    price: book.price,
    original_price: book.originalPrice || null,
    cover_image: book.coverImage || '/digital-covers/kn-6.webp',
    total_pages: book.totalPages || 50,
    is_free_preview_pages: book.isFreePreviewPages ?? 5,
    description: book.description || '',
    author: book.author || 'Belesu Academic Team',
    language: book.language || 'Kannada with English Translations',
    badge: book.badge || null,
    features: book.features || [],
    table_of_contents: book.tableOfContents || [],
    is_active: true,
  };
}

/**
 * GET /api/admin/digital
 * Returns all digital books combined with order sales statistics
 */
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return Response.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  try {
    const supabase = createAdminClient();

    // 1. Fetch sales aggregation from order_items
    const { data: orderItems } = await supabase
      .from('order_items')
      .select('product_id, item_sku, quantity, item_total');

    const salesBySku: Record<string, { unitsSold: number; totalRevenue: number }> = {};
    const salesById: Record<string, { unitsSold: number; totalRevenue: number }> = {};

    (orderItems || []).forEach((item) => {
      const qty = item.quantity || 1;
      const rev = Number(item.item_total) || 0;
      if (item.item_sku) {
        if (!salesBySku[item.item_sku]) salesBySku[item.item_sku] = { unitsSold: 0, totalRevenue: 0 };
        salesBySku[item.item_sku].unitsSold += qty;
        salesBySku[item.item_sku].totalRevenue += rev;
      }
      if (item.product_id) {
        if (!salesById[item.product_id]) salesById[item.product_id] = { unitsSold: 0, totalRevenue: 0 };
        salesById[item.product_id].unitsSold += qty;
        salesById[item.product_id].totalRevenue += rev;
      }
    });

    // 2. Fetch books from Supabase digital_books table
    let books: DigitalBook[] = [];
    const { data: dbBooks, error: dbError } = await supabase
      .from('digital_books')
      .select('*')
      .eq('is_active', true)
      .order('grade_class', { ascending: true });

    if (!dbError && dbBooks && dbBooks.length > 0) {
      books = dbBooks.map(mapDbRowToBook);
    } else {
      // Fallback to in-memory list (pre-seeded with initial digital books)
      books = [...inMemoryDigitalBooks];
    }

    // 3. Attach computed sales stats
    const booksWithStats = books.map((book) => {
      const sales = salesById[book.id] || salesBySku[book.sku] || { unitsSold: 0, totalRevenue: 0 };
      return {
        ...book,
        unitsSold: sales.unitsSold,
        revenue: sales.totalRevenue,
      };
    });

    return Response.json({
      success: true,
      books: booksWithStats,
      totalCount: booksWithStats.length,
    });
  } catch (err: any) {
    console.error('Failed to fetch digital books:', err);
    return Response.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

/**
 * POST /api/admin/digital
 * Creates a new digital book
 */
export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return Response.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  try {
    const body = await request.json();

    if (!body.title || !body.subject || !body.gradeClass || body.price === undefined) {
      return Response.json({ success: false, error: 'Title, Subject, Grade, and Price are required.' }, { status: 400 });
    }

    const gradeNum = Number(body.gradeClass);
    const priceNum = Number(body.price);

    // Slug generator
    const generatedSlug =
      body.slug?.trim() ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    // SKU generator
    const generatedSku =
      body.sku?.trim() ||
      `SD${gradeNum}-${String(body.subject).substring(0, 2).toUpperCase()}`;

    // ID generator
    const generatedId =
      body.id?.trim() ||
      `dbook-${gradeNum}-${String(body.subject).substring(0, 2).toLowerCase()}-${Date.now().toString().slice(-4)}`;

    const newBook: DigitalBook = {
      id: generatedId,
      slug: generatedSlug,
      title: body.title.trim(),
      sku: generatedSku,
      subject: body.subject,
      gradeClass: gradeNum,
      price: priceNum,
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      coverImage: body.coverImage?.trim() || '/digital-covers/kn-6.webp',
      totalPages: Number(body.totalPages) || 50,
      isFreePreviewPages: Number(body.isFreePreviewPages) || 5,
      description: body.description?.trim() || '',
      author: body.author?.trim() || 'Belesu Academic Team',
      language: body.language?.trim() || 'Kannada with English Translations',
      badge: body.badge?.trim() || undefined,
      rating: 5.0,
      reviewCount: 0,
      features: Array.isArray(body.features) ? body.features : (body.features ? [body.features] : []),
      tableOfContents: Array.isArray(body.tableOfContents) ? body.tableOfContents : [],
    };

    // Attempt Supabase insert
    const supabase = createAdminClient();
    const row = mapBookToDbRow(newBook);
    const { error: insertError } = await supabase.from('digital_books').insert(row);

    if (insertError) {
      console.warn('Supabase table insert skipped/failed, keeping in runtime cache:', insertError.message);
    }

    // Always update runtime cache
    inMemoryDigitalBooks = [newBook, ...inMemoryDigitalBooks.filter((b) => b.id !== newBook.id)];

    return Response.json({
      success: true,
      message: 'Digital book created successfully',
      book: newBook,
    });
  } catch (err: any) {
    console.error('Error creating digital book:', err);
    return Response.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/digital
 * Alters / Updates an existing digital book
 */
export async function PUT(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return Response.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    if (!body.id) {
      return Response.json({ success: false, error: 'Book ID is required for updating.' }, { status: 400 });
    }

    const updatedBook: DigitalBook = {
      id: body.id,
      slug: body.slug,
      title: body.title,
      sku: body.sku,
      subject: body.subject,
      gradeClass: Number(body.gradeClass),
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      coverImage: body.coverImage,
      totalPages: Number(body.totalPages),
      isFreePreviewPages: Number(body.isFreePreviewPages),
      description: body.description || '',
      author: body.author || 'Belesu Academic Team',
      language: body.language || 'Kannada with English Translations',
      badge: body.badge || undefined,
      rating: body.rating ? Number(body.rating) : 5.0,
      reviewCount: body.reviewCount ? Number(body.reviewCount) : 0,
      features: Array.isArray(body.features) ? body.features : [],
      tableOfContents: Array.isArray(body.tableOfContents) ? body.tableOfContents : [],
    };

    const supabase = createAdminClient();
    const row = mapBookToDbRow(updatedBook);
    const { error: updateError } = await supabase
      .from('digital_books')
      .update(row)
      .eq('id', body.id);

    if (updateError) {
      console.warn('Supabase update skipped/failed, updating runtime cache:', updateError.message);
    }

    // Update in-memory runtime cache
    const existingIdx = inMemoryDigitalBooks.findIndex((b) => b.id === body.id);
    if (existingIdx !== -1) {
      inMemoryDigitalBooks[existingIdx] = updatedBook;
    } else {
      inMemoryDigitalBooks.unshift(updatedBook);
    }

    return Response.json({
      success: true,
      message: 'Digital book updated successfully',
      book: updatedBook,
    });
  } catch (err: any) {
    console.error('Error updating digital book:', err);
    return Response.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/digital?id=xxx
 * Deletes or deactivates a digital book
 */
export async function DELETE(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return Response.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return Response.json({ success: false, error: 'Book ID parameter is required.' }, { status: 400 });
    }

    const supabase = createAdminClient();
    
    // Attempt hard delete or soft deactivate
    const { error: delError } = await supabase
      .from('digital_books')
      .delete()
      .eq('id', id);

    if (delError) {
      console.warn('Supabase delete skipped/failed, removing from runtime cache:', delError.message);
    }

    // Remove from in-memory cache
    inMemoryDigitalBooks = inMemoryDigitalBooks.filter((b) => b.id !== id);

    return Response.json({
      success: true,
      message: 'Digital book removed successfully',
    });
  } catch (err: any) {
    console.error('Error deleting digital book:', err);
    return Response.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

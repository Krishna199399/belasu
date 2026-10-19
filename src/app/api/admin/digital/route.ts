import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { createAdminClient } from '@/lib/supabase';
import { mapDbRowToBook, mapBookToDbRow } from '@/lib/digital';
import { DIGITAL_BOOKS_DATA } from '@/data/digitalBooksData';
import { DigitalBook } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/admin/digital
 * Returns all digital books directly from Supabase DB combined with sales statistics
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

    if (!dbError && Array.isArray(dbBooks)) {
      books = dbBooks.map(mapDbRowToBook);
    } else if (dbError) {
      console.warn('Database error querying digital_books, falling back to static:', dbError.message);
      books = [...DIGITAL_BOOKS_DATA];
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

    return Response.json(
      {
        success: true,
        books: booksWithStats,
        totalCount: booksWithStats.length,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (err: any) {
    console.error('Failed to fetch digital books:', err);
    return Response.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

/**
 * POST /api/admin/digital
 * Creates a new digital book in Supabase DB
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

    const newBookData: Partial<DigitalBook> = {
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
      isFreePreviewPages: body.isFreePreviewPages !== undefined ? Number(body.isFreePreviewPages) : 5,
      description: body.description?.trim() || '',
      author: body.author?.trim() || 'Belesu Academic Team',
      language: body.language?.trim() || 'Kannada with English Translations',
      badge: body.badge?.trim() || undefined,
      features: Array.isArray(body.features) ? body.features : (body.features ? [body.features] : []),
      tableOfContents: Array.isArray(body.tableOfContents) ? body.tableOfContents : [],
    };

    const supabase = createAdminClient();
    const row = mapBookToDbRow(newBookData);

    const { data: insertedRow, error: insertError } = await supabase
      .from('digital_books')
      .insert(row)
      .select()
      .single();

    if (insertError) {
      console.error('Supabase insert error on digital_books:', insertError);
      return Response.json(
        { success: false, error: `Database error: ${insertError.message}` },
        { status: 400 }
      );
    }

    const createdBook = mapDbRowToBook(insertedRow);

    return Response.json({
      success: true,
      message: 'Digital book created successfully',
      book: createdBook,
    });
  } catch (err: any) {
    console.error('Error creating digital book:', err);
    return Response.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/digital
 * Alters / Updates an existing digital book in Supabase DB
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

    const updatedBookData: Partial<DigitalBook> = {
      id: body.id,
      slug: body.slug,
      title: body.title,
      sku: body.sku,
      subject: body.subject,
      gradeClass: Number(body.gradeClass),
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      coverImage: body.coverImage,
      totalPages: Number(body.totalPages) || 50,
      isFreePreviewPages: body.isFreePreviewPages !== undefined ? Number(body.isFreePreviewPages) : 5,
      description: body.description || '',
      author: body.author || 'Belesu Academic Team',
      language: body.language || 'Kannada with English Translations',
      badge: body.badge || undefined,
      features: Array.isArray(body.features) ? body.features : [],
      tableOfContents: Array.isArray(body.tableOfContents) ? body.tableOfContents : [],
    };

    const supabase = createAdminClient();
    const row = mapBookToDbRow(updatedBookData);

    const { data: updatedRow, error: updateError } = await supabase
      .from('digital_books')
      .update(row)
      .eq('id', body.id)
      .select()
      .single();

    if (updateError) {
      console.error('Supabase update error on digital_books:', updateError);
      return Response.json(
        { success: false, error: `Database error: ${updateError.message}` },
        { status: 400 }
      );
    }

    const finalBook = mapDbRowToBook(updatedRow);

    return Response.json({
      success: true,
      message: 'Digital book updated successfully',
      book: finalBook,
    });
  } catch (err: any) {
    console.error('Error updating digital book:', err);
    return Response.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/digital?id=xxx
 * Permanently removes or deactivates a digital book from Supabase DB
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
    
    // Perform delete in Supabase
    const { error: delError } = await supabase
      .from('digital_books')
      .delete()
      .eq('id', id);

    if (delError) {
      console.error('Supabase delete error on digital_books:', delError);
      return Response.json(
        { success: false, error: `Database error: ${delError.message}` },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      message: 'Digital book removed successfully',
    });
  } catch (err: any) {
    console.error('Error deleting digital book:', err);
    return Response.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

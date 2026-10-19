import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/digital/upload-page?bookId=xxx
 * Returns the count and list of uploaded page images for a given book in Supabase Storage
 */
export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return Response.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  const { searchParams } = request.nextUrl;
  const bookId = searchParams.get('bookId');

  if (!bookId) {
    return Response.json({ success: false, error: 'Book ID is required' }, { status: 400 });
  }

  try {
    const supabase = createAdminClient();
    const { data: files, error } = await supabase.storage
      .from('belesu-book-pages')
      .list(bookId, { limit: 1000, sortBy: { column: 'name', order: 'asc' } });

    if (error) {
      return Response.json({ success: false, error: error.message }, { status: 500 });
    }

    const pageFiles = (files || []).filter((f) => f.name.endsWith('.webp') || f.name.endsWith('.png'));

    return Response.json({
      success: true,
      bookId,
      uploadedCount: pageFiles.length,
      pages: pageFiles.map((f) => f.name),
    });
  } catch (err: any) {
    return Response.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

/**
 * POST /api/admin/digital/upload-page
 * Accepts a single rendered page image (WebP) and uploads to belesu-book-pages/{bookId}/page-{padded}.webp
 */
export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return Response.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const bookId = formData.get('bookId') as string;
    const pageNum = Number(formData.get('page'));
    const totalPages = formData.get('totalPages') ? Number(formData.get('totalPages')) : undefined;
    const file = formData.get('image') as File | null;

    if (!bookId || !pageNum || !file) {
      return Response.json(
        { success: false, error: 'Missing bookId, page number, or image file' },
        { status: 400 }
      );
    }

    const paddedPage = String(pageNum).padStart(3, '0');
    const filePath = `${bookId}/page-${paddedPage}.webp`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const supabase = createAdminClient();

    const { error: uploadError } = await supabase.storage
      .from('belesu-book-pages')
      .upload(filePath, buffer, {
        contentType: 'image/webp',
        upsert: true,
      });

    if (uploadError) {
      console.error(`Failed to upload page ${pageNum} for book ${bookId}:`, uploadError);
      return Response.json(
        { success: false, error: `Storage error: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // If totalPages is provided (typically passed on completion of the upload sequence), sync to digital_books
    if (totalPages && totalPages > 0) {
      await supabase
        .from('digital_books')
        .update({ total_pages: totalPages, updated_at: new Date().toISOString() })
        .eq('id', bookId);
    }

    return Response.json({
      success: true,
      message: `Page ${pageNum} uploaded successfully`,
      path: filePath,
      page: pageNum,
    });
  } catch (err: any) {
    console.error('Error in /api/admin/digital/upload-page:', err);
    return Response.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

/**
 * GET /api/reader/page?bookId=xxx&page=1&preview=true
 * Returns a short-lived signed URL for a single book page image.
 * Supports public previews up to the book's free preview limit,
 * and enforces authenticated purchase ownership for pages beyond that.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const bookId = searchParams.get('bookId');
  const page = Number(searchParams.get('page')) || 1;
  const preview = searchParams.get('preview') === 'true';

  if (!bookId) {
    return Response.json({ success: false, error: 'Missing bookId' }, { status: 400 });
  }

  const supabase = createAdminClient();

  if (preview) {
    // In preview mode: verify page does not exceed the book's free preview limit
    let freePages = 5;
    const { data: dbBook } = await supabase
      .from('digital_books')
      .select('is_free_preview_pages')
      .eq('id', bookId)
      .maybeSingle();

    if (dbBook && dbBook.is_free_preview_pages !== null) {
      freePages = Number(dbBook.is_free_preview_pages);
    }

    if (page > freePages) {
      return Response.json(
        { success: false, error: 'Preview page limit exceeded. Purchase required.' },
        { status: 403 }
      );
    }
  } else {
    // Non-preview mode: auth and ownership is mandatory
    const authUser = await getAuthUser();
    if (!authUser) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { data: user } = await supabase
      .from('users')
      .select('purchased_books')
      .eq('id', authUser.userId)
      .single();

    const books = user?.purchased_books;
    const owned =
      (books?.digital  ?? []).includes(bookId) ||
      (books?.physical ?? []).includes(bookId);

    if (!owned) {
      return Response.json({ success: false, error: 'Book not purchased' }, { status: 403 });
    }
  }

  // Generate signed URL from Supabase Storage
  const paddedPage = String(page).padStart(3, '0');
  const filePath = `${bookId}/page-${paddedPage}.webp`;

  const { data: signedData, error: signErr } = await supabase.storage
    .from('belesu-book-pages')
    .createSignedUrl(filePath, 60);

  if (signErr || !signedData?.signedUrl) {
    return Response.json({
      success: true,
      url: null,
      isDemoMode: true,
      message: 'Page image not yet uploaded — this is a demo placeholder',
    });
  }

  return Response.json({ success: true, url: signedData.signedUrl });
}

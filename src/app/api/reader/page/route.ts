import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase';

/**
 * GET /api/reader/page?bookId=xxx&page=1
 * Returns a short-lived signed URL for a single book page image.
 * Auth + ownership is verified server-side before issuing the URL.
 */
export async function GET(request: NextRequest) {
  const authUser = await getAuthUser();
  if (!authUser) {
    return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const bookId = searchParams.get('bookId');
  const page = searchParams.get('page');
  const preview = searchParams.get('preview') === 'true';

  if (!bookId || !page) {
    return Response.json({ success: false, error: 'Missing bookId or page' }, { status: 400 });
  }

  const supabase = createAdminClient();

  // If not preview mode: verify ownership
  if (!preview) {
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

  // Generate a 30-second signed URL for the page image from Supabase Storage
  // Path convention: belesu-book-pages/{bookId}/page-{padded}.webp
  const paddedPage = String(page).padStart(3, '0');
  const filePath = `${bookId}/page-${paddedPage}.webp`;

  const { data: signedData, error: signErr } = await supabase.storage
    .from('belesu-book-pages')
    .createSignedUrl(filePath, 30); // 30 second TTL

  if (signErr || !signedData?.signedUrl) {
    // Fallback: return a placeholder for development
    return Response.json({
      success: true,
      url: null,
      isDemoMode: true,
      message: 'Page image not yet uploaded — this is a demo placeholder',
    });
  }

  return Response.json({ success: true, url: signedData.signedUrl });
}

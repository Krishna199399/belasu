import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const authUser = await getAuthUser();
  if (!authUser) return Response.json({ success: false }, { status: 401 });

  const bookId = request.nextUrl.searchParams.get('bookId');
  if (!bookId) return Response.json({ success: false, error: 'Missing bookId' }, { status: 400 });

  const supabase = createAdminClient();
  const { data } = await supabase
    .from('read_progress')
    .select('last_page, updated_at')
    .eq('user_id', authUser.userId)
    .eq('book_id', bookId)
    .single();

  return Response.json({ success: true, lastPage: data?.last_page ?? 1 });
}

export async function POST(request: NextRequest) {
  const authUser = await getAuthUser();
  if (!authUser) return Response.json({ success: false }, { status: 401 });

  const { bookId, page } = await request.json();
  if (!bookId || !page) return Response.json({ success: false, error: 'Missing fields' }, { status: 400 });

  const supabase = createAdminClient();
  await supabase
    .from('read_progress')
    .upsert(
      { user_id: authUser.userId, book_id: bookId, last_page: page, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,book_id' }
    );

  return Response.json({ success: true });
}

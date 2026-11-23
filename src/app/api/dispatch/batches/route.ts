import { NextRequest } from 'next/server';
import { requireDispatchAccess, dispatchUnauthorized } from '@/lib/dispatchAuth';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

/** GET /api/dispatch/batches — printed dispatch sheets, newest first */
export async function GET(request: NextRequest) {
  const staff = await requireDispatchAccess();
  if (!staff) return dispatchUnauthorized();

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50', 10) || 50));
    const from = (page - 1) * limit;

    const supabase = createAdminClient();
    const { data, count, error } = await supabase
      .from('dispatch_batches')
      .select(
        'id, batch_name, start_order_number, end_order_number, order_count, total_books, order_numbers, skipped, created_by_name, created_by_phone, created_at',
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .range(from, from + limit - 1);
    if (error) throw error;

    return Response.json({
      success: true,
      batches: data || [],
      pagination: { total: count || 0, page, limit, totalPages: Math.max(1, Math.ceil((count || 0) / limit)) },
    });
  } catch (err) {
    console.error('Dispatch batches error:', err);
    const message = err instanceof Error ? err.message : (err as { message?: string })?.message || 'Server error';
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}

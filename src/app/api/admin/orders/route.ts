import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { createAdminClient } from '@/lib/supabase';
import { applyOrderFilters, getSalesSummary, parseOrderFilters } from '@/lib/salesReport';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/orders
 *   Filters: status, type (physical|digital), period (+ month/year for month_year),
 *            startDate/endDate, search
 *   Paging:  page, limit
 *
 * On page 1 (or includeMetrics=true) also returns:
 *   summary — sales summary for the CURRENT filters (all pages, not just this one)
 *   metrics — Today / This Week / This Month sales for the top cards
 * All amounts follow the shared sales rule in src/lib/salesRules.ts.
 */
export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return Response.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const filters = parseOrderFilters(searchParams);
    const includeMetrics = searchParams.get('includeMetrics') === 'true';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(200, Math.max(1, parseInt(searchParams.get('limit') || '25', 10) || 25));
    const from = (page - 1) * limit;

    const supabase = createAdminClient();
    const listQuery = applyOrderFilters(
      supabase.from('orders').select('*, order_items(*)', { count: 'exact' }),
      filters
    )
      .order('created_at', { ascending: false })
      .order('order_number', { ascending: false })
      .range(from, from + limit - 1);

    const withSummary = includeMetrics || page === 1;

    const [listRes, summary, today, thisWeek, thisMonth] = await Promise.all([
      listQuery,
      withSummary ? getSalesSummary(filters) : Promise.resolve(null),
      withSummary ? getSalesSummary({ period: 'today' }) : Promise.resolve(null),
      withSummary ? getSalesSummary({ period: 'this_week' }) : Promise.resolve(null),
      withSummary ? getSalesSummary({ period: 'this_month' }) : Promise.resolve(null),
    ]);

    if (listRes.error) throw listRes.error;
    const count = listRes.count || 0;

    const card = (s: typeof today) => (s ? { count: s.salesCount, revenue: s.salesAmount } : null);

    return Response.json({
      success: true,
      orders: listRes.data || [],
      summary,
      metrics: withSummary
        ? { today: card(today), thisWeek: card(thisWeek), thisMonth: card(thisMonth) }
        : null,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    console.error('Admin orders fetch error:', err);
    const message = err instanceof Error ? err.message : (err as { message?: string })?.message || 'Server error';
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}

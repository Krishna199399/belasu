import { NextRequest } from 'next/server';
import { requireDispatchAccess, dispatchUnauthorized } from '@/lib/dispatchAuth';
import { createAdminClient } from '@/lib/supabase';
import { getISTDateRange } from '@/lib/orderDateUtils';
import {
  DISPATCH_ORDER_COLUMNS,
  DISPATCH_START_ISO,
  EXCLUDED_ORDER_STATUSES,
  DispatchOrderRow,
  toDispatchOrder,
} from '@/lib/dispatch';

export const dynamic = 'force-dynamic';

const EXCLUDED_FILTER = `(${EXCLUDED_ORDER_STATUSES.map((s) => `"${s}"`).join(',')})`;

/**
 * GET /api/dispatch/orders
 *   status:    to_print (default) | printed | all
 *   period:    all | today | yesterday | this_week
 *   search:    order number, name, phone, city or pincode
 *   fromOrder, toOrder: numeric order range
 *   sort:      asc | desc (by order number)
 *   page, limit
 *
 * Only shippable orders are ever returned: physical books, payment Paid, not cancelled/refunded,
 * placed on/after DISPATCH_START_ISO.
 */
export async function GET(request: NextRequest) {
  const staff = await requireDispatchAccess();
  if (!staff) return dispatchUnauthorized();

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'to_print';
    const period = searchParams.get('period') || 'all';
    // Strip characters that would break PostgREST's or() filter syntax
    const search = (searchParams.get('search') || '').replace(/[^\p{L}\p{N}\s@.+-]/gu, '').trim();
    const fromOrder = parseInt(searchParams.get('fromOrder') || '', 10);
    const toOrder = parseInt(searchParams.get('toOrder') || '', 10);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(200, Math.max(1, parseInt(searchParams.get('limit') || '100', 10) || 100));
    const from = (page - 1) * limit;

    const supabase = createAdminClient();

    let query = supabase
      .from('orders')
      .select(DISPATCH_ORDER_COLUMNS, { count: 'exact' })
      .eq('has_physical_books', true)
      .eq('payment_status', 'Paid')
      .not('order_status', 'in', EXCLUDED_FILTER)
      .gte('created_at', DISPATCH_START_ISO);

    if (status === 'to_print') query = query.eq('is_printed', false);
    else if (status === 'printed') query = query.eq('is_printed', true);

    if (period !== 'all') {
      const range = getISTDateRange(period);
      if (range) query = query.gte('created_at', range.startDate).lte('created_at', range.endDate);
    }

    if (!isNaN(fromOrder) && !isNaN(toOrder)) {
      query = query.gte('order_seq', Math.min(fromOrder, toOrder)).lte('order_seq', Math.max(fromOrder, toOrder));
    } else if (!isNaN(fromOrder)) {
      query = query.gte('order_seq', fromOrder);
    } else if (!isNaN(toOrder)) {
      query = query.lte('order_seq', toOrder);
    }

    if (search) {
      const s = `%${search}%`;
      query = query.or(
        [
          `order_number.ilike.${s}`,
          `shipping_first_name.ilike.${s}`,
          `shipping_last_name.ilike.${s}`,
          `billing_first_name.ilike.${s}`,
          `billing_phone.ilike.${s}`,
          `shipping_phone.ilike.${s}`,
          `shipping_city.ilike.${s}`,
          `shipping_postcode.ilike.${s}`,
        ].join(',')
      );
    }

    // sort=asc|desc. Default: newest first (descending) on every tab.
    const ascending = searchParams.get('sort') === 'asc';
    query = query.order('order_seq', { ascending }).range(from, from + limit - 1);

    const { data, count, error } = await query;
    if (error) throw error;

    const orders = ((data || []) as unknown as DispatchOrderRow[]).map(toDispatchOrder);

    // Attach batch names for printed orders
    const batchIds = [...new Set(orders.map((o) => o.batchId).filter(Boolean))] as string[];
    const batchNames: Record<string, string> = {};
    if (batchIds.length > 0) {
      const { data: batches } = await supabase
        .from('dispatch_batches')
        .select('id, batch_name')
        .in('id', batchIds);
      for (const b of batches || []) batchNames[b.id] = b.batch_name;
    }

    // KPI counters
    const today = getISTDateRange('today')!;
    const base = () =>
      supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('has_physical_books', true)
        .eq('payment_status', 'Paid')
        .not('order_status', 'in', EXCLUDED_FILTER)
        .gte('created_at', DISPATCH_START_ISO);

    const [toPrintRes, todayRes, printedTodayRes] = await Promise.all([
      base().eq('is_printed', false),
      base().gte('created_at', today.startDate).lte('created_at', today.endDate),
      base().gte('printed_at', today.startDate).lte('printed_at', today.endDate),
    ]);

    return Response.json({
      success: true,
      orders: orders.map((o) => ({ ...o, batchName: o.batchId ? batchNames[o.batchId] || null : null })),
      kpis: {
        toPrint: toPrintRes.count || 0,
        receivedToday: todayRes.count || 0,
        printedToday: printedTodayRes.count || 0,
      },
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil((count || 0) / limit)),
      },
    });
  } catch (err) {
    console.error('Dispatch orders error:', err);
    const message = err instanceof Error ? err.message : (err as { message?: string })?.message || 'Server error';
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}

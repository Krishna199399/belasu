import { NextRequest } from 'next/server';
import { requireDispatchStaff } from '@/lib/dispatchAuth';
import { createAdminClient } from '@/lib/supabase';
import { getISTDateRange } from '@/lib/orderDateUtils';

export async function GET(request: NextRequest) {
  const staff = await requireDispatchStaff();
  if (!staff) {
    return Response.json(
      { success: false, error: 'Unauthorized. Staff dispatch access required.' },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all'; // 'today' | 'yesterday' | 'this_week' | 'all'
    const printStatus = searchParams.get('printStatus') || 'all'; // 'unprinted' | 'printed' | 'all'
    const search = searchParams.get('search')?.trim();
    const fromOrder = searchParams.get('fromOrder')?.trim();
    const toOrder = searchParams.get('toOrder')?.trim();
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const supabase = createAdminClient();

    // Query physical book orders only
    let query = supabase
      .from('orders')
      .select('*, order_items(*)', { count: 'exact' })
      .eq('has_physical_books', true);

    // Filter by period
    if (period && period !== 'all') {
      const range = getISTDateRange(period);
      if (range) {
        query = query.gte('created_at', range.startDate).lte('created_at', range.endDate);
      }
    }

    // Filter by printed status
    if (printStatus === 'unprinted') {
      query = query.or('is_printed.is.null,is_printed.eq.false');
    } else if (printStatus === 'printed') {
      query = query.eq('is_printed', true);
    }

    // Filter by order range if provided
    if (fromOrder && toOrder) {
      const minNum = Math.min(parseInt(fromOrder, 10), parseInt(toOrder, 10));
      const maxNum = Math.max(parseInt(fromOrder, 10), parseInt(toOrder, 10));
      query = query.gte('order_number', String(minNum)).lte('order_number', String(maxNum));
    }

    // Search filter
    if (search) {
      query = query.or(
        `order_number.ilike.%${search}%,billing_first_name.ilike.%${search}%,billing_last_name.ilike.%${search}%,billing_phone.ilike.%${search}%,billing_city.ilike.%${search}%`
      );
    }

    query = query
      .order('created_at', { ascending: false })
      .order('order_number', { ascending: false })
      .range(from, to);

    const { data: orders, count, error } = await query;
    if (error) throw error;

    // Fast counts for dispatch dashboard KPIs
    const todayRange = getISTDateRange('today');
    const [unprintedRes, todayPhysicalRes] = await Promise.all([
      supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('has_physical_books', true)
        .or('is_printed.is.null,is_printed.eq.false'),
      todayRange
        ? supabase
            .from('orders')
            .select('id, is_printed', { count: 'exact' })
            .eq('has_physical_books', true)
            .gte('created_at', todayRange.startDate)
            .lte('created_at', todayRange.endDate)
        : Promise.resolve({ count: 0, data: [] }),
    ]);

    const todayOrders = (todayPhysicalRes as any).data || [];
    const todayDispatchedCount = todayOrders.filter((o: any) => o.is_printed).length;

    return Response.json({
      success: true,
      orders: orders || [],
      kpis: {
        totalPendingUnprinted: unprintedRes.count || 0,
        todayPhysicalCount: (todayPhysicalRes as any).count || 0,
        todayPrintedCount: todayDispatchedCount,
      },
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (err: any) {
    console.error('Dispatch orders error:', err);
    return Response.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { createAdminClient } from '@/lib/supabase';
import { getISTDateRange } from '@/lib/orderDateUtils';

export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return Response.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type'); // 'physical' | 'digital' | 'all'
    const period = searchParams.get('period'); // 'all' | 'today' | 'yesterday' | 'this_week' | 'last_7_days' | 'this_month' | 'month_year'
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const includeMetrics = searchParams.get('includeMetrics');
    const search = searchParams.get('search')?.trim();
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '25', 10);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const supabase = createAdminClient();

    let query = supabase
      .from('orders')
      .select('*, order_items(*)', { count: 'exact' });

    if (status && status !== 'all') {
      query = query.eq('order_status', status);
    }

    if (type === 'physical') {
      query = query.eq('has_physical_books', true);
    } else if (type === 'digital') {
      query = query.eq('has_digital_books', true);
    }

    // Date / Period filters
    if (period && period !== 'all') {
      const range = getISTDateRange(period, month, year);
      if (range) {
        query = query.gte('created_at', range.startDate).lte('created_at', range.endDate);
      }
    } else if (startDate && endDate) {
      query = query.gte('created_at', startDate).lte('created_at', endDate);
    }

    if (search) {
      // Search across order number, billing name, billing phone, billing email, city
      query = query.or(`order_number.ilike.%${search}%,billing_first_name.ilike.%${search}%,billing_last_name.ilike.%${search}%,billing_phone.ilike.%${search}%,billing_email.ilike.%${search}%,billing_city.ilike.%${search}%`);
    }

    query = query
      .order('created_at', { ascending: false })
      .order('order_number', { ascending: false })
      .range(from, to);

    const { data: orders, count, error } = await query;

    if (error) throw error;

    // Fetch aggregated metrics for Today, This Week, and This Month when requested or on page 1
    let metrics = null;
    if (includeMetrics === 'true' || page === 1) {
      const todayRange = getISTDateRange('today');
      const weekRange = getISTDateRange('this_week');
      const monthRange = getISTDateRange('this_month');

      const [todayRes, weekRes, monthRes] = await Promise.all([
        todayRange
          ? supabase
              .from('orders')
              .select('order_total_amount, payment_status')
              .gte('created_at', todayRange.startDate)
              .lte('created_at', todayRange.endDate)
          : Promise.resolve({ data: [] }),
        weekRange
          ? supabase
              .from('orders')
              .select('order_total_amount, payment_status')
              .gte('created_at', weekRange.startDate)
              .lte('created_at', weekRange.endDate)
          : Promise.resolve({ data: [] }),
        monthRange
          ? supabase
              .from('orders')
              .select('order_total_amount, payment_status')
              .gte('created_at', monthRange.startDate)
              .lte('created_at', monthRange.endDate)
          : Promise.resolve({ data: [] }),
      ]);

      const sumRevenue = (items: any[]) =>
        (items || []).reduce((acc, curr) => acc + (Number(curr.order_total_amount) || 0), 0);

      metrics = {
        today: {
          count: todayRes.data?.length || 0,
          revenue: sumRevenue(todayRes.data || []),
        },
        thisWeek: {
          count: weekRes.data?.length || 0,
          revenue: sumRevenue(weekRes.data || []),
        },
        thisMonth: {
          count: monthRes.data?.length || 0,
          revenue: sumRevenue(monthRes.data || []),
        },
      };
    }

    return Response.json({
      success: true,
      orders: orders || [],
      metrics,
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (err: any) {
    console.error('Admin orders fetch error:', err);
    return Response.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

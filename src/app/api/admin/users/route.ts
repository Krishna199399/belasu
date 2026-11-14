import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { createAdminClient } from '@/lib/supabase';
import { isPhoneAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return Response.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim();
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '25', 10);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const supabase = createAdminClient();

    let query = supabase
      .from('users')
      .select('id, name, phone, email, purchased_books, created_at, updated_at', { count: 'exact' });

    if (search) {
      query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`);
    }

    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data: users, count, error } = await query;
    if (error) throw error;

    // Fetch user order stats and cities for the current users
    const userIds = (users || []).map((u) => u.id);

    let ordersMap: Record<string, { count: number; totalSpent: number }> = {};
    let cityMap: Record<string, string> = {};

    if (userIds.length > 0) {
      const [ordersRes, addressesRes] = await Promise.all([
        supabase
          .from('orders')
          .select('user_id, order_total_amount, payment_status, order_status, billing_city, shipping_city, created_at')
          .in('user_id', userIds)
          .order('created_at', { ascending: false }),
        supabase
          .from('addresses')
          .select('user_id, city, state, is_default, created_at')
          .in('user_id', userIds)
          .order('is_default', { ascending: false })
          .order('created_at', { ascending: false }),
      ]);

      const orders = ordersRes.data || [];
      const addresses = addressesRes.data || [];

      // 1. Resolve city from default / latest addresses first
      addresses.forEach((a) => {
        if (!cityMap[a.user_id] && a.city?.trim()) {
          cityMap[a.user_id] = a.city.trim();
        }
      });

      // 2. Resolve stats and fallback city from orders
      orders.forEach((o) => {
        if (!ordersMap[o.user_id]) {
          ordersMap[o.user_id] = { count: 0, totalSpent: 0 };
        }
        ordersMap[o.user_id].count++;
        if (o.payment_status === 'Paid' || o.order_status === 'Completed') {
          ordersMap[o.user_id].totalSpent += Number(o.order_total_amount) || 0;
        }

        if (!cityMap[o.user_id]) {
          const ordCity = o.billing_city?.trim() || o.shipping_city?.trim();
          if (ordCity) {
            cityMap[o.user_id] = ordCity;
          }
        }
      });
    }

    const enhancedUsers = (users || []).map((u) => {
      const stats = ordersMap[u.id] || { count: 0, totalSpent: 0 };
      const digitalBooksCount = u.purchased_books?.digital?.length || 0;
      const physicalBooksCount = u.purchased_books?.physical?.length || 0;
      const isAdmin = Boolean((u as any).is_admin || isPhoneAdmin(u.phone));
      const city = cityMap[u.id] || null;

      return {
        ...u,
        isAdmin,
        city,
        ordersCount: stats.count,
        totalSpent: stats.totalSpent,
        digitalBooksCount,
        physicalBooksCount,
      };
    });

    return Response.json({
      success: true,
      users: enhancedUsers,
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (err: any) {
    console.error('Admin users fetch error:', err);
    return Response.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

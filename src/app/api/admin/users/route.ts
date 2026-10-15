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

    // Fetch user order stats for the current users
    const userIds = (users || []).map((u) => u.id);

    let ordersMap: Record<string, { count: number; totalSpent: number }> = {};

    if (userIds.length > 0) {
      const { data: orders } = await supabase
        .from('orders')
        .select('user_id, order_total_amount, payment_status, order_status')
        .in('user_id', userIds);

      (orders || []).forEach((o) => {
        if (!ordersMap[o.user_id]) {
          ordersMap[o.user_id] = { count: 0, totalSpent: 0 };
        }
        ordersMap[o.user_id].count++;
        if (o.payment_status === 'Paid' || o.order_status === 'Completed') {
          ordersMap[o.user_id].totalSpent += Number(o.order_total_amount) || 0;
        }
      });
    }

    const enhancedUsers = (users || []).map((u) => {
      const stats = ordersMap[u.id] || { count: 0, totalSpent: 0 };
      const digitalBooksCount = u.purchased_books?.digital?.length || 0;
      const physicalBooksCount = u.purchased_books?.physical?.length || 0;
      const isAdmin = Boolean((u as any).is_admin || isPhoneAdmin(u.phone));

      return {
        ...u,
        isAdmin,
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

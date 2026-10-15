import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { createAdminClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return Response.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type'); // 'physical' | 'digital' | 'all'
    const search = searchParams.get('search')?.trim();
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
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

    if (search) {
      // Search across order number, billing name, billing phone, billing email
      query = query.or(`order_number.ilike.%${search}%,billing_first_name.ilike.%${search}%,billing_last_name.ilike.%${search}%,billing_phone.ilike.%${search}%,billing_email.ilike.%${search}%,billing_city.ilike.%${search}%`);
    }

    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data: orders, count, error } = await query;

    if (error) throw error;

    return Response.json({
      success: true,
      orders: orders || [],
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

import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { createAdminClient } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return Response.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const supabase = createAdminClient();

    // Fetch order by id or by order_number
    let query = supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', id);

    let { data: order, error } = await query.maybeSingle();

    if (!order) {
      // Try by order_number (e.g. BLS-10001)
      const res = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('order_number', id)
        .maybeSingle();
      order = res.data;
      error = res.error;
    }

    if (error) throw error;
    if (!order) {
      return Response.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // Fetch customer profile
    const { data: customer } = await supabase
      .from('users')
      .select('id, name, phone, email, created_at, purchased_books')
      .eq('id', order.user_id)
      .maybeSingle();

    // Fetch shipping address if shipping_address_id is present
    let address = null;
    if (order.shipping_address_id) {
      const { data: addr } = await supabase
        .from('addresses')
        .select('*')
        .eq('id', order.shipping_address_id)
        .maybeSingle();
      address = addr;
    }

    return Response.json({
      success: true,
      order: {
        ...order,
        customer,
        shipping_address: address,
      },
    });
  } catch (err: any) {
    console.error('Admin single order fetch error:', err);
    return Response.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return Response.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { order_status, payment_status, shipping_method } = body;

    const updates: Record<string, any> = {};
    if (order_status !== undefined) updates.order_status = order_status;
    if (payment_status !== undefined) updates.payment_status = payment_status;
    if (shipping_method !== undefined) updates.shipping_method = shipping_method;

    if (Object.keys(updates).length === 0) {
      return Response.json({ success: false, error: 'No update fields provided' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Check if target is UUID or order_number
    let isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    let query = supabase.from('orders').update(updates);
    if (isUUID) {
      query = query.eq('id', id);
    } else {
      query = query.eq('order_number', id);
    }

    const { data, error } = await query.select('*, order_items(*)').single();

    if (error) throw error;

    return Response.json({
      success: true,
      order: data,
    });
  } catch (err: any) {
    console.error('Admin order update error:', err);
    return Response.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

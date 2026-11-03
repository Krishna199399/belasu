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
    const cleanId = decodeURIComponent(id || '').trim();
    const supabase = createAdminClient();

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId);
    let order = null;
    let error = null;

    // Fetch order by id (if UUID) or by order_number
    if (isUuid) {
      const res = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', cleanId)
        .maybeSingle();
      order = res.data;
      error = res.error;
    }

    if (!order) {
      // Try by order_number (e.g. 23401 or BLS-10001)
      const res = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('order_number', cleanId)
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

    // Synchronize digital book access if order is cancelled or refunded
    if (data && data.user_id && Array.isArray(data.order_items)) {
      const digitalProductIds = data.order_items
        .filter((item: any) => item.item_type === 'digital' && item.product_id)
        .map((item: any) => item.product_id);

      if (digitalProductIds.length > 0) {
        const { data: userRecord } = await supabase
          .from('users')
          .select('purchased_books')
          .eq('id', data.user_id)
          .maybeSingle();

        if (userRecord) {
          const currentBooks = userRecord.purchased_books || { physical: [], digital: [] };
          let digitalList: string[] = Array.isArray(currentBooks.digital) ? [...currentBooks.digital] : [];

          const shouldRevoke =
            order_status === 'Cancelled' ||
            payment_status === 'Refunded' ||
            payment_status === 'Failed';

          const shouldGrant =
            order_status === 'Completed' ||
            payment_status === 'Paid';

          if (shouldRevoke) {
            digitalList = digitalList.filter((b) => !digitalProductIds.includes(b));
            await supabase
              .from('users')
              .update({
                purchased_books: {
                  ...currentBooks,
                  digital: digitalList,
                },
              })
              .eq('id', data.user_id);
          } else if (shouldGrant) {
            digitalProductIds.forEach((pid: string) => {
              if (!digitalList.includes(pid)) digitalList.push(pid);
            });
            await supabase
              .from('users')
              .update({
                purchased_books: {
                  ...currentBooks,
                  digital: digitalList,
                },
              })
              .eq('id', data.user_id);
          }
        }
      }
    }

    return Response.json({
      success: true,
      order: data,
    });
  } catch (err: any) {
    console.error('Admin order update error:', err);
    return Response.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

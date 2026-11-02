import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const rawParams = await params;
    const rawOrderNumber = rawParams?.orderNumber;
    if (!rawOrderNumber) {
      return NextResponse.json({ success: false, error: 'Order number is required' }, { status: 400 });
    }

    const orderNumber = decodeURIComponent(rawOrderNumber).trim();
    const supabase = createAdminClient();

    const isUuid = UUID_REGEX.test(orderNumber);
    let order: any = null;

    // 1. Look up by primary key UUID if parameter is a valid UUID
    if (isUuid) {
      const { data: orderById, error: idErr } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderNumber)
        .maybeSingle();

      if (idErr) {
        console.warn('[orders/detail] UUID query warning:', idErr.message);
      }
      if (orderById) order = orderById;
    }

    // 2. Look up by exact order_number
    if (!order) {
      const { data: orderByNum, error: numErr } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', orderNumber)
        .maybeSingle();

      if (numErr) {
        console.warn('[orders/detail] order_number query warning:', numErr.message);
      }
      if (orderByNum) order = orderByNum;
    }

    // 3. Fallback: Strip leading '#' prefix (e.g. #23401 -> 23401)
    if (!order && orderNumber.startsWith('#')) {
      const stripped = orderNumber.replace(/^#+/, '').trim();
      const { data: orderByStripped } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', stripped)
        .maybeSingle();
      if (orderByStripped) order = orderByStripped;
    }

    // 4. Fallback: Try with/without 'BLS-' prefix
    if (!order) {
      const altNumber = orderNumber.startsWith('BLS-')
        ? orderNumber.replace(/^BLS-/, '')
        : `BLS-${orderNumber}`;
      const { data: orderByAlt } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', altNumber)
        .maybeSingle();
      if (orderByAlt) order = orderByAlt;
    }

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // Verify access: if user is authenticated and order has user_id, ensure user matches or admin or phone matches
    const authUser = await getAuthUser();
    if (authUser && order.user_id && order.user_id !== authUser.userId && !authUser.isAdmin) {
      const norm = (val?: string | null) => (val || '').replace(/\D/g, '').slice(-10);
      const userPhone = norm(authUser.phone);
      const billingPhone = norm(order.billing_phone);
      const shippingPhone = norm(order.shipping_phone);

      const phoneMatch = Boolean(userPhone && (userPhone === billingPhone || userPhone === shippingPhone));

      if (!phoneMatch) {
        return NextResponse.json({ success: false, error: 'Unauthorized access to order' }, { status: 403 });
      }
    }

    // Fetch order items
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order.id);

    if (itemsError) {
      console.warn('Failed to fetch order items:', itemsError);
    }

    // Format response
    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.order_number,
        orderStatus: order.order_status,
        orderDate: order.order_date,
        customerName: `${order.billing_first_name || ''} ${order.billing_last_name || ''}`.trim() || 'Customer',
        customerPhone: order.shipping_phone || order.billing_phone || '',
        customerEmail: order.billing_email || '',

        // Payment info
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        razorpayPaymentId: order.razorpay_payment_id,
        razorpayOrderId: order.razorpay_order_id,

        // Amounts
        subtotalAmount: order.order_subtotal_amount,
        shippingAmount: order.order_shipping_amount,
        taxAmount: order.order_total_tax_amount,
        totalAmount: order.order_total_amount,

        // Product flags
        hasPhysicalBooks: order.has_physical_books,
        hasDigitalBooks: order.has_digital_books,

        // Shipping address
        shipping: {
          firstName: order.shipping_first_name || order.billing_first_name,
          lastName: order.shipping_last_name || order.billing_last_name,
          address1: order.shipping_address1 || order.billing_address1,
          address2: order.shipping_address2 || order.billing_address2,
          city: order.shipping_city || order.billing_city,
          state: order.shipping_state || order.billing_state,
          postcode: order.shipping_postcode || order.billing_postcode,
          phone: order.shipping_phone || order.billing_phone,
        },

        // Billing address
        billing: {
          firstName: order.billing_first_name,
          lastName: order.billing_last_name,
          address1: order.billing_address1,
          address2: order.billing_address2,
          city: order.billing_city,
          state: order.billing_state,
          postcode: order.billing_postcode,
          phone: order.billing_phone,
          email: order.billing_email,
        },

        // Items
        items: (items || []).map((item) => ({
          id: item.id,
          title: item.item_name,
          productType: item.item_type,
          sku: item.item_sku,
          quantity: item.quantity,
          price: item.item_cost,
          total: item.item_total,
          productId: item.product_id,
        })),
      },
    });
  } catch (error) {
    console.error('Fetch order detail error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

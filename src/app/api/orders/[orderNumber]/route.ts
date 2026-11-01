import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;
    if (!orderNumber) {
      return NextResponse.json({ success: false, error: 'Order number is required' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Query by order_number or by order id
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .or(`order_number.eq.${orderNumber},id.eq.${orderNumber}`)
      .single();

    if (error || !order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // Verify access: if user is authenticated and order has user_id, ensure user matches or admin
    const authUser = await getAuthUser();
    if (authUser && order.user_id && order.user_id !== authUser.userId && !authUser.isAdmin) {
      if (authUser.phone !== order.billing_phone && authUser.phone !== order.shipping_phone) {
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

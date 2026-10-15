import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase';

export async function GET() {
  const authUser = await getAuthUser();
  if (!authUser) {
    return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
  }

  const supabase = createAdminClient();

  // Fetch orders for this user, newest first
  const { data: ordersData, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', authUser.userId)
    .order('order_date', { ascending: false });

  if (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
  }

  // Fetch all order items for these orders in one query
  const orderIds = (ordersData || []).map((o) => o.id);
  const { data: itemsData } = orderIds.length
    ? await supabase.from('order_items').select('*').in('order_id', orderIds)
    : { data: [] };

  // Group items by order_id
  const itemsByOrderId: Record<string, any[]> = {};
  for (const item of itemsData || []) {
    if (!itemsByOrderId[item.order_id]) itemsByOrderId[item.order_id] = [];
    itemsByOrderId[item.order_id].push(item);
  }

  // Transform to camelCase matching the Order type
  const orders = (ordersData || []).map((o) => {
    const items = (itemsByOrderId[o.id] || []).map((item) => ({
      id: item.id,
      orderId: item.order_id,
      itemSKU: item.item_sku,
      itemName: item.item_name,
      productType: item.item_type,
      quantity: item.quantity,
      itemCost: item.item_cost,
      itemTotal: item.item_total,
      productId: item.product_id,
      createdAt: item.created_at,
    }));

    return {
      id: o.id,
      orderNumber: o.order_number,
      orderStatus: o.order_status,
      orderDate: o.order_date,
      userId: o.user_id,

      billing: {
        firstName: o.billing_first_name,
        lastName: o.billing_last_name,
        address1: o.billing_address1,
        address2: o.billing_address2,
        city: o.billing_city,
        state: o.billing_state,
        postcode: o.billing_postcode,
        phone: o.billing_phone,
        email: o.billing_email,
      },

      paymentMethodTitle: o.payment_method,
      paymentStatus: o.payment_status,
      razorpayOrderId: o.razorpay_order_id,
      razorpayPaymentId: o.razorpay_payment_id,

      orderSubtotalAmount: o.order_subtotal_amount,
      orderShippingAmount: o.order_shipping_amount,
      orderTotalTaxAmount: o.order_total_tax_amount,
      orderRefundAmount: o.order_refund_amount,
      orderTotalAmount: o.order_total_amount,

      hasPhysicalProducts: o.has_physical_books,
      hasDigitalProducts: o.has_digital_books,

      items,
      createdAt: o.created_at,
      updatedAt: o.updated_at,
    };
  });

  // Compute total spent (sum of completed/paid orders)
  const totalSpent = orders
    .filter((o) => o.paymentStatus === 'Paid')
    .reduce((sum, o) => sum + Number(o.orderTotalAmount), 0);

  return NextResponse.json({
    success: true,
    orders,
    totalSpent,
    count: orders.length,
  });
}

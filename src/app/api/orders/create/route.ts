import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { fulfillRazorpayPayment } from '@/lib/paymentFulfillment';
import { createAdminClient } from '@/lib/supabase';

/**
 * POST /api/orders/create  { paymentId, razorpayOrderId }
 *
 * Checkout fallback, used when /api/payment/verify did not return an order number.
 * It can NOT create an order on its own: it returns the customer's existing order
 * for this payment, or creates it from what Razorpay says was paid. Any items,
 * prices or shipping sent by the browser are ignored.
 */
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const { paymentId, razorpayOrderId } = await request.json();
    if (!paymentId || !razorpayOrderId) {
      return NextResponse.json({ success: false, error: 'Payment details are required' }, { status: 400 });
    }

    const result = await fulfillRazorpayPayment({
      razorpayOrderId: String(razorpayOrderId),
      paymentId: String(paymentId),
      expectedUserId: authUser.userId,
    });

    const { data: order } = await createAdminClient()
      .from('orders')
      .select('id, order_number, order_status, order_date, order_subtotal_amount, order_shipping_amount, order_total_tax_amount, order_total_amount, has_physical_books, has_digital_books')
      .eq('order_number', result.orderNumber)
      .eq('user_id', authUser.userId)
      .maybeSingle();

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.order_number,
        status: order.order_status,
        date: order.order_date,
        subtotal: order.order_subtotal_amount,
        shipping: order.order_shipping_amount,
        tax: order.order_total_tax_amount,
        total: order.order_total_amount,
        hasPhysical: order.has_physical_books,
        hasDigital: order.has_digital_books,
      },
      alreadyProcessed: result.alreadyProcessed,
    });
  } catch (error) {
    console.error('[orders/create] Order creation error:', error);
    return NextResponse.json(
      { success: false, error: 'We could not confirm your payment yet. If money was deducted, your order will appear shortly — please contact support if it does not.' },
      { status: 500 }
    );
  }
}

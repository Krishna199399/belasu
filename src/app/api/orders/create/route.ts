import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { fulfillOrder } from '@/lib/orderFulfillment';
import { SHIPPING_FEE } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser();
    
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('[orders/create] Order creation request for user:', authUser.userId);
    
    const { 
      items, 
      shippingAddressId, 
      paymentMethod = 'Razorpay - Online Payment',
      paymentId,
      razorpayOrderId,
      shippingFee = SHIPPING_FEE,
      customerEmail,
      customerPhone,
      customerName,
    } = body;

    // Validation
    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Call centralized fulfillOrder protected by in-flight concurrency mutex
    const result = await fulfillOrder({
      userId: authUser.userId,
      items,
      shippingAddressId,
      paymentMethod,
      paymentId,
      razorpayOrderId,
      shippingFee,
      customerEmail,
      customerPhone,
      customerName,
    });

    const order = result.order;
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
      alreadyProcessed: Boolean(result.alreadyProcessed),
    });
  } catch (error: any) {
    console.error('[orders/create] Order creation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}

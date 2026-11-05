import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { fulfillOrder } from '@/lib/orderFulfillment';
import { SHIPPING_FEE } from '@/lib/utils';
import crypto from 'crypto';

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
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      // Optional order-creation params passed directly by checkout
      items,
      shippingAddressId,
      shippingFee,
      customerEmail,
      customerPhone,
      customerName,
      paymentMethod,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Missing payment details' },
        { status: 400 }
      );
    }

    // ── 1. Verify Razorpay HMAC-SHA256 signature ────────────────────────────
    const keySecret = (
      process.env.RAZORPAY_KEY_SECRET ||
      process.env.RAZORPAY_SECRET ||
      ''
    ).trim();

    if (!keySecret) {
      return NextResponse.json(
        { success: false, error: 'Payment configuration error' },
        { status: 500 }
      );
    }

    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // ── 2. Atomically fulfill order in the same request ───────────────────────
    // Fulfilling immediately upon signature verification eliminates order loss
    // if the user closes the browser before /api/orders/create is called.
    let orderResult: { orderNumber?: string; alreadyProcessed?: boolean } = {};

    let itemsToFulfill = items;
    let itemsSummary = '';
    let targetAddressId = shippingAddressId || null;
    let targetShippingFee = shippingFee ?? SHIPPING_FEE;
    let targetPhone = customerPhone || null;
    let targetEmail = customerEmail || null;
    let targetName = customerName || null;

    // Fallback: If items was not passed in request body, retrieve metadata from Razorpay order notes
    if (!itemsToFulfill || !Array.isArray(itemsToFulfill) || itemsToFulfill.length === 0) {
      try {
        const { createRazorpayInstance } = await import('@/lib/razorpay');
        const razorpay = createRazorpayInstance();
        const rzOrder = await razorpay.orders.fetch(razorpay_order_id);
        const notes = (rzOrder?.notes as Record<string, any>) || {};
        if (notes.items_summary) {
          itemsSummary = String(notes.items_summary);
          targetAddressId = targetAddressId || notes.shipping_address_id || null;
          if (notes.shipping_fee) targetShippingFee = parseFloat(notes.shipping_fee);
          targetPhone = targetPhone || notes.customer_phone || null;
          targetEmail = targetEmail || notes.customer_email || null;
          targetName = targetName || notes.customer_name || null;
        }
      } catch (err: any) {
        console.warn('[payment/verify] Could not fetch Razorpay order notes for fallback:', err?.message);
      }
    }

    if ((itemsToFulfill && itemsToFulfill.length > 0) || itemsSummary) {
      try {
        const result = await fulfillOrder({
          userId: authUser.userId,
          items: itemsToFulfill && itemsToFulfill.length > 0 ? itemsToFulfill : undefined,
          itemsSummary: itemsSummary || undefined,
          shippingAddressId: targetAddressId,
          paymentMethod: paymentMethod || 'Razorpay - Online Payment',
          paymentId: razorpay_payment_id,
          razorpayOrderId: razorpay_order_id,
          shippingFee: targetShippingFee,
          customerEmail: targetEmail,
          customerPhone: targetPhone,
          customerName: targetName,
        });

        orderResult = {
          orderNumber: result.orderNumber,
          alreadyProcessed: result.alreadyProcessed,
        };

        console.log(
          `[payment/verify] Order fulfilled in verify step: #${result.orderNumber} (alreadyProcessed=${result.alreadyProcessed})`
        );
      } catch (fulfillErr: any) {
        // Non-fatal: if fulfillment fails here, log error so the fallback
        // /api/orders/create or Razorpay webhook can fulfill it.
        console.error('[payment/verify] fulfillOrder error (non-fatal):', fulfillErr?.message);
      }
    }

    return NextResponse.json({
      success: true,
      verified: true,
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
      ...(orderResult.orderNumber ? { orderNumber: orderResult.orderNumber } : {}),
      ...(orderResult.alreadyProcessed !== undefined ? { alreadyProcessed: orderResult.alreadyProcessed } : {}),
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to verify payment',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

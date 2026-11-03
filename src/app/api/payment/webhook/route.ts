import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { fulfillOrder } from '@/lib/orderFulfillment';
import { createAdminClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    const webhookSecret = (
      process.env.RAZORPAY_WEBHOOK_SECRET ||
      process.env.RAZORPAY_KEY_SECRET ||
      ''
    ).trim();

    if (!webhookSecret) {
      console.error('[Razorpay Webhook] Missing RAZORPAY_WEBHOOK_SECRET in environment');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    if (!signature) {
      console.warn('[Razorpay Webhook] Missing x-razorpay-signature header');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Verify HMAC-SHA256 signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('[Razorpay Webhook] Signature verification failed');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    console.log(`[Razorpay Webhook] Received verified event: ${event}`);

    // ─── 1. Payment Captured or Order Paid ──────────────────────────────────
    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload.payload?.payment?.entity;
      const orderEntity = payload.payload?.order?.entity;

      const paymentId = paymentEntity?.id || null;
      const razorpayOrderId = paymentEntity?.order_id || orderEntity?.id || null;
      const notes = paymentEntity?.notes || orderEntity?.notes || {};

      const userId = notes.user_id;
      const shippingAddressId = notes.shipping_address_id || null;
      const itemsSummary = notes.items_summary || '';
      const shippingFee = parseFloat(notes.shipping_fee || '48');
      const customerPhone = paymentEntity?.contact || notes.customer_phone || '';
      const customerEmail = paymentEntity?.email || notes.customer_email || '';
      const customerName = notes.customer_name || '';

      if (userId) {
        try {
          const result = await fulfillOrder({
            userId,
            itemsSummary,
            shippingAddressId,
            paymentMethod: `Razorpay - ${paymentEntity?.method?.toUpperCase() || 'UPI'}`,
            paymentId,
            razorpayOrderId,
            shippingFee,
            customerEmail,
            customerPhone,
            customerName,
          });

          console.log(`[Razorpay Webhook] Order fulfillment result for ${paymentId}:`, {
            orderNumber: result.orderNumber,
            alreadyProcessed: result.alreadyProcessed,
          });
        } catch (fulfillErr) {
          console.error('[Razorpay Webhook] Failed to fulfill order automatically:', fulfillErr);
        }
      } else {
        console.warn('[Razorpay Webhook] No user_id present in payment notes:', paymentId);
      }
    }

    // ─── 2. Payment Failed ──────────────────────────────────────────────────
    if (event === 'payment.failed') {
      const paymentEntity = payload.payload?.payment?.entity;
      const failedRazorpayOrderId = paymentEntity?.order_id;

      console.warn('[Razorpay Webhook] Payment failed on gateway:', {
        paymentId: paymentEntity?.id,
        orderId: failedRazorpayOrderId,
        errorCode: paymentEntity?.error_code,
        errorDescription: paymentEntity?.error_description,
        contact: paymentEntity?.contact,
      });

      // Mark any pre-created order record as Failed in DB
      if (failedRazorpayOrderId) {
        const supabase = createAdminClient();
        await supabase
          .from('orders')
          .update({ order_status: 'Failed', payment_status: 'Failed' })
          .eq('razorpay_order_id', failedRazorpayOrderId);
        console.log(`[Razorpay Webhook] Marked order as Failed for razorpay_order_id ${failedRazorpayOrderId}`);
      }
    }

    // ─── 3. Refund Processed ────────────────────────────────────────────────
    if (event === 'refund.processed' || event === 'refund.created') {
      const refundEntity = payload.payload?.refund?.entity;
      const paymentId = refundEntity?.payment_id;

      if (paymentId) {
        const supabase = createAdminClient();
        await supabase
          .from('orders')
          .update({
            order_status: 'Refunded',
            order_refund_amount: (refundEntity?.amount || 0) / 100,
          })
          .eq('razorpay_payment_id', paymentId);

        console.log(`[Razorpay Webhook] Marked order as Refunded for payment ${paymentId}`);
      }
    }

    return NextResponse.json({ status: 'ok', received: true });
  } catch (err: any) {
    console.error('[Razorpay Webhook] Processing error:', err);
    return NextResponse.json({ error: 'Webhook processing failed', details: err?.message }, { status: 500 });
  }
}


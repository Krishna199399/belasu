import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { fulfillRazorpayPayment, hmacMatches } from '@/lib/paymentFulfillment';

/**
 * Razorpay webhook — server-side safety net for orders whose browser callback
 * never reached us. Orders are created ONLY via fulfillRazorpayPayment, which reads
 * the customer/books from the Razorpay ORDER notes written by our server. Payment
 * notes are ignored: they are set by the browser at checkout.
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    const webhookSecret = (process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET || '').trim();

    if (!webhookSecret) {
      console.error('[Razorpay Webhook] Missing RAZORPAY_WEBHOOK_SECRET in environment');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }
    if (!hmacMatches(webhookSecret, rawBody, signature)) {
      console.error('[Razorpay Webhook] Signature verification failed');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    console.log(`[Razorpay Webhook] Received verified event: ${event}`);

    // ── Payment captured / order paid → create the order if the browser flow missed it
    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload.payload?.payment?.entity;
      const paymentId = paymentEntity?.id;
      const razorpayOrderId = paymentEntity?.order_id || payload.payload?.order?.entity?.id;
      if (paymentId && razorpayOrderId) {
        try {
          const result = await fulfillRazorpayPayment({ razorpayOrderId, paymentId });
          console.log(`[Razorpay Webhook] ${result.kind} order #${result.orderNumber} (alreadyProcessed=${result.alreadyProcessed})`);
        } catch (fulfillErr) {
          // Logged loudly: a captured payment without an order needs a human to look at it
          console.error(`[Razorpay Webhook] FULFILMENT FAILED for payment ${paymentId}:`, fulfillErr instanceof Error ? fulfillErr.message : fulfillErr);
        }
      }
    }

    // ── Payment failed → mark any pre-created order record as Failed
    if (event === 'payment.failed') {
      const failedRazorpayOrderId = payload.payload?.payment?.entity?.order_id;
      if (failedRazorpayOrderId) {
        await createAdminClient()
          .from('orders')
          .update({ order_status: 'Failed', payment_status: 'Failed' })
          .eq('razorpay_order_id', failedRazorpayOrderId)
          .neq('payment_status', 'Paid'); // never downgrade an order that was paid by a later attempt
      }
    }

    // ── Refund → record the refunded amount; only a FULL refund marks the order Refunded
    if (event === 'refund.processed' || event === 'refund.created') {
      const refundEntity = payload.payload?.refund?.entity;
      const paymentId = refundEntity?.payment_id;
      if (paymentId) {
        const supabase = createAdminClient();
        const { data: order } = await supabase
          .from('orders')
          .select('id, order_total_amount')
          .eq('razorpay_payment_id', paymentId)
          .maybeSingle();
        if (order) {
          // Prefer the payment's cumulative refunded amount; fall back to this refund
          const refunded =
            (Number(payload.payload?.payment?.entity?.amount_refunded) || Number(refundEntity?.amount) || 0) / 100;
          const full = refunded + 0.5 >= Number(order.order_total_amount);
          await supabase
            .from('orders')
            .update({ order_refund_amount: refunded, ...(full ? { order_status: 'Refunded' } : {}) })
            .eq('id', order.id);
          console.log(`[Razorpay Webhook] Refund ₹${refunded} recorded for payment ${paymentId} (${full ? 'full' : 'partial'})`);
        }
      }
    }

    return NextResponse.json({ status: 'ok', received: true });
  } catch (err) {
    console.error('[Razorpay Webhook] Processing error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

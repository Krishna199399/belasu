import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { fulfillRazorpayPayment, isValidCheckoutSignature } from '@/lib/paymentFulfillment';

/**
 * POST /api/payment/verify  { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 *
 * Verifies the checkout signature, then creates the order from what Razorpay
 * says was paid (see src/lib/paymentFulfillment.ts). Any items / prices / shipping
 * the browser sends are ignored.
 */
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ success: false, error: 'Missing payment details' }, { status: 400 });
    }

    if (!isValidCheckoutSignature(String(razorpay_order_id), String(razorpay_payment_id), String(razorpay_signature))) {
      return NextResponse.json({ success: false, error: 'Invalid payment signature' }, { status: 400 });
    }

    // Create the order now so it is not lost if the customer closes the browser.
    // If this fails, the /api/orders/create fallback and the Razorpay webhook retry it.
    let orderNumber: string | undefined;
    let alreadyProcessed: boolean | undefined;
    try {
      const result = await fulfillRazorpayPayment({
        razorpayOrderId: String(razorpay_order_id),
        paymentId: String(razorpay_payment_id),
        expectedUserId: authUser.userId,
      });
      orderNumber = result.orderNumber;
      alreadyProcessed = result.alreadyProcessed;
      console.log(`[payment/verify] Order #${result.orderNumber} (alreadyProcessed=${result.alreadyProcessed})`);
    } catch (fulfillErr) {
      console.error('[payment/verify] Fulfilment failed (fallback/webhook will retry):', fulfillErr instanceof Error ? fulfillErr.message : fulfillErr);
    }

    return NextResponse.json({
      success: true,
      verified: true,
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
      ...(orderNumber ? { orderNumber } : {}),
      ...(alreadyProcessed !== undefined ? { alreadyProcessed } : {}),
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ success: false, error: 'Failed to verify payment' }, { status: 500 });
  }
}

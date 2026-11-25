import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { fulfillRazorpayPayment, isValidCheckoutSignature } from '@/lib/paymentFulfillment';

export const dynamic = 'force-dynamic';

/**
 * POST /api/digital/purchase  { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 *
 * Verifies the checkout signature, then grants the book recorded on the Razorpay
 * order by OUR server (/api/payment/create-order) — not a bookId or amount sent by
 * the browser.
 */
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return Response.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return Response.json(
        { success: false, error: 'Payment information required. Please complete payment through Razorpay.' },
        { status: 400 }
      );
    }

    if (!isValidCheckoutSignature(String(razorpay_order_id), String(razorpay_payment_id), String(razorpay_signature))) {
      return Response.json({ success: false, error: 'Invalid payment signature. Verification failed.' }, { status: 400 });
    }

    const result = await fulfillRazorpayPayment({
      razorpayOrderId: String(razorpay_order_id),
      paymentId: String(razorpay_payment_id),
      expectedUserId: authUser.userId,
    });
    if (result.kind !== 'digital') {
      return Response.json({ success: false, error: 'This payment was not for a digital book.' }, { status: 400 });
    }

    return Response.json({
      success: true,
      message: result.alreadyProcessed ? 'Purchase already recorded' : 'Purchase completed and recorded in orders successfully',
      orderId: result.orderId,
      orderNumber: result.orderNumber,
      bookId: result.bookId,
    });
  } catch (err) {
    console.error('Error during digital purchase:', err);
    return Response.json(
      { success: false, error: 'We could not confirm your payment yet. If money was deducted, your book will unlock shortly — contact support if it does not.' },
      { status: 500 }
    );
  }
}

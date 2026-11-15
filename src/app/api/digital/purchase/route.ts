import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { fulfillDigitalOrder } from '@/lib/digitalFulfillment';
import { HIDE_DIGITAL_CLASS_6 } from '@/data/digitalBooksData';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return Response.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const {
      bookId,
      amount,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      email,
      phone,
      name,
    } = body;

    if (!bookId) {
      return Response.json({ success: false, error: 'Book ID is required' }, { status: 400 });
    }

    if (HIDE_DIGITAL_CLASS_6 && (bookId === 'dbook-6-kn-01' || bookId === 'kannada-class-6-guide')) {
      return Response.json(
        { success: false, error: 'Digital edition currently undergoing final release preparation. Sales open next week.' },
        { status: 400 }
      );
    }

    if (!razorpay_payment_id || !razorpay_order_id) {
      return Response.json(
        { success: false, error: 'Payment information required. Please complete payment through Razorpay.' },
        { status: 400 }
      );
    }

    // Verify Razorpay HMAC signature
    const keySecret = (
      process.env.RAZORPAY_KEY_SECRET ||
      process.env.RAZORPAY_SECRET ||
      ''
    ).trim();
    if (keySecret) {
      if (!razorpay_signature) {
        return Response.json(
          { success: false, error: 'Payment signature missing' },
          { status: 400 }
        );
      }

      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return Response.json(
          { success: false, error: 'Invalid payment signature. Verification failed.' },
          { status: 400 }
        );
      }
    }

    // Delegate ALL order insertion + notifications to the centralised fulfillDigitalOrder.
    // fulfillDigitalOrder is idempotent — concurrent webhook + client calls for the same
    // payment are safely absorbed without creating duplicate orders.
    const result = await fulfillDigitalOrder({
      userId: authUser.userId,
      bookId,
      paymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      paymentMethod: 'Razorpay - Online Payment',
      customerEmail: typeof email === 'string' ? email.trim() : undefined,
      customerPhone: typeof phone === 'string' ? phone.trim() : undefined,
      customerName: typeof name === 'string' ? name.trim() : undefined,
      amountPaid: Number(amount) || undefined,
    });

    return Response.json({
      success: true,
      message: result.alreadyProcessed
        ? 'Purchase already recorded'
        : 'Purchase completed and recorded in orders successfully',
      orderId: result.orderId,
      orderNumber: result.orderNumber,
      bookId,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Server error';
    console.error('Error during digital purchase:', err);
    return Response.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

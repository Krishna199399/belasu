import crypto from 'crypto';
import { createRazorpayInstance } from '@/lib/razorpay';
import { fulfillOrder } from '@/lib/orderFulfillment';
import { fulfillDigitalOrder } from '@/lib/digitalFulfillment';

/**
 * The ONLY way an online order gets created.
 *
 * Asks Razorpay's API (not the browser) what happened:
 *   - the payment exists, belongs to this Razorpay order, and is captured/authorized
 *   - the amount paid equals the Razorpay order amount
 *   - the order notes — written by OUR server in /api/payment/create-order — say
 *     which customer and which books (prices re-checked from the catalogue)
 * Then creates the order. Safe to call from the browser callback, the order-create
 * fallback and the Razorpay webhook at the same time (fulfilment is idempotent).
 */

export interface PaymentFulfillmentResult {
  kind: 'books' | 'digital';
  orderNumber: string;
  orderId?: string;
  bookId?: string;
  alreadyProcessed: boolean;
}

type RazorpayNotes = Record<string, string | number | null | undefined>;

/** Constant-time check of an HMAC-SHA256 hex signature */
export function hmacMatches(secret: string, payload: string, signature: string | null | undefined): boolean {
  if (!secret || !signature) return false;
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(String(signature));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Razorpay checkout signature: HMAC(order_id|payment_id) with the key secret */
export function isValidCheckoutSignature(orderId: string, paymentId: string, signature: string): boolean {
  const secret = (process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET || '').trim();
  return hmacMatches(secret, `${orderId}|${paymentId}`, signature);
}

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : v == null ? '' : String(v));

export async function fulfillRazorpayPayment(args: {
  razorpayOrderId: string;
  paymentId: string;
  /** When called on behalf of a logged-in customer: the order must be theirs */
  expectedUserId?: string;
}): Promise<PaymentFulfillmentResult> {
  const { razorpayOrderId, paymentId, expectedUserId } = args;
  const razorpay = createRazorpayInstance();

  const [rzOrder, payment] = await Promise.all([
    razorpay.orders.fetch(razorpayOrderId),
    razorpay.payments.fetch(paymentId),
  ]);

  if (!rzOrder || !payment) throw new Error('Payment not found at Razorpay');
  if (payment.order_id !== razorpayOrderId) throw new Error('Payment does not belong to this order');
  if (payment.status !== 'captured' && payment.status !== 'authorized') {
    throw new Error(`Payment is not complete (status: ${payment.status})`);
  }
  if (Number(payment.amount) !== Number(rzOrder.amount)) {
    throw new Error('Paid amount does not match the payment order');
  }

  const notes = (rzOrder.notes || {}) as RazorpayNotes;
  const userId = str(notes.user_id);
  if (!userId) throw new Error('Payment order has no customer attached');
  if (expectedUserId && userId !== expectedUserId) throw new Error('This payment belongs to a different account');

  const amountPaid = Number(payment.amount) / 100;
  const paymentMethod = `Razorpay - ${str(payment.method).toUpperCase() || 'ONLINE'}`;
  const customerEmail = str(notes.customer_email) || str(payment.email) || null;
  const customerPhone = str(notes.customer_phone) || str(payment.contact) || null;
  const customerName = str(notes.customer_name) || null;

  const bookId = str(notes.bookId || notes.book_id);
  if (bookId) {
    const r = await fulfillDigitalOrder({
      userId,
      bookId,
      paymentId,
      razorpayOrderId,
      paymentMethod,
      customerEmail,
      customerPhone,
      customerName,
      amountPaid,
    });
    return { kind: 'digital', orderNumber: r.orderNumber, orderId: r.orderId, bookId: r.bookId, alreadyProcessed: r.alreadyProcessed };
  }

  const r = await fulfillOrder({
    userId,
    itemsSummary: str(notes.items_summary),
    shippingAddressId: str(notes.shipping_address_id) || null,
    paymentMethod,
    paymentId,
    razorpayOrderId,
    customerEmail,
    customerPhone,
    customerName,
    amountPaid,
  });
  return { kind: 'books', orderNumber: r.orderNumber, orderId: r.order?.id, alreadyProcessed: Boolean(r.alreadyProcessed) };
}

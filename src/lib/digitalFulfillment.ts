/**
 * digitalFulfillment.ts
 *
 * Idempotent, server-side digital book order fulfillment.
 * Called by:
 *   1. /api/digital/purchase  — client-triggered after Razorpay checkout
 *   2. /api/payment/webhook   — server-side safety net (if client call missed)
 *
 * Idempotency: checks razorpay_payment_id OR razorpay_order_id before inserting.
 */

import { createAdminClient } from '@/lib/supabase';
import { resolveDigitalBook } from '@/lib/checkoutPricing';
import { sendWhatsAppOrderConfirmation } from '@/lib/wacrm';
import { sendAdminOrderNotification, sendCustomerOrderReceipt } from '@/lib/email';

export interface FulfillDigitalOrderParams {
  userId: string;
  bookId: string;
  paymentId?: string | null;
  razorpayOrderId?: string | null;
  paymentMethod?: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  customerName?: string | null;
  /** Amount in rupees (e.g. 295). Falls back to book price if 0 or missing. */
  amountPaid?: number;
}

export interface FulfillDigitalOrderResult {
  success: true;
  orderNumber: string;
  orderId: string;
  bookId: string;
  alreadyProcessed: boolean;
}

/**
 * Idempotent digital order fulfillment.
 * Safe to call from both frontend and webhook simultaneously — checks for
 * existing order before inserting.
 */
export async function fulfillDigitalOrder(
  params: FulfillDigitalOrderParams
): Promise<FulfillDigitalOrderResult> {
  const {
    userId,
    bookId,
    paymentId,
    razorpayOrderId,
    paymentMethod = 'Razorpay - Online Payment',
    customerEmail,
    customerPhone,
    customerName,
    amountPaid,
  } = params;

  const supabase = createAdminClient();

  // ── 1. Idempotency check ─────────────────────────────────────────────────
  if (paymentId || razorpayOrderId) {
    let query = supabase.from('orders').select('id, order_number');
    if (paymentId && razorpayOrderId) {
      query = query.or(
        `razorpay_payment_id.eq.${paymentId},razorpay_order_id.eq.${razorpayOrderId}`
      );
    } else if (paymentId) {
      query = query.eq('razorpay_payment_id', paymentId);
    } else if (razorpayOrderId) {
      query = query.eq('razorpay_order_id', razorpayOrderId);
    }

    const { data: existing } = await query.maybeSingle();
    if (existing) {
      console.log(
        `[digitalFulfillment] Idempotent hit — order ${existing.order_number} already exists for payment ${paymentId}`
      );
      return {
        success: true,
        orderNumber: existing.order_number,
        orderId: existing.id,
        bookId,
        alreadyProcessed: true,
      };
    }
  }

  // ── 2. A new order needs a verified payment that covers the book ─────────
  if (!paymentId || !razorpayOrderId || typeof amountPaid !== 'number') {
    throw new Error('[digitalFulfillment] Cannot create an order without a verified payment');
  }

  const book = await resolveDigitalBook(bookId);
  if (!book) {
    throw new Error(`[digitalFulfillment] Book not found for bookId: ${bookId}`);
  }

  if (amountPaid + 0.5 < book.price) {
    console.error(
      `[digitalFulfillment] AMOUNT MISMATCH for ${razorpayOrderId}: paid ₹${amountPaid}, book ${book.id} costs ₹${book.price}`
    );
    throw new Error('[digitalFulfillment] Paid amount is less than the book price');
  }

  const orderAmount = amountPaid;

  // ── 3. Resolve user ──────────────────────────────────────────────────────
  const { data: user, error: userErr } = await supabase
    .from('users')
    .select('id, name, phone, email, purchased_books')
    .eq('id', userId)
    .single();

  if (userErr || !user) {
    throw new Error(`[digitalFulfillment] User not found for userId: ${userId}`);
  }

  // Sync email if missing on the user record
  const finalEmail = customerEmail?.trim() || user.email || null;
  const finalName = customerName?.trim() || user.name || 'Student';
  const finalPhone = customerPhone?.trim() || user.phone || null;

  if (finalEmail && !user.email) {
    await supabase.from('users').update({ email: finalEmail }).eq('id', userId);
  }

  // ── 4. Resolve billing address (optional, digital = no shipping needed) ──
  const { data: defaultAddr } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false })
    .limit(1)
    .maybeSingle();

  const firstName = defaultAddr?.first_name || finalName.trim().split(/\s+/)[0] || 'Valued';
  const lastName =
    defaultAddr?.last_name || finalName.trim().split(/\s+/).slice(1).join(' ') || 'Student';
  const billingCity = defaultAddr?.city || 'Online';
  const billingState = defaultAddr?.state || 'Karnataka';
  const billingPostcode = defaultAddr?.postcode || '560001';
  const billingPhone = defaultAddr?.phone || finalPhone;
  const billingEmail = defaultAddr?.email || finalEmail;

  // ── 5. Generate order number ─────────────────────────────────────────────
  let orderNumber = `${Date.now()}`;
  try {
    const { data: orderNumData } = await supabase.rpc('generate_order_number');
    if (orderNumData) {
      const cleaned = String(orderNumData).replace(/^BLS-?/i, '').replace(/^#+/, '').trim();
      if (cleaned) orderNumber = cleaned;
    }
  } catch {
    // Keep timestamp fallback
  }

  // ── 6. Pre-insert double check (race condition guard) ────────────────────
  if (paymentId || razorpayOrderId) {
    let recheckQuery = supabase.from('orders').select('id, order_number');
    if (paymentId && razorpayOrderId) {
      recheckQuery = recheckQuery.or(
        `razorpay_payment_id.eq.${paymentId},razorpay_order_id.eq.${razorpayOrderId}`
      );
    } else if (paymentId) {
      recheckQuery = recheckQuery.eq('razorpay_payment_id', paymentId);
    } else if (razorpayOrderId) {
      recheckQuery = recheckQuery.eq('razorpay_order_id', razorpayOrderId);
    }

    const { data: recheckExisting } = await recheckQuery.maybeSingle();
    if (recheckExisting) {
      console.log(
        `[digitalFulfillment] Pre-insert double-check hit — order ${recheckExisting.order_number}`
      );
      return {
        success: true,
        orderNumber: recheckExisting.order_number,
        orderId: recheckExisting.id,
        bookId,
        alreadyProcessed: true,
      };
    }
  }

  // ── 7. Upsert order record ───────────────────────────────────────────────
  // Using upsert (not insert) so that if the webhook and client-side call arrive
  // simultaneously, the second one simply returns the already-inserted row
  // instead of creating a duplicate. Requires a UNIQUE constraint on
  // razorpay_payment_id in the orders table (add via Supabase SQL if missing).
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .upsert(
      {
        order_number: orderNumber,
        user_id: user.id,
        order_status: 'Completed',
        order_date: new Date().toISOString(),

        billing_first_name: firstName,
        billing_last_name: lastName,
        billing_address1: 'Digital Instant Delivery (Web Reader)',
        billing_address2: null,
        billing_city: billingCity,
        billing_state: billingState,
        billing_postcode: billingPostcode,
        billing_phone: billingPhone,
        billing_email: billingEmail,

        shipping_method: 'Digital Instant Access',

        payment_method: paymentMethod,
        payment_status: 'Paid',
        razorpay_order_id: razorpayOrderId || null,
        razorpay_payment_id: paymentId || null,

        order_subtotal_amount: orderAmount,
        order_shipping_amount: 0,
        order_total_tax_amount: 0,
        order_refund_amount: 0,
        order_total_amount: orderAmount,

        has_hard_copy_books: false,
        has_physical_books: false,
        has_digital_books: true,
      },
      { onConflict: 'razorpay_payment_id', ignoreDuplicates: false }
    )
    .select()
    .single();

  if (orderErr || !order) {
    throw new Error(
      `[digitalFulfillment] Order upsert failed: ${orderErr?.message || 'unknown DB error'}`
    );
  }

  // ── 8. Insert order item ─────────────────────────────────────────────────
  const { error: itemErr } = await supabase.from('order_items').insert({
    order_id: order.id,
    product_id: book.id,
    item_name: book.title,
    item_sku: book.sku || `SD${book.grade_class || 6}-KN`,
    item_type: 'digital',
    quantity: 1,
    item_cost: orderAmount,
    item_total: orderAmount,
  });

  if (itemErr) {
    // Non-fatal: log and continue — order record is already created
    console.error('[digitalFulfillment] order_items insert error (non-fatal):', itemErr);
  }

  // ── 9. Grant digital access to the user ─────────────────────────────────
  const currentBooks = user.purchased_books || { physical: [], digital: [] };
  const currentDigital = Array.isArray(currentBooks.digital) ? currentBooks.digital : [];

  if (!currentDigital.includes(book.id)) {
    const { error: accessErr } = await supabase
      .from('users')
      .update({
        purchased_books: {
          ...currentBooks,
          digital: [...currentDigital, book.id],
        },
      })
      .eq('id', user.id);

    if (accessErr) {
      console.error('[digitalFulfillment] Failed to grant digital access:', accessErr);
      // Non-fatal from fulfillment perspective — order is recorded, access can be granted manually
    }
  }

  // ── 10. Notifications (non-blocking) ────────────────────────────────────
  const bookLabel = `${book.title} (Class ${book.grade_class || 6} Digital Reader)`;

  sendWhatsAppOrderConfirmation({
    orderNumber: order.order_number,
    name: finalName,
    phone: finalPhone || '',
    totalAmount: orderAmount,
    itemsSummary: bookLabel,
    isDigital: true,
  }).catch((err) => console.warn('[digitalFulfillment] WhatsApp notification error (non-fatal):', err));

  sendAdminOrderNotification({
    orderNumber: order.order_number,
    orderDate: order.order_date,
    customerName: finalName,
    customerPhone: finalPhone,
    customerEmail: finalEmail,
    items: [{ title: book.title, quantity: 1, price: orderAmount, productType: 'digital', sku: book.sku || `SD${book.grade_class || 6}-KN` }],
    subtotal: orderAmount,
    shippingFee: 0,
    totalAmount: orderAmount,
    paymentMethod,
    paymentId: paymentId || undefined,
    razorpayOrderId: razorpayOrderId || undefined,
    shippingAddress: null,
    isDigitalOnly: true,
  }).catch((err) => console.warn('[digitalFulfillment] Admin email error (non-fatal):', err));

  if (finalEmail) {
    sendCustomerOrderReceipt({
      orderNumber: order.order_number,
      orderDate: order.order_date,
      customerName: finalName,
      customerPhone: finalPhone,
      customerEmail: finalEmail,
      items: [{ title: book.title, quantity: 1, price: orderAmount, productType: 'digital', sku: book.sku || `SD${book.grade_class || 6}-KN` }],
      subtotal: orderAmount,
      shippingFee: 0,
      totalAmount: orderAmount,
      paymentMethod,
      paymentId: paymentId || undefined,
      razorpayOrderId: razorpayOrderId || undefined,
      shippingAddress: null,
      isDigitalOnly: true,
    }).catch((err) => console.warn('[digitalFulfillment] Customer receipt error (non-fatal):', err));
  }

  console.log(`[digitalFulfillment] ✅ Order ${orderNumber} created for user ${userId}, book ${bookId}`);

  return {
    success: true,
    orderNumber: order.order_number,
    orderId: order.id,
    bookId,
    alreadyProcessed: false,
  };
}


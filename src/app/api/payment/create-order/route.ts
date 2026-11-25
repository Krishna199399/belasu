import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { createRazorpayInstance } from '@/lib/razorpay';
import { createAdminClient } from '@/lib/supabase';
import { parseItemsSummary, priceCart, resolveDigitalBook } from '@/lib/checkoutPricing';
import { HIDE_DIGITAL_CLASS_6 } from '@/data/digitalBooksData';

/** Razorpay notes: max 15 keys, 256 chars per value */
const note = (v: unknown) => (typeof v === 'string' ? v.trim().slice(0, 250) : '');

/**
 * POST /api/payment/create-order
 *
 * The amount charged is computed HERE from the catalogue — the `amount` the
 * browser sends is ignored. The notes stored on the Razorpay order are built by
 * this server (customer id, books, shipping), so the payment-verification step
 * can trust them.
 *
 * Body: { notes: { items_summary: "SK1:2,SD6-KN:1", shipping_address_id?, customer_* }  — cart checkout
 *         notes: { bookId, customerName?, customerEmail?, customerPhone? }               — digital checkout }
 */
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const clientNotes = (body?.notes && typeof body.notes === 'object' ? body.notes : {}) as Record<string, unknown>;

    let amount: number;
    let notes: Record<string, string>;
    const customer = {
      customer_name: note(clientNotes.customer_name ?? clientNotes.customerName),
      customer_email: note(clientNotes.customer_email ?? clientNotes.customerEmail),
      customer_phone: note(clientNotes.customer_phone ?? clientNotes.customerPhone),
    };

    const bookId = note(clientNotes.bookId ?? clientNotes.book_id);
    if (bookId) {
      // ── Digital book checkout ──
      if (HIDE_DIGITAL_CLASS_6 && (bookId === 'dbook-6-kn-01' || bookId === 'kannada-class-6-guide')) {
        return NextResponse.json({ success: false, error: 'This digital edition is not on sale yet.' }, { status: 400 });
      }
      const book = await resolveDigitalBook(bookId);
      if (!book) return NextResponse.json({ success: false, error: 'Book not found' }, { status: 400 });
      amount = book.price;
      notes = { ...customer, bookId: book.id, bookTitle: note(book.title) };
    } else {
      // ── Cart checkout ──
      let priced;
      try {
        priced = await priceCart(parseItemsSummary(clientNotes.items_summary));
      } catch (e) {
        return NextResponse.json(
          { success: false, error: e instanceof Error ? e.message : 'Invalid cart' },
          { status: 400 }
        );
      }

      let shippingAddressId = note(clientNotes.shipping_address_id);
      if (priced.hasPhysical) {
        if (!shippingAddressId) {
          return NextResponse.json({ success: false, error: 'Please select a delivery address' }, { status: 400 });
        }
        const { data: addr } = await createAdminClient()
          .from('addresses')
          .select('id')
          .eq('id', shippingAddressId)
          .eq('user_id', authUser.userId)
          .maybeSingle();
        if (!addr) {
          return NextResponse.json({ success: false, error: 'Delivery address not found on your account' }, { status: 400 });
        }
      } else {
        shippingAddressId = '';
      }

      amount = priced.total;
      notes = {
        ...customer,
        items_summary: priced.itemsSummary,
        shipping_fee: String(priced.shippingFee),
        shipping_address_id: shippingAddressId,
      };

      const clientAmount = Number(body?.amount);
      if (clientAmount && Math.abs(clientAmount - amount) > 0.5) {
        console.warn(`[create-order] Browser total ₹${clientAmount} ≠ catalogue total ₹${amount} for ${authUser.userId}; charging catalogue total`);
      }
    }

    const razorpay = createRazorpayInstance();
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      // user_id LAST so nothing from the browser can override it
      notes: { ...notes, user_id: authUser.userId },
    });

    return NextResponse.json({
      success: true,
      order: { id: order.id, amount: order.amount, currency: order.currency, receipt: order.receipt },
    });
  } catch (error) {
    console.error('Create Razorpay order error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create payment order' }, { status: 500 });
  }
}

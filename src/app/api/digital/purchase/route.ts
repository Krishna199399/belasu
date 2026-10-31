import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase';
import { DIGITAL_BOOKS_DATA } from '@/data/digitalBooksData';
import { sendWhatsAppOrderConfirmation } from '@/lib/wacrm';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

interface DigitalBookRecord {
  id: string;
  title: string;
  sku?: string;
  price?: number;
  grade_class?: number;
  gradeClass?: number;
  slug?: string;
}

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

    if (!razorpay_payment_id || !razorpay_order_id) {
      return Response.json(
        { success: false, error: 'Payment information required. Please complete payment through Razorpay.' },
        { status: 400 }
      );
    }

    // Verify Razorpay HMAC signature if secret is configured
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
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

    const supabase = createAdminClient();

    // 1. Fetch book details from database or static fallback
    let book: DigitalBookRecord | null = null;
    const { data: dbBook } = await supabase
      .from('digital_books')
      .select('*')
      .eq('id', bookId)
      .maybeSingle();

    if (dbBook) {
      book = dbBook as DigitalBookRecord;
    } else {
      const found = DIGITAL_BOOKS_DATA.find((b) => b.id === bookId);
      if (found) {
        book = {
          id: found.id,
          title: found.title,
          sku: found.sku,
          price: found.price,
          grade_class: found.gradeClass,
          gradeClass: found.gradeClass,
          slug: found.slug,
        };
      }
    }

    if (!book) {
      return Response.json({ success: false, error: 'Book not found' }, { status: 404 });
    }

    // 2. Fetch user details
    const { data: user, error: userErr } = await supabase
      .from('users')
      .select('id, name, phone, email, purchased_books')
      .eq('id', authUser.userId)
      .single();

    if (userErr || !user) {
      return Response.json({ success: false, error: 'User profile not found' }, { status: 404 });
    }

    // 3. Update user email/name if provided and not previously recorded
    const finalEmail = (email && typeof email === 'string' && email.trim()) ? email.trim() : user.email;
    const finalName = (name && typeof name === 'string' && name.trim()) ? name.trim() : user.name;
    const finalPhone = (phone && typeof phone === 'string' && phone.trim()) ? phone.trim() : (user.phone || authUser.phone);

    if ((finalEmail && finalEmail !== user.email) || (finalName && finalName !== user.name)) {
      await supabase
        .from('users')
        .update({
          ...(finalEmail ? { email: finalEmail } : {}),
          ...(finalName ? { name: finalName } : {}),
        })
        .eq('id', user.id);
    }

    // 4. Fetch user default address if exists, or fallback to user profile details
    const { data: defaultAddr } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .limit(1)
      .maybeSingle();

    const firstName = defaultAddr?.first_name || finalName?.trim().split(/\s+/)[0] || 'Valued';
    const lastName = defaultAddr?.last_name || finalName?.trim().split(/\s+/).slice(1).join(' ') || 'Student';
    const billingAddress1 = defaultAddr?.address1 || 'Digital Instant Delivery (Web Reader)';
    const billingAddress2 = defaultAddr?.address2 || null;
    const billingCity = defaultAddr?.city || 'Online';
    const billingState = defaultAddr?.state || 'Karnataka';
    const billingPostcode = defaultAddr?.postcode || '560001';
    const billingPhone = defaultAddr?.phone || finalPhone;
    const billingEmail = defaultAddr?.email || finalEmail || null;

    // Generate valid order number using DB sequence or fallback
    let orderNumber = `BLS-${Date.now()}`;
    try {
      const { data: orderNumData } = await supabase.rpc('generate_order_number');
      if (orderNumData) {
        orderNumber = orderNumData;
      }
    } catch {
      // Keep timestamp fallback
    }

    const orderAmount = Number(amount) || Number(book.price) || 295;

    // 5. Insert into orders table (matching public.orders schema)
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: user.id,
        order_status: 'Completed',
        order_date: new Date().toISOString(),

        billing_first_name: firstName,
        billing_last_name: lastName,
        billing_address1: billingAddress1,
        billing_address2: billingAddress2,
        billing_city: billingCity,
        billing_state: billingState,
        billing_postcode: billingPostcode,
        billing_phone: billingPhone,
        billing_email: billingEmail,

        shipping_method: 'Digital Instant Access',

        payment_method: 'Razorpay - Online Payment',
        payment_status: 'Paid',
        razorpay_order_id: razorpay_order_id || null,
        razorpay_payment_id: razorpay_payment_id || null,

        order_subtotal_amount: orderAmount,
        order_shipping_amount: 0,
        order_total_tax_amount: 0,
        order_refund_amount: 0,
        order_total_amount: orderAmount,

        has_hard_copy_books: false,
        has_physical_books: false,
        has_digital_books: true,
      })
      .select()
      .single();

    if (orderErr || !order) {
      console.error('Failed to create order record for digital purchase:', orderErr);
      return Response.json(
        { success: false, error: 'Failed to record digital order: ' + (orderErr?.message || 'Database error') },
        { status: 500 }
      );
    }

    // 6. Insert into order_items table (matching public.order_items schema)
    const { error: itemErr } = await supabase.from('order_items').insert({
      order_id: order.id,
      product_id: book.id,
      item_name: book.title,
      item_sku: book.sku || `SD${book.grade_class || book.gradeClass || 6}-KN`,
      item_type: 'digital',
      quantity: 1,
      item_cost: orderAmount,
      item_total: orderAmount,
    });

    if (itemErr) {
      console.error('Failed to insert digital order item:', itemErr);
    }

    // 7. Add to purchased_books if not already present
    const currentBooks = user.purchased_books || { physical: [], digital: [] };
    const currentDigital = Array.isArray(currentBooks.digital) ? currentBooks.digital : [];

    if (!currentDigital.includes(bookId)) {
      const updatedBooks = {
        ...currentBooks,
        digital: [...currentDigital, bookId],
      };

      const { error: updateErr } = await supabase
        .from('users')
        .update({ purchased_books: updatedBooks })
        .eq('id', user.id);

      if (updateErr) {
        console.error('Failed to update user purchased_books:', updateErr);
        return Response.json({ success: false, error: 'Failed to grant digital access' }, { status: 500 });
      }
    }

    // 8. Send WhatsApp notification
    try {
      await sendWhatsAppOrderConfirmation({
        orderNumber: order.order_number,
        name: finalName || firstName || 'Student',
        phone: finalPhone,
        totalAmount: orderAmount,
        itemsSummary: `${book.title} (Class ${book.grade_class || book.gradeClass || 6} Digital Reader)`,
        isDigital: true,
      });
    } catch (waErr) {
      console.warn('Non-fatal WhatsApp delivery notice error:', waErr);
    }

    return Response.json({
      success: true,
      message: 'Purchase completed and recorded in orders successfully',
      orderId: order.id,
      orderNumber: order.order_number,
      bookId,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Server error';
    console.error('Error during digital purchase:', err);
    return Response.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

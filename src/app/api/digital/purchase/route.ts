import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase';
import { getLiveDigitalBookBySlug } from '@/lib/digital';
import { DIGITAL_BOOKS_DATA } from '@/data/digitalBooksData';
import { sendWhatsAppOrderConfirmation } from '@/lib/wacrm';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return Response.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { bookId, paymentMethod = 'UPI', amount } = body;

    if (!bookId) {
      return Response.json({ success: false, error: 'Book ID is required' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Fetch book details from database or static fallback
    let book: any = null;
    const { data: dbBook } = await supabase
      .from('digital_books')
      .select('*')
      .eq('id', bookId)
      .maybeSingle();

    if (dbBook) {
      book = dbBook;
    } else {
      book = DIGITAL_BOOKS_DATA.find((b) => b.id === bookId);
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

    const currentBooks = user.purchased_books || { physical: [], digital: [] };
    const currentDigital = Array.isArray(currentBooks.digital) ? currentBooks.digital : [];

    // 3. Add to purchased_books if not already present
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

    // 4. Generate order record
    const orderId = `ORD-${Date.now()}`;
    const orderAmount = Number(amount) || Number(book.price) || 199;

    const { error: orderErr } = await supabase.from('orders').insert({
      id: orderId,
      user_id: user.id,
      customer_name: user.name || 'Valued Student',
      customer_phone: user.phone || authUser.phone,
      shipping_address: 'Digital Instant Delivery (Web Reader)',
      city: 'Online',
      state: 'Karnataka',
      pincode: '560001',
      total_amount: orderAmount,
      shipping_fee: 0,
      payment_method: paymentMethod,
      payment_status: 'Paid',
      order_status: 'Delivered',
      items_summary: `${book.title} (Class ${book.grade_class || book.gradeClass} Digital Reader)`,
    });

    if (orderErr) {
      console.warn('Non-fatal: could not create order row for digital purchase:', orderErr.message);
    } else {
      // Insert order item
      await supabase.from('order_items').insert({
        order_id: orderId,
        product_id: book.id,
        item_title: book.title,
        item_sku: book.sku || `SD${book.grade_class || 6}-KN`,
        item_type: 'digital',
        price: orderAmount,
        quantity: 1,
        item_total: orderAmount,
      });
    }

    // 5. Send WhatsApp notification
    try {
      await sendWhatsAppOrderConfirmation({
        orderNumber: orderId,
        name: user.name || 'Student',
        phone: user.phone || authUser.phone,
        totalAmount: orderAmount,
        itemsSummary: `${book.title} (Digital Reader)`,
        isDigital: true,
      });
    } catch (waErr) {
      console.warn('Non-fatal WhatsApp delivery notice error:', waErr);
    }

    return Response.json({
      success: true,
      message: 'Purchase completed successfully',
      orderId,
      bookId,
    });
  } catch (err: any) {
    console.error('Error during digital purchase:', err);
    return Response.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

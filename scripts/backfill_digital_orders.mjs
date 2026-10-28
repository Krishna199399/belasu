import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function backfill() {
  console.log('--- Starting Digital Orders Backfill ---');

  // 1. Fetch users with digital books in purchased_books
  const { data: users, error: userErr } = await supabase
    .from('users')
    .select('id, phone, name, email, purchased_books');

  if (userErr) {
    console.error('Error fetching users:', userErr);
    return;
  }

  // 2. Fetch digital books details
  const { data: digitalBooks } = await supabase
    .from('digital_books')
    .select('*');

  const booksMap = new Map();
  for (const b of digitalBooks || []) {
    booksMap.set(b.id, b);
  }

  // Fallback for Class 6 if not in DB table
  if (!booksMap.has('dbook-6-kn-01')) {
    booksMap.set('dbook-6-kn-01', {
      id: 'dbook-6-kn-01',
      title: 'Class 6 Siri Kannada Complete Digital Guidebook',
      sku: 'SD6-KN',
      grade_class: 6,
      price: 199,
    });
  }

  for (const user of users || []) {
    const digitalList = user.purchased_books?.digital || [];
    if (!Array.isArray(digitalList) || digitalList.length === 0) continue;

    console.log(`Checking user ${user.phone} (${user.name}) with books:`, digitalList);

    // Check existing digital orders for this user
    const { data: existingOrders } = await supabase
      .from('orders')
      .select('id, order_number, has_digital_books, order_items(product_id)')
      .eq('user_id', user.id)
      .eq('has_digital_books', true);

    const orderedProductIds = new Set();
    for (const o of existingOrders || []) {
      for (const item of o.order_items || []) {
        if (item.product_id) orderedProductIds.add(item.product_id);
      }
    }

    for (const bookId of digitalList) {
      if (orderedProductIds.has(bookId)) {
        console.log(`User ${user.phone} already has an order for book ${bookId}. Skipping.`);
        continue;
      }

      console.log(`Backfilling missing order for user ${user.phone}, book: ${bookId}...`);
      const book = booksMap.get(bookId) || {
        id: bookId,
        title: 'Class 6 Siri Kannada Complete Digital Guidebook',
        sku: 'SD6-KN',
        grade_class: 6,
        price: 199,
      };

      // Get user default address if exists
      const { data: defaultAddr } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .limit(1)
        .maybeSingle();

      const firstName = defaultAddr?.first_name || user.name?.trim().split(/\s+/)[0] || 'Valued';
      const lastName = defaultAddr?.last_name || user.name?.trim().split(/\s+/).slice(1).join(' ') || 'Student';
      const billingAddress1 = defaultAddr?.address1 || 'Digital Instant Delivery (Web Reader)';
      const billingAddress2 = defaultAddr?.address2 || null;
      const billingCity = defaultAddr?.city || 'Online';
      const billingState = defaultAddr?.state || 'Karnataka';
      const billingPostcode = defaultAddr?.postcode || '560001';
      const billingPhone = defaultAddr?.phone || user.phone;
      const billingEmail = defaultAddr?.email || user.email || null;

      let orderNumber = `BLS-${Date.now()}`;
      try {
        const { data: orderNumData } = await supabase.rpc('generate_order_number');
        if (orderNumData) orderNumber = orderNumData;
      } catch {
        // fallback
      }

      const orderAmount = Number(book.price) || 199;

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

          payment_method: 'Online',
          payment_status: 'Paid',

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

      if (orderErr) {
        console.error('Failed to backfill order:', orderErr);
        continue;
      }

      console.log(`Created order ${order.order_number} (${order.id}) for user ${user.phone}`);

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
        console.error('Failed to create order item:', itemErr);
      } else {
        console.log(`Successfully attached digital order item for book ${book.title}!`);
      }
    }
  }

  console.log('--- Backfill Completed ---');
}

backfill().catch(console.error);


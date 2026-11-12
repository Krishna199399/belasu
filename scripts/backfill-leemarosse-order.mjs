/**
 * backfill-leemarosse-order.mjs
 *
 * One-time backfill script for missing digital order:
 *   Customer: leemarosse@gmail.com (+91 9894737528)
 *   Payment:  pay_TzGEWJzrN5gmaA (Razorpay, Captured ₹295)
 *   Order ID: order_TzGELyp1QyF7Eo
 *   User ID:  7309b4b8-fc5d-40b4-8839-6e27972f1709
 *   Book:     dbook-6-kn-01 (Kannada Class 6 Digital Guidebook)
 *
 * Usage:
 *   node scripts/backfill-leemarosse-order.mjs
 *
 * This script is idempotent — safe to run multiple times.
 * It checks if the order already exists before inserting.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sjqccpysjxkmnfttoqgf.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY env var not set.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const PAYMENT_ID = 'pay_TzGEWJzrN5gmaA';
const RAZORPAY_ORDER_ID = 'order_TzGELyp1QyF7Eo';
const USER_ID = '7309b4b8-fc5d-40b4-8839-6e27972f1709';
const BOOK_ID = 'dbook-6-kn-01';
const BOOK_TITLE = 'Kannada Class 6 — Complete English-Translated Digital Guidebook';
const BOOK_SKU = 'SD6-KN';
const AMOUNT = 295;

async function run() {
  console.log('🔍 Checking if order already exists for payment:', PAYMENT_ID);

  // 1. Idempotency check
  const { data: existing } = await supabase
    .from('orders')
    .select('id, order_number, order_status')
    .or(`razorpay_payment_id.eq.${PAYMENT_ID},razorpay_order_id.eq.${RAZORPAY_ORDER_ID}`)
    .maybeSingle();

  if (existing) {
    console.log(`✅ Order already exists: #${existing.order_number} (${existing.order_status}). Nothing to do.`);
    return;
  }

  // 2. Verify user exists
  const { data: user, error: userErr } = await supabase
    .from('users')
    .select('id, name, phone, email, purchased_books')
    .eq('id', USER_ID)
    .single();

  if (userErr || !user) {
    console.error('❌ User not found in DB:', userErr?.message);
    process.exit(1);
  }

  console.log('✅ User found:', user.name, '|', user.email, '|', user.phone);

  // 3. Generate order number
  let orderNumber = `${Date.now()}`;
  const { data: orderNumData } = await supabase.rpc('generate_order_number');
  if (orderNumData) {
    const cleaned = String(orderNumData).replace(/^BLS-?/i, '').replace(/^#+/, '').trim();
    if (cleaned) orderNumber = cleaned;
  }

  console.log('📦 Generated order number:', orderNumber);

  // 4. Insert order
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: USER_ID,
      order_status: 'Completed',
      order_date: new Date('2026-11-12T12:17:00Z').toISOString(), // 5:47 PM IST = 12:17 UTC

      billing_first_name: 'Limarose',
      billing_last_name: '',
      billing_address1: 'Digital Instant Delivery (Web Reader)',
      billing_address2: null,
      billing_city: 'Online',
      billing_state: 'Karnataka',
      billing_postcode: '560001',
      billing_phone: '9894737528',
      billing_email: 'leemarosse@gmail.com',

      shipping_method: 'Digital Instant Access',

      payment_method: 'Razorpay - UPI',
      payment_status: 'Paid',
      razorpay_order_id: RAZORPAY_ORDER_ID,
      razorpay_payment_id: PAYMENT_ID,

      order_subtotal_amount: AMOUNT,
      order_shipping_amount: 0,
      order_total_tax_amount: 0,
      order_refund_amount: 0,
      order_total_amount: AMOUNT,

      has_hard_copy_books: false,
      has_physical_books: false,
      has_digital_books: true,
    })
    .select()
    .single();

  if (orderErr || !order) {
    console.error('❌ Failed to insert order:', orderErr?.message);
    process.exit(1);
  }

  console.log('✅ Order inserted:', order.order_number, '(id:', order.id, ')');

  // 5. Insert order item
  const { error: itemErr } = await supabase.from('order_items').insert({
    order_id: order.id,
    product_id: BOOK_ID,
    item_name: BOOK_TITLE,
    item_sku: BOOK_SKU,
    item_type: 'digital',
    quantity: 1,
    item_cost: AMOUNT,
    item_total: AMOUNT,
  });

  if (itemErr) {
    console.error('⚠️  order_items insert error (non-fatal):', itemErr.message);
  } else {
    console.log('✅ Order item inserted.');
  }

  // 6. Grant digital book access
  const currentBooks = user.purchased_books || { physical: [], digital: [] };
  const currentDigital = Array.isArray(currentBooks.digital) ? currentBooks.digital : [];

  if (currentDigital.includes(BOOK_ID)) {
    console.log('✅ User already has digital access to', BOOK_ID);
  } else {
    const { error: accessErr } = await supabase
      .from('users')
      .update({
        purchased_books: {
          ...currentBooks,
          digital: [...currentDigital, BOOK_ID],
        },
      })
      .eq('id', USER_ID);

    if (accessErr) {
      console.error('❌ Failed to grant digital access:', accessErr.message);
    } else {
      console.log('✅ Digital access granted: dbook-6-kn-01 added to purchased_books.digital');
    }
  }

  console.log('\n🎉 Backfill complete!');
  console.log('   Order Number:', order.order_number);
  console.log('   Customer:    leemarosse@gmail.com | +91 9894737528');
  console.log('   Book:        Kannada Class 6 Digital Guidebook (dbook-6-kn-01)');
  console.log('   Amount:      ₹295 | Payment:', PAYMENT_ID);
  console.log('\nNext step: Verify in admin panel at https://belesu.in/admin/orders');
}

run().catch((err) => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});

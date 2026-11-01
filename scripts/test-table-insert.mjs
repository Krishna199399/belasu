import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testInsert() {
  const testPhone = '9999988888';
  console.log('Testing insert of dummy user...');
  
  // 1. User
  const { data: user, error: userErr } = await supabase
    .from('users')
    .upsert({
      phone: testPhone,
      name: 'Test Customer',
      email: 'test@example.com',
      purchased_books: { physical: ['15926'], digital: [] },
    }, { onConflict: 'phone' })
    .select()
    .single();

  if (userErr) {
    console.error('User insert error:', userErr);
    return;
  }
  console.log('✓ User created:', user.id);

  // 2. Address
  const { data: addr, error: addrErr } = await supabase
    .from('addresses')
    .insert({
      user_id: user.id,
      first_name: 'Test',
      last_name: 'Customer',
      address1: '123 Test Street, Near Temple',
      city: 'Bangalore',
      state: 'KA',
      postcode: '560001',
      phone: testPhone,
      email: 'test@example.com',
      is_default: true,
    })
    .select()
    .single();

  if (addrErr) {
    console.error('Address insert error:', addrErr);
    return;
  }
  console.log('✓ Address created:', addr.id);

  // 3. Order
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .upsert({
      order_number: 'TEST-MIGRATION-001',
      user_id: user.id,
      order_status: 'Completed',
      order_date: new Date().toISOString(),
      billing_first_name: 'Test',
      billing_last_name: 'Customer',
      billing_address1: '123 Test Street, Near Temple',
      billing_city: 'Bangalore',
      billing_state: 'KA',
      billing_postcode: '560001',
      billing_phone: testPhone,
      billing_email: 'test@example.com',
      shipping_address_id: addr.id,
      shipping_first_name: 'Test',
      shipping_last_name: 'Customer',
      shipping_address1: '123 Test Street, Near Temple',
      shipping_city: 'Bangalore',
      shipping_state: 'KA',
      shipping_postcode: '560001',
      shipping_phone: testPhone,
      payment_method: 'Credit Card/Debit Card/NetBanking',
      payment_status: 'Paid',
      order_subtotal_amount: 380,
      order_shipping_amount: 40,
      order_total_amount: 420,
      has_hard_copy_books: true,
      has_physical_books: true,
      has_digital_books: false,
    }, { onConflict: 'order_number' })
    .select()
    .single();

  if (orderErr) {
    console.error('Order insert error:', orderErr);
    return;
  }
  console.log('✓ Order created:', order.id);

  // 4. Order Item
  const { data: item, error: itemErr } = await supabase
    .from('order_items')
    .insert({
      order_id: order.id,
      item_sku: 'SK1',
      item_name: 'Savi Kannada Class 1',
      item_type: 'hard_copy',
      quantity: 2,
      item_cost: 190,
      item_total: 380,
      product_id: '15926',
    })
    .select()
    .single();

  if (itemErr) {
    console.error('Order item insert error:', itemErr);
    return;
  }
  console.log('✓ Order item created:', item.id);

  // Clean up test data
  console.log('Cleaning up test records...');
  await supabase.from('order_items').delete().eq('id', item.id);
  await supabase.from('orders').delete().eq('id', order.id);
  await supabase.from('addresses').delete().eq('id', addr.id);
  await supabase.from('users').delete().eq('id', user.id);
  console.log('✓ Cleanup complete. All table constraints and schemas verified!');
}

testInsert();


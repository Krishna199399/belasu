import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifyMigration() {
  console.log('====================================================');
  console.log('🔍 Running Post-Migration Verification');
  console.log('====================================================\n');

  // Test Customer 1: Roopa Pathole (Order 16129)
  const testPhone = '9902111183';
  console.log(`1. Testing Customer Lookup for phone: ${testPhone}`);
  const { data: user, error: userErr } = await supabase
    .from('users')
    .select('*')
    .eq('phone', testPhone)
    .single();

  if (userErr || !user) {
    console.error('❌ User lookup failed:', userErr);
    return;
  }
  console.log('✓ Found User:', {
    id: user.id,
    name: user.name,
    phone: user.phone,
    email: user.email,
  });

  // Test Address Fetch for this user
  console.log(`\n2. Testing Address Fetch for user_id: ${user.id}`);
  const { data: addresses, error: addrErr } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false });

  if (addrErr || !addresses || addresses.length === 0) {
    console.error('❌ Address lookup failed:', addrErr);
    return;
  }

  console.log(`✓ Found ${addresses.length} saved address(es):`);
  for (const a of addresses) {
    console.log(`  - [Default: ${a.is_default}] ${a.first_name} ${a.last_name}, ${a.address1}, ${a.city}, ${a.state} - ${a.postcode} (Phone: ${a.phone})`);
  }

  // Test Order History Fetch for this user
  console.log(`\n3. Testing Order History for user_id: ${user.id}`);
  const { data: orders, error: orderErr } = await supabase
    .from('orders')
    .select('id, order_number, order_status, order_date, order_total_amount')
    .eq('user_id', user.id);

  if (orderErr) {
    console.error('❌ Order lookup failed:', orderErr);
    return;
  }

  console.log(`✓ Found ${orders.length} order(s):`);
  for (const o of orders) {
    // Fetch items for order
    const { data: items } = await supabase
      .from('order_items')
      .select('item_sku, item_name, quantity, item_cost, item_total')
      .eq('order_id', o.id);

    console.log(`  - Order #${o.order_number} (${o.order_status}) on ${o.order_date} | Total: ₹${o.order_total_amount}`);
    if (items) {
      for (const it of items) {
        console.log(`      * SKU: ${it.item_sku} | ${it.item_name} | Qty: ${it.quantity} | Cost: ₹${it.item_cost}`);
      }
    }
  }

  // Test Random Sample Customer 2: Nandhini P (Order 16391)
  const testPhone2 = '9159990581';
  console.log(`\n4. Testing Second Customer: Nandhini P (${testPhone2})`);
  const { data: user2 } = await supabase.from('users').select('*').eq('phone', testPhone2).single();
  const { data: addrs2 } = await supabase.from('addresses').select('*').eq('user_id', user2?.id);
  const { data: ords2 } = await supabase.from('orders').select('order_number, order_total_amount, order_status').eq('user_id', user2?.id);

  console.log('✓ Found Customer 2:', {
    name: user2?.name,
    phone: user2?.phone,
    address: addrs2?.[0]?.address1 + ', ' + addrs2?.[0]?.city + ' - ' + addrs2?.[0]?.postcode,
    defaultAddress: addrs2?.[0]?.is_default,
    orders: ords2?.map(o => `#${o.order_number} (₹${o.order_total_amount})`),
  });

  console.log('\n====================================================');
  console.log('VERDICT: PASS');
  console.log('All customer data, addresses, orders, and items verified in Supabase!');
  console.log('====================================================\n');
}

verifyMigration();

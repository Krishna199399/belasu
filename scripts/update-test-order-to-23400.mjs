import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateOrderNumber() {
  console.log('Finding order BLS-10007 in Supabase...');
  const { data: existing, error: findErr } = await supabase
    .from('orders')
    .select('id, order_number, billing_first_name, order_total_amount')
    .eq('order_number', 'BLS-10007')
    .maybeSingle();

  if (findErr) {
    console.error('Error finding order:', findErr);
    process.exit(1);
  }

  if (!existing) {
    console.log('Order BLS-10007 was not found (maybe already updated). Checking order 23400...');
    const { data: updated } = await supabase
      .from('orders')
      .select('id, order_number, billing_first_name, order_total_amount')
      .eq('order_number', '23400')
      .maybeSingle();
    console.log('Order 23400:', updated);
    return;
  }

  console.log('Found existing order:', existing);
  console.log('Updating order_number to 23400...');

  const { data: updated, error: updateErr } = await supabase
    .from('orders')
    .update({ order_number: '23400' })
    .eq('id', existing.id)
    .select()
    .single();

  if (updateErr) {
    console.error('Failed to update order number:', updateErr);
    process.exit(1);
  }

  console.log('✓ Successfully updated order number to 23400:', {
    id: updated.id,
    order_number: updated.order_number,
    customer: updated.billing_first_name,
    total: updated.order_total_amount,
  });
  console.log('VERDICT: PASS');
}

updateOrderNumber();

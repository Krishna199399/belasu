import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function inspectSchema() {
  const { data: users } = await supabase.from('users').select('*').limit(1);
  console.log('Users sample columns:', users ? Object.keys(users[0] || {}) : 'None');
  
  const { data: addresses } = await supabase.from('addresses').select('*').limit(1);
  console.log('Addresses sample columns:', addresses ? Object.keys(addresses[0] || {}) : 'None');

  const { data: orders } = await supabase.from('orders').select('*').limit(1);
  console.log('Orders sample columns:', orders ? Object.keys(orders[0] || {}) : 'None');

  const { data: items } = await supabase.from('order_items').select('*').limit(1);
  console.log('Order items sample columns:', items ? Object.keys(items[0] || {}) : 'None');
}

inspectSchema();


import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkNextOrderNumber() {
  const { data, error } = await supabase.rpc('generate_order_number');
  if (error) {
    console.error('Error generating order number:', error);
    process.exit(1);
  }
  console.log('Next Generated Order Number:', data);
  if (!data.startsWith('BLS-') && parseInt(data) >= 23400) {
    console.log('VERDICT: PASS - Pure number >= 23400');
  } else {
    console.log('Current format is still:', data);
  }
}

checkNextOrderNumber();


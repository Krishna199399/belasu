import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTable() {
  console.log('Checking dispatch_batches table in Supabase...');
  const { data, error } = await supabase.from('dispatch_batches').select('id').limit(1);
  if (error) {
    console.log('Status: Table not yet created in Supabase schema.');
    console.log('Error detail:', error.message);
    console.log('\nRun scripts/create-dispatch-batches-table.sql in Supabase SQL Editor:');
    console.log('https://supabase.com/dashboard/project/sjqccpysjxkmnfttoqgf/sql/new');
  } else {
    console.log('✓ dispatch_batches table is LIVE and ready in Supabase!');
  }
}

checkTable();

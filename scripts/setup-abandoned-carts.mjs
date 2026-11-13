import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTable() {
  console.log('Checking abandoned_carts table in Supabase Pro...');
  const { data, error } = await supabase.from('abandoned_carts').select('id').limit(1);
  if (error) {
    console.log('Status: Table not yet created in Supabase schema.');
    console.log('Error detail:', error.message);
    console.log('\nRun scripts/create-abandoned-carts-table.sql in Supabase SQL Editor:');
    console.log('https://supabase.com/dashboard/project/sjqccpysjxkmnfttoqgf/sql/new');
  } else {
    console.log('✓ abandoned_carts table is LIVE and ready in Supabase!');
  }
}

checkTable();


import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

const initialInventory = [
  {
    book_id: '15926',
    sku: 'SK1',
    title: 'Savi Kannada English Translated Innovative Guidebook Class 1',
    series: 'Savi',
    grade_class: 1,
    stock_quantity: 45,
    low_stock_threshold: 10,
    is_in_stock: true,
  },
  {
    book_id: '15849',
    sku: 'SK2',
    title: 'Savi Kannada English Translated Innovative Guidebook Class 2',
    series: 'Savi',
    grade_class: 2,
    stock_quantity: 60,
    low_stock_threshold: 10,
    is_in_stock: true,
  },
  {
    book_id: '16142',
    sku: 'SK3',
    title: 'Savi Kannada English Translated Innovative Guidebook Class 3',
    series: 'Savi',
    grade_class: 3,
    stock_quantity: 0, // OUT OF STOCK
    low_stock_threshold: 10,
    is_in_stock: false, // OUT OF STOCK
  },
  {
    book_id: '16351',
    sku: 'SK4',
    title: 'Savi Kannada English Translated Innovative Guidebook Class 4',
    series: 'Savi',
    grade_class: 4,
    stock_quantity: 0, // OUT OF STOCK
    low_stock_threshold: 10,
    is_in_stock: false, // OUT OF STOCK
  },
  {
    book_id: '19570',
    sku: 'KK1',
    title: 'Kali Kannada English Translated Innovative Guidebook Class 1',
    series: 'Kali',
    grade_class: 1,
    stock_quantity: 40,
    low_stock_threshold: 10,
    is_in_stock: true,
  },
  {
    book_id: '19577',
    sku: 'KK2',
    title: 'Kali Kannada English Translated Innovative Guidebook Class 2',
    series: 'Kali',
    grade_class: 2,
    stock_quantity: 30,
    low_stock_threshold: 10,
    is_in_stock: true,
  },
  {
    book_id: '19571',
    sku: 'KK3',
    title: 'Kali Kannada English Translated Innovative Guidebook Class 3',
    series: 'Kali',
    grade_class: 3,
    stock_quantity: 25,
    low_stock_threshold: 10,
    is_in_stock: true,
  },
  {
    book_id: '19757',
    sku: 'KK4',
    title: 'Kali Kannada English Translated Innovative Guidebook Class 4',
    series: 'Kali',
    grade_class: 4,
    stock_quantity: 35,
    low_stock_threshold: 10,
    is_in_stock: true,
  },
  {
    book_id: '17548',
    sku: 'SR5',
    title: 'Siri Kannada English Translated Guidebook Class 5',
    series: 'Siri',
    grade_class: 5,
    stock_quantity: 50,
    low_stock_threshold: 10,
    is_in_stock: true,
  },
  {
    book_id: '20049',
    sku: 'TL5',
    title: 'Tili Kannada English Translated Innovative Guidebook Class 5',
    series: 'Tili',
    grade_class: 5,
    stock_quantity: 42,
    low_stock_threshold: 10,
    is_in_stock: true,
  },
];

async function seed() {
  console.log('Seeding hard_copy_inventory...');
  const { data, error } = await supabase
    .from('hard_copy_inventory')
    .upsert(initialInventory, { onConflict: 'book_id' })
    .select();

  if (error) {
    console.error('Error seeding hard_copy_inventory:', error);
    process.exit(1);
  }

  console.log('Successfully upserted rows in hard_copy_inventory:', data.length);

  // Check inventory_logs
  const logEntries = initialInventory.map(item => ({
    book_id: item.book_id,
    change_amount: item.stock_quantity,
    remaining_stock: item.stock_quantity,
    reason: item.stock_quantity === 0 ? 'Marked Out of Stock by Admin' : 'Initial Baseline Stock'
  }));

  const { error: logErr } = await supabase
    .from('inventory_logs')
    .insert(logEntries);

  if (logErr) {
    console.warn('Note on inventory_logs insertion:', logErr.message);
  } else {
    console.log('Successfully inserted initial audit logs.');
  }

  // Verify
  const { data: verifyData } = await supabase
    .from('hard_copy_inventory')
    .select('book_id, sku, title, stock_quantity, is_in_stock');

  console.log('\n--- Current hard_copy_inventory in Supabase ---');
  console.table(verifyData);
}

seed().catch(console.error);


import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import XLSX from 'xlsx';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Service Role Key in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

const EXCEL_FILE = 'Orders-from - Start -04July 2024 - till - 07Aug2026 - To New Website.xlsx';

const SKU_PRODUCT_MAP = {
  'SK1': '15926',
  'SK2': '15849',
  'SK3': '16142',
  'SK4': '16351',
  'SK5': '21000',
  'KK1': '19570',
  'KK2': '19577',
  'KK3': '19571',
  'KK4': '19757',
  'SR5': '17548',
  'TL5': '20049',
  'TK5': '20049',
};

function parseExcelDate(val) {
  if (!val) return new Date().toISOString();
  if (typeof val === 'number') {
    const d = new Date((val - 25569) * 86400 * 1000);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  }
  const d = new Date(val);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

function parseNumber(val) {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const cleaned = String(val).replace(/[₹$,\s]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

function cleanPhoneNumber(raw) {
  if (!raw) return '';
  const digits = String(raw).replace(/\D/g, '');
  if (digits.length >= 10) {
    return digits.slice(-10);
  }
  return '';
}

async function retryOperation(op, retries = 5, delay = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await op();
      if (res && res.error) {
        throw new Error(res.error.message || JSON.stringify(res.error));
      }
      return res;
    } catch (err) {
      if (attempt === retries) throw err;
      console.warn(`   ⚠️ Warning: Attempt ${attempt} failed (${err.message}). Retrying in ${delay * attempt}ms...`);
      await new Promise((r) => setTimeout(r, delay * attempt));
    }
  }
}

async function runMigration() {
  console.log('====================================================');
  console.log('🚀 Resuming Belesu Order Items Migration');
  console.log('📁 Source File:', EXCEL_FILE);
  console.log('====================================================\n');

  console.log('📖 Reading Excel workbook...');
  const wb = XLSX.readFile(EXCEL_FILE);
  const sheet = wb.Sheets['Orders'];
  const rawRows = XLSX.utils.sheet_to_json(sheet);
  console.log(`✓ Read ${rawRows.length} total rows from Orders sheet.`);

  // Check current counts
  const { count: currentItems } = await supabase.from('order_items').select('*', { count: 'exact', head: true });
  console.log(`Current items in Supabase: ${currentItems}`);

  // Fetch order UUIDs to build orderNumber -> orderId map
  console.log('🔄 Fetching all 5,212 order UUIDs from Supabase...');
  const orderNumberToId = new Map();
  let from = 0;
  const PAGE = 1000;
  while (true) {
    const { data: ords, error } = await supabase
      .from('orders')
      .select('id, order_number')
      .range(from, from + PAGE - 1);
    if (error) throw error;
    if (!ords || ords.length === 0) break;
    for (const o of ords) {
      orderNumberToId.set(o.order_number, o.id);
    }
    if (ords.length < PAGE) break;
    from += PAGE;
  }
  console.log(`✓ Cached ${orderNumberToId.size} order UUIDs.`);

  // Clear partial items if any to avoid duplication
  if (currentItems > 0 && currentItems < 5768) {
    console.log(`🧹 Clearing partial ${currentItems} items before clean insert...`);
    const { error: delErr } = await supabase.from('order_items').delete().gte('quantity', 0);
    if (delErr) {
      console.warn('Could not batch delete order_items:', delErr.message);
    } else {
      console.log('✓ Cleared partial items.');
    }
  }

  // Build items array
  const orderItemsList = [];
  for (const row of rawRows) {
    const rawOrderNum = String(row['Order Number'] || '').trim();
    if (!rawOrderNum) continue;

    const orderId = orderNumberToId.get(rawOrderNum);
    if (!orderId) continue;

    const sku = String(row['SKU'] || '').trim();
    const productId = SKU_PRODUCT_MAP[sku] || null;
    const itemName = String(row['Item Name'] || 'Belesu Book').trim();
    const quantity = parseInt(String(row['Quantity (- Refund)'] || 1), 10) || 1;
    const itemCost = parseNumber(row['Item Cost']);

    orderItemsList.push({
      order_id: orderId,
      item_sku: sku || null,
      item_name: itemName,
      item_type: 'hard_copy',
      quantity,
      item_cost: itemCost,
      item_total: quantity * itemCost,
      product_id: productId,
    });
  }

  console.log(`\n📚 4/4: Inserting ${orderItemsList.length} order items with retry protection...`);
  const BATCH_SIZE = 100;
  let itemCount = 0;

  for (let i = 0; i < orderItemsList.length; i += BATCH_SIZE) {
    const chunk = orderItemsList.slice(i, i + BATCH_SIZE);
    await retryOperation(async () => {
      return await supabase.from('order_items').insert(chunk);
    });

    itemCount += chunk.length;
    process.stdout.write(`\r   Inserted ${itemCount}/${orderItemsList.length} items (${Math.round((itemCount / orderItemsList.length) * 100)}%)`);
  }
  console.log('\n✓ Order items inserted successfully.');

  // Final verification
  const { count: finalUsers } = await supabase.from('users').select('*', { count: 'exact', head: true });
  const { count: finalAddresses } = await supabase.from('addresses').select('*', { count: 'exact', head: true });
  const { count: finalOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true });
  const { count: finalItems } = await supabase.from('order_items').select('*', { count: 'exact', head: true });

  console.log('\n====================================================');
  console.log('🎉 Belesu Data Migration Finished Successfully!');
  console.log('====================================================');
  console.log(`👥 Total Customers in Supabase:   ${finalUsers}`);
  console.log(`🏠 Total Addresses in Supabase:   ${finalAddresses}`);
  console.log(`📦 Total Orders in Supabase:      ${finalOrders}`);
  console.log(`📚 Total Line Items in Supabase:  ${finalItems}`);
  console.log('====================================================\n');
}

runMigration().catch((err) => {
  console.error('\n❌ Fatal Migration Error:', err);
  process.exit(1);
});

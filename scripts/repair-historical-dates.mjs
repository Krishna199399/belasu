import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Service Role Key in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

const PAGE = 1000;
const CONCURRENCY = 50;

async function fetchAllRows(table, selectColumns, extraFilter) {
  const allRows = [];
  let from = 0;
  while (true) {
    let q = supabase.from(table).select(selectColumns).range(from, from + PAGE - 1);
    if (extraFilter) q = extraFilter(q);
    const { data, error } = await q;
    if (error) throw error;
    if (!data || data.length === 0) break;
    allRows.push(...data);
    if (data.length < PAGE) break;
    from += PAGE;
  }
  return allRows;
}

async function repairHistoricalDates() {
  console.log('====================================================');
  console.log('🔧 Starting Historical Date Repair for Belesu');
  console.log('====================================================\n');

  // ── 1. ORDERS REPAIR ────────────────────────────────────────────────────────
  console.log('📦 Phase 1: Fetching all orders where created_at was stamped on Nov 1...');
  const orders = await fetchAllRows(
    'orders',
    'id, order_number, user_id, order_date, created_at',
    (q) =>
      q
        .not('order_date', 'is', null)
        .gte('created_at', '2026-11-01T00:00:00Z')
        .lte('created_at', '2026-11-01T23:59:59.999Z')
  );

  console.log(`Found ${orders.length} orders to repair.\n`);

  let updatedOrders = 0;
  for (let i = 0; i < orders.length; i += CONCURRENCY) {
    const chunk = orders.slice(i, i + CONCURRENCY);
    await Promise.all(
      chunk.map(async (o) => {
        if (!o.order_date) return;
        const { error } = await supabase
          .from('orders')
          .update({ created_at: o.order_date })
          .eq('id', o.id);
        if (error) {
          console.error(`Failed to update order #${o.order_number}:`, error.message);
        } else {
          updatedOrders++;
        }
      })
    );
    process.stdout.write(`\r   Updated ${updatedOrders}/${orders.length} orders (${Math.round((updatedOrders / orders.length) * 100)}%)`);
  }
  console.log('\n✓ Orders date repair completed successfully!\n');

  // ── 2. USERS REPAIR ─────────────────────────────────────────────────────────
  console.log('👤 Phase 2: Computing earliest order date per customer...');
  const allOrdersWithDates = await fetchAllRows(
    'orders',
    'user_id, order_date',
    (q) => q.not('user_id', 'is', null).not('order_date', 'is', null)
  );

  const userEarliestDateMap = new Map();
  for (const o of allOrdersWithDates) {
    if (!o.user_id || !o.order_date) continue;
    const existing = userEarliestDateMap.get(o.user_id);
    if (!existing || new Date(o.order_date).getTime() < new Date(existing).getTime()) {
      userEarliestDateMap.set(o.user_id, o.order_date);
    }
  }
  console.log(`Computed earliest order dates for ${userEarliestDateMap.size} users.\n`);

  console.log('Fetching users stamped on Nov 1 to backfill...');
  const usersToUpdate = await fetchAllRows(
    'users',
    'id, name, phone, created_at',
    (q) =>
      q
        .gte('created_at', '2026-11-01T00:00:00Z')
        .lte('created_at', '2026-11-01T23:59:59.999Z')
  );

  console.log(`Found ${usersToUpdate.length} users created on Nov 1.`);

  let updatedUsers = 0;
  const eligibleUsers = usersToUpdate.filter((u) => userEarliestDateMap.has(u.id));
  console.log(`${eligibleUsers.length} of these users have historical order history to backfill.\n`);

  for (let i = 0; i < eligibleUsers.length; i += CONCURRENCY) {
    const chunk = eligibleUsers.slice(i, i + CONCURRENCY);
    await Promise.all(
      chunk.map(async (u) => {
        const earliestDate = userEarliestDateMap.get(u.id);
        if (!earliestDate) return;
        const { error } = await supabase
          .from('users')
          .update({ created_at: earliestDate })
          .eq('id', u.id);
        if (error) {
          console.error(`Failed to update user ${u.id}:`, error.message);
        } else {
          updatedUsers++;
        }
      })
    );
    process.stdout.write(`\r   Updated ${updatedUsers}/${eligibleUsers.length} users (${Math.round((updatedUsers / eligibleUsers.length) * 100)}%)`);
  }
  console.log('\n✓ Users date repair completed successfully!\n');

  // ── 3. VERIFICATION ────────────────────────────────────────────────────────
  console.log('====================================================');
  console.log('📊 Verification Audit Post-Repair');
  console.log('====================================================');

  const { count: remainingNov1Orders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', '2026-11-01T00:00:00Z')
    .lte('created_at', '2026-11-01T23:59:59.999Z');

  const { data: sampleOrders } = await supabase
    .from('orders')
    .select('order_number, order_date, created_at')
    .in('order_number', ['22128', '22127', '22129', '22133'])
    .order('order_number', { ascending: false });

  console.log(`Remaining orders with created_at on Nov 1: ${remainingNov1Orders}`);
  console.log('Sample verified orders:');
  console.table(sampleOrders);
}

repairHistoricalDates().catch((err) => {
  console.error('Fatal error during repair:', err);
  process.exit(1);
});

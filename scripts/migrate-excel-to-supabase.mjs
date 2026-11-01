import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import XLSX from 'xlsx';
import path from 'path';

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

// SKU to product ID mapping
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

async function runMigration() {
  console.log('====================================================');
  console.log('🚀 Starting Belesu Historical Excel Data Migration');
  console.log('📁 Source File:', EXCEL_FILE);
  console.log('====================================================\n');

  console.log('📖 Reading Excel workbook...');
  const wb = XLSX.readFile(EXCEL_FILE);
  const sheet = wb.Sheets['Orders'];
  if (!sheet) {
    throw new Error('Sheet "Orders" not found in workbook!');
  }
  const rawRows = XLSX.utils.sheet_to_json(sheet);
  console.log(`✓ Read ${rawRows.length} total rows from Orders sheet.`);

  // 1. Data Structuring
  console.log('\n📊 Aggregating customers, orders, and addresses...');
  const userMap = new Map(); // cleanPhone -> user object
  const orderMap = new Map(); // orderNumber -> order object with items
  const GUEST_PHONE = '0000000000';

  // Ensure fallback guest user exists for test/broken phone rows
  userMap.set(GUEST_PHONE, {
    phone: GUEST_PHONE,
    name: 'Legacy Guest Customer',
    email: 'guest@belesu.com',
    purchasedPhysical: new Set(),
    purchasedDigital: new Set(),
    addresses: new Map(),
  });

  for (const row of rawRows) {
    const rawOrderNum = String(row['Order Number'] || '').trim();
    if (!rawOrderNum) continue;

    const rawPhone = String(row['Phone (Billing)'] || '').trim();
    const cleanPhone = cleanPhoneNumber(rawPhone) || GUEST_PHONE;
    const rawEmail = String(row['Email (Billing)'] || '').trim().toLowerCase() || null;
    const firstName = String(row['First Name (Billing)'] || '').trim();
    const lastName = String(row['Last Name (Billing)'] || '').trim();
    const fullName = `${firstName} ${lastName}`.trim() || 'Customer';

    const address1 = String(row['Address 1&2 (Billing)'] || '').trim();
    const city = String(row['City (Billing)'] || '').trim();
    const state = String(row['State Code (Billing)'] || 'KA').trim() || 'KA';
    const postcode = String(row['Postcode (Billing)'] || '').trim();

    const sku = String(row['SKU'] || '').trim();
    const productId = SKU_PRODUCT_MAP[sku] || null;
    const itemName = String(row['Item Name'] || 'Belesu Book').trim();
    const quantity = parseInt(String(row['Quantity (- Refund)'] || 1), 10) || 1;
    const itemCost = parseNumber(row['Item Cost']);
    const rawStatus = String(row['Order Status'] || 'Processing').trim();
    const orderDate = parseExcelDate(row['Order Date']);

    // Map order status
    let orderStatus = 'Processing';
    const lowerStatus = rawStatus.toLowerCase();
    if (lowerStatus.includes('complete')) orderStatus = 'Completed';
    else if (lowerStatus.includes('cancel')) orderStatus = 'Cancelled';
    else if (lowerStatus.includes('refund')) orderStatus = 'Refunded';
    else if (lowerStatus.includes('fail')) orderStatus = 'Failed';
    else if (lowerStatus.includes('process')) orderStatus = 'Processing';

    // User aggregation
    if (!userMap.has(cleanPhone)) {
      userMap.set(cleanPhone, {
        phone: cleanPhone,
        name: fullName,
        email: rawEmail,
        purchasedPhysical: new Set(),
        purchasedDigital: new Set(),
        addresses: new Map(),
      });
    }

    const user = userMap.get(cleanPhone);
    // Keep most complete name & email
    if ((!user.name || user.name === 'Customer') && fullName) {
      user.name = fullName;
    }
    if (!user.email && rawEmail) {
      user.email = rawEmail;
    }
    if (productId && (orderStatus === 'Completed' || orderStatus === 'Processing')) {
      user.purchasedPhysical.add(productId);
    }

    // Address aggregation
    if (address1 && city && postcode) {
      const addrKey = `${address1}|${city}|${postcode}`.toLowerCase();
      // Store address with latest order date for ordering
      if (!user.addresses.has(addrKey)) {
        user.addresses.set(addrKey, {
          firstName: firstName || 'Customer',
          lastName: lastName || '',
          address1,
          city,
          state,
          postcode,
          phone: cleanPhone,
          email: rawEmail,
          latestDate: orderDate,
        });
      } else {
        const existing = user.addresses.get(addrKey);
        if (new Date(orderDate) > new Date(existing.latestDate)) {
          existing.latestDate = orderDate;
        }
      }
    }

    // Order aggregation
    if (!orderMap.has(rawOrderNum)) {
      orderMap.set(rawOrderNum, {
        orderNumber: rawOrderNum,
        cleanPhone,
        orderStatus,
        orderDate,
        firstName,
        lastName,
        address1,
        city,
        state,
        postcode,
        email: rawEmail,
        phone: cleanPhone,
        paymentMethod: String(row['Payment Method Title'] || 'Online').trim(),
        paymentStatus: orderStatus === 'Completed' ? 'Paid' : 'Pending',
        subtotal: parseNumber(row['Order Subtotal Amount']),
        shipping: parseNumber(row['Order Shipping Amount']),
        total: parseNumber(row['Order Total Amount']),
        refund: parseNumber(row['Order Refund Amount']),
        items: [],
      });
    }

    orderMap.get(rawOrderNum).items.push({
      sku,
      productId,
      name: itemName,
      quantity,
      cost: itemCost,
      total: quantity * itemCost,
    });
  }

  console.log(`✓ Processed ${userMap.size} unique customers.`);
  console.log(`✓ Processed ${orderMap.size} unique orders.`);

  // 2. Insert / Upsert Users in batches of 200
  console.log('\n👤 1/4: Upserting users into public.users...');
  const userList = Array.from(userMap.values());
  const BATCH_SIZE = 200;
  let userCount = 0;

  for (let i = 0; i < userList.length; i += BATCH_SIZE) {
    const chunk = userList.slice(i, i + BATCH_SIZE).map((u) => ({
      phone: u.phone,
      name: u.name,
      email: u.email,
      purchased_books: {
        physical: Array.from(u.purchasedPhysical),
        digital: Array.from(u.purchasedDigital),
      },
    }));

    const { error } = await supabase.from('users').upsert(chunk, { onConflict: 'phone' });
    if (error) {
      console.error(`Error upserting users batch [${i} - ${i + chunk.length}]:`, error.message);
      throw error;
    }
    userCount += chunk.length;
    process.stdout.write(`\r   Upserted ${userCount}/${userList.length} users (${Math.round((userCount / userList.length) * 100)}%)`);
  }
  console.log('\n✓ Users upsert completed successfully.');

  // Fetch all user records to build phone -> uuid map
  console.log('🔄 Fetching user UUIDs from Supabase...');
  const phoneToUuid = new Map();
  let from = 0;
  const PAGE = 1000;
  while (true) {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, phone')
      .range(from, from + PAGE - 1);
    if (error) throw error;
    if (!users || users.length === 0) break;
    for (const u of users) {
      phoneToUuid.set(u.phone, u.id);
    }
    if (users.length < PAGE) break;
    from += PAGE;
  }
  console.log(`✓ Cached ${phoneToUuid.size} user UUIDs.`);

  // 3. Prepare & Insert Addresses
  console.log('\n🏠 2/4: Inserting addresses into public.addresses...');
  const addressInsertList = [];

  for (const user of userList) {
    const userId = phoneToUuid.get(user.phone);
    if (!userId) continue;

    const userAddresses = Array.from(user.addresses.values());
    // Sort so latest address is first
    userAddresses.sort((a, b) => new Date(b.latestDate).getTime() - new Date(a.latestDate).getTime());

    for (let idx = 0; idx < userAddresses.length; idx++) {
      const addr = userAddresses[idx];
      addressInsertList.push({
        user_id: userId,
        first_name: addr.firstName,
        last_name: addr.lastName,
        address1: addr.address1,
        address2: null,
        city: addr.city,
        state: addr.state,
        postcode: addr.postcode,
        phone: addr.phone,
        email: addr.email,
        is_default: idx === 0, // Mark latest as default!
      });
    }
  }

  console.log(`Found ${addressInsertList.length} total customer addresses to import.`);
  let addressCount = 0;

  for (let i = 0; i < addressInsertList.length; i += BATCH_SIZE) {
    const chunk = addressInsertList.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from('addresses').insert(chunk);
    if (error) {
      console.error(`Error inserting addresses batch [${i} - ${i + chunk.length}]:`, error.message);
      throw error;
    }
    addressCount += chunk.length;
    process.stdout.write(`\r   Inserted ${addressCount}/${addressInsertList.length} addresses (${Math.round((addressCount / addressInsertList.length) * 100)}%)`);
  }
  console.log('\n✓ Addresses inserted successfully.');

  // Fetch all default addresses to build userId -> defaultAddressId map for orders
  console.log('🔄 Fetching address IDs from Supabase...');
  const userToDefaultAddressId = new Map();
  from = 0;
  while (true) {
    const { data: addrs, error } = await supabase
      .from('addresses')
      .select('id, user_id, is_default')
      .range(from, from + PAGE - 1);
    if (error) throw error;
    if (!addrs || addrs.length === 0) break;
    for (const a of addrs) {
      if (a.is_default) {
        userToDefaultAddressId.set(a.user_id, a.id);
      }
    }
    if (addrs.length < PAGE) break;
    from += PAGE;
  }
  console.log(`✓ Cached ${userToDefaultAddressId.size} default address links.`);

  // 4. Insert / Upsert Orders
  console.log('\n📦 3/4: Upserting orders into public.orders...');
  const orderList = Array.from(orderMap.values());
  let orderCount = 0;

  for (let i = 0; i < orderList.length; i += BATCH_SIZE) {
    const chunk = orderList.slice(i, i + BATCH_SIZE).map((o) => {
      const userId = phoneToUuid.get(o.cleanPhone) || phoneToUuid.get(GUEST_PHONE);
      const addressId = userToDefaultAddressId.get(userId) || null;

      return {
        order_number: o.orderNumber,
        user_id: userId,
        order_status: o.orderStatus,
        order_date: o.orderDate,
        billing_first_name: o.firstName || 'Customer',
        billing_last_name: o.lastName || '',
        billing_address1: o.address1 || 'Karnataka',
        billing_address2: null,
        billing_city: o.city || 'Bangalore',
        billing_state: o.state || 'KA',
        billing_postcode: o.postcode || '560001',
        billing_phone: o.phone,
        billing_email: o.email,
        shipping_address_id: addressId,
        shipping_first_name: o.firstName || 'Customer',
        shipping_last_name: o.lastName || '',
        shipping_address1: o.address1 || 'Karnataka',
        shipping_city: o.city || 'Bangalore',
        shipping_state: o.state || 'KA',
        shipping_postcode: o.postcode || '560001',
        shipping_phone: o.phone,
        shipping_method: 'Flat rate',
        payment_method: o.paymentMethod,
        payment_status: o.paymentStatus,
        order_subtotal_amount: o.subtotal,
        order_shipping_amount: o.shipping,
        order_total_amount: o.total,
        order_refund_amount: o.refund,
        has_hard_copy_books: true,
        has_physical_books: true,
        has_digital_books: false,
      };
    });

    const { error } = await supabase.from('orders').upsert(chunk, { onConflict: 'order_number' });
    if (error) {
      console.error(`Error upserting orders batch [${i} - ${i + chunk.length}]:`, error.message);
      throw error;
    }
    orderCount += chunk.length;
    process.stdout.write(`\r   Upserted ${orderCount}/${orderList.length} orders (${Math.round((orderCount / orderList.length) * 100)}%)`);
  }
  console.log('\n✓ Orders upsert completed successfully.');

  // Fetch order UUIDs to build orderNumber -> orderId map
  console.log('🔄 Fetching order UUIDs from Supabase...');
  const orderNumberToId = new Map();
  from = 0;
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

  // 5. Insert Order Items
  console.log('\n📚 4/4: Inserting order items into public.order_items...');
  const orderItemsList = [];
  for (const ord of orderList) {
    const orderId = orderNumberToId.get(ord.orderNumber);
    if (!orderId) continue;

    for (const item of ord.items) {
      orderItemsList.push({
        order_id: orderId,
        item_sku: item.sku || null,
        item_name: item.name,
        item_type: 'hard_copy',
        quantity: item.quantity,
        item_cost: item.cost,
        item_total: item.total,
        product_id: item.productId,
      });
    }
  }

  console.log(`Found ${orderItemsList.length} order items to import.`);
  let itemCount = 0;

  for (let i = 0; i < orderItemsList.length; i += BATCH_SIZE) {
    const chunk = orderItemsList.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from('order_items').insert(chunk);
    if (error) {
      console.error(`Error inserting order items batch [${i} - ${i + chunk.length}]:`, error.message);
      throw error;
    }
    itemCount += chunk.length;
    process.stdout.write(`\r   Inserted ${itemCount}/${orderItemsList.length} items (${Math.round((itemCount / orderItemsList.length) * 100)}%)`);
  }
  console.log('\n✓ Order items inserted successfully.');

  // 6. Summary & Verification
  console.log('\n====================================================');
  console.log('🎉 Belesu Data Migration Finished Successfully!');
  console.log('====================================================');
  console.log(`👥 Total Customers in Supabase:   ${userCount}`);
  console.log(`🏠 Total Addresses in Supabase:   ${addressCount}`);
  console.log(`📦 Total Orders in Supabase:      ${orderCount}`);
  console.log(`📚 Total Line Items in Supabase:  ${itemCount}`);
  console.log('====================================================\n');
}

runMigration().catch((err) => {
  console.error('\n❌ Fatal Migration Error:', err);
  process.exit(1);
});


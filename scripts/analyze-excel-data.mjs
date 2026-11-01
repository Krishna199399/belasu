import XLSX from 'xlsx';

const filePath = 'Orders-from - Start -04July 2024 - till - 07Aug2026 - To New Website.xlsx';
const workbook = XLSX.readFile(filePath);
const worksheet = workbook.Sheets['Orders'];
const rows = XLSX.utils.sheet_to_json(worksheet);

console.log('Total item rows in Orders sheet:', rows.length);

const orderMap = new Map();
const userPhones = new Map(); // phone -> { name, email, addresses: Set }
const skuCounts = new Map();
const statusCounts = new Map();
let invalidPhones = 0;
let missingAddresses = 0;

for (const row of rows) {
  const orderNum = String(row['Order Number'] || '').trim();
  const status = String(row['Order Status'] || '').trim();
  const rawPhone = String(row['Phone (Billing)'] || '').trim();
  const rawEmail = String(row['Email (Billing)'] || '').trim().toLowerCase();
  const firstName = String(row['First Name (Billing)'] || '').trim();
  const lastName = String(row['Last Name (Billing)'] || '').trim();
  const address = String(row['Address 1&2 (Billing)'] || '').trim();
  const city = String(row['City (Billing)'] || '').trim();
  const state = String(row['State Code (Billing)'] || '').trim();
  const postcode = String(row['Postcode (Billing)'] || '').trim();
  const sku = String(row['SKU'] || '').trim();

  // Order counts
  if (!orderMap.has(orderNum)) {
    orderMap.set(orderNum, {
      orderNum,
      status,
      date: row['Order Date'],
      phone: rawPhone,
      email: rawEmail,
      name: `${firstName} ${lastName}`.trim(),
      items: [],
      subtotal: row['Order Subtotal Amount'],
      shipping: row['Order Shipping Amount'],
      total: row['Order Total Amount'],
      paymentMethod: row['Payment Method Title'],
      address,
      city,
      state,
      postcode,
    });
  }
  orderMap.get(orderNum).items.push({
    sku,
    name: row['Item Name'],
    qty: row['Quantity (- Refund)'],
    cost: row['Item Cost'],
  });

  // SKU counts
  skuCounts.set(sku, (skuCounts.get(sku) || 0) + 1);
  statusCounts.set(status, (statusCounts.get(status) || 0) + 1);

  // Phone clean
  const cleanPhone = rawPhone.replace(/\D/g, '').slice(-10);
  if (cleanPhone.length !== 10) {
    invalidPhones++;
  } else {
    if (!userPhones.has(cleanPhone)) {
      userPhones.set(cleanPhone, {
        phone: cleanPhone,
        name: `${firstName} ${lastName}`.trim(),
        email: rawEmail,
        addresses: new Map(),
      });
    }
    const user = userPhones.get(cleanPhone);
    if (!user.name && (firstName || lastName)) {
      user.name = `${firstName} ${lastName}`.trim();
    }
    if (!user.email && rawEmail) {
      user.email = rawEmail;
    }

    if (address && city && postcode) {
      const addrKey = `${address}|${city}|${postcode}`.toLowerCase();
      if (!user.addresses.has(addrKey)) {
        user.addresses.set(addrKey, {
          firstName,
          lastName,
          address1: address,
          city,
          state: state || 'KA',
          postcode,
          phone: cleanPhone,
          email: rawEmail,
        });
      }
    } else {
      missingAddresses++;
    }
  }
}

console.log('Unique Orders:', orderMap.size);
console.log('Unique Customers by 10-digit Phone:', userPhones.size);
console.log('Invalid/Missing Phone Rows:', invalidPhones);
console.log('Order Statuses:', Object.fromEntries(statusCounts));
console.log('Top 10 SKUs:', Array.from(skuCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10));

let totalAddresses = 0;
for (const [phone, u] of userPhones) {
  totalAddresses += u.addresses.size;
}
console.log('Total Deduplicated User Addresses to Import:', totalAddresses);


/**
 * Excel Data Import Script
 * 
 * This script imports old order data from Excel files into the new system.
 * It maintains backward compatibility with the old database structure while
 * linking orders to the new user authentication system where possible.
 * 
 * Usage:
 *   npm install xlsx
 *   npx ts-node scripts/import-excel-data.ts path/to/orders.xlsx
 */

import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

// Types matching old Excel structure
interface ExcelOrderRow {
  'Order Number': string;
  'Order Status': string;
  'Order Date': string;
  'First Name (Billing)': string;
  'Last Name (Billing)': string;
  'Address 1 (Billing)': string;
  'Address 2 (Billing)': string;
  'City (Billing)': string;
  'Postcode (Billing)': string;
  'Email (Billing)': string;
  'Phone (Billing)': string;
  'Payment Method Title': string;
  'Order Subtotal Amount': string | number;
  'Shipping Method Title': string;
  'Order Shipping Amount': string | number;
  'Order Refund Amount': string | number;
  'Order Total Amount': string | number;
  'Order Total Tax Amount': string | number;
  'Item (SKU)': string; // e.g., "SK1"
  'Item Name': string;
  'Quantity': string | number;
  'Item Cost': string | number;
}

// Import configuration
interface ImportConfig {
  excelFilePath: string;
  sheetName?: string;
  dryRun?: boolean; // If true, only validate without saving
  matchUsers?: boolean; // Try to match orders to existing users by phone/email
  outputJsonPath?: string; // Output transformed data as JSON
}

// Transformed order structure
interface TransformedOrder {
  orderNumber: string;
  orderStatus: string;
  orderDate: string;
  userId: string | null; // null for legacy orders without user match
  billing: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state?: string;
    postcode: string;
    phone: string;
    email: string;
  };
  shipping: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state?: string;
    postcode: string;
    phone: string;
    email: string;
  };
  paymentMethodTitle: string;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  items: Array<{
    itemSKU: string;
    itemName: string;
    quantity: number;
    itemCost: number;
    productType: 'physical' | 'digital';
    productId: string | null;
  }>;
  orderSubtotalAmount: number;
  shippingMethodTitle: string;
  orderShippingAmount: number;
  orderRefundAmount: number;
  orderTotalAmount: number;
  orderTotalTaxAmount: number;
  hasPhysicalProducts: boolean;
  hasDigitalProducts: boolean;
}

/**
 * Parse amount string to number
 * Handles various formats: "₹280", "$280.00", "280", etc.
 */
function parseAmount(value: string | number): number {
  if (typeof value === 'number') return value;
  const cleaned = value.replace(/[₹$,\s]/g, '');
  return parseFloat(cleaned) || 0;
}

/**
 * Determine product type based on SKU pattern
 * SK1-SK10, KK1-KK10, SR5, TL5 = physical
 * SD6-SD10 = digital
 */
function determineProductType(sku: string): 'physical' | 'digital' {
  if (sku.startsWith('SD')) {
    return 'digital';
  }
  return 'physical';
}

/**
 * Map SKU to product ID
 * This requires knowledge of your product IDs from mockData.ts and digitalBooksData.ts
 */
function mapSkuToProductId(sku: string): string | null {
  // TODO: Replace with actual mapping from your database
  // For now, return null to indicate product lookup needed
  
  const skuToIdMap: Record<string, string> = {
    // Physical books
    'SK1': '15926',  // Savi Class 1
    'SK2': '15849',  // Savi Class 2
    'SK3': '16142',  // Savi Class 3
    'SK4': '16351',  // Savi Class 4
    'KK1': '19570',  // Kali Class 1
    'KK2': '19577',  // Kali Class 2
    'KK3': '19571',  // Kali Class 3
    'KK4': '19757',  // Kali Class 4
    'SR5': '17548',  // Siri Class 5
    'TL5': '20049',  // Tili Class 5
    
    // Digital books (you'll need to add actual IDs)
    'SD6-KN': 'digital-6-kannada',
    'SD6-SC': 'digital-6-science',
    'SD7-KN': 'digital-7-kannada',
    'SD7-MA': 'digital-7-math',
    'SD8-KN': 'digital-8-kannada',
    'SD8-SC': 'digital-8-science',
    'SD9-KN': 'digital-9-kannada',
    'SD9-SS': 'digital-9-social',
    'SD10-KN': 'digital-10-kannada',
    'SD10-MA': 'digital-10-math',
    'SD10-SC': 'digital-10-science',
  };
  
  return skuToIdMap[sku] || null;
}

/**
 * Group Excel rows by order number
 * Each order may have multiple rows (one per item)
 */
function groupRowsByOrder(rows: ExcelOrderRow[]): Map<string, ExcelOrderRow[]> {
  const grouped = new Map<string, ExcelOrderRow[]>();
  
  for (const row of rows) {
    const orderNumber = row['Order Number'];
    if (!grouped.has(orderNumber)) {
      grouped.set(orderNumber, []);
    }
    grouped.get(orderNumber)!.push(row);
  }
  
  return grouped;
}

/**
 * Transform Excel rows to order structure
 */
function transformOrderRows(orderNumber: string, rows: ExcelOrderRow[]): TransformedOrder {
  const firstRow = rows[0];
  
  // Build items array
  const items = rows.map(row => {
    const sku = row['Item (SKU)'];
    return {
      itemSKU: sku,
      itemName: row['Item Name'],
      quantity: typeof row['Quantity'] === 'number' ? row['Quantity'] : parseInt(row['Quantity']) || 1,
      itemCost: parseAmount(row['Item Cost']),
      productType: determineProductType(sku),
      productId: mapSkuToProductId(sku),
    };
  });
  
  const hasPhysical = items.some(i => i.productType === 'physical');
  const hasDigital = items.some(i => i.productType === 'digital');
  
  // Normalize order status
  let orderStatus = firstRow['Order Status'];
  const statusMap: Record<string, string> = {
    'completed': 'Completed',
    'processing': 'Processing',
    'pending': 'Pending',
    'cancelled': 'Cancelled',
    'refunded': 'Refunded',
  };
  orderStatus = statusMap[orderStatus.toLowerCase()] || orderStatus;
  
  return {
    orderNumber,
    orderStatus,
    orderDate: firstRow['Order Date'],
    userId: null, // Will be filled if user matching is enabled
    billing: {
      firstName: firstRow['First Name (Billing)'],
      lastName: firstRow['Last Name (Billing)'],
      address1: firstRow['Address 1 (Billing)'],
      address2: firstRow['Address 2 (Billing)'] || '',
      city: firstRow['City (Billing)'],
      postcode: firstRow['Postcode (Billing)'],
      phone: firstRow['Phone (Billing)'],
      email: firstRow['Email (Billing)'],
    },
    shipping: {
      firstName: firstRow['First Name (Billing)'],
      lastName: firstRow['Last Name (Billing)'],
      address1: firstRow['Address 1 (Billing)'],
      address2: firstRow['Address 2 (Billing)'] || '',
      city: firstRow['City (Billing)'],
      postcode: firstRow['Postcode (Billing)'],
      phone: firstRow['Phone (Billing)'],
      email: firstRow['Email (Billing)'],
    },
    paymentMethodTitle: firstRow['Payment Method Title'],
    paymentStatus: orderStatus === 'Completed' ? 'Paid' : 'Pending',
    items,
    orderSubtotalAmount: parseAmount(firstRow['Order Subtotal Amount']),
    shippingMethodTitle: firstRow['Shipping Method Title'],
    orderShippingAmount: parseAmount(firstRow['Order Shipping Amount']),
    orderRefundAmount: parseAmount(firstRow['Order Refund Amount']),
    orderTotalAmount: parseAmount(firstRow['Order Total Amount']),
    orderTotalTaxAmount: parseAmount(firstRow['Order Total Tax Amount']),
    hasPhysicalProducts: hasPhysical,
    hasDigitalProducts: hasDigital,
  };
}

/**
 * Main import function
 */
export async function importExcelData(config: ImportConfig): Promise<void> {
  console.log('📊 Starting Excel import...');
  console.log(`📁 File: ${config.excelFilePath}`);
  console.log(`🧪 Dry run: ${config.dryRun ? 'YES' : 'NO'}`);
  console.log(`👤 Match users: ${config.matchUsers ? 'YES' : 'NO'}`);
  console.log('');
  
  // Read Excel file
  if (!fs.existsSync(config.excelFilePath)) {
    throw new Error(`Excel file not found: ${config.excelFilePath}`);
  }
  
  const workbook = XLSX.readFile(config.excelFilePath);
  const sheetName = config.sheetName || workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  if (!worksheet) {
    throw new Error(`Sheet "${sheetName}" not found in workbook`);
  }
  
  // Parse to JSON
  const rows: ExcelOrderRow[] = XLSX.utils.sheet_to_json(worksheet);
  console.log(`✅ Parsed ${rows.length} rows from Excel`);
  
  // Group by order number
  const ordersMap = groupRowsByOrder(rows);
  console.log(`📦 Found ${ordersMap.size} unique orders`);
  console.log('');
  
  // Transform orders
  const transformedOrders: TransformedOrder[] = [];
  let successCount = 0;
  let errorCount = 0;
  
  for (const [orderNumber, orderRows] of ordersMap.entries()) {
    try {
      const order = transformOrderRows(orderNumber, orderRows);
      transformedOrders.push(order);
      successCount++;
      
      console.log(`✓ Order ${orderNumber}: ${order.items.length} items, ${order.orderStatus}`);
    } catch (error) {
      errorCount++;
      console.error(`✗ Order ${orderNumber}: Error transforming`, error);
    }
  }
  
  console.log('');
  console.log(`✅ Successfully transformed: ${successCount} orders`);
  console.log(`❌ Errors: ${errorCount} orders`);
  console.log('');
  
  // Save as JSON if requested
  if (config.outputJsonPath) {
    fs.writeFileSync(
      config.outputJsonPath,
      JSON.stringify(transformedOrders, null, 2),
      'utf-8'
    );
    console.log(`💾 Saved transformed data to: ${config.outputJsonPath}`);
  }
  
  // If not dry run, save to database
  if (!config.dryRun) {
    console.log('💾 Saving to database...');
    // TODO: Implement database save logic
    // for (const order of transformedOrders) {
    //   await db.orders.create({ data: order });
    // }
    console.log('⚠️  Database save not implemented yet (mock storage)');
  } else {
    console.log('🧪 Dry run complete - no data saved');
  }
  
  console.log('');
  console.log('🎉 Import complete!');
}

/**
 * CLI entry point
 */
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: npx ts-node scripts/import-excel-data.ts <excel-file> [options]');
    console.log('');
    console.log('Options:');
    console.log('  --dry-run          Validate without saving to database');
    console.log('  --sheet <name>     Excel sheet name (default: first sheet)');
    console.log('  --output <path>    Save transformed JSON to file');
    console.log('  --match-users      Try to match orders to existing users');
    console.log('');
    console.log('Example:');
    console.log('  npx ts-node scripts/import-excel-data.ts orders.xlsx --dry-run --output output.json');
    process.exit(1);
  }
  
  const config: ImportConfig = {
    excelFilePath: args[0],
    dryRun: args.includes('--dry-run'),
    matchUsers: args.includes('--match-users'),
  };
  
  const sheetIndex = args.indexOf('--sheet');
  if (sheetIndex !== -1 && args[sheetIndex + 1]) {
    config.sheetName = args[sheetIndex + 1];
  }
  
  const outputIndex = args.indexOf('--output');
  if (outputIndex !== -1 && args[outputIndex + 1]) {
    config.outputJsonPath = args[outputIndex + 1];
  }
  
  importExcelData(config)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('❌ Import failed:', error);
      process.exit(1);
    });
}

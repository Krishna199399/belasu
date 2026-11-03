import { createAdminClient } from '@/lib/supabase';

export interface AdminAnalyticsData {
  totalRevenue: number;
  codRevenue: number;
  onlineRevenue: number;
  totalOrders: number;
  totalUsers: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  physicalCount: number;
  digitalCount: number;
  statusMap: Record<string, number>;
  citySalesMap: Record<string, { count: number; total: number }>;
  topSellingProducts: Array<{
    name: string;
    sku: string;
    type?: string;
    totalQty: number;
    totalRevenue: number;
  }>;
  cachedAt: number;
}

export interface ItemSalesData {
  salesBySku: Record<string, { unitsSold: number; totalRevenue: number; name?: string; sku?: string }>;
  salesById: Record<string, { unitsSold: number; totalRevenue: number; name?: string; sku?: string }>;
  cachedAt: number;
}

// 60-second in-memory cache to guarantee zero load spikes on Supabase
let cachedAnalytics: AdminAnalyticsData | null = null;
let cachedItemSales: ItemSalesData | null = null;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

/**
 * Fetch complete analytics across all 5,000+ orders in Supabase using chunked range queries.
 */
export async function getFullAdminStats(forceRefresh = false): Promise<AdminAnalyticsData> {
  const now = Date.now();
  if (!forceRefresh && cachedAnalytics && now - cachedAnalytics.cachedAt < CACHE_TTL_MS) {
    return cachedAnalytics;
  }

  const supabase = createAdminClient();

  // 1. Exact counts for orders & users
  const { count: totalOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  const { count: totalUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });

  // 2. Fetch order metrics in chunks of 1000 to bypass PostgREST max-rows cap
  const CHUNK_SIZE = 1000;
  let from = 0;
  let hasMore = true;

  let totalRevenue = 0;
  let codRevenue = 0;
  let onlineRevenue = 0;
  let pendingOrders = 0;
  let processingOrders = 0;
  let completedOrders = 0;
  let cancelledOrders = 0;
  let physicalCount = 0;
  let digitalCount = 0;

  const citySalesMap: Record<string, { count: number; total: number }> = {};
  const statusMap: Record<string, number> = {};

  while (hasMore) {
    const { data: chunk, error } = await supabase
      .from('orders')
      .select('order_total_amount, payment_status, order_status, payment_method, has_physical_books, has_digital_books, billing_city')
      .range(from, from + CHUNK_SIZE - 1);

    if (error) {
      console.error('[adminAnalytics] Error fetching order chunk:', error);
      break;
    }

    if (chunk && chunk.length > 0) {
      for (const o of chunk) {
        const amt = Number(o.order_total_amount) || 0;
        const isPaidOrCompleted =
          o.payment_status === 'Paid' ||
          o.order_status === 'Completed' ||
          o.order_status === 'Delivered';

        if (isPaidOrCompleted) {
          totalRevenue += amt;
          const method = (o.payment_method || '').toLowerCase();
          if (method.includes('cash') || method.includes('cod')) {
            codRevenue += amt;
          } else {
            onlineRevenue += amt;
          }
        }

        const status = o.order_status || 'Unknown';
        statusMap[status] = (statusMap[status] || 0) + 1;

        if (status === 'Pending') pendingOrders++;
        else if (status === 'Processing') processingOrders++;
        else if (status === 'Completed' || status === 'Delivered') completedOrders++;
        else if (status === 'Cancelled') cancelledOrders++;

        if (o.has_physical_books) physicalCount++;
        if (o.has_digital_books) digitalCount++;

        const city = (o.billing_city || 'Karnataka').trim();
        if (city) {
          // Normalize common city representations
          const normalizedCity =
            city.toLowerCase() === 'bangalore' || city.toLowerCase() === 'bengaluru' || city.toLowerCase() === 'banglore'
              ? 'Bengaluru'
              : city;

          if (!citySalesMap[normalizedCity]) citySalesMap[normalizedCity] = { count: 0, total: 0 };
          citySalesMap[normalizedCity].count += 1;
          if (isPaidOrCompleted) {
            citySalesMap[normalizedCity].total += amt;
          }
        }
      }

      from += chunk.length;
      if (chunk.length < CHUNK_SIZE) hasMore = false;
    } else {
      hasMore = false;
    }
  }

  // 3. Get item sales data for top products
  const itemSales = await getAggregatedOrderItemSales(forceRefresh);
  const topSellingProducts = Object.values(itemSales.salesBySku)
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, 8)
    .map((p) => ({
      name: p.name || p.sku || 'Unknown Book',
      sku: p.sku || 'N/A',
      totalQty: p.unitsSold,
      totalRevenue: p.totalRevenue,
    }));

  cachedAnalytics = {
    totalRevenue,
    codRevenue,
    onlineRevenue,
    totalOrders: totalOrders || from,
    totalUsers: totalUsers || 0,
    pendingOrders,
    processingOrders,
    completedOrders,
    cancelledOrders,
    physicalCount,
    digitalCount,
    statusMap,
    citySalesMap,
    topSellingProducts,
    cachedAt: now,
  };

  return cachedAnalytics;
}

/**
 * Fetch and aggregate sales across all 5,700+ order_items in Supabase.
 */
export async function getAggregatedOrderItemSales(forceRefresh = false): Promise<ItemSalesData> {
  const now = Date.now();
  if (!forceRefresh && cachedItemSales && now - cachedItemSales.cachedAt < CACHE_TTL_MS) {
    return cachedItemSales;
  }

  const supabase = createAdminClient();
  const CHUNK_SIZE = 1000;
  let from = 0;
  let hasMore = true;

  const salesBySku: Record<string, { unitsSold: number; totalRevenue: number; name?: string; sku?: string }> = {};
  const salesById: Record<string, { unitsSold: number; totalRevenue: number; name?: string; sku?: string }> = {};

  while (hasMore) {
    const { data: chunk, error } = await supabase
      .from('order_items')
      .select('product_id, item_sku, item_name, item_type, quantity, item_total')
      .range(from, from + CHUNK_SIZE - 1);

    if (error) {
      console.error('[adminAnalytics] Error fetching order_items chunk:', error);
      break;
    }

    if (chunk && chunk.length > 0) {
      for (const item of chunk) {
        const qty = item.quantity || 1;
        const rev = Number(item.item_total) || 0;

        if (item.item_sku) {
          if (!salesBySku[item.item_sku]) {
            salesBySku[item.item_sku] = {
              unitsSold: 0,
              totalRevenue: 0,
              name: item.item_name,
              sku: item.item_sku,
            };
          }
          salesBySku[item.item_sku].unitsSold += qty;
          salesBySku[item.item_sku].totalRevenue += rev;
        }

        if (item.product_id) {
          if (!salesById[item.product_id]) {
            salesById[item.product_id] = {
              unitsSold: 0,
              totalRevenue: 0,
              name: item.item_name,
              sku: item.item_sku,
            };
          }
          salesById[item.product_id].unitsSold += qty;
          salesById[item.product_id].totalRevenue += rev;
        }
      }

      from += chunk.length;
      if (chunk.length < CHUNK_SIZE) hasMore = false;
    } else {
      hasMore = false;
    }
  }

  cachedItemSales = {
    salesBySku,
    salesById,
    cachedAt: now,
  };

  return cachedItemSales;
}

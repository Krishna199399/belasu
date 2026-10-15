import { requireAdmin } from '@/lib/adminAuth';
import { createAdminClient } from '@/lib/supabase';

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return Response.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  try {
    const supabase = createAdminClient();

    // 1. Fetch all orders for analytics calculation
    const { data: orders, error: ordersErr } = await supabase
      .from('orders')
      .select('id, order_number, order_status, payment_status, order_total_amount, has_physical_books, has_digital_books, created_at, billing_first_name, billing_last_name, billing_phone, billing_city')
      .order('created_at', { ascending: false });

    if (ordersErr) throw ordersErr;

    // 2. Fetch users count
    const { count: totalUsers, error: usersErr } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (usersErr) throw usersErr;

    // 3. Compute stats
    const allOrders = orders || [];
    let totalRevenue = 0;
    let pendingOrders = 0;
    let processingOrders = 0;
    let completedOrders = 0;
    let physicalCount = 0;
    let digitalCount = 0;

    allOrders.forEach((o) => {
      if (o.payment_status === 'Paid' || o.order_status === 'Completed') {
        totalRevenue += Number(o.order_total_amount) || 0;
      }
      if (o.order_status === 'Pending') pendingOrders++;
      if (o.order_status === 'Processing') processingOrders++;
      if (o.order_status === 'Completed' || o.order_status === 'Delivered') completedOrders++;
      if (o.has_physical_books) physicalCount++;
      if (o.has_digital_books) digitalCount++;
    });

    // 4. Fetch recent 10 orders with items
    const { data: recentOrders, error: recentErr } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
      .limit(10);

    if (recentErr) throw recentErr;

    // 5. Fetch top selling items from order_items
    const { data: items } = await supabase
      .from('order_items')
      .select('item_name, item_sku, item_type, quantity, item_total');

    const productSalesMap: Record<string, { name: string; sku: string; type: string; totalQty: number; totalRevenue: number }> = {};
    (items || []).forEach((item) => {
      const key = item.item_sku || item.item_name;
      if (!productSalesMap[key]) {
        productSalesMap[key] = {
          name: item.item_name,
          sku: item.item_sku || 'N/A',
          type: item.item_type,
          totalQty: 0,
          totalRevenue: 0,
        };
      }
      productSalesMap[key].totalQty += item.quantity || 1;
      productSalesMap[key].totalRevenue += Number(item.item_total) || 0;
    });

    const topSellingProducts = Object.values(productSalesMap)
      .sort((a, b) => b.totalQty - a.totalQty)
      .slice(0, 5);

    return Response.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders: allOrders.length,
        pendingOrders,
        processingOrders,
        completedOrders,
        totalUsers: totalUsers || 0,
        physicalCount,
        digitalCount,
      },
      recentOrders: recentOrders || [],
      topSellingProducts,
    });
  } catch (err: any) {
    console.error('Admin stats error:', err);
    return Response.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

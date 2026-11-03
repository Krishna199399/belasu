import { requireAdmin } from '@/lib/adminAuth';
import { createAdminClient } from '@/lib/supabase';
import { getFullAdminStats } from '@/lib/adminAnalytics';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return Response.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get('refresh') === 'true';

    // 1. Fetch complete lifetime analytics (cached for 60s for high performance)
    const analytics = await getFullAdminStats(forceRefresh);

    // 2. Fetch recent 10 orders with items
    const supabase = createAdminClient();
    const { data: recentOrders, error: recentErr } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
      .limit(10);

    if (recentErr) {
      console.warn('Error fetching recent orders for stats:', recentErr);
    }

    return Response.json({
      success: true,
      stats: {
        totalRevenue: analytics.totalRevenue,
        codRevenue: analytics.codRevenue,
        onlineRevenue: analytics.onlineRevenue,
        totalOrders: analytics.totalOrders,
        pendingOrders: analytics.pendingOrders,
        processingOrders: analytics.processingOrders,
        completedOrders: analytics.completedOrders,
        cancelledOrders: analytics.cancelledOrders,
        totalUsers: analytics.totalUsers,
        physicalCount: analytics.physicalCount,
        digitalCount: analytics.digitalCount,
      },
      statusMap: analytics.statusMap,
      citySalesMap: analytics.citySalesMap,
      recentOrders: recentOrders || [],
      topSellingProducts: analytics.topSellingProducts,
      cachedAt: analytics.cachedAt,
    });
  } catch (err: any) {
    console.error('Admin stats error:', err);
    return Response.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

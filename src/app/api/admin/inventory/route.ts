import { requireAdmin } from '@/lib/adminAuth';
import { getPhysicalInventory } from '@/lib/inventory';

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return Response.json(
      { success: false, error: 'Unauthorized. Admin access required.' },
      { status: 403 }
    );
  }

  try {
    const { items, stats } = await getPhysicalInventory();
    return Response.json({
      success: true,
      items,
      stats,
    });
  } catch (err: any) {
    console.error('Failed to fetch physical inventory:', err);
    return Response.json(
      { success: false, error: err.message || 'Server error' },
      { status: 500 }
    );
  }
}

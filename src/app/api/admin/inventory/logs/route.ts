import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { getInventoryLogs } from '@/lib/inventory';

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return Response.json(
      { success: false, error: 'Unauthorized. Admin access required.' },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get('bookId') || undefined;

    const logs = await getInventoryLogs(bookId);
    return Response.json({
      success: true,
      logs,
    });
  } catch (err: any) {
    console.error('Inventory logs API error:', err);
    return Response.json(
      { success: false, error: err.message || 'Server error' },
      { status: 500 }
    );
  }
}

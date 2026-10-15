import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { restockBook } from '@/lib/inventory';

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return Response.json(
      { success: false, error: 'Unauthorized. Admin access required.' },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { bookId, changeAmount, reason, newThreshold } = body;

    if (!bookId) {
      return Response.json(
        { success: false, error: 'Book ID is required' },
        { status: 400 }
      );
    }

    if (typeof changeAmount !== 'number') {
      return Response.json(
        { success: false, error: 'Valid changeAmount number is required' },
        { status: 400 }
      );
    }

    const result = await restockBook(
      bookId,
      changeAmount,
      reason || 'Admin Restock / Adjustment',
      typeof newThreshold === 'number' ? newThreshold : undefined
    );

    if (!result.success) {
      return Response.json(
        { success: false, error: result.error || 'Failed to update stock' },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      remainingStock: result.remainingStock,
    });
  } catch (err: any) {
    console.error('Restock API error:', err);
    return Response.json(
      { success: false, error: err.message || 'Server error' },
      { status: 500 }
    );
  }
}

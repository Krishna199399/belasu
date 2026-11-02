import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { toggleBookStockStatus } from '@/lib/inventory';

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
    const { bookId, inStock } = body;

    if (!bookId) {
      return Response.json(
        { success: false, error: 'Book ID is required' },
        { status: 400 }
      );
    }

    const result = await toggleBookStockStatus(
      bookId,
      typeof inStock === 'boolean' ? inStock : undefined
    );

    if (!result.success) {
      return Response.json(
        { success: false, error: result.error || 'Failed to toggle stock status' },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      bookId,
      inStock: result.inStock,
      stockQuantity: result.stockQuantity,
      message: `Stock status updated to ${result.inStock ? 'In Stock' : 'Out of Stock'}`,
    });
  } catch (err: any) {
    console.error('Toggle stock API error:', err);
    return Response.json(
      { success: false, error: err.message || 'Server error' },
      { status: 500 }
    );
  }
}


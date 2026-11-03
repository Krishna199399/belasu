import { requireAdmin } from '@/lib/adminAuth';
import { createAdminClient } from '@/lib/supabase';
import { BOOKS_DATA } from '@/data/mockData';
import { digitalBooks } from '@/data/digitalBooksData';
import { getPhysicalInventory } from '@/lib/inventory';

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return Response.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  try {
    const supabase = createAdminClient();

    // Query sales count for each product from order_items across all history
    const { getAggregatedOrderItemSales } = await import('@/lib/adminAnalytics');
    const { salesBySku, salesById } = await getAggregatedOrderItemSales();

    const { items: liveInventory } = await getPhysicalInventory();
    const invMap = new Map(liveInventory.map((i) => [i.bookId, i]));

    const physicalProducts = BOOKS_DATA.map((book) => {
      const sales = salesById[book.id] || salesBySku[book.sku] || { unitsSold: 0, totalRevenue: 0 };
      const live = invMap.get(book.id);
      return {
        id: book.id,
        title: book.title,
        sku: book.sku,
        series: book.series,
        gradeClass: book.gradeClass,
        price: book.price,
        originalPrice: book.originalPrice,
        inStock: live ? live.isInStock : book.inStock,
        stockQuantity: live ? live.stockQuantity : book.stockQuantity,
        coverImage: book.coverImage,
        unitsSold: sales.unitsSold,
        revenue: sales.totalRevenue,
        type: 'physical',
      };
    });

    const digitalProducts = digitalBooks.map((book: any) => {
      const sales = salesById[book.id] || salesBySku[book.sku] || { unitsSold: 0, totalRevenue: 0 };
      return {
        id: book.id,
        title: book.title,
        sku: book.sku,
        subject: book.subject,
        gradeClass: book.gradeClass,
        price: book.price,
        originalPrice: book.originalPrice,
        coverImage: book.coverImage,
        totalPages: book.totalPages,
        isFreePreviewPages: book.isFreePreviewPages,
        unitsSold: sales.unitsSold,
        revenue: sales.totalRevenue,
        type: 'digital',
      };
    });

    return Response.json({
      success: true,
      physical: physicalProducts,
      digital: digitalProducts,
    });
  } catch (err: any) {
    console.error('Admin products fetch error:', err);
    return Response.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

import { BOOKS_DATA } from '@/data/mockData';
import { getPhysicalInventory } from '@/lib/inventory';

export async function GET() {
  try {
    const { items: liveInventory } = await getPhysicalInventory();
    const invMap = new Map(liveInventory.map((i) => [i.bookId, i]));

    const books = BOOKS_DATA.map((book) => {
      const live = invMap.get(book.id);
      return {
        ...book,
        stockQuantity: live ? live.stockQuantity : book.stockQuantity,
        inStock: live ? live.isInStock : (book.stockQuantity > 0),
      };
    });

    return Response.json({ success: true, books });
  } catch (err: any) {
    return Response.json({ success: true, books: BOOKS_DATA });
  }
}

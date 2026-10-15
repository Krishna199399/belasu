import { createAdminClient } from '@/lib/supabase';
import { BOOKS_DATA } from '@/data/mockData';
import { PhysicalBookInventory, InventoryLogItem } from '@/types';

// In-memory fallback state to ensure functionality before or after database migration
const inMemoryStock: Record<
  string,
  {
    stockQuantity: number;
    lowStockThreshold: number;
    isInStock: boolean;
    updatedAt: string;
  }
> = {};

// Initialize in-memory cache from BOOKS_DATA
BOOKS_DATA.forEach((b) => {
  inMemoryStock[b.id] = {
    stockQuantity: b.stockQuantity ?? 50,
    lowStockThreshold: 10,
    isInStock: (b.stockQuantity ?? 50) > 0,
    updatedAt: new Date().toISOString(),
  };
});

const inMemoryLogs: InventoryLogItem[] = [];

/**
 * Fetch all physical books inventory along with live sales figures from order_items
 */
export async function getPhysicalInventory(): Promise<{
  items: PhysicalBookInventory[];
  stats: {
    totalUnitsInStock: number;
    lowStockCount: number;
    outOfStockCount: number;
    totalUnitsSold: number;
  };
}> {
  const supabase = createAdminClient();

  // 1. Fetch sales count from order_items
  const salesBySku: Record<string, { unitsSold: number; revenue: number }> = {};
  const salesById: Record<string, { unitsSold: number; revenue: number }> = {};

  try {
    const { data: orderItems } = await supabase
      .from('order_items')
      .select('product_id, item_sku, quantity, item_total, item_type');

    (orderItems || []).forEach((item) => {
      if (item.item_type === 'hard_copy' || item.item_type === 'physical' || !item.item_type) {
        const qty = item.quantity || 1;
        const rev = Number(item.item_total) || 0;
        if (item.item_sku) {
          if (!salesBySku[item.item_sku]) salesBySku[item.item_sku] = { unitsSold: 0, revenue: 0 };
          salesBySku[item.item_sku].unitsSold += qty;
          salesBySku[item.item_sku].revenue += rev;
        }
        if (item.product_id) {
          if (!salesById[item.product_id]) salesById[item.product_id] = { unitsSold: 0, revenue: 0 };
          salesById[item.product_id].unitsSold += qty;
          salesById[item.product_id].revenue += rev;
        }
      }
    });
  } catch (err) {
    console.warn('Could not query order_items for sales:', err);
  }

  // 2. Query hard_copy_inventory (with fallback to physical_inventory)
  let dbRows: any[] | null = null;
  try {
    const { data, error } = await supabase
      .from('hard_copy_inventory')
      .select('*')
      .order('grade_class', { ascending: true });
    if (!error && data && data.length > 0) {
      dbRows = data;
    } else {
      const fallback = await supabase
        .from('physical_inventory')
        .select('*')
        .order('grade_class', { ascending: true });
      if (!fallback.error && fallback.data && fallback.data.length > 0) {
        dbRows = fallback.data;
      }
    }
  } catch (err) {
    // Table might not exist yet; use fallback
  }

  // 3. Assemble complete list
  const items: PhysicalBookInventory[] = BOOKS_DATA.map((book) => {
    const dbRow = dbRows?.find((r) => r.book_id === book.id || r.sku === book.sku);
    const mem = inMemoryStock[book.id];

    const stockQuantity = dbRow ? Number(dbRow.stock_quantity) : mem?.stockQuantity ?? book.stockQuantity ?? 50;
    const lowStockThreshold = dbRow ? Number(dbRow.low_stock_threshold) : mem?.lowStockThreshold ?? 10;
    const isInStock = dbRow ? Boolean(dbRow.is_in_stock) : stockQuantity > 0;
    const updatedAt = dbRow ? dbRow.updated_at : mem?.updatedAt || new Date().toISOString();

    const sales = salesById[book.id] || salesBySku[book.sku] || { unitsSold: 0, revenue: 0 };

    return {
      bookId: book.id,
      sku: book.sku,
      title: book.title,
      series: book.series,
      gradeClass: book.gradeClass,
      stockQuantity,
      lowStockThreshold,
      isInStock,
      coverImage: book.coverImage,
      price: book.price,
      originalPrice: book.originalPrice,
      unitsSold: sales.unitsSold,
      revenue: sales.revenue,
      updatedAt,
    };
  });

  // Calculate summary stats
  const totalUnitsInStock = items.reduce((sum, i) => sum + i.stockQuantity, 0);
  const lowStockCount = items.filter((i) => i.stockQuantity > 0 && i.stockQuantity <= i.lowStockThreshold).length;
  const outOfStockCount = items.filter((i) => i.stockQuantity <= 0).length;
  const totalUnitsSold = items.reduce((sum, i) => sum + i.unitsSold, 0);

  return {
    items,
    stats: {
      totalUnitsInStock,
      lowStockCount,
      outOfStockCount,
      totalUnitsSold,
    },
  };
}

/**
 * Deduct physical inventory when a customer places an order
 */
export async function deductStockOnOrder(
  purchasedPhysicalItems: Array<{ id: string; sku?: string; quantity: number; title?: string }>,
  orderNumber: string
): Promise<{ success: boolean; errors?: string[] }> {
  const supabase = createAdminClient();
  const errors: string[] = [];

  for (const item of purchasedPhysicalItems) {
    const bookId = item.id;
    const qtyToDeduct = item.quantity || 1;

    try {
      // Check in Supabase (hard_copy_inventory first, then physical_inventory)
      let targetTable = 'hard_copy_inventory';
      let { data: dbItem } = await supabase
        .from('hard_copy_inventory')
        .select('*')
        .eq('book_id', bookId)
        .maybeSingle();

      if (!dbItem) {
        const fallback = await supabase
          .from('physical_inventory')
          .select('*')
          .eq('book_id', bookId)
          .maybeSingle();
        if (fallback.data) {
          dbItem = fallback.data;
          targetTable = 'physical_inventory';
        }
      }

      if (dbItem) {
        const currentStock = Number(dbItem.stock_quantity);
        const newStock = Math.max(0, currentStock - qtyToDeduct);
        const isInStock = newStock > 0;

        // Update database table
        await supabase
          .from(targetTable)
          .update({
            stock_quantity: newStock,
            is_in_stock: isInStock,
            updated_at: new Date().toISOString(),
          })
          .eq('book_id', bookId);

        // Record audit log
        await supabase.from('inventory_logs').insert({
          book_id: bookId,
          change_amount: -qtyToDeduct,
          remaining_stock: newStock,
          reason: `Customer Purchase: Order #${orderNumber}`,
        });

        // Sync in-memory cache
        if (inMemoryStock[bookId]) {
          inMemoryStock[bookId].stockQuantity = newStock;
          inMemoryStock[bookId].isInStock = isInStock;
        }
      } else {
        // Fallback to in-memory deduction
        if (inMemoryStock[bookId]) {
          const current = inMemoryStock[bookId].stockQuantity;
          const newStock = Math.max(0, current - qtyToDeduct);
          inMemoryStock[bookId].stockQuantity = newStock;
          inMemoryStock[bookId].isInStock = newStock > 0;
          inMemoryStock[bookId].updatedAt = new Date().toISOString();

          inMemoryLogs.unshift({
            id: `log-${Date.now()}-${Math.random()}`,
            bookId,
            changeAmount: -qtyToDeduct,
            remainingStock: newStock,
            reason: `Customer Purchase: Order #${orderNumber}`,
            createdAt: new Date().toISOString(),
          });
        }
      }
    } catch (err: any) {
      console.error(`Failed to deduct inventory for book ${bookId}:`, err);
      errors.push(`Failed to update stock for ${item.title || bookId}`);
    }
  }

  return { success: errors.length === 0, errors };
}

/**
 * Restock or manually adjust book inventory from the Admin panel
 */
export async function restockBook(
  bookId: string,
  changeAmount: number,
  reason: string,
  newThreshold?: number
): Promise<{ success: boolean; error?: string; remainingStock?: number }> {
  const supabase = createAdminClient();

  try {
    let targetTable = 'hard_copy_inventory';
    let { data: dbItem } = await supabase
      .from('hard_copy_inventory')
      .select('*')
      .eq('book_id', bookId)
      .maybeSingle();

    if (!dbItem) {
      const fallback = await supabase
        .from('physical_inventory')
        .select('*')
        .eq('book_id', bookId)
        .maybeSingle();
      if (fallback.data) {
        dbItem = fallback.data;
        targetTable = 'physical_inventory';
      }
    }

    if (dbItem) {
      const currentStock = Number(dbItem.stock_quantity);
      const newStock = Math.max(0, currentStock + changeAmount);
      const isInStock = newStock > 0;

      const updatePayload: any = {
        stock_quantity: newStock,
        is_in_stock: isInStock,
        updated_at: new Date().toISOString(),
      };

      if (newThreshold !== undefined && newThreshold >= 0) {
        updatePayload.low_stock_threshold = newThreshold;
      }

      const { error: updateError } = await supabase
        .from(targetTable)
        .update(updatePayload)
        .eq('book_id', bookId);

      if (updateError) throw updateError;

      // Insert audit log
      await supabase.from('inventory_logs').insert({
        book_id: bookId,
        change_amount: changeAmount,
        remaining_stock: newStock,
        reason: reason || 'Manual Admin Restock',
      });

      // Update in-memory
      if (inMemoryStock[bookId]) {
        inMemoryStock[bookId].stockQuantity = newStock;
        inMemoryStock[bookId].isInStock = isInStock;
        if (newThreshold !== undefined) inMemoryStock[bookId].lowStockThreshold = newThreshold;
      }

      return { success: true, remainingStock: newStock };
    }

    // In-memory fallback
    if (inMemoryStock[bookId]) {
      const currentStock = inMemoryStock[bookId].stockQuantity;
      const newStock = Math.max(0, currentStock + changeAmount);
      inMemoryStock[bookId].stockQuantity = newStock;
      inMemoryStock[bookId].isInStock = newStock > 0;
      if (newThreshold !== undefined) inMemoryStock[bookId].lowStockThreshold = newThreshold;
      inMemoryStock[bookId].updatedAt = new Date().toISOString();

      inMemoryLogs.unshift({
        id: `log-${Date.now()}`,
        bookId,
        changeAmount,
        remainingStock: newStock,
        reason: reason || 'Manual Admin Restock',
        createdAt: new Date().toISOString(),
      });

      return { success: true, remainingStock: newStock };
    }

    return { success: false, error: 'Book ID not found in inventory catalog' };
  } catch (err: any) {
    console.error('Restock error:', err);
    return { success: false, error: err.message || 'Failed to update stock' };
  }
}

/**
 * Fetch inventory change logs (audit history)
 */
export async function getInventoryLogs(bookId?: string): Promise<InventoryLogItem[]> {
  const supabase = createAdminClient();

  try {
    let query = supabase
      .from('inventory_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (bookId) {
      query = query.eq('book_id', bookId);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data.map((row) => {
        const matched = BOOKS_DATA.find((b) => b.id === row.book_id);
        return {
          id: row.id,
          bookId: row.book_id,
          changeAmount: Number(row.change_amount),
          remainingStock: Number(row.remaining_stock),
          reason: row.reason,
          createdAt: row.created_at,
          bookTitle: matched?.title || `Book ID ${row.book_id}`,
          sku: matched?.sku || 'N/A',
        };
      });
    }
  } catch (err) {
    // Fall back to in-memory logs
  }

  // Filter in-memory logs
  const logs = bookId ? inMemoryLogs.filter((l) => l.bookId === bookId) : inMemoryLogs;
  return logs.map((l) => {
    const matched = BOOKS_DATA.find((b) => b.id === l.bookId);
    return {
      ...l,
      bookTitle: matched?.title || `Book ID ${l.bookId}`,
      sku: matched?.sku || 'N/A',
    };
  });
}

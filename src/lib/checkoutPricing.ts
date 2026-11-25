import { createAdminClient } from '@/lib/supabase';
import { BOOKS_DATA } from '@/data/mockData';
import { DIGITAL_BOOKS_DATA } from '@/data/digitalBooksData';
import { SHIPPING_FEE } from '@/lib/utils';
import type { FulfillOrderItem } from '@/lib/orderFulfillment';

/**
 * Server-side pricing. Prices ALWAYS come from the catalogue here — never from the
 * browser — so a customer cannot change what they pay.
 *   Hard copy: src/data/mockData.ts (BOOKS_DATA)
 *   Digital:   digital_books table (admin-editable), falling back to DIGITAL_BOOKS_DATA
 */

const MAX_QTY_PER_ITEM = 20;
const MAX_LINES = 20;

export interface CartEntry {
  /** SKU or product id */
  key: string;
  quantity: number;
}

export interface PricedCart {
  items: FulfillOrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  hasPhysical: boolean;
  hasDigital: boolean;
  /** Canonical "SKU:qty,SKU:qty" — stored in the Razorpay order notes */
  itemsSummary: string;
}

export interface DigitalBookInfo {
  id: string;
  title: string;
  sku?: string;
  price: number;
  grade_class?: number;
  slug?: string;
}

/** Parses "SK1:2,SD6-KN:1" into cart entries. */
export function parseItemsSummary(summary: unknown): CartEntry[] {
  if (typeof summary !== 'string') return [];
  return summary
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((entry) => {
      const [key, qty] = entry.split(':');
      return { key: (key || '').trim(), quantity: parseInt(qty, 10) || 1 };
    });
}

/** Digital book by id or slug: database first (admin can change prices), then the static catalogue. */
export async function resolveDigitalBook(idOrSlug: string): Promise<DigitalBookInfo | null> {
  const supabase = createAdminClient();
  const { data: dbBook } = await supabase
    .from('digital_books')
    .select('id, title, sku, price, grade_class, slug')
    .or(`id.eq.${idOrSlug.replace(/[^\w-]/g, '')},slug.eq.${idOrSlug.replace(/[^\w-]/g, '')}`)
    .maybeSingle();
  if (dbBook) return { ...dbBook, price: Number(dbBook.price) };

  const found = DIGITAL_BOOKS_DATA.find((b) => b.id === idOrSlug || b.slug === idOrSlug);
  return found
    ? { id: found.id, title: found.title, sku: found.sku, price: found.price, grade_class: found.gradeClass, slug: found.slug }
    : null;
}

/** Prices a cart from the catalogue. Throws on unknown items or silly quantities. */
export async function priceCart(entries: CartEntry[]): Promise<PricedCart> {
  if (!entries.length) throw new Error('Cart is empty');
  if (entries.length > MAX_LINES) throw new Error('Too many items in one order');

  // Merge duplicate lines (same book twice)
  const merged = new Map<string, number>();
  for (const e of entries) {
    const qty = Math.floor(Number(e.quantity));
    if (!Number.isFinite(qty) || qty < 1 || qty > MAX_QTY_PER_ITEM) throw new Error(`Invalid quantity for ${e.key}`);
    const key = e.key.trim().toLowerCase();
    merged.set(key, (merged.get(key) || 0) + qty);
  }

  const items: FulfillOrderItem[] = [];
  for (const [key, quantity] of merged) {
    const physical = BOOKS_DATA.find((b) => b.sku.toLowerCase() === key || b.id.toLowerCase() === key);
    if (physical) {
      items.push({
        id: physical.id,
        sku: physical.sku,
        title: physical.title,
        price: physical.price,
        quantity,
        productType: 'physical',
        slug: physical.slug,
      });
      continue;
    }
    const staticDigital = DIGITAL_BOOKS_DATA.find(
      (d) => d.sku?.toLowerCase() === key || d.id.toLowerCase() === key || d.slug.toLowerCase() === key
    );
    const digital = staticDigital ? await resolveDigitalBook(staticDigital.id) : null;
    if (digital) {
      items.push({
        id: digital.id,
        sku: digital.sku || 'DIGITAL',
        title: digital.title,
        price: digital.price,
        quantity: 1, // a digital licence is per account — never charge twice
        productType: 'digital',
        slug: digital.slug,
      });
      continue;
    }
    throw new Error(`Unknown item in cart: ${key}`);
  }

  const hasPhysical = items.some((i) => i.productType === 'physical');
  const hasDigital = items.some((i) => i.productType === 'digital');
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingFee = hasPhysical ? SHIPPING_FEE : 0;
  const itemsSummary = items.map((i) => `${i.sku || i.id}:${i.quantity}`).join(',');

  return { items, subtotal, shippingFee, total: subtotal + shippingFee, hasPhysical, hasDigital, itemsSummary };
}

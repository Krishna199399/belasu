/**
 * Shared logic for the Packing & Dispatch portal.
 * Eligibility rules, row mapping, IST formatting and batch filenames live here so the
 * list API, print API and re-download API all behave identically.
 */

/**
 * The dispatch portal only handles orders placed on/after this date (IST).
 * Older orders were packed before the portal existed and never appear here.
 */
export const DISPATCH_START_LABEL = '21 Nov 2026';
export const DISPATCH_START_ISO = new Date('2026-11-21T00:00:00+05:30').toISOString();

/** Order statuses that must never be packed even if payment shows Paid */
export const EXCLUDED_ORDER_STATUSES = ['Cancelled', 'Refunded', 'Failed'] as const;

/**
 * Max orders allowed in one Word sheet. Order IDs travel in the PostgREST URL
 * (`id=in.(...)`), so this also keeps request URLs well under proxy limits.
 */
export const MAX_ORDERS_PER_BATCH = 150;

/** Max span of a from–to range request (Supabase returns at most 1000 rows per query) */
export const MAX_RANGE_SPAN = 1000;

/**
 * Columns dispatch staff may see. Deliberately excludes amounts, email,
 * payment IDs and other data staff don't need to pack and ship.
 */
export const DISPATCH_ORDER_COLUMNS = [
  'id',
  'order_number',
  'order_seq',
  'order_date',
  'created_at',
  'order_status',
  'payment_status',
  'has_physical_books',
  'is_printed',
  'printed_at',
  'dispatch_batch_id',
  'billing_first_name',
  'billing_last_name',
  'billing_address1',
  'billing_address2',
  'billing_city',
  'billing_state',
  'billing_postcode',
  'billing_phone',
  'shipping_first_name',
  'shipping_last_name',
  'shipping_address1',
  'shipping_address2',
  'shipping_city',
  'shipping_state',
  'shipping_postcode',
  'shipping_phone',
  'order_items(item_sku, item_name, item_type, quantity)',
].join(', ');

export interface DispatchOrderRow {
  id: string;
  order_number: string;
  order_seq: number | null;
  order_date: string | null;
  created_at: string;
  order_status: string;
  payment_status: string;
  has_physical_books: boolean;
  is_printed: boolean;
  printed_at: string | null;
  dispatch_batch_id: string | null;
  billing_first_name: string | null;
  billing_last_name: string | null;
  billing_address1: string | null;
  billing_address2: string | null;
  billing_city: string | null;
  billing_state: string | null;
  billing_postcode: string | null;
  billing_phone: string | null;
  shipping_first_name: string | null;
  shipping_last_name: string | null;
  shipping_address1: string | null;
  shipping_address2: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_postcode: string | null;
  shipping_phone: string | null;
  order_items: { item_sku: string | null; item_name: string; item_type: string; quantity: number }[] | null;
}

export interface DispatchItem {
  sku: string;
  name: string;
  quantity: number;
}

/** Clean, staff-facing shape of an order (used by both the UI and the docx generator) */
export interface DispatchOrder {
  id: string;
  orderNumber: string;
  orderSeq: number;
  orderDate: string;
  customerName: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  pincode: string;
  items: DispatchItem[];
  totalBooks: number;
  isPrinted: boolean;
  printedAt: string | null;
  batchId: string | null;
}

export interface SkippedOrder {
  orderNumber: string;
  reason: string;
}

/** Physical items only — digital items never go on a shipping slip */
function physicalItems(row: DispatchOrderRow): DispatchItem[] {
  return (row.order_items || [])
    .filter((i) => i.item_type !== 'digital')
    .map((i) => ({
      sku: (i.item_sku || '').trim().toUpperCase() || i.item_name.slice(0, 12).toUpperCase(),
      name: i.item_name,
      quantity: i.quantity || 1,
    }));
}

/** Map a DB row to the staff-facing order. Shipping address wins, billing is the fallback. */
export function toDispatchOrder(row: DispatchOrderRow): DispatchOrder {
  const useShipping = Boolean(row.shipping_address1?.trim());
  const pick = (ship: string | null, bill: string | null) =>
    ((useShipping ? ship : bill) || bill || '').trim();

  const first = pick(row.shipping_first_name, row.billing_first_name);
  const last = pick(row.shipping_last_name, row.billing_last_name);
  const items = physicalItems(row);

  return {
    id: row.id,
    orderNumber: row.order_number,
    orderSeq: row.order_seq ?? (parseInt(row.order_number.replace(/\D/g, ''), 10) || 0),
    orderDate: row.order_date || row.created_at,
    customerName: `${first} ${last}`.trim() || 'Customer',
    phone: pick(row.shipping_phone, row.billing_phone),
    address1: pick(row.shipping_address1, row.billing_address1),
    address2: pick(row.shipping_address2, row.billing_address2),
    city: pick(row.shipping_city, row.billing_city),
    state: pick(row.shipping_state, row.billing_state) || 'Karnataka',
    pincode: pick(row.shipping_postcode, row.billing_postcode),
    items,
    totalBooks: items.reduce((sum, i) => sum + i.quantity, 0),
    isPrinted: Boolean(row.is_printed),
    printedAt: row.printed_at,
    batchId: row.dispatch_batch_id,
  };
}

/**
 * Returns why an order cannot go into a dispatch sheet, or null if it can.
 * `includePrinted` allows re-printing orders that already appear in an earlier batch.
 */
export function getSkipReason(row: DispatchOrderRow, includePrinted: boolean): string | null {
  if (!row.has_physical_books) return 'Digital only (nothing to ship)';
  if (new Date(row.created_at).getTime() < new Date(DISPATCH_START_ISO).getTime()) {
    return `Placed before ${DISPATCH_START_LABEL}`;
  }
  if ((EXCLUDED_ORDER_STATUSES as readonly string[]).includes(row.order_status)) return row.order_status;
  if (row.payment_status !== 'Paid') return `Payment ${row.payment_status || 'pending'}`;
  if (row.is_printed && !includePrinted) return 'Already printed';
  return null;
}

/* ─────────────────────────── IST formatting ─────────────────────────── */

const IST = 'Asia/Kolkata';

function istParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: IST,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value || '';
  return {
    day: get('day'),
    month: get('month').slice(0, 3),
    year: get('year'),
  };
}

/**
 * Belesu's existing filename convention (print date in IST, day without leading zero):
 *   "Orders-1-Dec-25-19682-19683.docx"
 */
export function generateBatchFilename(
  startOrderNumber: string,
  endOrderNumber: string,
  date: Date = new Date()
): string {
  const p = istParts(date);
  const range =
    startOrderNumber === endOrderNumber ? startOrderNumber : `${startOrderNumber}-${endOrderNumber}`;
  return `Orders-${p.day}-${p.month}-${p.year.slice(-2)}-${range}.docx`;
}

/** Content-Disposition that survives spaces/parentheses in every browser */
export function docxDownloadHeaders(filename: string, extra: Record<string, string> = {}) {
  const asciiName = filename.replace(/[^\x20-\x7E]/g, '_').replace(/"/g, '');
  return {
    'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'Content-Disposition': `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
    'X-Batch-Name': encodeURIComponent(filename),
    'Cache-Control': 'no-store',
    ...extra,
  };
}

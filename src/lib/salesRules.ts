/**
 * The ONE definition of a "sale" for every admin report (Orders page cards,
 * filtered summaries, CSV export, monthly report, Analytics). Pure — safe to
 * import from client and server code.
 *
 *   Sale        = payment_status "Paid" AND order_status not Cancelled / Refunded / Failed
 *   Sale amount = order total (books + shipping) − any refund on that order
 */

export const NON_SALE_ORDER_STATUSES = ['Cancelled', 'Refunded', 'Failed'] as const;

/** Month of the very first order in the database (IST). Month pickers start here. */
export const FIRST_ORDER_MONTH = '2024-05';

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

export interface SalesRow {
  created_at: string;
  order_total_amount: number | string | null;
  order_refund_amount: number | string | null;
  payment_status: string | null;
  order_status: string | null;
  has_physical_books: boolean | null;
  has_digital_books: boolean | null;
}

/** Columns needed to compute a SalesSummary — keep selects minimal. */
export const SALES_ROW_COLUMNS =
  'created_at, order_total_amount, order_refund_amount, payment_status, order_status, has_physical_books, has_digital_books';

export interface SalesSummary {
  /** Every order matching the filter, whatever its status */
  totalOrders: number;
  /** Orders that count as sales */
  salesCount: number;
  /** ₹ — order totals (incl. shipping) minus refunds, sales only */
  salesAmount: number;
  cancelledCount: number;
  /** ₹ value of cancelled / refunded / failed orders (money NOT received) */
  cancelledAmount: number;
  /** ₹ refunded across all orders in the filter */
  refundAmount: number;
  /** Orders still waiting for payment (not paid, not cancelled) */
  unpaidCount: number;
  /** Sales containing hard-copy books */
  hardCopyCount: number;
  /** Sales containing digital books */
  digitalCount: number;
  averageOrderValue: number;
}

const num = (v: number | string | null | undefined) => Number(v) || 0;

export function isNonSaleStatus(status: string | null | undefined): boolean {
  return (NON_SALE_ORDER_STATUSES as readonly string[]).includes(status || '');
}

export function isSale(row: Pick<SalesRow, 'payment_status' | 'order_status'>): boolean {
  return row.payment_status === 'Paid' && !isNonSaleStatus(row.order_status);
}

export function saleAmount(row: Pick<SalesRow, 'order_total_amount' | 'order_refund_amount'>): number {
  return Math.max(0, num(row.order_total_amount) - num(row.order_refund_amount));
}

export function emptySummary(): SalesSummary {
  return {
    totalOrders: 0,
    salesCount: 0,
    salesAmount: 0,
    cancelledCount: 0,
    cancelledAmount: 0,
    refundAmount: 0,
    unpaidCount: 0,
    hardCopyCount: 0,
    digitalCount: 0,
    averageOrderValue: 0,
  };
}

export function summarizeSales(rows: SalesRow[]): SalesSummary {
  const s = emptySummary();
  for (const row of rows) {
    s.totalOrders++;
    s.refundAmount += num(row.order_refund_amount);
    if (isSale(row)) {
      s.salesCount++;
      s.salesAmount += saleAmount(row);
      if (row.has_physical_books) s.hardCopyCount++;
      if (row.has_digital_books) s.digitalCount++;
    } else if (isNonSaleStatus(row.order_status)) {
      s.cancelledCount++;
      s.cancelledAmount += num(row.order_total_amount);
    } else {
      s.unpaidCount++;
    }
  }
  s.salesAmount = Math.round(s.salesAmount * 100) / 100;
  s.averageOrderValue = s.salesCount ? Math.round(s.salesAmount / s.salesCount) : 0;
  return s;
}

/** "YYYY-MM" of a timestamp in IST */
export function istMonthKey(iso: string): string {
  return new Date(new Date(iso).getTime() + IST_OFFSET_MS).toISOString().slice(0, 7);
}

/** Number of months from FIRST_ORDER_MONTH up to and including the current IST month */
export function monthsSinceFirstOrder(now: Date = new Date()): number {
  const [fy, fm] = FIRST_ORDER_MONTH.split('-').map(Number);
  const [cy, cm] = istMonthKey(now.toISOString()).split('-').map(Number);
  return (cy - fy) * 12 + (cm - fm) + 1;
}

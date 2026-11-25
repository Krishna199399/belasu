import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { fetchAllOrderRows, parseOrderFilters } from '@/lib/salesReport';
import { formatOrderDate } from '@/lib/orderDateUtils';
import { SalesRow, isSale, saleAmount, summarizeSales } from '@/lib/salesRules';

export const dynamic = 'force-dynamic';

interface ExportRow extends SalesRow {
  order_number: string;
  order_date: string | null;
  billing_first_name: string | null;
  billing_last_name: string | null;
  billing_phone: string | null;
  billing_email: string | null;
  billing_address1: string | null;
  billing_city: string | null;
  billing_postcode: string | null;
  payment_method: string | null;
  order_shipping_amount: number | string | null;
  order_items: { item_name: string; quantity: number }[] | null;
}

const COLUMNS =
  'order_number, order_date, created_at, billing_first_name, billing_last_name, billing_phone, billing_email, ' +
  'billing_address1, billing_city, billing_postcode, payment_method, payment_status, order_status, ' +
  'order_total_amount, order_shipping_amount, order_refund_amount, has_physical_books, has_digital_books, ' +
  'order_items(item_name, quantity)';

/** Quote a CSV cell; also neutralise spreadsheet formula injection (=, +, -, @). */
function cell(value: unknown): string {
  let s = value === null || value === undefined ? '' : String(value);
  if (/^[=+\-@]/.test(s) && !/^-?\d+(\.\d+)?$/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

/**
 * GET /api/admin/orders/export — CSV of EVERY order matching the current filters
 * (same query params as /api/admin/orders), ordered by date, with a totals block.
 */
export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return Response.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const filters = parseOrderFilters(searchParams);
    const rows = (await fetchAllOrderRows<ExportRow>(COLUMNS, filters)).sort((a, b) =>
      (a.order_date || a.created_at).localeCompare(b.order_date || b.created_at)
    );
    const summary = summarizeSales(rows);

    const header = [
      'Order Number', 'Day', 'Date', 'Time (IST)', 'Week', 'Customer Name', 'Phone', 'Email', 'Address',
      'City', 'Pincode', 'Payment Method', 'Payment Status', 'Order Status', 'Order Total (INR)',
      'Shipping (INR)', 'Refund (INR)', 'Counts as Sale', 'Sale Amount (INR)', 'Items',
    ];

    const lines = rows.map((o) => {
      const { dayName, dateStr, timeStr, weekNumber } = formatOrderDate(o.order_date || o.created_at);
      const items = (o.order_items || []).map((i) => `${i.item_name} (x${i.quantity})`).join('; ');
      const sale = isSale(o);
      return [
        cell(o.order_number), cell(dayName), cell(dateStr), cell(timeStr), cell(`W${weekNumber}`),
        cell(`${o.billing_first_name || ''} ${o.billing_last_name || ''}`.trim()), cell(o.billing_phone),
        cell(o.billing_email), cell(o.billing_address1), cell(o.billing_city), cell(o.billing_postcode),
        cell(o.payment_method), cell(o.payment_status), cell(o.order_status),
        Number(o.order_total_amount) || 0, Number(o.order_shipping_amount) || 0, Number(o.order_refund_amount) || 0,
        cell(sale ? 'Yes' : 'No'), sale ? saleAmount(o) : 0, cell(items),
      ].join(',');
    });

    const totals = [
      '',
      `${cell('TOTAL ORDERS')},${summary.totalOrders}`,
      `${cell('SALES (paid, not cancelled)')},${summary.salesCount}`,
      `${cell('SALES AMOUNT (INR, incl. shipping, minus refunds)')},${summary.salesAmount}`,
      `${cell('CANCELLED / REFUNDED / FAILED')},${summary.cancelledCount}`,
      `${cell('CANCELLED VALUE (INR)')},${summary.cancelledAmount}`,
      `${cell('REFUNDS (INR)')},${summary.refundAmount}`,
      `${cell('AWAITING PAYMENT')},${summary.unpaidCount}`,
    ];

    const label = filters.period === 'month_year' && filters.year && filters.month
      ? `${filters.year}-${String(filters.month).padStart(2, '0')}`
      : filters.period || 'all';
    const todayIST = new Date(Date.now() + 5.5 * 3600_000).toISOString().slice(0, 10);
    const filename = `belesu_orders_${label}_${todayIST}.csv`;

    // BOM so Excel opens ₹ / Kannada names correctly
    const csv = '﻿' + [header.map(cell).join(','), ...lines, ...totals].join('\r\n');
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('Admin orders export error:', err);
    const message = err instanceof Error ? err.message : (err as { message?: string })?.message || 'Server error';
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}

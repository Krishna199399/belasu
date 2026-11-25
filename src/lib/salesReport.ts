import { createAdminClient } from '@/lib/supabase';
import { getISTDateRange } from '@/lib/orderDateUtils';
import {
  SALES_ROW_COLUMNS,
  SalesRow,
  SalesSummary,
  emptySummary,
  istMonthKey,
  summarizeSales,
} from '@/lib/salesRules';

/**
 * Server-side helpers shared by the admin Orders list, its CSV export and the
 * monthly sales report, so every view applies exactly the same filters.
 */

export interface OrderFilters {
  status?: string | null;
  type?: string | null;
  period?: string | null;
  month?: string | null;
  year?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  search?: string | null;
}

export function parseOrderFilters(searchParams: URLSearchParams): OrderFilters {
  return {
    status: searchParams.get('status'),
    type: searchParams.get('type'),
    period: searchParams.get('period'),
    month: searchParams.get('month'),
    year: searchParams.get('year'),
    startDate: searchParams.get('startDate'),
    endDate: searchParams.get('endDate'),
    // Strip characters that would break PostgREST's or() filter syntax
    search: (searchParams.get('search') || '').replace(/[^\p{L}\p{N}\s@.+-]/gu, '').trim() || null,
  };
}

/** The subset of the PostgREST filter builder these helpers use. */
interface FilterChain {
  eq(column: string, value: unknown): FilterChain;
  gte(column: string, value: unknown): FilterChain;
  lte(column: string, value: unknown): FilterChain;
  or(filters: string): FilterChain;
}

/** Applies status / type / date / search filters to any `orders` query. */
export function applyOrderFilters<T>(query: T, f: OrderFilters): T {
  let q = query as unknown as FilterChain;

  if (f.status && f.status !== 'all') q = q.eq('order_status', f.status);

  if (f.type === 'physical') q = q.eq('has_physical_books', true);
  else if (f.type === 'digital') q = q.eq('has_digital_books', true);

  if (f.period && f.period !== 'all') {
    const range = getISTDateRange(f.period, f.month, f.year);
    if (range) q = q.gte('created_at', range.startDate).lte('created_at', range.endDate);
  } else if (f.startDate && f.endDate) {
    q = q.gte('created_at', f.startDate).lte('created_at', f.endDate);
  }

  if (f.search) {
    const s = `%${f.search}%`;
    q = q.or(
      [
        `order_number.ilike.${s}`,
        `billing_first_name.ilike.${s}`,
        `billing_last_name.ilike.${s}`,
        `billing_phone.ilike.${s}`,
        `billing_email.ilike.${s}`,
        `billing_city.ilike.${s}`,
      ].join(',')
    );
  }

  return q as unknown as T;
}

const CHUNK = 1000;
const MAX_ROWS = 50000;

/**
 * Reads every matching row in chunks of 1000 (PostgREST's per-request cap).
 * Ordered by id so chunks never overlap or skip rows.
 */
export async function fetchAllOrderRows<T>(columns: string, filters: OrderFilters): Promise<T[]> {
  const supabase = createAdminClient();
  const rows: T[] = [];
  for (let from = 0; from < MAX_ROWS; from += CHUNK) {
    const base = supabase.from('orders').select(columns);
    const { data, error } = await applyOrderFilters(base, filters)
      .order('id', { ascending: true })
      .range(from, from + CHUNK - 1);
    if (error) throw error;
    rows.push(...((data || []) as unknown as T[]));
    if (!data || data.length < CHUNK) break;
  }
  return rows;
}

export async function getSalesSummary(filters: OrderFilters): Promise<SalesSummary> {
  return summarizeSales(await fetchAllOrderRows<SalesRow>(SALES_ROW_COLUMNS, filters));
}

/* ─────────────────────────── Monthly report ─────────────────────────── */

export interface MonthlySalesRow extends SalesSummary {
  /** "YYYY-MM" */
  month: string;
  /** % change in salesAmount vs the previous month; null when there is nothing to compare */
  changePercent: number | null;
}

export interface MonthlySalesReport {
  year: number;
  months: MonthlySalesRow[];
  total: SalesSummary;
}

/** Month-by-month sales for one calendar year (IST), up to the current month. */
export async function getMonthlySalesReport(year: number, type: string | null): Promise<MonthlySalesReport> {
  // From 1 Dec of the previous year so January can show "vs last month"
  const startIST = Date.UTC(year - 1, 11, 1) - 5.5 * 3600_000;
  const endIST = Date.UTC(year + 1, 0, 1) - 5.5 * 3600_000 - 1;
  const rows = await fetchAllOrderRows<SalesRow>(SALES_ROW_COLUMNS, {
    type,
    startDate: new Date(startIST).toISOString(),
    endDate: new Date(endIST).toISOString(),
  });

  const byMonth = new Map<string, SalesRow[]>();
  for (const row of rows) {
    const key = istMonthKey(row.created_at);
    if (!byMonth.has(key)) byMonth.set(key, []);
    byMonth.get(key)!.push(row);
  }

  const currentMonth = istMonthKey(new Date().toISOString());
  const months: MonthlySalesRow[] = [];
  let previousAmount = summarizeSales(byMonth.get(`${year - 1}-12`) || []).salesAmount;

  for (let m = 1; m <= 12; m++) {
    const key = `${year}-${String(m).padStart(2, '0')}`;
    if (key > currentMonth) break;
    const summary = byMonth.has(key) ? summarizeSales(byMonth.get(key)!) : emptySummary();
    months.push({
      month: key,
      ...summary,
      changePercent:
        previousAmount > 0 ? Math.round(((summary.salesAmount - previousAmount) / previousAmount) * 1000) / 10 : null,
    });
    previousAmount = summary.salesAmount;
  }

  const yearRows = rows.filter((r) => istMonthKey(r.created_at).startsWith(`${year}-`));
  return { year, months, total: summarizeSales(yearRows) };
}

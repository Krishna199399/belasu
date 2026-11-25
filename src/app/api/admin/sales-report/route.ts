import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { getMonthlySalesReport } from '@/lib/salesReport';
import { FIRST_ORDER_MONTH, istMonthKey } from '@/lib/salesRules';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/sales-report?year=2026&type=all|physical|digital
 * Month-by-month sales for one year plus the year total.
 */
export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return Response.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const firstYear = parseInt(FIRST_ORDER_MONTH.slice(0, 4), 10);
    const currentYear = parseInt(istMonthKey(new Date().toISOString()).slice(0, 4), 10);
    const requested = parseInt(searchParams.get('year') || String(currentYear), 10);
    const year = Math.min(currentYear, Math.max(firstYear, isNaN(requested) ? currentYear : requested));
    const typeParam = searchParams.get('type');
    const type = typeParam === 'physical' || typeParam === 'digital' ? typeParam : null;

    const report = await getMonthlySalesReport(year, type);
    const years = Array.from({ length: currentYear - firstYear + 1 }, (_, i) => currentYear - i);

    return Response.json({ success: true, ...report, years });
  } catch (err) {
    console.error('Sales report error:', err);
    const message = err instanceof Error ? err.message : (err as { message?: string })?.message || 'Server error';
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}

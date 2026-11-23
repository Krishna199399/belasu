import { NextRequest } from 'next/server';
import { requireDispatchAccess, dispatchUnauthorized } from '@/lib/dispatchAuth';
import { createAdminClient } from '@/lib/supabase';
import {
  DISPATCH_ORDER_COLUMNS,
  DISPATCH_START_ISO,
  MAX_ORDERS_PER_BATCH,
  MAX_RANGE_SPAN,
  DispatchOrderRow,
  SkippedOrder,
  docxDownloadHeaders,
  generateBatchFilename,
  getSkipReason,
  toDispatchOrder,
} from '@/lib/dispatch';
import { generateDispatchDocx } from '@/lib/docxGenerator';

export const dynamic = 'force-dynamic';

interface PrintRequest {
  /** Explicitly selected orders (checkbox mode) */
  orderIds?: string[];
  /** Range mode */
  fromOrder?: number | string;
  toOrder?: number | string;
  /** Include orders that were already printed in an earlier batch */
  includePrinted?: boolean;
  /** Dry run: return what would be printed without creating a batch */
  preview?: boolean;
}

function fail(error: string, status: number, extra: Record<string, unknown> = {}) {
  return Response.json({ success: false, error, ...extra }, { status });
}

/**
 * POST /api/dispatch/print
 * Resolves the orders, records a dispatch batch, marks the orders printed and
 * returns the Word (.docx) dispatch sheet. With `preview: true` it only returns the summary.
 */
export async function POST(request: NextRequest) {
  const staff = await requireDispatchAccess();
  if (!staff) return dispatchUnauthorized();

  let body: PrintRequest;
  try {
    body = await request.json();
  } catch {
    return fail('Invalid request body.', 400);
  }

  const includePrinted = Boolean(body.includePrinted);
  const supabase = createAdminClient();

  try {
    /* 1. Load candidate orders */
    let rows: DispatchOrderRow[];

    if (Array.isArray(body.orderIds) && body.orderIds.length > 0) {
      if (body.orderIds.length > MAX_ORDERS_PER_BATCH) {
        return fail(`Select at most ${MAX_ORDERS_PER_BATCH} orders per sheet.`, 400);
      }
      const { data, error } = await supabase.from('orders').select(DISPATCH_ORDER_COLUMNS).in('id', body.orderIds);
      if (error) throw error;
      rows = (data || []) as unknown as DispatchOrderRow[];
    } else {
      const a = parseInt(String(body.fromOrder ?? ''), 10);
      const b = parseInt(String(body.toOrder ?? ''), 10);
      if (isNaN(a) || isNaN(b)) return fail('Select orders or enter a From and To order number.', 400);
      const min = Math.min(a, b);
      const max = Math.max(a, b);
      if (max - min > MAX_RANGE_SPAN) return fail(`Range too large (max ${MAX_RANGE_SPAN} order numbers).`, 400);

      const { data, error } = await supabase
        .from('orders')
        .select(DISPATCH_ORDER_COLUMNS)
        .gte('order_seq', min)
        .lte('order_seq', max)
        .gte('created_at', DISPATCH_START_ISO); // older orders are outside the dispatch portal
      if (error) throw error;
      rows = (data || []) as unknown as DispatchOrderRow[];
    }

    rows.sort((x, y) => (x.order_seq ?? 0) - (y.order_seq ?? 0));

    /* 2. Split into printable vs skipped */
    const printable: DispatchOrderRow[] = [];
    const skipped: SkippedOrder[] = [];
    for (const row of rows) {
      const reason = getSkipReason(row, includePrinted);
      if (reason) {
        // Digital-only orders in a range are expected noise — keep them out of the skipped list
        if (!row.has_physical_books) continue;
        skipped.push({ orderNumber: row.order_number, reason });
      } else {
        printable.push(row);
      }
    }

    if (printable.length > MAX_ORDERS_PER_BATCH) {
      return fail(
        `This would print ${printable.length} orders. Maximum is ${MAX_ORDERS_PER_BATCH} per sheet — use a smaller range.`,
        400
      );
    }

    const summarize = (list: DispatchOrderRow[]) => {
      const orders = list.map(toDispatchOrder);
      return {
        orders,
        orderCount: orders.length,
        totalBooks: orders.reduce((s, o) => s + o.totalBooks, 0),
        startOrder: orders[0]?.orderNumber || null,
        endOrder: orders[orders.length - 1]?.orderNumber || null,
      };
    };

    const plan = summarize(printable);

    if (body.preview) {
      return Response.json({
        success: true,
        preview: {
          orderCount: plan.orderCount,
          totalBooks: plan.totalBooks,
          startOrder: plan.startOrder,
          endOrder: plan.endOrder,
          orderNumbers: plan.orders.map((o) => o.orderNumber),
          skipped,
        },
      });
    }

    if (plan.orderCount === 0) {
      return fail('No printable orders found. Everything selected was skipped.', 404, { skipped });
    }

    /* 3. Create the batch record */
    const createdAt = new Date();

    const { data: batch, error: batchError } = await supabase
      .from('dispatch_batches')
      .insert({
        batch_name: generateBatchFilename(plan.startOrder!, plan.endOrder!, createdAt),
        start_order_number: plan.startOrder,
        end_order_number: plan.endOrder,
        order_count: plan.orderCount,
        total_books: plan.totalBooks,
        order_ids: plan.orders.map((o) => o.id),
        order_numbers: plan.orders.map((o) => o.orderNumber),
        skipped,
        created_by_phone: staff.phone,
        created_by_name: staff.name || null,
        status: 'printed',
        created_at: createdAt.toISOString(),
      })
      .select('id')
      .single();
    if (batchError || !batch) throw batchError || new Error('Could not create dispatch batch');

    /* 4. Claim the orders. The is_printed=false guard stops two people printing the same order. */
    let claim = supabase
      .from('orders')
      .update({ is_printed: true, printed_at: createdAt.toISOString(), dispatch_batch_id: batch.id })
      .in('id', plan.orders.map((o) => o.id));
    if (!includePrinted) claim = claim.eq('is_printed', false);
    const { data: claimed, error: claimError } = await claim.select('id');

    if (claimError) {
      await supabase.from('dispatch_batches').delete().eq('id', batch.id);
      throw claimError;
    }

    let final = plan;
    const claimedIds = new Set((claimed || []).map((r: { id: string }) => r.id));
    if (claimedIds.size !== plan.orderCount) {
      // Someone else printed some of these orders a moment ago
      const lost = printable.filter((r) => !claimedIds.has(r.id));
      for (const r of lost) skipped.push({ orderNumber: r.order_number, reason: 'Printed just now in another batch' });
      final = summarize(printable.filter((r) => claimedIds.has(r.id)));

      if (final.orderCount === 0) {
        await supabase.from('dispatch_batches').delete().eq('id', batch.id);
        return fail('These orders were just printed by someone else.', 409, { skipped });
      }

      await supabase
        .from('dispatch_batches')
        .update({
          batch_name: generateBatchFilename(final.startOrder!, final.endOrder!, createdAt),
          start_order_number: final.startOrder,
          end_order_number: final.endOrder,
          order_count: final.orderCount,
          total_books: final.totalBooks,
          order_ids: final.orders.map((o) => o.id),
          order_numbers: final.orders.map((o) => o.orderNumber),
          skipped,
        })
        .eq('id', batch.id);
    }

    /* 5. Build the Word file */
    const filename = generateBatchFilename(final.startOrder!, final.endOrder!, createdAt);
    const buffer = await generateDispatchDocx(final.orders);

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: docxDownloadHeaders(filename, {
        'X-Batch-Id': batch.id,
        'X-Orders-Count': String(final.orderCount),
        'X-Start-Order': final.startOrder!,
        'X-End-Order': final.endOrder!,
      }),
    });
  } catch (err) {
    console.error('Dispatch print error:', err);
    const message = err instanceof Error ? err.message : (err as { message?: string })?.message || 'Server error';
    return fail(message, 500);
  }
}

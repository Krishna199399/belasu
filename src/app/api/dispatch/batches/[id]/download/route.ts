import { NextRequest } from 'next/server';
import { requireDispatchAccess, dispatchUnauthorized } from '@/lib/dispatchAuth';
import { createAdminClient } from '@/lib/supabase';
import {
  DISPATCH_ORDER_COLUMNS,
  DispatchOrderRow,
  docxDownloadHeaders,
  generateBatchFilename,
  toDispatchOrder,
} from '@/lib/dispatch';
import { generateDispatchDocx } from '@/lib/docxGenerator';

export const dynamic = 'force-dynamic';

/**
 * GET /api/dispatch/batches/:id/download
 * Re-generates the Word sheet for an existing batch. Does NOT mark anything again.
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const staff = await requireDispatchAccess();
  if (!staff) return dispatchUnauthorized();

  const { id } = await params;

  try {
    const supabase = createAdminClient();
    const { data: batch, error } = await supabase
      .from('dispatch_batches')
      .select('id, start_order_number, end_order_number, order_ids, created_at')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    if (!batch) return Response.json({ success: false, error: 'Batch not found' }, { status: 404 });

    const orderIds = (batch.order_ids || []) as string[];
    if (orderIds.length === 0) {
      return Response.json({ success: false, error: 'This batch has no orders' }, { status: 404 });
    }

    const { data: rows, error: ordersError } = await supabase
      .from('orders')
      .select(DISPATCH_ORDER_COLUMNS)
      .in('id', orderIds);
    if (ordersError) throw ordersError;

    const orders = ((rows || []) as unknown as DispatchOrderRow[])
      .map(toDispatchOrder)
      .sort((a, b) => a.orderSeq - b.orderSeq);

    const buffer = await generateDispatchDocx(orders);

    // Same name as the original download (rebuilt so older batches also follow the current convention)
    const filename = generateBatchFilename(
      batch.start_order_number,
      batch.end_order_number,
      new Date(batch.created_at)
    );

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: docxDownloadHeaders(filename),
    });
  } catch (err) {
    console.error('Dispatch batch download error:', err);
    const message = err instanceof Error ? err.message : (err as { message?: string })?.message || 'Server error';
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}

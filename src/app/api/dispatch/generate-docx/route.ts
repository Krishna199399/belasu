import { NextRequest } from 'next/server';
import { requireDispatchStaff } from '@/lib/dispatchAuth';
import { createAdminClient } from '@/lib/supabase';
import {
  generateDispatchDocx,
  generateBatchFilename,
  DispatchOrder,
} from '@/lib/docxGenerator';

export async function POST(request: NextRequest) {
  const staff = await requireDispatchStaff();
  if (!staff) {
    return Response.json(
      { success: false, error: 'Unauthorized. Staff dispatch access required.' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { orderIds, fromOrderNumber, toOrderNumber, markAsPrinted = true } = body;

    const supabase = createAdminClient();

    let query = supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('has_physical_books', true);

    if (Array.isArray(orderIds) && orderIds.length > 0) {
      query = query.in('id', orderIds);
    } else if (fromOrderNumber && toOrderNumber) {
      const minNum = Math.min(parseInt(fromOrderNumber, 10), parseInt(toOrderNumber, 10));
      const maxNum = Math.max(parseInt(fromOrderNumber, 10), parseInt(toOrderNumber, 10));
      query = query.gte('order_number', String(minNum)).lte('order_number', String(maxNum));
    } else {
      return Response.json(
        { success: false, error: 'Please select orders or specify an order range.' },
        { status: 400 }
      );
    }

    query = query.order('order_number', { ascending: true });

    const { data: dbOrders, error } = await query;
    if (error) throw error;

    if (!dbOrders || dbOrders.length === 0) {
      return Response.json(
        { success: false, error: 'No matching physical book orders found to print.' },
        { status: 404 }
      );
    }

    // Format orders into DispatchOrder structure
    const dispatchOrders: DispatchOrder[] = dbOrders.map((o) => {
      const customerName = `${o.billing_first_name || ''} ${o.billing_last_name || ''}`.trim() || 'Customer';
      const items = (o.order_items || []).map((i: any) => ({
        name: i.item_name,
        sku: i.item_sku,
        quantity: i.quantity || 1,
      }));

      return {
        id: o.id,
        orderNumber: o.order_number,
        orderDate: o.order_date || o.created_at,
        customerName,
        phone: o.billing_phone,
        address1: o.billing_address1,
        address2: o.billing_address2,
        city: o.billing_city,
        state: o.billing_state || 'Karnataka',
        pincode: o.billing_postcode,
        items,
      };
    });

    const startOrder = dispatchOrders[0].orderNumber;
    const endOrder = dispatchOrders[dispatchOrders.length - 1].orderNumber;
    const filename = generateBatchFilename(startOrder, endOrder, new Date());

    // Generate Microsoft Word (.docx) Buffer
    const docxBuffer = await generateDispatchDocx(dispatchOrders);

    const targetIds = dispatchOrders.map((o) => o.id);
    const targetNumbers = dispatchOrders.map((o) => o.orderNumber);

    // Update order status in background / parallel
    if (markAsPrinted) {
      try {
        await supabase
          .from('orders')
          .update({
            is_printed: true,
            printed_at: new Date().toISOString(),
            dispatch_batch_name: filename,
          })
          .in('id', targetIds);
      } catch (err) {
        console.warn('Could not update order is_printed flag:', err);
      }
    }

    // Record batch into dispatch_batches table
    try {
      await supabase.from('dispatch_batches').insert({
        batch_name: filename,
        start_order_number: startOrder,
        end_order_number: endOrder,
        order_count: dispatchOrders.length,
        order_ids: targetIds,
        order_numbers: targetNumbers,
        created_by_phone: staff.phone,
        status: 'printed',
      });
    } catch (err) {
      console.warn('dispatch_batches table not created yet:', err);
    }

    // Return the generated Word (.docx) file directly as a downloadable binary response
    const uint8 = new Uint8Array(docxBuffer);
    return new Response(uint8, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'X-Batch-Name': filename,
        'X-Orders-Count': String(dispatchOrders.length),
        'X-Start-Order': startOrder,
        'X-End-Order': endOrder,
      },
    });
  } catch (err: any) {
    console.error('Word docx generation error:', err);
    return Response.json({ success: false, error: err.message || 'Generation error' }, { status: 500 });
  }
}

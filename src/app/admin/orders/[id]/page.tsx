import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase';
import { OrderDetailClient } from '@/components/admin/OrderDetailClient';

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  // Try fetching by UUID or by order_number
  let query = supabase.from('orders').select('*, order_items(*)').eq('id', id);
  let { data: order } = await query.maybeSingle();

  if (!order) {
    const res = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('order_number', id)
      .maybeSingle();
    order = res.data;
  }

  if (!order) {
    notFound();
  }

  // Fetch customer record if present
  let customer = null;
  if (order.user_id) {
    const { data: userRecord } = await supabase
      .from('users')
      .select('id, name, phone, email')
      .eq('id', order.user_id)
      .maybeSingle();
    customer = userRecord;
  }

  const initialOrder = {
    ...order,
    customer,
  };

  return <OrderDetailClient initialOrder={initialOrder} />;
}

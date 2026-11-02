import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase';
import { OrderDetailClient } from '@/components/admin/OrderDetailClient';

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cleanId = decodeURIComponent(id || '').trim();
  const supabase = createAdminClient();

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId);
  let order = null;

  // Try fetching by UUID if valid
  if (isUuid) {
    const { data } = await supabase.from('orders').select('*, order_items(*)').eq('id', cleanId).maybeSingle();
    order = data;
  }

  // Otherwise or fallback: fetch by order_number
  if (!order) {
    const res = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('order_number', cleanId)
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

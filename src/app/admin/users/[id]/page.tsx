import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase';
import { isPhoneAdmin } from '@/lib/auth';
import { digitalBooks } from '@/data/digitalBooksData';
import { UserDetailClient } from '@/components/admin/UserDetailClient';

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  // 1. Fetch user
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!user) {
    notFound();
  }

  // 2. Fetch addresses
  const { data: addresses } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false });

  // 3. Fetch orders
  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const digitalList = (user.purchased_books?.digital || []) as string[];
  const isAdmin = Boolean((user as any).is_admin || isPhoneAdmin(user.phone));

  const availableDigitalBooks = digitalBooks.map((b: any) => ({
    id: b.id,
    title: b.title,
    gradeClass: b.gradeClass,
    subject: b.subject,
    isOwned: digitalList.includes(b.id),
  }));

  const initialUser = {
    ...user,
    isAdmin,
    addresses: addresses || [],
    orders: orders || [],
    availableDigitalBooks,
  };

  return <UserDetailClient initialUser={initialUser} />;
}

import { getAuthUser, isPhoneAdmin } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase';

export async function GET() {
  const authUser = await getAuthUser();
  if (!authUser) {
    return Response.json({ user: null }, { status: 401 });
  }

  // Fetch fresh user data from Supabase (including purchased books)
  const supabase = createAdminClient();
  const { data: user } = await supabase
    .from('users')
    .select('id, name, phone, purchased_books, created_at')
    .eq('id', authUser.userId)
    .single();

  if (!user) {
    return Response.json({ user: null }, { status: 401 });
  }

  // Fetch addresses from Supabase
  const { data: addressesData } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false })
    .order('usage_count', { ascending: false });

  // Transform addresses to camelCase for frontend
  const addresses = (addressesData || []).map(addr => ({
    id: addr.id,
    userId: addr.user_id,
    firstName: addr.first_name,
    lastName: addr.last_name,
    address1: addr.address1,
    address2: addr.address2,
    city: addr.city,
    state: addr.state,
    postcode: addr.postcode,
    phone: addr.phone,
    email: addr.email,
    label: addr.label,
    isDefault: addr.is_default,
    coordinates: addr.latitude && addr.longitude ? {
      latitude: addr.latitude,
      longitude: addr.longitude,
    } : null,
    usageCount: addr.usage_count,
    lastUsedAt: addr.last_used_at,
    createdAt: addr.created_at,
    updatedAt: addr.updated_at,
  }));

  return Response.json({
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      isAdmin: Boolean((user as any).is_admin || isPhoneAdmin(user.phone, user.name)),
      purchasedBooks: user.purchased_books || { physical: [], digital: [] },
      addresses: addresses,
      createdAt: user.created_at,
    },
  });
}

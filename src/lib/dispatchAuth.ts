import { getAuthUser, AuthPayload } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase';

/**
 * Checks if a given phone number is an authorized dispatch / packing staff member.
 */
export function isPhoneDispatchStaff(phone?: string | null): boolean {
  if (!phone) return false;
  const staffPhones = (process.env.DISPATCH_STAFF_PHONES || '')
    .split(',')
    .map((p) => p.trim().replace(/^\+91/, '').replace(/\s+/g, ''))
    .filter(Boolean);

  const cleanPhone = phone.trim().replace(/^\+91/, '').replace(/\s+/g, '');
  return staffPhones.includes(cleanPhone);
}

/**
 * Validates whether the current request is from an authenticated Admin OR an authorized Dispatch Staff member.
 * Returns the AuthPayload if valid, or null if unauthorized.
 */
export async function requireDispatchStaff(): Promise<AuthPayload | null> {
  const user = await getAuthUser();
  if (!user) return null;

  // 1. Admins always have access to dispatch portal
  if (user.isAdmin) {
    return user;
  }

  // 2. Check if phone is in DISPATCH_STAFF_PHONES environment list
  if (isPhoneDispatchStaff(user.phone)) {
    return user;
  }

  // 3. Fallback: Check if user has role='dispatch' in the database
  try {
    const supabase = createAdminClient();
    const { data: dbUser } = await supabase
      .from('users')
      .select('role, is_staff')
      .eq('id', user.userId)
      .maybeSingle();

    if (dbUser && (dbUser.role === 'dispatch' || dbUser.is_staff === true)) {
      return user;
    }
  } catch (err) {
    console.error('Error verifying dispatch staff role:', err);
  }

  return null;
}

import { getAuthUser, AuthPayload } from '@/lib/auth';

/**
 * Allows admins and packing & dispatch staff (DISPATCH_STAFF_PHONES).
 * Returns the AuthPayload if allowed, or null if unauthorized.
 */
export async function requireDispatchAccess(): Promise<AuthPayload | null> {
  const user = await getAuthUser();
  if (!user) return null;
  if (user.isAdmin || user.isDispatch) return user;
  return null;
}

export function dispatchUnauthorized() {
  return Response.json(
    { success: false, error: 'Unauthorized. Dispatch staff access required.' },
    { status: 403 }
  );
}

import { getAuthUser } from '@/lib/auth';

/**
 * Validates whether the current request is from an authenticated admin.
 * Returns the AuthPayload if valid, or null if unauthorized.
 */
export async function requireAdmin() {
  const user = await getAuthUser();
  if (!user || !user.isAdmin) {
    return null;
  }
  return user;
}

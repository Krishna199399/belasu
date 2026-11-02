import { getAuthUser, getFullUserProfile } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const authUser = await getAuthUser();
  if (!authUser) {
    return Response.json({ user: null }, { status: 401 });
  }

  const profile = await getFullUserProfile(authUser.userId);
  if (!profile) {
    return Response.json({ user: null }, { status: 401 });
  }

  return Response.json({ user: profile });
}

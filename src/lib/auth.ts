import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'belesu-super-secret-key-change-in-production'
);

const COOKIE_NAME = 'belesu_auth';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export interface AuthPayload {
  userId: string;
  phone: string;
  name: string;
  isAdmin?: boolean;
}

/** Check if a given phone number or account name is considered an admin */
export function isPhoneAdmin(phone?: string | null, name?: string | null): boolean {
  if (name && name.toLowerCase().trim() === 'admin') return true;
  if (!phone) return false;
  const adminPhones = (process.env.ADMIN_PHONES || '8105829199,1234567888')
    .split(',')
    .map((p) => p.trim().replace(/^\+91/, ''));
  const cleanPhone = phone.trim().replace(/^\+91/, '');
  return adminPhones.includes(cleanPhone);
}

/** Sign a JWT and return the token string */
export async function signToken(payload: AuthPayload): Promise<string> {
  const isAdmin = Boolean(payload.isAdmin || isPhoneAdmin(payload.phone, payload.name));
  return new SignJWT({ ...payload, isAdmin })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(JWT_SECRET);
}

/** Verify a JWT token string and return the payload */
export async function verifyToken(token: string): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const authData = payload as unknown as AuthPayload;
    if (authData && (authData.isAdmin || isPhoneAdmin(authData.phone, authData.name))) {
      authData.isAdmin = true;
    }
    return authData;
  } catch {
    return null;
  }
}

/** Read the auth cookie from the current request and verify it */
export async function getAuthUser(): Promise<AuthPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const user = await verifyToken(token);
  if (!user) return null;
  return {
    ...user,
    isAdmin: Boolean(user.isAdmin || isPhoneAdmin(user.phone, user.name)),
  };
}

/** Set the auth cookie in a Route Handler response */
export function buildAuthCookieHeader(token: string): string {
  return `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

/** Clear the auth cookie */
export function buildClearCookieHeader(): string {
  return `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`;
}

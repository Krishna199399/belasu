import { NextRequest } from 'next/server';
import { issueLoginOtp } from '@/lib/loginOtp';

/** POST /api/auth/retry-otp  { phone } — sends a fresh WhatsApp login code (same limits as send) */
export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();
    return await issueLoginOtp(request, phone);
  } catch (err) {
    console.error('retry-otp error:', err);
    return Response.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

import { NextRequest } from 'next/server';
import { issueLoginOtp } from '@/lib/loginOtp';

/** POST /api/auth/send-otp  { phone, name? } — sends a WhatsApp login code */
export async function POST(request: NextRequest) {
  try {
    const { phone, name } = await request.json();
    return await issueLoginOtp(request, phone, name);
  } catch (err) {
    console.error('send-otp error:', err);
    return Response.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

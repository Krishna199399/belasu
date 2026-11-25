import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase';
import { signToken, buildAuthCookieHeader, getFullUserProfile, isPhoneAdmin } from '@/lib/auth';
import { clientIp, hitRateLimit, isRateLimited, resetRateLimit, tooManyRequests } from '@/lib/rateLimit';

const DEV_OTP = '123456';
const IS_DEV = process.env.NODE_ENV !== 'production';

const WRONG_CODE_LIMIT = 5; // wrong codes per phone …
const WRONG_CODE_WINDOW = 15 * 60 * 1000; // … per 15 minutes
const IP_LIMIT = 30; // verify attempts per IP …
const IP_WINDOW = 15 * 60 * 1000; // … per 15 minutes

function sameCode(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

/**
 * POST /api/auth/verify-otp  { phone, otp, name? }
 *
 * The OTP is checked ONLY against the 6-digit code this server generated and sent on
 * WhatsApp for THIS phone (the `otps` row, see src/lib/loginOtp.ts). One-time use,
 * 10-minute expiry, 5 wrong codes per phone per 15 minutes.
 */
export async function POST(request: NextRequest) {
  try {
    const { phone, otp, name } = await request.json();

    if (!phone || !otp) {
      return Response.json({ success: false, error: 'Phone and OTP are required' }, { status: 400 });
    }

    const cleanPhone = String(phone).replace(/\D/g, '').slice(-10);
    const cleanOtp = String(otp).trim();
    if (!/^\d{10}$/.test(cleanPhone) || !/^\d{4,8}$/.test(cleanOtp)) {
      return Response.json({ success: false, error: 'Incorrect verification code. Please check and try again.' }, { status: 400 });
    }

    const ip = clientIp(request.headers);
    const ipCheck = hitRateLimit(`verify-ip:${ip}`, IP_LIMIT, IP_WINDOW);
    if (!ipCheck.ok) return tooManyRequests(ipCheck.retryAfter, 'Too many attempts. Please wait a few minutes and try again.');
    const phoneKey = `verify-fail:${cleanPhone}`;
    const phoneCheck = isRateLimited(phoneKey, WRONG_CODE_LIMIT, WRONG_CODE_WINDOW);
    if (!phoneCheck.ok) {
      return tooManyRequests(phoneCheck.retryAfter, 'Too many wrong codes. Please request a new code in a few minutes.');
    }

    const supabase = createAdminClient();
    const { data: otpRecord } = await supabase.from('otps').select('*').eq('phone', cleanPhone).maybeSingle();

    let isVerified = false;
    let failureReason: string | null = null;

    if (IS_DEV && cleanOtp === DEV_OTP) {
      isVerified = true;
    } else if (!otpRecord?.otp_code) {
      failureReason = 'No verification code was requested for this number. Please request a new code.';
    } else if (otpRecord.expires_at && new Date(otpRecord.expires_at) < new Date()) {
      return Response.json({ success: false, error: 'OTP has expired. Please request a new one.' }, { status: 400 });
    } else {
      // The 6-digit code we generated and sent on WhatsApp
      isVerified = sameCode(String(otpRecord.otp_code), cleanOtp);
    }

    if (!isVerified) {
      hitRateLimit(phoneKey, WRONG_CODE_LIMIT, WRONG_CODE_WINDOW);
      return Response.json(
        { success: false, error: failureReason || 'Incorrect verification code. Please check and try again.' },
        { status: 400 }
      );
    }

    resetRateLimit(phoneKey);
    // One-time use
    await supabase.from('otps').delete().eq('phone', cleanPhone);

    // Find or create the user (preserving existing customer names)
    const { data: existingUser } = await supabase.from('users').select('*').eq('phone', cleanPhone).maybeSingle();

    let user = existingUser;
    if (!user) {
      const displayName = (typeof name === 'string' && name.trim()) || otpRecord?.name || `User_${cleanPhone.slice(-4)}`;
      const { data: newUser, error: createErr } = await supabase
        .from('users')
        .insert({ phone: cleanPhone, name: displayName })
        .select()
        .single();

      if (createErr || !newUser) {
        console.error('User creation error:', createErr);
        return Response.json({ success: false, error: 'Failed to create user account.' }, { status: 500 });
      }
      user = newUser;
    } else if (typeof name === 'string' && name.trim() && (!user.name || user.name.startsWith('User_'))) {
      const { data: updatedUser } = await supabase
        .from('users')
        .update({ name: name.trim() })
        .eq('id', user.id)
        .select()
        .single();
      if (updatedUser) user = updatedUser;
    }

    const isAdmin = isPhoneAdmin(user.phone);
    const token = await signToken({ userId: user.id, phone: user.phone, name: user.name, isAdmin });
    const profile = await getFullUserProfile(user.id);

    return new Response(
      JSON.stringify({
        success: true,
        user: profile || { id: user.id, name: user.name, phone: user.phone, isAdmin, addresses: [] },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Set-Cookie': buildAuthCookieHeader(token) },
      }
    );
  } catch (err) {
    console.error('verify-otp error:', err);
    return Response.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

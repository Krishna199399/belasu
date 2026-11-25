import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase';
import { sendWhatsAppOtp } from '@/lib/wacrm';
import { clientIp, hitRateLimit, tooManyRequests } from '@/lib/rateLimit';

/**
 * Login OTP — WhatsApp (Meta Cloud API, template `belesu_authentication`) only.
 * The 6-digit code is generated here and stored in `otps` (one row per phone);
 * /api/auth/verify-otp compares against it.
 */

const OTP_TTL_MS = 10 * 60 * 1000;
const IS_DEV = process.env.NODE_ENV !== 'production';

export async function issueLoginOtp(request: Request, rawPhone: unknown, name?: unknown): Promise<Response> {
  const phone = typeof rawPhone === 'string' ? rawPhone.trim() : '';
  if (!/^\d{10}$/.test(phone)) {
    return Response.json({ success: false, error: 'Enter a valid 10-digit phone number' }, { status: 400 });
  }

  // Every send costs a WhatsApp message — stop OTP bombing
  const ipLimit = hitRateLimit(`otp-send-ip:${clientIp(request.headers)}`, 10, 60 * 60 * 1000);
  if (!ipLimit.ok) return tooManyRequests(ipLimit.retryAfter, 'Too many code requests. Please try again later.');
  const phoneLimit = hitRateLimit(`otp-send:${phone}`, 4, 15 * 60 * 1000);
  if (!phoneLimit.ok) {
    return tooManyRequests(phoneLimit.retryAfter, 'Too many codes requested for this number. Please wait a few minutes.');
  }

  const code = String(crypto.randomInt(100000, 1000000));
  const displayName = typeof name === 'string' && name.trim() ? name.trim().slice(0, 80) : null;

  const sent = await sendWhatsAppOtp(phone, code, displayName || undefined);
  if (!sent.success) {
    if (IS_DEV) {
      // Local development without WhatsApp: show the code in the UI
      await saveCode(phone, code, displayName);
      console.log(`[DEV MODE] OTP for ${phone}: ${code}`);
      return Response.json({ success: true, message: `[DEV MODE] OTP: ${code}` });
    }
    console.error(`[login-otp] WhatsApp send failed for ${phone.slice(-4)}:`, sent.error);
    return Response.json(
      {
        success: false,
        error: 'Could not send the WhatsApp code. Please check the number has WhatsApp and try again.',
      },
      { status: 502 }
    );
  }

  await saveCode(phone, code, displayName);
  return Response.json({ success: true, message: 'WhatsApp verification code sent' });
}

async function saveCode(phone: string, code: string, name: string | null) {
  const { error } = await createAdminClient()
    .from('otps')
    .upsert(
      { phone, otp_code: code, expires_at: new Date(Date.now() + OTP_TTL_MS).toISOString(), ...(name ? { name } : {}) },
      { onConflict: 'phone' }
    );
  if (error) throw new Error(`Could not store OTP: ${error.message}`);
}

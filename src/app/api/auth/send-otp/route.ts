import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { sendWhatsAppOtp } from '@/lib/wacrm';

// In development: optional fallback dev OTP 123456
const DEV_OTP = '123456';
const IS_DEV = process.env.NODE_ENV !== 'production';

export async function POST(request: NextRequest) {
  try {
    const { phone, name } = await request.json();

    if (!phone || !/^\d{10}$/.test(phone)) {
      return Response.json({ success: false, error: 'Enter a valid 10-digit phone number' }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const rawOtp = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes
    const supabase = createAdminClient();

    // ──────────────────────────────────────────────────────────────────────────
    // 1. PRIMARY: Official Meta WhatsApp Authentication Template (belesu_authentication)
    // ──────────────────────────────────────────────────────────────────────────
    try {
      const metaRes = await sendWhatsAppOtp(cleanPhone, rawOtp, name);
      if (metaRes.success) {
        console.log(`[send-otp] Dispatched via Meta WhatsApp Cloud API to 91${cleanPhone} (Message ID: ${metaRes.messageId})`);

        await supabase.from('otps').upsert(
          {
            phone: cleanPhone,
            otp_code: rawOtp,
            expires_at: expiresAt,
            name: name || null,
          },
          { onConflict: 'phone' }
        );

        return Response.json({
          success: true,
          provider: 'meta',
          message: 'WhatsApp verification code sent',
        });
      }

      console.warn(`[send-otp] Meta WhatsApp dispatch failed (${metaRes.error}), falling back to MSG91...`);
    } catch (metaErr) {
      console.warn('[send-otp] Meta WhatsApp exception, falling back to MSG91:', metaErr);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 2. FALLBACK: MSG91 Multi-Channel Widget API
    // ──────────────────────────────────────────────────────────────────────────
    const authKey = process.env.MSG91_AUTH_KEY || '586335A5gpZuvFpB6ae66a79P1';
    const widgetId = process.env.NEXT_PUBLIC_MSG91_WIDGET_ID || '366a45776b7a393936333337';
    const tokenAuth = process.env.NEXT_PUBLIC_MSG91_TOKEN_AUTH || '586335TnpNGKx14of6ae675f2P1';

    let msg91Success = false;
    let msg91ReqId: string | null = null;
    let msg91Error: string | null = null;

    const clientIp =
      request.headers.get('x-real-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('cf-connecting-ip') ||
      '';

    try {
      const sendHeaders: Record<string, string> = {
        authkey: authKey,
        'Content-Type': 'application/json',
      };
      if (clientIp) sendHeaders['X-Forwarded-For'] = clientIp;

      const msg91Res = await fetch('https://control.msg91.com/api/v5/widget/sendOtp', {
        method: 'POST',
        headers: sendHeaders,
        body: JSON.stringify({
          widgetId,
          tokenAuth,
          identifier: `91${cleanPhone}`,
        }),
      });

      const msg91Data = await msg91Res.json();
      const isIpBlocked =
        String(msg91Data.message).toLowerCase().includes('ipblocked') ||
        String(msg91Data.message).toLowerCase().includes('ip blocked') ||
        String(msg91Data.message).toLowerCase().includes('ip_blocked');

      if (!isIpBlocked && (msg91Data.type === 'success' || msg91Res.ok)) {
        msg91Success = true;
        msg91ReqId = msg91Data.message || null;
        console.log(`[MSG91 Fallback] OTP dispatched to 91${cleanPhone}, reqId: ${msg91ReqId}`);
      } else {
        const isIpBlockedOnFailure = String(msg91Data.message).toLowerCase().includes('ipblocked');
        msg91Error = isIpBlockedOnFailure
          ? 'Too many OTP requests from this device. Please wait a few minutes and try again.'
          : msg91Data.message || 'MSG91 send failed';
        console.warn('[MSG91 Fallback sendOtp] Failed:', msg91Data);
      }
    } catch (fetchErr) {
      console.error('[MSG91 Fallback sendOtp] Network error:', fetchErr);
      msg91Error = fetchErr instanceof Error ? fetchErr.message : 'Network error';
    }

    if (msg91Success && msg91ReqId) {
      await supabase.from('otps').upsert(
        {
          phone: cleanPhone,
          otp_code: msg91ReqId,
          expires_at: expiresAt,
          name: name || null,
        },
        { onConflict: 'phone' }
      );

      return Response.json({
        success: true,
        reqId: msg91ReqId,
        provider: 'msg91',
        message: 'Verification code sent via SMS/WhatsApp fallback',
      });
    }

    if (IS_DEV) {
      console.log(`[DEV MODE] OTP for ${cleanPhone}: ${rawOtp}`);
      await supabase.from('otps').upsert(
        {
          phone: cleanPhone,
          otp_code: rawOtp,
          expires_at: expiresAt,
          name: name || null,
        },
        { onConflict: 'phone' }
      );
      return Response.json({
        success: true,
        message: `[DEV MODE] OTP: ${rawOtp}`,
      });
    }

    return Response.json(
      {
        success: false,
        error: msg91Error || 'Failed to dispatch verification code. Please try again.',
      },
      { status: 500 }
    );
  } catch (err) {
    console.error('send-otp error:', err);
    return Response.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

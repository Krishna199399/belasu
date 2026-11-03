import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

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
    const authKey = process.env.MSG91_AUTH_KEY || '586335A5gpZuvFpB6ae66a79P1';
    const widgetId = process.env.NEXT_PUBLIC_MSG91_WIDGET_ID || '366a45776b7a393936333337';
    const tokenAuth = process.env.NEXT_PUBLIC_MSG91_TOKEN_AUTH || '586335TnpNGKx14of6ae675f2P1';

    let msg91Success = false;
    let msg91ReqId: string | null = null;
    let msg91Error: string | null = null;

    // Dispatch WhatsApp OTP directly via MSG91 Widget API (Default Channel 12: WHATSAPP)
    try {
      const msg91Res = await fetch('https://control.msg91.com/api/v5/widget/sendOtp', {
        method: 'POST',
        headers: {
          'authkey': authKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          widgetId,
          tokenAuth,
          identifier: `91${cleanPhone}`,
        }),
      });

      const msg91Data = await msg91Res.json();
      if (msg91Data.type === 'success' || msg91Res.ok) {
        msg91Success = true;
        msg91ReqId = msg91Data.message || null;
        console.log(`[MSG91] WhatsApp OTP dispatched to 91${cleanPhone}, reqId: ${msg91ReqId}`);
      } else {
        msg91Error = msg91Data.message || 'MSG91 send failed';
        console.warn('[MSG91 sendOtp API] Failed:', msg91Data);
      }
    } catch (fetchErr) {
      console.error('[MSG91 sendOtp API] Network error:', fetchErr);
      msg91Error = fetchErr instanceof Error ? fetchErr.message : 'Network error';
    }

    // Upsert record in Supabase (saving reqId for server-side verification)
    const storedCode = msg91ReqId || (IS_DEV ? DEV_OTP : String(Math.floor(100000 + Math.random() * 900000)));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes matching MSG91 WhatsApp OTP

    const supabase = createAdminClient();
    await supabase
      .from('otps')
      .upsert({ phone: cleanPhone, otp_code: storedCode, expires_at: expiresAt, name: name || null }, { onConflict: 'phone' });

    if (msg91Success) {
      return Response.json({
        success: true,
        reqId: msg91ReqId,
        message: 'WhatsApp OTP sent successfully via MSG91',
      });
    }

    if (IS_DEV) {
      console.log(`[DEV MODE] OTP for ${cleanPhone}: ${storedCode}`);
      return Response.json({
        success: true,
        message: `[DEV MODE] OTP: ${storedCode}`,
      });
    }

    return Response.json(
      {
        success: false,
        error: msg91Error || 'Failed to dispatch WhatsApp OTP via MSG91. Please try again.',
      },
      { status: 500 }
    );
  } catch (err) {
    console.error('send-otp error:', err);
    return Response.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

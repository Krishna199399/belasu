import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { sendWhatsAppOtp } from '@/lib/wacrm';

export async function POST(request: NextRequest) {
  try {
    const { phone, retryChannel = '12' } = await request.json();

    if (!phone || !/^\d{10}$/.test(phone)) {
      return Response.json({ success: false, error: 'Enter a valid 10-digit phone number' }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    const supabase = createAdminClient();

    // ──────────────────────────────────────────────────────────────────────────
    // 1. PRIMARY (For WhatsApp Channel '12'): Try Meta WhatsApp Cloud API
    // ──────────────────────────────────────────────────────────────────────────
    if (String(retryChannel) === '12') {
      const rawOtp = String(Math.floor(100000 + Math.random() * 900000));
      try {
        const metaRes = await sendWhatsAppOtp(cleanPhone, rawOtp);
        if (metaRes.success) {
          console.log(`[retry-otp] Resent via Meta WhatsApp Cloud API to 91${cleanPhone} (Message ID: ${metaRes.messageId})`);

          await supabase.from('otps').upsert(
            {
              phone: cleanPhone,
              otp_code: rawOtp,
              expires_at: expiresAt,
            },
            { onConflict: 'phone' }
          );

          return Response.json({
            success: true,
            provider: 'meta',
            message: 'WhatsApp verification code resent',
          });
        }
        console.warn(`[retry-otp] Meta retry failed (${metaRes.error}), falling back to MSG91...`);
      } catch (metaErr) {
        console.warn('[retry-otp] Meta retry exception, falling back to MSG91:', metaErr);
      }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 2. FALLBACK (or SMS Channel '11'): MSG91 Multi-Channel API
    // ──────────────────────────────────────────────────────────────────────────
    const authKey = process.env.MSG91_AUTH_KEY || '586335A5gpZuvFpB6ae66a79P1';
    const widgetId = process.env.NEXT_PUBLIC_MSG91_WIDGET_ID || '366a45776b7a393936333337';
    const tokenAuth = process.env.NEXT_PUBLIC_MSG91_TOKEN_AUTH || '586335TnpNGKx14of6ae675f2P1';

    const clientIp =
      request.headers.get('x-real-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('cf-connecting-ip') ||
      '';

    const apiHeaders: Record<string, string> = {
      authkey: authKey,
      'Content-Type': 'application/json',
    };
    if (clientIp) apiHeaders['X-Forwarded-For'] = clientIp;

    const { data: otpRecord } = await supabase
      .from('otps')
      .select('*')
      .eq('phone', cleanPhone)
      .maybeSingle();

    let newReqId: string | null = null;
    let success = false;
    let errorMessage: string | null = null;

    // A. Attempt retry with existing MSG91 reqId if available
    const existingReqId = otpRecord?.otp_code;
    if (existingReqId && existingReqId.length > 10) {
      try {
        const retryRes = await fetch('https://control.msg91.com/api/v5/widget/retryOtp', {
          method: 'POST',
          headers: apiHeaders,
          body: JSON.stringify({
            widgetId,
            tokenAuth,
            reqId: existingReqId,
            retryChannel: String(retryChannel),
          }),
        });

        const retryData = await retryRes.json();
        const isRetryBlocked = String(retryData.message).toLowerCase().includes('ipblocked');
        if (!isRetryBlocked && (retryData.type === 'success' || retryRes.ok)) {
          success = true;
          newReqId = retryData.message || existingReqId;
          console.log(`[retry-otp] MSG91 retried channel ${retryChannel} for 91${cleanPhone}, reqId: ${newReqId}`);
        } else {
          console.warn(`[retry-otp] MSG91 retry failed, falling back to fresh sendOtp:`, retryData);
        }
      } catch (err) {
        console.warn(`[retry-otp] MSG91 retry call error, falling back to fresh sendOtp:`, err);
      }
    }

    // B. If retry failed or no existing reqId, send fresh OTP via MSG91
    if (!success) {
      try {
        const sendRes = await fetch('https://control.msg91.com/api/v5/widget/sendOtp', {
          method: 'POST',
          headers: apiHeaders,
          body: JSON.stringify({
            widgetId,
            tokenAuth,
            identifier: `91${cleanPhone}`,
          }),
        });

        const sendData = await sendRes.json();
        const isSendBlocked = String(sendData.message).toLowerCase().includes('ipblocked');
        if (!isSendBlocked && (sendData.type === 'success' || sendRes.ok)) {
          success = true;
          newReqId = sendData.message || null;
          console.log(`[retry-otp] MSG91 fresh sendOtp dispatched for 91${cleanPhone}, reqId: ${newReqId}`);
        } else {
          errorMessage = isSendBlocked
            ? 'Too many OTP requests from this device. Please wait a few minutes.'
            : sendData.message || 'Failed to dispatch verification code';
        }
      } catch (fetchErr) {
        errorMessage = fetchErr instanceof Error ? fetchErr.message : 'Network error';
      }
    }

    if (success && newReqId) {
      await supabase.from('otps').upsert(
        {
          phone: cleanPhone,
          otp_code: newReqId,
          expires_at: expiresAt,
        },
        { onConflict: 'phone' }
      );

      return Response.json({
        success: true,
        reqId: newReqId,
        provider: 'msg91',
        message: retryChannel === '11' ? 'SMS verification code sent' : 'WhatsApp verification code resent',
      });
    }

    return Response.json(
      {
        success: false,
        error: errorMessage || 'Failed to resend verification code. Please try again.',
      },
      { status: 500 }
    );
  } catch (err) {
    console.error('retry-otp error:', err);
    return Response.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

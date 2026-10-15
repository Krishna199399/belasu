import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

// In development: always use mock OTP 123456
// In production: integrate an SMS gateway (MSG91, Fast2SMS, Twilio)
const DEV_OTP = '123456';
const IS_DEV = process.env.NODE_ENV !== 'production';

export async function POST(request: NextRequest) {
  try {
    const { phone, name } = await request.json();

    if (!phone || !/^\d{10}$/.test(phone)) {
      return Response.json({ success: false, error: 'Enter a valid 10-digit phone number' }, { status: 400 });
    }

    const otp = IS_DEV ? DEV_OTP : String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 min

    const supabase = createAdminClient();

    // Upsert OTP record (one per phone, overwrite if re-requested)
    const { error } = await supabase
      .from('otps')
      .upsert({ phone, otp_code: otp, expires_at: expiresAt, name: name || null }, { onConflict: 'phone' });

    if (error) {
      console.error('OTP upsert error:', error);
      return Response.json({ success: false, error: 'Failed to generate OTP. Try again.' }, { status: 500 });
    }

    if (IS_DEV) {
      console.log(`[DEV] OTP for ${phone}: ${otp}`);
    } else {
      // TODO: Send SMS via gateway
      // await sendSms(phone, `Your Belesu OTP is: ${otp}. Valid for 5 minutes.`);
    }

    return Response.json({
      success: true,
      message: IS_DEV ? `[DEV MODE] OTP: ${otp}` : 'OTP sent to your phone number',
    });
  } catch (err) {
    console.error('send-otp error:', err);
    return Response.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

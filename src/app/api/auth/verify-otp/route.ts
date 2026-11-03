import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { signToken, buildAuthCookieHeader, getFullUserProfile, isPhoneAdmin } from '@/lib/auth';

const DEV_OTP = '123456';
const IS_DEV = process.env.NODE_ENV !== 'production';

export async function POST(request: NextRequest) {
  try {
    const { phone, otp, name, reqId } = await request.json();

    if (!phone || !otp) {
      return Response.json({ success: false, error: 'Phone and OTP are required' }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const cleanOtp = String(otp).trim();
    const supabase = createAdminClient();

    // 1. Fetch stored OTP record
    const { data: otpRecord } = await supabase
      .from('otps')
      .select('*')
      .eq('phone', cleanPhone)
      .maybeSingle();

    // 2. Check expiry if record exists
    if (otpRecord && otpRecord.expires_at) {
      if (new Date(otpRecord.expires_at) < new Date()) {
        return Response.json({ success: false, error: 'OTP has expired. Please request a new one.' }, { status: 400 });
      }
    }

    const authKey = process.env.MSG91_AUTH_KEY || '586335A5gpZuvFpB6ae66a79P1';
    const widgetId = process.env.NEXT_PUBLIC_MSG91_WIDGET_ID || '366a45776b7a393936333337';
    const tokenAuth = process.env.NEXT_PUBLIC_MSG91_TOKEN_AUTH || '586335TnpNGKx14of6ae675f2P1';

    let isVerified = false;
    let failureReason: string | null = null;

    // Check A: Dev mode fallback code 123456
    if (IS_DEV && cleanOtp === DEV_OTP) {
      isVerified = true;
    }

    // Check B: Direct code match with stored code (if raw code was stored)
    if (!isVerified && otpRecord?.otp_code && otpRecord.otp_code === cleanOtp) {
      isVerified = true;
    }

    // Check C: Official MSG91 Widget OTP verification
    const targetReqId = reqId || otpRecord?.otp_code;
    if (!isVerified && targetReqId) {
      try {
        const msg91Res = await fetch('https://control.msg91.com/api/v5/widget/verifyOtp', {
          method: 'POST',
          headers: {
            'authkey': authKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            widgetId,
            tokenAuth,
            otp: cleanOtp,
            reqId: String(targetReqId).trim(),
          }),
        });

        const msg91Data = await msg91Res.json();
        console.log(`[verify-otp] MSG91 verify result for 91${cleanPhone}:`, msg91Data);

        if (
          msg91Data.type === 'success' ||
          msg91Data.message === 'OTP verified successfully' ||
          (msg91Res.ok && msg91Data.status !== 'fail' && msg91Data.type !== 'error')
        ) {
          isVerified = true;
        } else {
          failureReason = msg91Data.message || null;
        }
      } catch (msgErr) {
        console.error('[verify-otp] MSG91 verify API error:', msgErr);
      }
    }

    if (!isVerified) {
      return Response.json(
        {
          success: false,
          error: failureReason || 'Incorrect verification code. Please check and try again.',
        },
        { status: 400 }
      );
    }

    // 4. Delete used OTP from otps table
    await supabase.from('otps').delete().eq('phone', cleanPhone);

    // 5. Upsert user (preserving existing customer names)
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('phone', cleanPhone)
      .maybeSingle();

    let user = existingUser;
    if (!user) {
      const displayName = (name && name.trim()) || otpRecord?.name || `User_${cleanPhone.slice(-4)}`;
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
    } else if (name && name.trim() && (!user.name || user.name.startsWith('User_'))) {
      const { data: updatedUser } = await supabase
        .from('users')
        .update({ name: name.trim() })
        .eq('id', user.id)
        .select()
        .single();
      if (updatedUser) user = updatedUser;
    }

    // 6. Issue JWT & session cookie
    const isAdmin = Boolean((user as any).is_admin || isPhoneAdmin(user.phone, user.name));
    const token = await signToken({ userId: user.id, phone: user.phone, name: user.name, isAdmin });

    const profile = await getFullUserProfile(user.id);

    return new Response(
      JSON.stringify({
        success: true,
        user: profile || {
          id: user.id,
          name: user.name,
          phone: user.phone,
          isAdmin,
          addresses: [],
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': buildAuthCookieHeader(token),
        },
      }
    );
  } catch (err) {
    console.error('verify-otp error:', err);
    return Response.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

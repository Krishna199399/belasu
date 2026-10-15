import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { signToken, buildAuthCookieHeader } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { phone, otp, name } = await request.json();

    if (!phone || !otp) {
      return Response.json({ success: false, error: 'Phone and OTP are required' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Fetch stored OTP
    const { data: otpRecord, error: fetchErr } = await supabase
      .from('otps')
      .select('*')
      .eq('phone', phone)
      .single();

    if (fetchErr || !otpRecord) {
      return Response.json({ success: false, error: 'OTP not found. Please request a new one.' }, { status: 400 });
    }

    // 2. Check expiry
    if (new Date(otpRecord.expires_at) < new Date()) {
      return Response.json({ success: false, error: 'OTP has expired. Please request a new one.' }, { status: 400 });
    }

    // 3. Verify OTP
    if (otpRecord.otp_code !== otp) {
      return Response.json({ success: false, error: 'Incorrect OTP. Please try again.' }, { status: 400 });
    }

    // 4. Delete used OTP
    await supabase.from('otps').delete().eq('phone', phone);

    // 5. Upsert user (auto-register if first time)
    const displayName = name || otpRecord.name || `User_${phone.slice(-4)}`;
    const { data: user, error: userErr } = await supabase
      .from('users')
      .upsert({ phone, name: displayName }, { onConflict: 'phone' })
      .select()
      .single();

    if (userErr || !user) {
      console.error('User upsert error:', userErr);
      return Response.json({ success: false, error: 'Failed to create user account.' }, { status: 500 });
    }

    // 6. Issue JWT
    const { isPhoneAdmin } = await import('@/lib/auth');
    const isAdmin = Boolean((user as any).is_admin || isPhoneAdmin(user.phone));
    const token = await signToken({ userId: user.id, phone: user.phone, name: user.name, isAdmin });

    return new Response(
      JSON.stringify({ success: true, user: { id: user.id, name: user.name, phone: user.phone, isAdmin } }),
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

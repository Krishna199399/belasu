import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { signToken, buildAuthCookieHeader, isPhoneAdmin, getFullUserProfile } from '@/lib/auth';

interface Msg91VerifyResponse {
  type: string;
  message?: string;
  code?: number;
  data?: unknown;
}

export async function POST(request: NextRequest) {
  try {
    const { accessToken, phone, name } = await request.json();

    if (!accessToken || !phone) {
      return Response.json(
        { success: false, error: 'Access token and phone number are required' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const authKey = process.env.MSG91_AUTH_KEY || '586335A5gpZuvFpB6ae66a79P1';

    // Verify access token with MSG91
    const msg91Res = await fetch('https://control.msg91.com/api/v5/widget/verifyAccessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        authkey: authKey,
        'access-token': accessToken,
      }),
    });

    const msg91Data: Msg91VerifyResponse = await msg91Res.json();

    if (!msg91Res.ok || msg91Data.type !== 'success') {
      console.error('[MSG91 Verify] Access token verification failed:', msg91Data);
      return Response.json(
        {
          success: false,
          error:
            msg91Data.message ||
            'Failed to verify MSG91 OTP access token. Please try again.',
        },
        { status: 401 }
      );
    }

    // Check if the verified identifier matches the requested phone number
    const verifiedIdentifier = String(msg91Data.message || '').replace(/\D/g, '');
    if (verifiedIdentifier && !verifiedIdentifier.endsWith(cleanPhone)) {
      console.error('[MSG91 Verify] Phone number mismatch:', {
        verifiedIdentifier,
        cleanPhone,
      });
      return Response.json(
        { success: false, error: 'Verified mobile number does not match entered phone number.' },
        { status: 403 }
      );
    }

    // Find or create user in Supabase (preserving existing names for returning/migrated customers)
    const supabase = createAdminClient();
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('phone', cleanPhone)
      .maybeSingle();

    let user = existingUser;

    if (!user) {
      const displayName = (name && name.trim()) || `User_${cleanPhone.slice(-4)}`;
      const { data: newUser, error: createErr } = await supabase
        .from('users')
        .insert({ phone: cleanPhone, name: displayName })
        .select()
        .single();

      if (createErr || !newUser) {
        console.error('[MSG91 Verify] User insert error:', createErr);
        return Response.json(
          { success: false, error: 'Failed to create user account.' },
          { status: 500 }
        );
      }
      user = newUser;
    } else {
      // If user has a placeholder name and explicitly passed a name, update it
      if (name && name.trim() && (!user.name || user.name.startsWith('User_'))) {
        const { data: updatedUser } = await supabase
          .from('users')
          .update({ name: name.trim() })
          .eq('id', user.id)
          .select()
          .single();
        if (updatedUser) {
          user = updatedUser;
        }
      }
    }

    const isAdmin = isPhoneAdmin(user.phone);

    const token = await signToken({
      userId: user.id,
      phone: user.phone,
      name: user.name,
      isAdmin,
    });

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
    console.error('[MSG91 Verify] Unexpected error:', err);
    return Response.json(
      { success: false, error: 'An unexpected server error occurred during verification.' },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// POST - Set default address
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const addressId = body?.addressId;

    if (!addressId) {
      return NextResponse.json(
        { success: false, error: 'addressId is required' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // 1. Verify address exists and belongs to the authenticated user
    const { data: targetAddress, error: findError } = await supabase
      .from('addresses')
      .select('id')
      .eq('id', addressId)
      .eq('user_id', authUser.userId)
      .maybeSingle();

    if (findError || !targetAddress) {
      return NextResponse.json(
        { success: false, error: 'Address not found or does not belong to you' },
        { status: 404 }
      );
    }

    // 2. Clear default flag from all other addresses belonging to this user
    const { error: resetError } = await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', authUser.userId);

    if (resetError) {
      console.error('[addresses/set-default] Error resetting defaults:', resetError);
      return NextResponse.json(
        { success: false, error: 'Failed to reset default addresses' },
        { status: 500 }
      );
    }

    // 3. Mark the selected address as default
    const { data: updatedAddress, error: updateError } = await supabase
      .from('addresses')
      .update({
        is_default: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', addressId)
      .eq('user_id', authUser.userId)
      .select()
      .single();

    if (updateError) {
      console.error('[addresses/set-default] Error setting default:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to set default address' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Default address updated successfully',
      address: updatedAddress,
    });
  } catch (error) {
    console.error('[addresses/set-default] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to set default address' },
      { status: 500 }
    );
  }
}

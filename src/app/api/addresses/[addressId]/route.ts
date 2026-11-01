import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase';

// PATCH - Update address
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ addressId: string }> }
) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { addressId } = await params;
    const updates = await request.json();

    const supabase = createAdminClient();

    // Verify address belongs to user
    const { data: existingAddress, error: checkError } = await supabase
      .from('addresses')
      .select('id, is_default')
      .eq('id', addressId)
      .eq('user_id', authUser.userId)
      .single();

    if (checkError || !existingAddress) {
      return NextResponse.json(
        { success: false, error: 'Address not found' },
        { status: 404 }
      );
    }

    // Build update payload
    const updatePayload: Record<string, any> = {};
    if (updates.firstName !== undefined) updatePayload.first_name = updates.firstName;
    if (updates.lastName !== undefined) updatePayload.last_name = updates.lastName;
    if (updates.address1 !== undefined) updatePayload.address1 = updates.address1;
    if (updates.address2 !== undefined) updatePayload.address2 = updates.address2;
    if (updates.city !== undefined) updatePayload.city = updates.city;
    if (updates.state !== undefined) updatePayload.state = updates.state;
    if (updates.postcode !== undefined) updatePayload.postcode = updates.postcode;
    if (updates.phone !== undefined) updatePayload.phone = updates.phone;
    if (updates.email !== undefined) updatePayload.email = updates.email;
    if (updates.label !== undefined) updatePayload.label = updates.label;
    if (updates.isDefault !== undefined) updatePayload.is_default = updates.isDefault;

    const { data: updated, error: updateError } = await supabase
      .from('addresses')
      .update(updatePayload)
      .eq('id', addressId)
      .eq('user_id', authUser.userId)
      .select()
      .single();

    if (updateError) {
      console.error('Update address error:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update address' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      address: {
        id: updated.id,
        userId: updated.user_id,
        firstName: updated.first_name,
        lastName: updated.last_name,
        address1: updated.address1,
        address2: updated.address2,
        city: updated.city,
        state: updated.state,
        postcode: updated.postcode,
        phone: updated.phone,
        email: updated.email,
        label: updated.label,
        isDefault: updated.is_default,
        createdAt: updated.created_at,
        updatedAt: updated.updated_at,
      },
      message: 'Address updated successfully',
    });
  } catch (error) {
    console.error('Update address error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update address' },
      { status: 500 }
    );
  }
}

// DELETE - Delete address
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ addressId: string }> }
) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { addressId } = await params;
    const supabase = createAdminClient();

    // Check user addresses count and if this is default
    const { data: addresses } = await supabase
      .from('addresses')
      .select('id, is_default')
      .eq('user_id', authUser.userId);

    const addressToDelete = addresses?.find((a) => a.id === addressId);
    if (!addressToDelete) {
      return NextResponse.json(
        { success: false, error: 'Address not found' },
        { status: 404 }
      );
    }

    if (addressToDelete.is_default && addresses && addresses.length > 1) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete default address. Please set another address as default first.' },
        { status: 400 }
      );
    }

    const { error: deleteError } = await supabase
      .from('addresses')
      .delete()
      .eq('id', addressId)
      .eq('user_id', authUser.userId);

    if (deleteError) {
      console.error('Delete address error:', deleteError);
      return NextResponse.json(
        { success: false, error: 'Failed to delete address' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Address deleted successfully',
    });
  } catch (error) {
    console.error('Delete address error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete address' },
      { status: 500 }
    );
  }
}

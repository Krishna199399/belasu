import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase';

// POST - Create new address
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser();
    
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const addressData = await request.json();

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'address1', 'city', 'state', 'postcode', 'phone'];
    for (const field of requiredFields) {
      if (!addressData[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const supabase = createAdminClient();

    // Check if user has any addresses
    const { data: existingAddresses } = await supabase
      .from('addresses')
      .select('id')
      .eq('user_id', authUser.userId);

    // If this is the first address, make it default
    const isFirstAddress = !existingAddresses || existingAddresses.length === 0;

    // Insert new address
    const { data: newAddress, error } = await supabase
      .from('addresses')
      .insert({
        user_id: authUser.userId,
        first_name: addressData.firstName,
        last_name: addressData.lastName,
        address1: addressData.address1,
        address2: addressData.address2 || null,
        city: addressData.city,
        state: addressData.state,
        postcode: addressData.postcode,
        phone: addressData.phone,
        email: addressData.email || null,
        label: addressData.label || null,
        is_default: isFirstAddress,
        latitude: addressData.coordinates?.latitude || null,
        longitude: addressData.coordinates?.longitude || null,
        usage_count: 0,
        last_used_at: null,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to add address' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      address: {
        id: newAddress.id,
        userId: newAddress.user_id,
        firstName: newAddress.first_name,
        lastName: newAddress.last_name,
        address1: newAddress.address1,
        address2: newAddress.address2,
        city: newAddress.city,
        state: newAddress.state,
        postcode: newAddress.postcode,
        phone: newAddress.phone,
        email: newAddress.email,
        label: newAddress.label,
        isDefault: newAddress.is_default,
        coordinates: newAddress.latitude && newAddress.longitude ? {
          latitude: newAddress.latitude,
          longitude: newAddress.longitude,
        } : null,
        usageCount: newAddress.usage_count,
        lastUsedAt: newAddress.last_used_at,
        createdAt: newAddress.created_at,
        updatedAt: newAddress.updated_at,
      },
      message: 'Address added successfully',
    });
  } catch (error) {
    console.error('Add address error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add address' },
      { status: 500 }
    );
  }
}

// GET - Fetch all addresses for user
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser();
    
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const supabase = createAdminClient();

    const { data: addresses, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', authUser.userId)
      .order('is_default', { ascending: false })
      .order('usage_count', { ascending: false });

    if (error) {
      console.error('Supabase fetch error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch addresses' },
        { status: 500 }
      );
    }

    // Transform to camelCase for frontend
    const transformedAddresses = addresses.map(addr => ({
      id: addr.id,
      userId: addr.user_id,
      firstName: addr.first_name,
      lastName: addr.last_name,
      address1: addr.address1,
      address2: addr.address2,
      city: addr.city,
      state: addr.state,
      postcode: addr.postcode,
      phone: addr.phone,
      email: addr.email,
      label: addr.label,
      isDefault: addr.is_default,
      coordinates: addr.latitude && addr.longitude ? {
        latitude: addr.latitude,
        longitude: addr.longitude,
      } : null,
      usageCount: addr.usage_count,
      lastUsedAt: addr.last_used_at,
      createdAt: addr.created_at,
      updatedAt: addr.updated_at,
    }));

    return NextResponse.json({
      success: true,
      addresses: transformedAddresses,
    });
  } catch (error) {
    console.error('Fetch addresses error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch addresses' },
      { status: 500 }
    );
  }
}

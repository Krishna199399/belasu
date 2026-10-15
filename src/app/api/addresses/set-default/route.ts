import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Mock database - In production, replace with actual database calls
// Use global storage to persist across requests
if (typeof global !== 'undefined') {
  if (!(global as any).mockAddresses) {
    (global as any).mockAddresses = new Map<string, any[]>();
  }
}

const mockAddresses = (global as any).mockAddresses as Map<string, any[]>;

// Helper to get user from session
async function getUserFromSession(request: NextRequest) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('belesu_session');
  
  if (!sessionCookie) {
    return null;
  }

  try {
    const sessionData = JSON.parse(decodeURIComponent(sessionCookie.value));
    return sessionData;
  } catch {
    return null;
  }
}

// POST - Set default address
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromSession(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { addressId } = await request.json();

    if (!addressId) {
      return NextResponse.json(
        { success: false, error: 'addressId is required' },
        { status: 400 }
      );
    }

    const userAddresses = mockAddresses.get(user.id) || [];
    const addressIndex = userAddresses.findIndex(a => a.id === addressId);

    if (addressIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Address not found' },
        { status: 404 }
      );
    }

    // Unset all other default addresses
    userAddresses.forEach(addr => {
      addr.isDefault = false;
    });

    // Set new default
    userAddresses[addressIndex].isDefault = true;
    userAddresses[addressIndex].updatedAt = new Date().toISOString();

    mockAddresses.set(user.id, userAddresses);

    // In production: Update in database
    // await db.addresses.updateMany({ where: { userId: user.id }, data: { isDefault: false } });
    // await db.addresses.update({ where: { id: addressId }, data: { isDefault: true } });

    return NextResponse.json({
      success: true,
      message: 'Default address updated successfully',
    });
  } catch (error) {
    console.error('Set default address error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to set default address' },
      { status: 500 }
    );
  }
}

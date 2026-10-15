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

// PATCH - Update address
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ addressId: string }> }
) {
  try {
    const user = await getUserFromSession(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { addressId } = await params;
    const updates = await request.json();

    const userAddresses = mockAddresses.get(user.id) || [];
    const addressIndex = userAddresses.findIndex(a => a.id === addressId);

    if (addressIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Address not found' },
        { status: 404 }
      );
    }

    // Update address
    userAddresses[addressIndex] = {
      ...userAddresses[addressIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    mockAddresses.set(user.id, userAddresses);

    // In production: Update in database
    // await db.addresses.update({ where: { id: addressId }, data: updates });

    return NextResponse.json({
      success: true,
      address: userAddresses[addressIndex],
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
    const user = await getUserFromSession(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { addressId } = await params;

    const userAddresses = mockAddresses.get(user.id) || [];
    const addressIndex = userAddresses.findIndex(a => a.id === addressId);

    if (addressIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Address not found' },
        { status: 404 }
      );
    }

    const addressToDelete = userAddresses[addressIndex];

    // Prevent deleting default address if there are other addresses
    if (addressToDelete.isDefault && userAddresses.length > 1) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete default address. Please set another address as default first.' },
        { status: 400 }
      );
    }

    // Remove address
    userAddresses.splice(addressIndex, 1);
    mockAddresses.set(user.id, userAddresses);

    // In production: Delete from database
    // await db.addresses.delete({ where: { id: addressId } });

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

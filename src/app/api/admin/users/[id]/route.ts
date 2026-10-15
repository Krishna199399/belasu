import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { createAdminClient } from '@/lib/supabase';
import { isPhoneAdmin } from '@/lib/auth';
import { digitalBooks } from '@/data/digitalBooksData';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return Response.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const supabase = createAdminClient();

    // 1. Fetch user
    const { data: user, error: userErr } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (userErr) throw userErr;
    if (!user) {
      return Response.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // 2. Fetch addresses
    const { data: addresses } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false });

    // 3. Fetch all orders with items
    const { data: orders } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // 4. Fetch reading progress
    const { data: readProgress } = await supabase
      .from('read_progress')
      .select('*')
      .eq('user_id', user.id);

    // 5. Build enriched digital book list with ownership status
    const digitalList = (user.purchased_books?.digital || []) as string[];
    const ownedDigitalBooks = digitalBooks.filter((b: any) => digitalList.includes(b.id));

    const isAdmin = Boolean((user as any).is_admin || isPhoneAdmin(user.phone));

    return Response.json({
      success: true,
      user: {
        ...user,
        isAdmin,
        addresses: addresses || [],
        orders: orders || [],
        readProgress: readProgress || [],
        ownedDigitalBooks,
        availableDigitalBooks: digitalBooks.map((b: any) => ({
          id: b.id,
          title: b.title,
          gradeClass: b.gradeClass,
          subject: b.subject,
          isOwned: digitalList.includes(b.id),
        })),
      },
    });
  } catch (err: any) {
    console.error('Admin user detail fetch error:', err);
    return Response.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return Response.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { action, bookId, name, email } = body;

    const supabase = createAdminClient();

    // Fetch existing user
    const { data: user, error: fetchErr } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr || !user) {
      return Response.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const currentBooks = user.purchased_books || { physical: [], digital: [] };
    let digitalBooksList: string[] = Array.isArray(currentBooks.digital) ? [...currentBooks.digital] : [];
    let physicalBooksList: string[] = Array.isArray(currentBooks.physical) ? [...currentBooks.physical] : [];

    const updates: Record<string, any> = {};

    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;

    // Handle digital book access grant or revoke
    if (action === 'grant_digital' && bookId) {
      if (!digitalBooksList.includes(bookId)) {
        digitalBooksList.push(bookId);
      }
      updates.purchased_books = {
        physical: physicalBooksList,
        digital: digitalBooksList,
      };
    } else if (action === 'revoke_digital' && bookId) {
      digitalBooksList = digitalBooksList.filter((b) => b !== bookId);
      updates.purchased_books = {
        physical: physicalBooksList,
        digital: digitalBooksList,
      };
    }

    if (Object.keys(updates).length === 0) {
      return Response.json({ success: false, error: 'No valid action provided' }, { status: 400 });
    }

    const { data: updatedUser, error: updateErr } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateErr) throw updateErr;

    return Response.json({
      success: true,
      user: updatedUser,
      message: action ? `Book access successfully updated` : 'User profile updated',
    });
  } catch (err: any) {
    console.error('Admin user update error:', err);
    return Response.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

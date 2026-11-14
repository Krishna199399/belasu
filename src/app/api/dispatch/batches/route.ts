import { NextRequest } from 'next/server';
import { requireDispatchStaff } from '@/lib/dispatchAuth';
import { createAdminClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const staff = await requireDispatchStaff();
  if (!staff) {
    return Response.json(
      { success: false, error: 'Unauthorized. Staff dispatch access required.' },
      { status: 403 }
    );
  }

  try {
    const supabase = createAdminClient();

    const { data: batches, error } = await supabase
      .from('dispatch_batches')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      // Table doesn't exist yet
      return Response.json({
        success: true,
        batches: [],
        tableExists: false,
      });
    }

    return Response.json({
      success: true,
      batches: batches || [],
      tableExists: true,
    });
  } catch (err: any) {
    console.error('Fetch dispatch batches error:', err);
    return Response.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

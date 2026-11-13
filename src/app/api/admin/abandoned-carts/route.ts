import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { createAdminClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status') || 'all'; // 'all' | 'abandoned' | 'recovered'
    const search = searchParams.get('search')?.trim().toLowerCase() || '';
    const format = searchParams.get('format') || 'json';

    const supabase = createAdminClient();

    // 1. Fetch all carts to compute accurate metrics
    const { data: allCarts, error } = await supabase
      .from('abandoned_carts')
      .select('*')
      .order('last_active_at', { ascending: false });

    if (error) {
      // Table may not have been created yet
      return NextResponse.json({
        success: true,
        tableExists: false,
        warning: 'abandoned_carts table not found in database',
        metrics: {
          totalAbandoned: 0,
          totalLostRevenue: 0,
          totalRecovered: 0,
          totalRecoveredRevenue: 0,
          recoveryRate: 0,
        },
        carts: [],
      });
    }

    const rawList = allCarts || [];

    // Calculate KPIs
    let totalAbandoned = 0;
    let totalLostRevenue = 0;
    let totalRecovered = 0;
    let totalRecoveredRevenue = 0;

    for (const c of rawList) {
      const amount = Number(c.grand_total) || 0;
      if (c.status === 'abandoned' || c.status === 'active') {
        totalAbandoned += 1;
        totalLostRevenue += amount;
      } else if (c.status === 'recovered') {
        totalRecovered += 1;
        totalRecoveredRevenue += amount;
      }
    }

    const totalTracked = totalAbandoned + totalRecovered;
    const recoveryRate = totalTracked > 0 ? Math.round((totalRecovered / totalTracked) * 100) : 0;

    // Apply Filter & Search
    let filtered = rawList;

    if (statusFilter === 'abandoned') {
      filtered = filtered.filter((c) => c.status === 'abandoned' || c.status === 'active');
    } else if (statusFilter === 'recovered') {
      filtered = filtered.filter((c) => c.status === 'recovered');
    } else if (statusFilter === 'contacted') {
      filtered = filtered.filter((c) => (c.whatsapp_sent_count || 0) > 0);
    }

    if (search) {
      filtered = filtered.filter((c) => {
        const matchesName = (c.customer_name || '').toLowerCase().includes(search);
        const matchesPhone = (c.customer_phone || '').includes(search);
        const matchesItems = Array.isArray(c.cart_items) && c.cart_items.some((i: any) =>
          (i.title || '').toLowerCase().includes(search)
        );
        return matchesName || matchesPhone || matchesItems;
      });
    }

    // 2. Handle CSV Export for WACRM
    if (format === 'csv') {
      const rows = ['phone,name,cart_books,cart_total,recovery_link,status,last_active'];
      for (const c of filtered) {
        const items = Array.isArray(c.cart_items)
          ? c.cart_items.map((i: any) => `${i.title} (x${i.quantity || 1})`).join('; ')
          : '';
        const safeName = `"${(c.customer_name || 'Customer').replace(/"/g, '""')}"`;
        const safeItems = `"${items.replace(/"/g, '""')}"`;
        rows.push(`${c.customer_phone},${safeName},${safeItems},₹${c.grand_total},${c.recovery_url},${c.status},${c.last_active_at}`);
      }

      const csvContent = rows.join('\r\n');
      return new Response(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="belesu_abandoned_carts.csv"',
        },
      });
    }

    // 3. Return JSON payload
    return NextResponse.json({
      success: true,
      tableExists: true,
      metrics: {
        totalAbandoned,
        totalLostRevenue,
        totalRecovered,
        totalRecoveredRevenue,
        recoveryRate,
      },
      carts: filtered,
    });
  } catch (err: any) {
    console.error('[admin/abandoned-carts] Error:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { action, cartId } = body;

    if (!cartId || !action) {
      return NextResponse.json({ success: false, error: 'cartId and action required' }, { status: 400 });
    }

    const supabase = createAdminClient();

    if (action === 'mark_recovered') {
      const { error } = await supabase
        .from('abandoned_carts')
        .update({
          status: 'recovered',
          updated_at: new Date().toISOString(),
        })
        .eq('id', cartId);

      if (error) throw error;
      return NextResponse.json({ success: true, message: 'Cart marked as recovered' });
    }

    if (action === 'record_whatsapp_sent') {
      // Fetch current count
      const { data: cart } = await supabase
        .from('abandoned_carts')
        .select('whatsapp_sent_count')
        .eq('id', cartId)
        .single();

      const newCount = (cart?.whatsapp_sent_count || 0) + 1;
      const { error } = await supabase
        .from('abandoned_carts')
        .update({
          whatsapp_sent_count: newCount,
          last_whatsapp_sent_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', cartId);

      if (error) throw error;
      return NextResponse.json({ success: true, newCount });
    }

    if (action === 'delete') {
      const { error } = await supabase
        .from('abandoned_carts')
        .delete()
        .eq('id', cartId);

      if (error) throw error;
      return NextResponse.json({ success: true, message: 'Cart deleted' });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    console.error('[admin/abandoned-carts] Action error:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Action failed' }, { status: 500 });
  }
}

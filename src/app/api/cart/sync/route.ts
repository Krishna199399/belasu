import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

/** Clean and format phone numbers as E.164 (+91...) */
function formatPhoneForMeta(rawPhone: string): string {
  if (!rawPhone) return '';
  const digits = rawPhone.replace(/\D/g, '');
  if (!digits) return '';

  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return `+91${digits.slice(1)}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+${digits}`;
  }
  return rawPhone.startsWith('+') ? `+${digits}` : `+${digits}`;
}

/**
 * GET /api/cart/sync?sessionId=...
 * Recovers cart items for a customer who clicked a recovery link
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId')?.trim();

    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'sessionId required' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data: cartRecord, error } = await supabase
      .from('abandoned_carts')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (error || !cartRecord) {
      return NextResponse.json({ success: false, error: 'Cart not found or expired' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      cart: cartRecord.cart_items,
      subtotal: cartRecord.subtotal,
      shippingFee: cartRecord.shipping_fee,
      grandTotal: cartRecord.grand_total,
      customerName: cartRecord.customer_name,
      customerPhone: cartRecord.customer_phone,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Failed to fetch cart' }, { status: 500 });
  }
}

/**
 * POST /api/cart/sync
 * Captures or updates an abandoned cart in real-time
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      phone,
      name,
      email,
      cart,
      subtotal = 0,
      shippingFee = 0,
      grandTotal = 0,
      userId,
    } = body;

    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'sessionId is required' }, { status: 400 });
    }

    const cleanPhone = phone ? formatPhoneForMeta(phone) : '';

    // If no phone is provided yet or cart is empty, return early gracefully
    if (!cleanPhone || cleanPhone.replace(/\D/g, '').length < 10 || !Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No actionable phone or cart items to record yet',
        synced: false,
      });
    }

    const supabase = createAdminClient();

    // Simplify cart items for clean JSON storage
    const formattedCartItems = cart.map((item: any) => ({
      id: item.product?.id || item.id,
      title: item.product?.title || item.title || 'Guidebook',
      price: Number(item.product?.price || item.price || 0),
      quantity: Number(item.quantity || 1),
      productType: item.productType || 'physical',
      coverImage: item.product?.coverImage || item.coverImage || '',
      sku: item.product?.sku || item.sku || '',
      gradeClass: item.product?.gradeClass ?? null,
    }));

    const totalItemCount = formattedCartItems.reduce((acc: number, curr: any) => acc + (curr.quantity || 1), 0);
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'https://belesu.in';
    const recoveryUrl = `${origin}/cart?recover=${encodeURIComponent(sessionId)}`;

    // Upsert into abandoned_carts table
    const { data, error } = await supabase
      .from('abandoned_carts')
      .upsert(
        {
          session_id: sessionId,
          user_id: userId || null,
          customer_phone: cleanPhone,
          customer_name: (name || '').trim() || 'Customer',
          customer_email: (email || '').trim() || null,
          cart_items: formattedCartItems,
          item_count: totalItemCount,
          subtotal: Number(subtotal) || 0,
          shipping_fee: Number(shippingFee) || 0,
          grand_total: Number(grandTotal) || 0,
          recovery_url: recoveryUrl,
          status: 'abandoned',
          last_active_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'session_id' }
      )
      .select()
      .single();

    if (error) {
      // If table doesn't exist yet, do not fail customer experience
      console.warn('[cart/sync] Supabase save error (table may need creation):', error.message);
      return NextResponse.json({
        success: false,
        warning: 'Table not yet created or connection error',
        details: error.message,
      });
    }

    return NextResponse.json({
      success: true,
      cartId: data?.id,
      synced: true,
    });
  } catch (err: any) {
    console.error('[cart/sync] Unexpected error:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Sync failed' }, { status: 500 });
  }
}

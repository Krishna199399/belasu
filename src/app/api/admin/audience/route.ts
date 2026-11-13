import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { createAdminClient } from '@/lib/supabase';
import { BOOKS_DATA } from '@/data/mockData';
import { digitalBooks } from '@/data/digitalBooksData';

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

export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return Response.json(
      { success: false, error: 'Unauthorized. Admin access required.' },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId') || 'all';
    const excludeProductId = searchParams.get('excludeProductId') || 'none';
    const search = searchParams.get('search')?.trim().toLowerCase() || '';
    const batchSize = Math.max(50, Math.min(2000, parseInt(searchParams.get('batchSize') || '300', 10)));
    const batchIndex = parseInt(searchParams.get('batchIndex') || '0', 10);
    const format = searchParams.get('format') || 'json';

    const supabase = createAdminClient();

    // 1. Fetch all paid/completed orders with items
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, user_id, order_number, billing_first_name, billing_last_name, billing_phone, billing_email, payment_status, order_status, created_at, order_items(id, item_sku, item_name, product_id, quantity)')
      .or('payment_status.eq.Paid,order_status.eq.Completed')
      .order('created_at', { ascending: false });

    if (ordersError) throw ordersError;

    // 2. Fetch users for phone/name resolution & digital access books
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, name, phone, email, purchased_books, created_at');

    if (usersError) throw usersError;

    const userMap = new Map((users || []).map((u) => [u.id, u]));

    // 3. Build customer purchase map keyed by normalized phone
    interface CustomerEntry {
      phone: string;
      name: string;
      email?: string;
      userId?: string;
      orderCount: number;
      lastOrderNumber: string;
      lastOrderDate: string;
      purchasedItemIds: Set<string>;
      purchasedItemSkus: Set<string>;
      purchasedItemNames: string[];
    }

    const customerMap = new Map<string, CustomerEntry>();

    // Process from orders
    for (const order of orders || []) {
      const rawPhone = order.billing_phone;
      const cleanPhone = formatPhoneForMeta(rawPhone);
      if (!cleanPhone || cleanPhone.replace(/\D/g, '').length < 10) continue;

      const user = order.user_id ? userMap.get(order.user_id) : null;
      const fullName =
        [order.billing_first_name, order.billing_last_name].filter(Boolean).join(' ').trim() ||
        user?.name?.trim() ||
        'Customer';

      let entry = customerMap.get(cleanPhone);
      if (!entry) {
        entry = {
          phone: cleanPhone,
          name: fullName,
          email: order.billing_email || user?.email,
          userId: order.user_id,
          orderCount: 0,
          lastOrderNumber: order.order_number,
          lastOrderDate: order.created_at,
          purchasedItemIds: new Set<string>(),
          purchasedItemSkus: new Set<string>(),
          purchasedItemNames: [],
        };
        customerMap.set(cleanPhone, entry);
      }

      entry.orderCount += 1;

      // Register order items
      for (const item of (order.order_items as any[]) || []) {
        if (item.product_id) entry.purchasedItemIds.add(String(item.product_id).toLowerCase());
        if (item.item_sku) entry.purchasedItemSkus.add(String(item.item_sku).toLowerCase());
        if (item.item_name && !entry.purchasedItemNames.includes(item.item_name)) {
          entry.purchasedItemNames.push(item.item_name);
        }
      }
    }

    // Also register users who have digital or physical books in users.purchased_books
    for (const user of users || []) {
      if (!user.phone) continue;
      const cleanPhone = formatPhoneForMeta(user.phone);
      if (!cleanPhone || cleanPhone.replace(/\D/g, '').length < 10) continue;

      let entry = customerMap.get(cleanPhone);
      if (!entry) {
        entry = {
          phone: cleanPhone,
          name: user.name?.trim() || 'Customer',
          email: user.email,
          userId: user.id,
          orderCount: 0,
          lastOrderNumber: 'User Account',
          lastOrderDate: user.created_at,
          purchasedItemIds: new Set<string>(),
          purchasedItemSkus: new Set<string>(),
          purchasedItemNames: [],
        };
        customerMap.set(cleanPhone, entry);
      }

      const pBooks = user.purchased_books as any;
      if (pBooks) {
        const physical = Array.isArray(pBooks.physical) ? pBooks.physical : [];
        const digital = Array.isArray(pBooks.digital) ? pBooks.digital : [];
        for (const pid of [...physical, ...digital]) {
          if (pid) entry.purchasedItemIds.add(String(pid).toLowerCase());
        }
      }
    }

    // Helper: checks if a customer purchased a target product
    function hasPurchasedProduct(cust: CustomerEntry, targetId: string): boolean {
      if (targetId === 'all') return true;
      const lower = targetId.toLowerCase();
      if (cust.purchasedItemIds.has(lower)) return true;
      if (cust.purchasedItemSkus.has(lower)) return true;
      // Partial match on title
      return cust.purchasedItemNames.some((n) => n.toLowerCase().includes(lower));
    }

    // 4. Apply Inclusion and Exclusion Filters
    const filteredCustomers: CustomerEntry[] = [];

    for (const cust of customerMap.values()) {
      // Search filter
      if (search) {
        const matchesName = cust.name.toLowerCase().includes(search);
        const matchesPhone = cust.phone.includes(search);
        if (!matchesName && !matchesPhone) continue;
      }

      // Inclusion: Must have purchased target product
      if (productId !== 'all' && !hasPurchasedProduct(cust, productId)) {
        continue;
      }

      // Exclusion: Must NOT have purchased excluded product
      if (excludeProductId && excludeProductId !== 'none' && hasPurchasedProduct(cust, excludeProductId)) {
        continue;
      }

      filteredCustomers.push(cust);
    }

    // Sort by latest order date descending
    filteredCustomers.sort(
      (a, b) => new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime()
    );

    const totalContacts = filteredCustomers.length;
    const totalBatches = Math.max(1, Math.ceil(totalContacts / batchSize));

    // 5. Handle CSV Export format
    if (format === 'csv') {
      let exportSlice = filteredCustomers;
      if (batchIndex > 0) {
        const start = (batchIndex - 1) * batchSize;
        exportSlice = filteredCustomers.slice(start, start + batchSize);
      }

      // CSV Header & rows: phone,name
      const rows = ['phone,name'];
      for (const c of exportSlice) {
        // Escape name if it contains commas or quotes
        const safeName = c.name ? `"${c.name.replace(/"/g, '""')}"` : 'Customer';
        rows.push(`${c.phone},${safeName}`);
      }

      const csvContent = rows.join('\r\n');
      const filename = `belesu_audience_${productId.replace(/\s+/g, '_')}_batch${batchIndex || 'all'}.csv`;

      return new Response(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    }

    // 6. Return JSON with batch information & preview contacts
    const batches = [];
    for (let i = 1; i <= totalBatches; i++) {
      const start = (i - 1) * batchSize + 1;
      const end = Math.min(i * batchSize, totalContacts);
      const count = totalContacts > 0 ? end - start + 1 : 0;
      batches.push({
        batchIndex: i,
        count,
        range: totalContacts > 0 ? `${start} – ${end}` : '0',
      });
    }

    // Products catalog for frontend selection
    const availableProducts = [
      ...BOOKS_DATA.map((b) => ({
        id: b.id,
        sku: b.sku,
        title: b.title,
        gradeClass: b.gradeClass,
        type: 'physical',
      })),
      ...digitalBooks.map((d: any) => ({
        id: d.id,
        sku: d.sku,
        title: d.title,
        gradeClass: d.gradeClass,
        type: 'digital',
      })),
    ];

    return Response.json({
      success: true,
      totalContacts,
      batchSize,
      totalBatches,
      batches,
      contactsPreview: filteredCustomers.slice(0, 25).map((c) => ({
        phone: c.phone,
        name: c.name,
        email: c.email,
        orderCount: c.orderCount,
        lastOrderNumber: c.lastOrderNumber,
        lastOrderDate: c.lastOrderDate,
        purchasedBooks: c.purchasedItemNames.slice(0, 3),
      })),
      availableProducts,
    });
  } catch (err: any) {
    console.error('Admin audience query error:', err);
    return Response.json(
      { success: false, error: err.message || 'Failed to generate audience' },
      { status: 500 }
    );
  }
}


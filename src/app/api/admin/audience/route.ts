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

/** Extract class grade (1-10) from book title or slug */
function extractGradeFromText(text: string): number | undefined {
  const match = text.match(/class\s*(\d+)/i) || text.match(/grade\s*(\d+)/i) || text.match(/savi\s*(\d+)/i);
  if (match && match[1]) {
    const n = parseInt(match[1], 10);
    if (n >= 1 && n <= 10) return n;
  }
  return undefined;
}

/** Calculate Karnataka Academic Year (May 1 to April 30) */
function getAcademicYear(dateStr: string): string {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = d.getMonth() + 1; // 1 to 12
  if (month >= 5) {
    return `${year}-${String(year + 1).slice(-2)}`;
  } else {
    return `${year - 1}-${String(year).slice(-2)}`;
  }
}

function getCurrentAcademicYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const startYear = month >= 5 ? year : year - 1;
  return `${startYear}-${String(startYear + 1).slice(-2)}`;
}

function getOffsetAcademicYear(offset: number): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const startYear = (month >= 5 ? year : year - 1) + offset;
  return `${startYear}-${String(startYear + 1).slice(-2)}`;
}

/** Estimate child's current grade today based on grade at purchase and academic years elapsed */
function estimateCurrentGrade(gradeAtPurchase: number | undefined, purchaseAY: string): string {
  if (!gradeAtPurchase) return 'N/A';
  const currentAY = getCurrentAcademicYear();
  const purchaseStart = parseInt(purchaseAY.split('-')[0], 10);
  const currentStart = parseInt(currentAY.split('-')[0], 10);
  const diffYears = Math.max(0, currentStart - purchaseStart);
  const projectedGrade = gradeAtPurchase + diffYears;

  if (projectedGrade > 10) {
    return 'Class 10+ (Higher Secondary)';
  }
  return `Class ${projectedGrade}`;
}

interface ItemPurchaseRecord {
  productId: string;
  sku: string;
  itemName: string;
  gradeClass?: number;
  purchaseDate: string;
  orderNumber: string;
  year: number;
  month: number;
  academicYear: string;
}

interface CustomerEntry {
  phone: string;
  name: string;
  email?: string;
  userId?: string;
  orderCount: number;
  lastOrderNumber: string;
  lastOrderDate: string;
  purchases: ItemPurchaseRecord[];
}

interface MatchedCustomer {
  customer: CustomerEntry;
  matchedPurchase?: {
    itemName: string;
    purchaseDate: string;
    year: number;
    month: number;
    academicYear: string;
    estimatedCurrentGrade: string;
    orderNumber: string;
  };
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
    const timeframe = searchParams.get('timeframe') || 'all';
    const filterYear = searchParams.get('year') || 'all';
    const filterMonth = searchParams.get('month') || 'all';
    const search = searchParams.get('search')?.trim().toLowerCase() || '';
    const batchSize = Math.max(50, Math.min(2000, parseInt(searchParams.get('batchSize') || '300', 10)));
    const batchIndex = parseInt(searchParams.get('batchIndex') || '0', 10);
    const format = searchParams.get('format') || 'json';

    const supabase = createAdminClient();

    // Catalog mapping for lookup
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

    const productLookup = new Map<string, { gradeClass?: number; title: string; sku: string }>();
    for (const p of availableProducts) {
      if (p.id) productLookup.set(p.id.toLowerCase(), p);
      if (p.sku) productLookup.set(p.sku.toLowerCase(), p);
    }

    // ── IMPORTANT: Supabase PostgREST has a default 1,000-row cap per query.
    // We paginate in chunks of 1,000 to retrieve ALL rows from large tables.
    const PAGE = 1000;

    async function fetchAllRows<T>(
      table: string,
      selectColumns: string,
      extraFilter?: (q: any) => any
    ): Promise<T[]> {
      const allRows: T[] = [];
      let from = 0;

      while (true) {
        let q: any = supabase.from(table).select(selectColumns).range(from, from + PAGE - 1);
        if (extraFilter) q = extraFilter(q);
        const { data, error } = await q;
        if (error) throw error;
        const chunk = (data || []) as T[];
        allRows.push(...chunk);
        if (chunk.length < PAGE) break;
        from += PAGE;
      }

      return allRows;
    }

    // 1. Fetch ALL paid/completed orders & users
    const [orders, users] = await Promise.all([
      fetchAllRows<any>(
        'orders',
        'id, user_id, order_number, billing_first_name, billing_last_name, billing_phone, billing_email, payment_status, order_status, order_date, created_at, order_items(id, item_sku, item_name, product_id, quantity)',
        (q) => q.or('payment_status.eq.Paid,order_status.eq.Completed').order('created_at', { ascending: false })
      ),
      fetchAllRows<any>(
        'users',
        'id, name, phone, email, purchased_books, created_at'
      ),
    ]);

    const userMap = new Map((users || []).map((u) => [u.id, u]));
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
          lastOrderDate: order.order_date || order.created_at,
          purchases: [],
        };
        customerMap.set(cleanPhone, entry);
      }

      entry.orderCount += 1;

      // Register order items with timestamps
      for (const item of (order.order_items as any[]) || []) {
        const prodId = String(item.product_id || '').toLowerCase();
        const sku = String(item.item_sku || '').toLowerCase();
        const meta = productLookup.get(prodId) || productLookup.get(sku);
        const grade = meta?.gradeClass || extractGradeFromText(item.item_name || '');

        const pDate = order.order_date || order.created_at || new Date().toISOString();
        const d = new Date(pDate);
        const yr = d.getFullYear();
        const mo = d.getMonth() + 1;
        const ay = getAcademicYear(pDate);

        entry.purchases.push({
          productId: prodId,
          sku,
          itemName: item.item_name || meta?.title || 'Book',
          gradeClass: grade,
          purchaseDate: pDate,
          orderNumber: order.order_number,
          year: yr,
          month: mo,
          academicYear: ay,
        });
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
          purchases: [],
        };
        customerMap.set(cleanPhone, entry);
      }

      const pBooks = user.purchased_books as any;
      if (pBooks) {
        const physical = Array.isArray(pBooks.physical) ? pBooks.physical : [];
        const digital = Array.isArray(pBooks.digital) ? pBooks.digital : [];

        const pDate = user.created_at || new Date().toISOString();
        const d = new Date(pDate);
        const yr = d.getFullYear();
        const mo = d.getMonth() + 1;
        const ay = getAcademicYear(pDate);

        for (const pid of [...physical, ...digital]) {
          if (!pid) continue;
          const pLower = String(pid).toLowerCase();
          if (entry.purchases.some((p) => p.productId === pLower || p.sku === pLower)) continue;

          const meta = productLookup.get(pLower);
          const grade = meta?.gradeClass || extractGradeFromText(meta?.title || pLower);

          entry.purchases.push({
            productId: pLower,
            sku: meta?.sku?.toLowerCase() || pLower,
            itemName: meta?.title || 'Book',
            gradeClass: grade,
            purchaseDate: pDate,
            orderNumber: 'Account Library',
            year: yr,
            month: mo,
            academicYear: ay,
          });
        }
      }
    }

    // Academic Year constants for time comparisons
    const currentAY = getCurrentAcademicYear();
    const prevAY1 = getOffsetAcademicYear(-1);
    const prevAY2 = getOffsetAcademicYear(-2);
    const prevAY3 = getOffsetAcademicYear(-3);

    // Collect distinct years for the frontend dropdown
    const distinctYearsSet = new Set<number>();
    for (const cust of customerMap.values()) {
      for (const p of cust.purchases) {
        if (p.year) distinctYearsSet.add(p.year);
      }
    }
    const availableYears = Array.from(distinctYearsSet).sort((a, b) => b - a);
    if (availableYears.length === 0) availableYears.push(2026, 2025, 2024);

    // Matching helper for timeframe / date filters
    function matchesTimeframe(
      p: ItemPurchaseRecord,
      tf: string,
      fYear: string,
      fMonth: string
    ): boolean {
      if (tf === 'all' && fYear === 'all' && fMonth === 'all') return true;

      const pTime = new Date(p.purchaseDate).getTime();
      const now = Date.now();

      if (tf === 'last_30_days') {
        return now - pTime <= 30 * 24 * 60 * 60 * 1000;
      }
      if (tf === 'last_90_days') {
        return now - pTime <= 90 * 24 * 60 * 60 * 1000;
      }
      if (tf === 'last_180_days') {
        return now - pTime <= 180 * 24 * 60 * 60 * 1000;
      }
      if (tf === 'academic_current') {
        return p.academicYear === currentAY;
      }
      if (tf === 'academic_prev_1') {
        return p.academicYear === prevAY1;
      }
      if (tf === 'academic_prev_2') {
        return p.academicYear === prevAY2;
      }
      if (tf === 'academic_prev_3') {
        return p.academicYear === prevAY3;
      }
      if (tf === 'older_than_1_year') {
        return now - pTime > 365 * 24 * 60 * 60 * 1000;
      }
      if (tf === 'older_than_2_years') {
        return now - pTime > 730 * 24 * 60 * 60 * 1000;
      }

      // Check year & month filters if custom or set
      if (fYear !== 'all' && p.year !== parseInt(fYear, 10)) {
        return false;
      }
      if (fMonth !== 'all' && p.month !== parseInt(fMonth, 10)) {
        return false;
      }

      return true;
    }

    function checkCustomerMatch(cust: CustomerEntry): MatchedCustomer | null {
      // 1. Exclusion: Must NOT have purchased excluded product
      if (excludeProductId && excludeProductId !== 'none') {
        const exLower = excludeProductId.toLowerCase();
        const hasExcluded = cust.purchases.some(
          (p) =>
            p.productId === exLower ||
            p.sku === exLower ||
            p.itemName.toLowerCase().includes(exLower)
        );
        if (hasExcluded) return null;
      }

      // 2. Inclusion & Timeframe filter
      let candidatePurchases = cust.purchases;
      if (productId !== 'all') {
        const targetLower = productId.toLowerCase();
        candidatePurchases = cust.purchases.filter(
          (p) =>
            p.productId === targetLower ||
            p.sku === targetLower ||
            p.itemName.toLowerCase().includes(targetLower)
        );
        if (candidatePurchases.length === 0) return null;
      }

      // Find the purchase matching timeframe (sorted by latest purchase date first)
      const validPurchase = candidatePurchases.find((p) =>
        matchesTimeframe(p, timeframe, filterYear, filterMonth)
      );

      if (!validPurchase) return null;

      const estGrade = estimateCurrentGrade(validPurchase.gradeClass, validPurchase.academicYear);

      return {
        customer: cust,
        matchedPurchase: {
          itemName: validPurchase.itemName,
          purchaseDate: validPurchase.purchaseDate,
          year: validPurchase.year,
          month: validPurchase.month,
          academicYear: validPurchase.academicYear,
          estimatedCurrentGrade: estGrade,
          orderNumber: validPurchase.orderNumber,
        },
      };
    }

    // 4. Apply Inclusion, Exclusion, Timeframe and Search Filters
    const filteredCustomers: MatchedCustomer[] = [];

    for (const cust of customerMap.values()) {
      // Search filter
      if (search) {
        const matchesName = cust.name.toLowerCase().includes(search);
        const matchesPhone = cust.phone.includes(search);
        if (!matchesName && !matchesPhone) continue;
      }

      const match = checkCustomerMatch(cust);
      if (match) {
        filteredCustomers.push(match);
      }
    }

    // Sort by matched purchase date descending
    filteredCustomers.sort((a, b) => {
      const timeA = new Date(a.matchedPurchase?.purchaseDate || a.customer.lastOrderDate).getTime();
      const timeB = new Date(b.matchedPurchase?.purchaseDate || b.customer.lastOrderDate).getTime();
      return timeB - timeA;
    });

    const totalContacts = filteredCustomers.length;
    const totalBatches = Math.max(1, Math.ceil(totalContacts / batchSize));

    // 5. Handle CSV Export format
    if (format === 'csv') {
      let exportSlice = filteredCustomers;
      if (batchIndex > 0) {
        const start = (batchIndex - 1) * batchSize;
        exportSlice = filteredCustomers.slice(start, start + batchSize);
      }

      // CSV Header & rows: phone,name,purchased_book,purchase_date,academic_year,estimated_grade
      const rows = ['phone,name,purchased_book,purchase_date,academic_year,estimated_grade'];
      for (const item of exportSlice) {
        const c = item.customer;
        const mp = item.matchedPurchase;
        const safeName = c.name ? `"${c.name.replace(/"/g, '""')}"` : 'Customer';
        const safeBook = mp?.itemName ? `"${mp.itemName.replace(/"/g, '""')}"` : 'Book';
        const pDate = mp?.purchaseDate ? mp.purchaseDate.split('T')[0] : '';
        const ay = mp?.academicYear || '';
        const grade = mp?.estimatedCurrentGrade ? `"${mp.estimatedCurrentGrade.replace(/"/g, '""')}"` : '';
        rows.push(`${c.phone},${safeName},${safeBook},${pDate},${ay},${grade}`);
      }

      const csvContent = rows.join('\r\n');
      const filename = `belesu_audience_${productId.replace(/\s+/g, '_')}_${timeframe}_batch${batchIndex || 'all'}.csv`;

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

    return Response.json({
      success: true,
      totalContacts,
      batchSize,
      totalBatches,
      batches,
      _debug: {
        totalOrdersLoaded: orders.length,
        totalUsersLoaded: users.length,
        totalUniquePhones: customerMap.size,
      },
      contactsPreview: filteredCustomers.slice(0, 30).map((item) => ({
        phone: item.customer.phone,
        name: item.customer.name,
        email: item.customer.email,
        orderCount: item.customer.orderCount,
        lastOrderNumber: item.matchedPurchase?.orderNumber || item.customer.lastOrderNumber,
        lastOrderDate: item.matchedPurchase?.purchaseDate || item.customer.lastOrderDate,
        purchasedBooks: Array.from(new Set(item.customer.purchases.map((p) => p.itemName))).slice(0, 3),
        matchedBookTitle: item.matchedPurchase?.itemName,
        purchaseDate: item.matchedPurchase?.purchaseDate,
        academicYear: item.matchedPurchase?.academicYear,
        estimatedGrade: item.matchedPurchase?.estimatedCurrentGrade,
      })),
      availableYears,
      academicYearPresets: [
        { id: 'academic_current', label: `Current Academic Year (${currentAY})` },
        { id: 'academic_prev_1', label: `1 Year Ago Academic Year (${prevAY1})` },
        { id: 'academic_prev_2', label: `2 Years Ago Academic Year (${prevAY2})` },
        { id: 'academic_prev_3', label: `3 Years Ago Academic Year (${prevAY3})` },
      ],
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

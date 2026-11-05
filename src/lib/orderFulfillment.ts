import { createAdminClient } from '@/lib/supabase';
import { deductStockOnOrder } from '@/lib/inventory';
import { sendWhatsAppOrderConfirmation } from '@/lib/wacrm';
import { sendAdminOrderNotification, sendCustomerOrderReceipt } from '@/lib/email';
import { BOOKS_DATA } from '@/data/mockData';
import { DIGITAL_BOOKS_DATA } from '@/data/digitalBooksData';
import { DigitalBook } from '@/types';
import { SHIPPING_FEE } from '@/lib/utils';

export interface FulfillOrderItem {
  id: string;
  sku?: string;
  title: string;
  price: number;
  quantity: number;
  productType: string;
  slug?: string;
}

export interface FulfillOrderParams {
  userId: string;
  items?: FulfillOrderItem[];
  itemsSummary?: string;
  shippingAddressId?: string | null;
  paymentMethod?: string;
  paymentId?: string | null;
  razorpayOrderId?: string | null;
  shippingFee?: number;
  customerEmail?: string | null;
  customerPhone?: string | null;
  customerName?: string | null;
}

/**
 * Resolves book items by SKU if only itemsSummary was passed (e.g. from Razorpay notes)
 */
export function resolveItemsFromSummary(itemsSummary?: string): FulfillOrderItem[] {
  if (!itemsSummary) return [];
  const entries = itemsSummary.split(',').map((s) => s.trim()).filter(Boolean);
  const items: FulfillOrderItem[] = [];

  for (const entry of entries) {
    const [skuOrId, qtyStr] = entry.split(':');
    const qty = parseInt(qtyStr, 10) || 1;
    const cleanKey = (skuOrId || '').trim();

    // Check physical books
    const physical = BOOKS_DATA.find(
      (b) => b.sku.toLowerCase() === cleanKey.toLowerCase() || b.id === cleanKey
    );
    if (physical) {
      items.push({
        id: physical.id,
        sku: physical.sku,
        title: physical.title,
        price: physical.price,
        quantity: qty,
        productType: 'physical',
        slug: physical.slug,
      });
      continue;
    }

    // Check digital books
    const digital = DIGITAL_BOOKS_DATA.find(
      (d: DigitalBook) => d.sku?.toLowerCase() === cleanKey.toLowerCase() || d.id === cleanKey || d.slug === cleanKey
    );
    if (digital) {
      items.push({
        id: digital.id,
        sku: digital.sku || 'DIGITAL',
        title: digital.title,
        price: digital.price,
        quantity: qty,
        productType: 'digital',
        slug: digital.slug,
      });
    }
  }

  return items;
}

// In-flight mutex locks mapped by razorpayOrderId or paymentId to prevent concurrent executions
const inFlightFulfillments = new Map<string, Promise<any>>();

/**
 * Centralized, idempotent order fulfillment logic with in-flight mutex lock.
 * Safely callable by BOTH the browser checkout flow AND Razorpay server webhooks concurrently.
 */
export async function fulfillOrder(params: FulfillOrderParams) {
  const lockKey = params.razorpayOrderId || params.paymentId;

  if (lockKey) {
    const existingPromise = inFlightFulfillments.get(lockKey);
    if (existingPromise) {
      console.log(`[fulfillOrder] Concurrency lock hit for ${lockKey}. Awaiting existing in-flight execution...`);
      return existingPromise;
    }
  }

  const promise = (async () => {
    return await executeFulfillment(params);
  })();

  if (lockKey) {
    inFlightFulfillments.set(lockKey, promise);
  }

  try {
    return await promise;
  } finally {
    if (lockKey) {
      // Retain resolved promise in memory for 15 seconds to safely absorb any trailing webhooks or duplicate requests
      setTimeout(() => inFlightFulfillments.delete(lockKey), 15000);
    }
  }
}

async function executeFulfillment(params: FulfillOrderParams) {
  const supabase = createAdminClient();

  const {
    userId,
    items: rawItems,
    itemsSummary,
    shippingAddressId,
    paymentMethod = 'Razorpay - Online Payment',
    paymentId,
    razorpayOrderId,
    shippingFee = SHIPPING_FEE,
    customerEmail,
    customerPhone,
    customerName,
  } = params;

  // 1. Idempotency Check: check if order already exists
  if (razorpayOrderId || paymentId) {
    let query = supabase.from('orders').select('*');
    if (razorpayOrderId && paymentId) {
      query = query.or(`razorpay_order_id.eq.${razorpayOrderId},razorpay_payment_id.eq.${paymentId}`);
    } else if (razorpayOrderId) {
      query = query.eq('razorpay_order_id', razorpayOrderId);
    } else if (paymentId) {
      query = query.eq('razorpay_payment_id', paymentId);
    }

    const { data: existingOrders } = await query;
    if (existingOrders && existingOrders.length > 0) {
      const existing = existingOrders[0];
      console.log(`[fulfillOrder] Idempotent hit: Order #${existing.order_number} already exists`);

      // If existing order was Pending and we now have paymentId, mark it Paid
      if (existing.order_status === 'Pending' && paymentId) {
        await supabase
          .from('orders')
          .update({
            order_status: 'Completed',
            payment_status: 'Paid',
            razorpay_payment_id: paymentId,
          })
          .eq('id', existing.id);
      }

      return {
        success: true,
        order: existing,
        orderNumber: existing.order_number,
        alreadyProcessed: true,
      };
    }
  }

  // 2. Resolve items
  let items = rawItems && rawItems.length > 0 ? rawItems : resolveItemsFromSummary(itemsSummary);
  if (items.length === 0) {
    throw new Error('No items found to fulfill this order');
  }

  const hasPhysical = items.some((item) => item.productType === 'physical');
  const hasDigital = items.some((item) => item.productType === 'digital');

  // 3. Resolve user details
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, name, phone, email, purchased_books')
    .eq('id', userId)
    .single();

  if (userError || !user) {
    throw new Error(`User not found for userId: ${userId}`);
  }

  // Sync user email if missing
  if (customerEmail && !user.email) {
    await supabase.from('users').update({ email: customerEmail.trim() }).eq('id', userId);
  }

  // 4. Resolve shipping address
  let shippingAddress: any = null;
  let targetAddressId = shippingAddressId;

  if (targetAddressId) {
    const { data: addr } = await supabase
      .from('addresses')
      .select('*')
      .eq('id', targetAddressId)
      .maybeSingle();
    shippingAddress = addr;
  }

  // Fallback: if shipping address not specified or missing, pick user's default/latest address
  if (!shippingAddress && hasPhysical) {
    const { data: addrs } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(1);

    if (addrs && addrs.length > 0) {
      shippingAddress = addrs[0];
      targetAddressId = shippingAddress.id;
    }
  }

  if (hasPhysical && !shippingAddress) {
    throw new Error('Shipping address required for hard copy books');
  }

  // 5. Build billing info
  const billingInfo = shippingAddress
    ? {
        first_name: shippingAddress.first_name,
        last_name: shippingAddress.last_name,
        address1: shippingAddress.address1,
        address2: shippingAddress.address2 || null,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postcode: shippingAddress.postcode,
        phone: shippingAddress.phone,
        email: shippingAddress.email || customerEmail || user.email || '',
      }
    : {
        first_name: customerName?.trim().split(/\s+/)[0] || user.name?.trim().split(/\s+/)[0] || 'Customer',
        last_name: customerName?.trim().split(/\s+/).slice(1).join(' ') || user.name?.trim().split(/\s+/).slice(1).join(' ') || '',
        address1: 'Digital Instant Delivery (Web Reader)',
        address2: null,
        city: 'Online',
        state: 'Karnataka',
        postcode: '560001',
        phone: customerPhone || user.phone,
        email: customerEmail || user.email || '',
      };

  // 6. Calculate amounts
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingAmount = hasPhysical ? shippingFee : 0;
  const taxAmount = 0;
  const totalAmount = subtotal + shippingAmount + taxAmount;

  // Double-check DB right before generating order number & inserting
  if (razorpayOrderId || paymentId) {
    let recheckQuery = supabase.from('orders').select('*');
    if (razorpayOrderId && paymentId) {
      recheckQuery = recheckQuery.or(`razorpay_order_id.eq.${razorpayOrderId},razorpay_payment_id.eq.${paymentId}`);
    } else if (razorpayOrderId) {
      recheckQuery = recheckQuery.eq('razorpay_order_id', razorpayOrderId);
    } else if (paymentId) {
      recheckQuery = recheckQuery.eq('razorpay_payment_id', paymentId);
    }

    const { data: doubleCheck } = await recheckQuery;
    if (doubleCheck && doubleCheck.length > 0) {
      const existing = doubleCheck[0];
      console.log(`[fulfillOrder] Pre-insert double-check hit: Order #${existing.order_number}`);
      return {
        success: true,
        order: existing,
        orderNumber: existing.order_number,
        alreadyProcessed: true,
      };
    }
  }

  // 7. Generate order number
  const { data: orderNumData } = await supabase.rpc('generate_order_number');
  let orderNumber = String(orderNumData || Date.now()).replace(/^BLS-?/i, '').replace(/^#+/, '').trim();
  if (!orderNumber) {
    orderNumber = `${Date.now()}`;
  }

  // 8. Insert main order record
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: user.id,
      order_status: 'Completed',
      order_date: new Date().toISOString(),

      billing_first_name: billingInfo.first_name,
      billing_last_name: billingInfo.last_name,
      billing_address1: billingInfo.address1,
      billing_address2: billingInfo.address2,
      billing_city: billingInfo.city,
      billing_state: billingInfo.state,
      billing_postcode: billingInfo.postcode,
      billing_email: billingInfo.email || null,
      billing_phone: billingInfo.phone,

      shipping_address_id: targetAddressId || null,
      shipping_first_name: shippingAddress ? shippingAddress.first_name : null,
      shipping_last_name: shippingAddress ? shippingAddress.last_name : null,
      shipping_address1: shippingAddress ? shippingAddress.address1 : null,
      shipping_address2: shippingAddress ? shippingAddress.address2 : null,
      shipping_city: shippingAddress ? shippingAddress.city : null,
      shipping_state: shippingAddress ? shippingAddress.state : null,
      shipping_postcode: shippingAddress ? shippingAddress.postcode : null,
      shipping_phone: shippingAddress ? shippingAddress.phone : null,
      shipping_method: hasPhysical ? 'Flat rate' : null,

      payment_method: paymentMethod,
      payment_status: 'Paid',
      razorpay_order_id: razorpayOrderId || null,
      razorpay_payment_id: paymentId || null,

      order_subtotal_amount: subtotal,
      order_shipping_amount: shippingAmount,
      order_total_tax_amount: taxAmount,
      order_refund_amount: 0,
      order_total_amount: totalAmount,

      has_hard_copy_books: hasPhysical,
      has_physical_books: hasPhysical,
      has_digital_books: hasDigital,
    })
    .select()
    .single();

  if (orderError || !order) {
    console.error('[fulfillOrder] Order insert error:', orderError);
    throw new Error(`Failed to create order: ${orderError?.message}`);
  }

  // 9. Insert order items
  const orderItems = items.map((item) => ({
    order_id: order.id,
    item_sku: item.sku,
    item_name: item.title,
    item_type: item.productType,
    quantity: item.quantity,
    item_cost: item.price,
    item_total: item.price * item.quantity,
    product_id: item.id,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
  if (itemsError) {
    console.error('[fulfillOrder] Order items insert error:', itemsError);
    await supabase.from('orders').delete().eq('id', order.id);
    throw new Error(`Failed to create order items: ${itemsError.message}`);
  }

  // 10. Update purchased_books for the user
  if (hasPhysical || hasDigital) {
    const currentBooks = user.purchased_books || { physical: [], digital: [] };
    const newPhysicalIds = items.filter((i) => i.productType === 'physical').map((i) => i.id);
    const newDigitalIds = items.filter((i) => i.productType === 'digital').map((i) => i.id);

    const updatedBooks = {
      physical: [...new Set([...(currentBooks.physical || []), ...newPhysicalIds])],
      digital: [...new Set([...(currentBooks.digital || []), ...newDigitalIds])],
    };

    await supabase.from('users').update({ purchased_books: updatedBooks }).eq('id', user.id);
  }

  // 11. Deduct physical inventory
  if (hasPhysical) {
    const physicalOrderItems = items
      .filter((i) => i.productType === 'physical')
      .map((i) => ({
        id: i.id,
        sku: i.sku,
        quantity: i.quantity || 1,
        title: i.title,
      }));
    await deductStockOnOrder(physicalOrderItems, orderNumber);
  }

  // 12. Increment address usage count
  if (targetAddressId) {
    const { data: addr } = await supabase
      .from('addresses')
      .select('usage_count')
      .eq('id', targetAddressId)
      .maybeSingle();
    await supabase
      .from('addresses')
      .update({ usage_count: (addr?.usage_count || 0) + 1, last_used_at: new Date().toISOString() })
      .eq('id', targetAddressId);
  }

  // 13. Notifications (Non-blocking)
  const targetPhone = customerPhone || user.phone || billingInfo.phone;
  if (targetPhone) {
    sendWhatsAppOrderConfirmation({
      phone: targetPhone,
      name: user.name || billingInfo.first_name || 'Customer',
      orderNumber: order.order_number,
      totalAmount: order.order_total_amount,
      itemsSummary: items.map((i) => i.title).slice(0, 3).join(', '),
      isDigital: hasDigital && !hasPhysical,
    }).catch((err) => console.error('[fulfillOrder] WhatsApp dispatch error:', err));
  }

  const buyerEmail = customerEmail || user.email || billingInfo.email;
  sendAdminOrderNotification({
    orderNumber: order.order_number,
    orderDate: order.order_date,
    customerName: user.name || customerName || billingInfo.first_name || 'Customer',
    customerPhone: targetPhone,
    customerEmail: buyerEmail,
    items: items.map((i) => ({
      title: i.title,
      quantity: i.quantity,
      price: i.price,
      productType: i.productType,
      sku: i.sku,
    })),
    subtotal: order.order_subtotal_amount,
    shippingFee: order.order_shipping_amount,
    totalAmount: order.order_total_amount,
    paymentMethod,
    paymentId: paymentId || '',
    razorpayOrderId: razorpayOrderId || '',
    shippingAddress: shippingAddress
      ? {
          name: [shippingAddress.first_name, shippingAddress.last_name].filter(Boolean).join(' ').trim(),
          firstName: shippingAddress.first_name || '',
          lastName: shippingAddress.last_name || '',
          phone: shippingAddress.phone || targetPhone || '',
          email: shippingAddress.email || buyerEmail || '',
          address1: shippingAddress.address1 || '',
          address2: shippingAddress.address2 || '',
          city: shippingAddress.city || '',
          state: shippingAddress.state || '',
          postcode: shippingAddress.postcode || '',
        }
      : null,
    billingAddress: billingInfo
      ? {
          name: [billingInfo.first_name, billingInfo.last_name].filter(Boolean).join(' ').trim(),
          firstName: billingInfo.first_name || '',
          lastName: billingInfo.last_name || '',
          phone: billingInfo.phone || targetPhone || '',
          email: billingInfo.email || buyerEmail || '',
          address1: billingInfo.address1 || '',
          address2: billingInfo.address2 || '',
          city: billingInfo.city || '',
          state: billingInfo.state || '',
          postcode: billingInfo.postcode || '',
        }
      : null,
    isDigitalOnly: hasDigital && !hasPhysical,
  }).catch((err) => console.error('[fulfillOrder] Admin email error:', err));

  if (buyerEmail) {
    sendCustomerOrderReceipt({
      orderNumber: order.order_number,
      orderDate: order.order_date,
      customerName: user.name || customerName || billingInfo.first_name || 'Customer',
      customerPhone: targetPhone,
      customerEmail: buyerEmail,
      items: items.map((i) => ({
        title: i.title,
        quantity: i.quantity,
        price: i.price,
        productType: i.productType,
        sku: i.sku,
      })),
      subtotal: order.order_subtotal_amount,
      shippingFee: order.order_shipping_amount,
      totalAmount: order.order_total_amount,
      paymentMethod,
      paymentId: paymentId || '',
      razorpayOrderId: razorpayOrderId || '',
      shippingAddress: shippingAddress
        ? {
            name: [shippingAddress.first_name, shippingAddress.last_name].filter(Boolean).join(' ').trim(),
            firstName: shippingAddress.first_name || '',
            lastName: shippingAddress.last_name || '',
            phone: shippingAddress.phone || targetPhone || '',
            email: shippingAddress.email || buyerEmail || '',
            address1: shippingAddress.address1 || '',
            address2: shippingAddress.address2 || '',
            city: shippingAddress.city || '',
            state: shippingAddress.state || '',
            postcode: shippingAddress.postcode || '',
          }
        : null,
      billingAddress: billingInfo
        ? {
            name: [billingInfo.first_name, billingInfo.last_name].filter(Boolean).join(' ').trim(),
            firstName: billingInfo.first_name || '',
            lastName: billingInfo.last_name || '',
            phone: billingInfo.phone || targetPhone || '',
            email: billingInfo.email || buyerEmail || '',
            address1: billingInfo.address1 || '',
            address2: billingInfo.address2 || '',
            city: billingInfo.city || '',
            state: billingInfo.state || '',
            postcode: billingInfo.postcode || '',
          }
        : null,
      isDigitalOnly: hasDigital && !hasPhysical,
    }).catch((err) => console.error('[fulfillOrder] Customer email error:', err));
  }

  return {
    success: true,
    order,
    orderNumber: order.order_number,
    alreadyProcessed: false,
  };
}

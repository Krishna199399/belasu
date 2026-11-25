import { createAdminClient } from '@/lib/supabase';
import { deductStockOnOrder } from '@/lib/inventory';
import { sendWhatsAppOrderConfirmation } from '@/lib/wacrm';
import { sendAdminOrderNotification, sendCustomerOrderReceipt } from '@/lib/email';
import { parseItemsSummary, priceCart } from '@/lib/checkoutPricing';

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
  /**
   * Rupees actually captured by Razorpay (from Razorpay's API, never the browser).
   * Required to create a new order; must equal the catalogue-priced total.
   */
  amountPaid?: number;
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

  // 2. A new order needs a real, verified payment. Callers must pass the amount
  //    Razorpay captured (see src/lib/paymentFulfillment.ts) — never a browser value.
  if (!paymentId || !razorpayOrderId || typeof params.amountPaid !== 'number') {
    throw new Error('Cannot create an order without a verified payment');
  }

  // 3. Resolve items and RE-PRICE them from the catalogue — prices or shipping
  //    sent by a browser are ignored.
  const entries = (rawItems && rawItems.length > 0
    ? rawItems.map((i) => ({ key: i.sku || i.id, quantity: i.quantity }))
    : parseItemsSummary(itemsSummary));
  const priced = await priceCart(entries);
  const items = priced.items;
  if (items.length === 0) {
    throw new Error('No items found to fulfill this order');
  }

  // 4. What was paid must match what the books cost
  if (Math.abs(priced.total - params.amountPaid) > 0.5) {
    console.error(
      `[fulfillOrder] AMOUNT MISMATCH for ${razorpayOrderId}: paid ₹${params.amountPaid}, catalogue total ₹${priced.total} (${priced.itemsSummary})`
    );
    throw new Error('Paid amount does not match the order total');
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
    // Only the customer's OWN saved address may be used
    const { data: addr } = await supabase
      .from('addresses')
      .select('*')
      .eq('id', targetAddressId)
      .eq('user_id', userId)
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

  // 6. Amounts — from the catalogue pricing above (already checked against the payment)
  const subtotal = priced.subtotal;
  const shippingAmount = priced.shippingFee;
  const taxAmount = 0;
  const totalAmount = priced.total;

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

  // 8. Upsert main order record
  // Using upsert (not insert) so that if the webhook and client-side call arrive
  // simultaneously, the second one simply returns the already-inserted row
  // instead of creating a duplicate. Requires a UNIQUE constraint on
  // razorpay_payment_id in the orders table (add via Supabase SQL if missing).
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .upsert(
      {
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
      },
      { onConflict: 'razorpay_payment_id', ignoreDuplicates: false }
    )
    .select()
    .single();

  if (orderError || !order) {
    console.error('[fulfillOrder] Order upsert error:', orderError);
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

  // ── Auto-recover any abandoned carts for this customer ──────────────────────
  try {
    const rawCustomerPhone = targetPhone || user.phone;
    if (rawCustomerPhone) {
      const cleanDigits = rawCustomerPhone.replace(/\D/g, '');
      const last10 = cleanDigits.slice(-10);
      const phoneVariants = [
        rawCustomerPhone,
        cleanDigits,
        `+91${last10}`,
        `91${last10}`,
        last10,
      ].filter(Boolean);

      await supabase
        .from('abandoned_carts')
        .update({
          status: 'recovered',
          recovered_order_id: order.id,
          updated_at: new Date().toISOString(),
        })
        .in('customer_phone', phoneVariants)
        .in('status', ['active', 'abandoned']);
    }
  } catch (cartRecoverErr: any) {
    // Non-fatal: order fulfillment must never fail because of cart tracking
    console.warn('[fulfillOrder] Auto-recover cart notice:', cartRecoverErr?.message);
  }

  return {
    success: true,
    order,
    orderNumber: order.order_number,
    alreadyProcessed: false,
  };
}

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase';
import { EnhancedCartItem } from '@/types';
import { deductStockOnOrder } from '@/lib/inventory';
import { sendWhatsAppOrderConfirmation } from '@/lib/wacrm';

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser();
    
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('Order creation request:', JSON.stringify(body, null, 2));
    
    const { 
      items, 
      shippingAddressId, 
      paymentMethod = 'Credit Card/Debit Card/NetBanking',
      shippingFee = 45 
    }: { 
      items: any[]; // Simplified cart item format from checkout
      shippingAddressId?: string;
      paymentMethod?: string;
      shippingFee?: number;
    } = body;

    const supabase = createAdminClient();

    // Validation
    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Check product types
    const hasPhysical = items.some(item => item.productType === 'physical');
    const hasDigital = items.some(item => item.productType === 'digital');

    // Validate shipping address for physical items
    if (hasPhysical && !shippingAddressId) {
      return NextResponse.json(
        { success: false, error: 'Shipping address required for hard copy books' },
        { status: 400 }
      );
    }

    // Get user info for billing
    const { data: user } = await supabase
      .from('users')
      .select('name, phone, purchased_books')
      .eq('id', authUser.userId)
      .single();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Get shipping address if provided
    let shippingAddress = null;
    if (shippingAddressId) {
      const { data } = await supabase
        .from('addresses')
        .select('*')
        .eq('id', shippingAddressId)
        .eq('user_id', authUser.userId)
        .single();
      
      shippingAddress = data;
      
      if (!shippingAddress) {
        return NextResponse.json(
          { success: false, error: 'Shipping address not found' },
          { status: 404 }
        );
      }
    }

    // Use shipping address for billing, or create basic billing info
    const billingInfo = shippingAddress || {
      first_name: user.name?.split(' ')[0] || 'Customer',
      last_name: user.name?.split(' ').slice(1).join(' ') || '',
      address1: 'Not Provided',
      address2: '',
      city: 'Not Provided',
      state: 'Not Provided',
      postcode: '000000',
      phone: user.phone,
      email: '',
    };

    // Calculate amounts
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingAmount = hasPhysical ? shippingFee : 0;
    const taxAmount = 0;
    const totalAmount = subtotal + shippingAmount + taxAmount;

    // Generate order number
    const { data: orderNumData } = await supabase.rpc('generate_order_number');
    const orderNumber = orderNumData || `${Date.now()}`;

    // Insert main order record
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: authUser.userId,
        order_status: 'Completed',
        order_date: new Date().toISOString(),
        
        // Billing information
        billing_first_name: billingInfo.first_name,
        billing_last_name: billingInfo.last_name,
        billing_address1: billingInfo.address1,
        billing_address2: billingInfo.address2 || null,
        billing_city: billingInfo.city,
        billing_state: billingInfo.state,
        billing_postcode: billingInfo.postcode,
        billing_email: billingInfo.email || null,
        billing_phone: billingInfo.phone,
        
        // Shipping information (for physical books)
        shipping_address_id: shippingAddressId || null,
        shipping_first_name: shippingAddress ? shippingAddress.first_name : null,
        shipping_last_name: shippingAddress ? shippingAddress.last_name : null,
        shipping_address1: shippingAddress ? shippingAddress.address1 : null,
        shipping_address2: shippingAddress ? shippingAddress.address2 : null,
        shipping_city: shippingAddress ? shippingAddress.city : null,
        shipping_state: shippingAddress ? shippingAddress.state : null,
        shipping_postcode: shippingAddress ? shippingAddress.postcode : null,
        shipping_phone: shippingAddress ? shippingAddress.phone : null,
        shipping_method: hasPhysical ? 'Flat rate' : null,
        
        // Payment information
        payment_method: paymentMethod,
        payment_status: 'Paid',
        
        // Amounts
        order_subtotal_amount: subtotal,
        order_shipping_amount: shippingAmount,
        order_total_tax_amount: taxAmount,
        order_refund_amount: 0,
        order_total_amount: totalAmount,
        
        // Product types
        has_physical_books: hasPhysical,
        has_digital_books: hasDigital,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order insert error:', orderError);
      return NextResponse.json(
        { success: false, error: 'Failed to create order', details: orderError.message },
        { status: 500 }
      );
    }

    // Insert order items
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

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Order items insert error:', itemsError);
      // Rollback order
      await supabase.from('orders').delete().eq('id', order.id);
      return NextResponse.json(
        { success: false, error: 'Failed to create order items', details: itemsError.message },
        { status: 500 }
      );
    }

    // Update purchased_books for both physical and digital items
    if (hasPhysical || hasDigital) {
      const currentBooks = user.purchased_books || { physical: [], digital: [] };

      const newPhysicalIds = items
        .filter((item) => item.productType === 'physical')
        .map((item) => item.id);

      const newDigitalIds = items
        .filter((item) => item.productType === 'digital')
        .map((item) => item.id);

      const updatedBooks = {
        physical: [...new Set([...(currentBooks.physical || []), ...newPhysicalIds])],
        digital: [...new Set([...(currentBooks.digital || []), ...newDigitalIds])],
      };

      console.log('Updating purchased_books:', {
        userId: authUser.userId,
        currentBooks,
        newPhysicalIds,
        newDigitalIds,
        updatedBooks,
      });

      const { error: updateError } = await supabase
        .from('users')
        .update({ purchased_books: updatedBooks })
        .eq('id', authUser.userId);

      if (updateError) {
        console.error('Failed to update purchased_books:', updateError);
      } else {
        console.log('Successfully updated purchased_books');
      }
    }

    // Deduct physical inventory & record audit log
    if (hasPhysical) {
      const physicalOrderItems = items
        .filter((item) => item.productType === 'physical')
        .map((item) => ({
          id: item.id,
          sku: item.sku,
          quantity: item.quantity || 1,
          title: item.title,
        }));

      await deductStockOnOrder(physicalOrderItems, orderNumber);
    }

    // Update address usage count if shipping address was used
    if (shippingAddressId) {
      const { data: addr } = await supabase
        .from('addresses')
        .select('usage_count')
        .eq('id', shippingAddressId)
        .single();

      await supabase
        .from('addresses')
        .update({
          usage_count: (addr?.usage_count || 0) + 1,
          last_used_at: new Date().toISOString(),
        })
        .eq('id', shippingAddressId);
    }

    // Get order items for response
    const { data: createdItems } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order.id);

    // Dispatch non-blocking WhatsApp order confirmation
    const customerPhone = user.phone || billingInfo.phone;
    if (customerPhone) {
      sendWhatsAppOrderConfirmation({
        phone: customerPhone,
        name: user.name || billingInfo.first_name || 'Customer',
        orderNumber: order.order_number,
        totalAmount: order.order_total_amount,
        itemsSummary: items.map((i: any) => i.title).slice(0, 3).join(', '),
        isDigital: hasDigital && !hasPhysical,
      }).catch((err) => {
        console.error('[orders/create] WhatsApp confirmation dispatch error:', err);
      });
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.order_number,
        status: order.order_status,
        date: order.order_date,
        subtotal: order.order_subtotal_amount,
        shipping: order.order_shipping_amount,
        tax: order.order_total_tax_amount,
        total: order.order_total_amount,
        hasPhysical,
        hasDigital,
        items: createdItems?.map(item => ({
          sku: item.item_sku,
          name: item.item_name,
          type: item.item_type,
          quantity: item.quantity,
          price: item.item_cost,
          productId: item.product_id,
        })) || [],
        digitalBooks: hasDigital ? items.filter(i => i.productType === 'digital').map(i => ({
          id: i.id,
          slug: i.slug,
          title: i.title,
        })) : [],
      },
      message: 'Order placed successfully',
    });

  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process order', details: error.message || String(error) },
      { status: 500 }
    );
  }
}

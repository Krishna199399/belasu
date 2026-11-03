import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { createRazorpayInstance } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser();
    
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { amount, currency = 'INR', receipt, notes = {} } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Create Razorpay instance
    const razorpay = createRazorpayInstance();

    // Create Razorpay order with attached customer and order metadata for webhooks
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: receipt || `order_${Date.now()}`,
      notes: {
        user_id: authUser.userId,
        ...notes,
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
    });
  } catch (error: any) {
    console.error('Create Razorpay order error:', error);
    const errorMessage = error?.error?.description || error?.message || 'Failed to create payment order';
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: error?.message 
      },
      { status: 500 }
    );
  }
}

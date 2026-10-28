'use client';

import { useState, useCallback } from 'react';
import { loadRazorpayScript, razorpayConfig, RazorpayOptions, RazorpayResponse } from '@/lib/razorpay';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

interface UseRazorpayOptions {
  onSuccess?: (response: RazorpayResponse) => void;
  onFailure?: (error: unknown) => void;
}

export function useRazorpay({ onSuccess, onFailure }: UseRazorpayOptions = {}) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const initiatePayment = useCallback(async ({
    amount,
    description,
    notes = {},
    prefill,
  }: {
    amount: number;
    description: string;
    notes?: Record<string, unknown>;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
  }) => {
    if (!user) {
      toast.error('Please login to continue');
      return;
    }

    setLoading(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      // Create Razorpay order
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create payment order');
      }

      // Configure Razorpay options
      const options: RazorpayOptions = {
        key: razorpayConfig.keyId,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Belesu',
        description,
        order_id: data.order.id,
        handler: async (paymentResponse: RazorpayResponse) => {
          try {
            // Verify payment on server
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(paymentResponse),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              toast.success('Payment successful!');
              onSuccess?.(paymentResponse);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error: unknown) {
            console.error('Payment verification error:', error);
            const msg = error instanceof Error ? error.message : 'Payment verification failed';
            toast.error(msg);
            onFailure?.(error);
          }
        },
        prefill: {
          name: prefill?.name ?? user.name,
          email: prefill?.email ?? user.email ?? '',
          contact: prefill?.contact ?? user.phone,
        },
        notes,
        theme: {
          color: '#ea580c', // Orange color matching your site
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.error('Payment cancelled');
          },
        },
      };

      // Open Razorpay checkout
      const razorpayConstructor = (window as unknown as { Razorpay: new (opts: RazorpayOptions) => { open: () => void } }).Razorpay;
      const razorpay = new razorpayConstructor(options);
      razorpay.open();

    } catch (error: unknown) {
      console.error('Payment initiation error:', error);
      const msg = error instanceof Error ? error.message : 'Failed to initiate payment';
      toast.error(msg);
      onFailure?.(error);
    } finally {
      setLoading(false);
    }
  }, [user, onSuccess, onFailure]);

  return {
    initiatePayment,
    loading,
  };
}

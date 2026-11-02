import Razorpay from 'razorpay';

// Server-side Razorpay instance (for creating orders)
export function createRazorpayInstance() {
  const keyId = (
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    process.env.RAZORPAY_KEY_ID ||
    ''
  ).trim();
  const keySecret = (
    process.env.RAZORPAY_KEY_SECRET ||
    process.env.RAZORPAY_SECRET ||
    ''
  ).trim();

  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials not found in environment variables (NEXT_PUBLIC_RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET)');
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

// Client-side configuration
export const razorpayConfig = {
  keyId: (
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    process.env.RAZORPAY_KEY_ID ||
    ''
  ).trim(),
};

// Helper to load Razorpay script
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    // Check if already loaded
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// Razorpay payment options type
export interface RazorpayOptions {
  key: string;
  amount: number; // in paise (100 paise = 1 INR)
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, any>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

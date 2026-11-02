/**
 * Belesu External Messaging Client
 * 
 * Note: WACRM integration is disabled per configuration in favor of MSG91.
 * All functions return safe no-op responses so that checkout, login, and
 * background order processing are never blocked or broken.
 */

export interface OrderConfirmationPayload {
  phone: string;
  name: string;
  orderNumber: string;
  totalAmount: number;
  itemsSummary: string;
  isDigital: boolean;
}

const ENABLE_WACRM = false; // Disabled per user instruction: use MSG91 and do not use WACRM
const IS_DEV = process.env.NODE_ENV !== 'production';

/**
 * Normalizes phone numbers to standard E.164 Indian format (+91XXXXXXXXXX)
 */
export function formatIndianPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return `+${cleaned}`;
  }
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  return phone.startsWith('+') ? phone : `+${cleaned}`;
}

/**
 * Sends a real-time WhatsApp OTP message (Legacy stub - replaced by MSG91)
 */
export async function sendWhatsAppOtp(
  phone: string,
  otp: string,
  name?: string
): Promise<{ success: boolean; error?: string }> {
  if (IS_DEV) {
    console.log(`[MSG91 Active] sendWhatsAppOtp stub called for ${phone} (Name: ${name || 'N/A'})`);
  }
  return { success: true };
}

/**
 * Sends an order confirmation message
 */
export async function sendWhatsAppOrderConfirmation(
  payload: OrderConfirmationPayload
): Promise<{ success: boolean; error?: string }> {
  if (IS_DEV) {
    console.log(`[Order Notification] Order ${payload.orderNumber} for ${payload.phone}`);
  }
  return { success: true };
}

/**
 * Explicit contact synchronization stub
 */
export async function syncContactToWacrm(
  phone: string,
  name?: string,
  email?: string
): Promise<void> {
  // No-op: WACRM sync disabled
}

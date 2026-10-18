/**
 * Belesu to WACRM (WhatsApp CRM) Bridge Client
 * 
 * Communicates with WACRM public API (at crm.belesu.com or localhost:3001)
 * for delivering transactional WhatsApp messages (OTP, Order Receipts).
 * 
 * All outbound notification calls are non-blocking to ensure customer
 * checkouts and logins are never delayed by external network latency.
 */

export interface OrderConfirmationPayload {
  phone: string;
  name: string;
  orderNumber: string;
  totalAmount: number;
  itemsSummary: string;
  isDigital: boolean;
}

const WACRM_API_URL = process.env.WACRM_API_URL || process.env.NEXT_PUBLIC_WACRM_URL || 'http://localhost:3001';
const WACRM_API_KEY = process.env.WACRM_API_KEY;
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
 * Sends a real-time WhatsApp OTP message with a One-Tap "Copy Code" button
 */
export async function sendWhatsAppOtp(
  phone: string,
  otp: string,
  name?: string
): Promise<{ success: boolean; error?: string }> {
  const formattedPhone = formatIndianPhone(phone);

  if (!WACRM_API_KEY) {
    if (IS_DEV) {
      console.log(`[WACRM DEV MOCK] WhatsApp OTP to ${formattedPhone}: ${otp} (Name: ${name || 'N/A'})`);
    } else {
      console.warn('[WACRM] WACRM_API_KEY is not configured in production.');
    }
    return { success: true };
  }

  try {
    const res = await fetch(`${WACRM_API_URL}/api/v1/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WACRM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: formattedPhone,
        type: 'template',
        template: {
          name: process.env.WHATSAPP_OTP_TEMPLATE || 'belesu_auth_otp',
          language: process.env.WHATSAPP_TEMPLATE_LANG || 'kn',
          params: [otp],
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[WACRM] Failed to send OTP (${res.status}):`, errText);
      return { success: false, error: errText };
    }

    return { success: true };
  } catch (error: any) {
    console.error('[WACRM] Network error sending WhatsApp OTP:', error?.message || error);
    return { success: false, error: error?.message || 'Network error' };
  }
}

/**
 * Sends a WhatsApp order receipt with order number, item summary, and total amount
 */
export async function sendWhatsAppOrderConfirmation(
  payload: OrderConfirmationPayload
): Promise<{ success: boolean; error?: string }> {
  const formattedPhone = formatIndianPhone(payload.phone);
  const templateName = payload.isDigital
    ? (process.env.WHATSAPP_DIGITAL_ORDER_TEMPLATE || 'belesu_order_digital')
    : (process.env.WHATSAPP_ORDER_TEMPLATE || 'belesu_order_physical');

  if (!WACRM_API_KEY) {
    if (IS_DEV) {
      console.log(`[WACRM DEV MOCK] WhatsApp Order Receipt to ${formattedPhone}:`, {
        order: payload.orderNumber,
        amount: `₹${payload.totalAmount}`,
        items: payload.itemsSummary,
        type: payload.isDigital ? 'Digital' : 'Physical',
      });
    } else {
      console.warn('[WACRM] WACRM_API_KEY is not configured in production.');
    }
    return { success: true };
  }

  try {
    const res = await fetch(`${WACRM_API_URL}/api/v1/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WACRM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: formattedPhone,
        type: 'template',
        template: {
          name: templateName,
          language: process.env.WHATSAPP_TEMPLATE_LANG || 'kn',
          params: [
            payload.name || 'Customer',
            payload.orderNumber,
            payload.itemsSummary,
            `₹${payload.totalAmount}`,
          ],
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[WACRM] Failed to send order receipt (${res.status}):`, errText);
      return { success: false, error: errText };
    }

    return { success: true };
  } catch (error: any) {
    console.error('[WACRM] Network error sending WhatsApp order confirmation:', error?.message || error);
    return { success: false, error: error?.message || 'Network error' };
  }
}

/**
 * Explicit contact synchronization to WACRM CRM contact list
 */
export async function syncContactToWacrm(
  phone: string,
  name?: string,
  email?: string
): Promise<void> {
  if (!WACRM_API_KEY) return;

  const formattedPhone = formatIndianPhone(phone);
  try {
    await fetch(`${WACRM_API_URL}/api/v1/contacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WACRM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: formattedPhone,
        name: name || 'Customer',
        email: email || undefined,
      }),
    });
  } catch (error) {
    console.warn('[WACRM] Contact sync failed (non-critical):', error);
  }
}

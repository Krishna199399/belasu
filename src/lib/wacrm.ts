import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase';

/**
 * Belesu WhatsApp Notification Client
 *
 * Sends official transactional order confirmations via Meta WhatsApp Cloud API
 * using approved Meta message templates:
 * - belesu_hard_copy_orders (Utility / Physical Books)
 * - belesu_digital_orders (Utility / Digital Guidebooks)
 *
 * Non-blocking guarantee: All calls are safely isolated so customer checkout,
 * Razorpay payments, and order creation are NEVER blocked or failed.
 */

export interface OrderConfirmationPayload {
  phone: string;
  name: string;
  orderNumber: string;
  totalAmount: number;
  itemsSummary: string;
  isDigital: boolean;
}

const WACRM_ACCOUNT_ID = '7d87d718-75b1-4cda-8df5-1f2780f45cd7';
const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || 'fa27331b6e7dded1a2ff99c9a42aad69b208f8ed5a204a19929c7c93a3bb4483';

/**
 * Normalizes phone numbers to standard E.164 digits without leading '+' for WhatsApp API
 */
export function formatIndianPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return cleaned;
  }
  if (cleaned.length === 10) {
    return `91${cleaned}`;
  }
  return cleaned;
}

/**
 * Helper to decrypt access token stored in whatsapp_config
 */
function decryptToken(encryptedText: string, keyHex: string): string {
  const parts = encryptedText.split(':');
  if (parts.length === 3) {
    const [ivHex, ctHex, tagHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(keyHex, 'hex'), iv);
    decipher.setAuthTag(tag);
    let dec = decipher.update(ctHex, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
  }
  throw new Error('Unsupported token encryption format');
}

/**
 * Sends a real-time WhatsApp OTP message (Managed via MSG91 widget/API)
 */
export async function sendWhatsAppOtp(
  phone: string,
  otp: string,
  name?: string
): Promise<{ success: boolean; error?: string }> {
  // MSG91 handles live login OTP dispatch
  return { success: true };
}

/**
 * Sends official WhatsApp order confirmation via Meta WhatsApp Cloud API
 */
export async function sendWhatsAppOrderConfirmation(
  payload: OrderConfirmationPayload
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const isEnabled =
    process.env.ENABLE_WACRM === 'true' ||
    process.env.ENABLE_WHATSAPP_ORDER_NOTIFICATIONS === 'true';

  const cleanPhone = formatIndianPhone(payload.phone);

  if (!isEnabled) {
    console.log(`[WhatsApp Notifications Standby] Order #${payload.orderNumber} for +${cleanPhone}`);
    return { success: true };
  }

  try {
    const supabase = createAdminClient();

    // 1. Fetch credentials
    const { data: cfg, error: cfgErr } = await supabase
      .from('whatsapp_config')
      .select('phone_number_id, access_token')
      .eq('account_id', WACRM_ACCOUNT_ID)
      .single();

    if (cfgErr || !cfg?.access_token || !cfg?.phone_number_id) {
      console.warn('[WhatsApp] Credentials not configured in database:', cfgErr?.message);
      return { success: false, error: 'WhatsApp config not found' };
    }

    const token = decryptToken(cfg.access_token, ENCRYPTION_KEY);
    const phoneNumberId = cfg.phone_number_id;

    // 2. Select approved template and populate variables
    const isDigital = payload.isDigital;
    const templateName = isDigital ? 'belesu_digital_orders' : 'belesu_hard_copy_orders';
    const customerName = payload.name || 'Customer';
    const amountStr = `₹${payload.totalAmount}`;

    const parameters = isDigital
      ? [
          { type: 'text', parameter_name: 'customer_name', text: customerName },
          { type: 'text', parameter_name: 'order_number', text: payload.orderNumber },
          { type: 'text', parameter_name: 'guidebook_name', text: payload.itemsSummary },
          { type: 'text', parameter_name: 'total_paid', text: amountStr },
        ]
      : [
          { type: 'text', parameter_name: 'customer_name', text: customerName },
          { type: 'text', parameter_name: 'order_number', text: payload.orderNumber },
          { type: 'text', parameter_name: 'items', text: payload.itemsSummary },
          { type: 'text', parameter_name: 'total_amount', text: amountStr },
        ];

    const body = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: cleanPhone,
      type: 'template',
      template: {
        name: templateName,
        language: { code: 'en' },
        components: [
          {
            type: 'body',
            parameters,
          },
        ],
      },
    };

    const res = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const resJson = await res.json();

    if (!res.ok) {
      console.error(`[WhatsApp] Meta API Error (${res.status}):`, resJson);
      return { success: false, error: resJson?.error?.message || 'Meta API error' };
    }

    const messageId = resJson.messages?.[0]?.id;
    console.log(`✅ [WhatsApp] Sent ${templateName} to +${cleanPhone} (Message ID: ${messageId})`);
    return { success: true, messageId };
  } catch (error: any) {
    console.error('[WhatsApp] Unexpected notification dispatch error:', error?.message || error);
    return { success: false, error: error?.message || 'Internal dispatch error' };
  }
}

/**
 * Contact synchronization stub (no-op)
 */
export async function syncContactToWacrm(
  phone: string,
  name?: string,
  email?: string
): Promise<void> {
  // Contacts are automatically synced via Supabase trigger public.sync_belesu_user_to_crm()
}

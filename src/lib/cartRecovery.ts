/**
 * Abandoned-cart recovery over WhatsApp, using the Meta-approved MARKETING template
 * `belesu___cart___recovery` sent through WACRM's public API, so the message also
 * appears in the CRM chat and replies continue there.
 *
 * Template (approved on Meta):
 *   Header : "Your Belesu Cart is Waiting!"                      (static)
 *   Body   : *Namaskara {{1}}! 🙏* … you added *{{2}}* to your Belesu cart …
 *   Button0: URL  https://belesu.in/cart?recover={{1}}           (cart session id)
 *   Button1: QUICK_REPLY "Complete Order"
 *
 * Templates (unlike free text) may be sent outside WhatsApp's 24-hour window.
 */

export const CART_TEMPLATE_NAME = process.env.WACRM_CART_TEMPLATE || 'belesu___cart___recovery';
export const CART_TEMPLATE_LANGUAGE = process.env.WACRM_CART_TEMPLATE_LANG || 'en';

/** Don't remind the same cart again within this window (unless forced). */
export const RESEND_COOLDOWN_HOURS = 24;

export interface RecoveryCart {
  id: string;
  session_id: string;
  customer_name: string | null;
  customer_phone: string;
  cart_items: { title?: string; quantity?: number }[] | null;
  status: string;
  whatsapp_sent_count: number | null;
  last_whatsapp_sent_at: string | null;
}

/**
 * Meta rejects template parameters containing newlines, tabs or more than four
 * consecutive spaces, and caps their length. Clean every value we send.
 */
function cleanParam(value: string, max: number): string {
  const v = value.replace(/[\r\n\t]+/g, ' ').replace(/ {2,}/g, ' ').trim();
  return v.length > max ? `${v.slice(0, max - 1).trimEnd()}…` : v;
}

/** "+91XXXXXXXXXX" from whatever was stored */
export function toE164India(phone: string): string | null {
  const digits = (phone || '').replace(/\D/g, '');
  const ten = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits.slice(-10);
  return /^[6-9]\d{9}$/.test(ten) ? `+91${ten}` : null;
}

/** First name-ish greeting; falls back to "Parent" */
export function greetingName(name: string | null): string {
  const n = cleanParam(name || '', 40);
  return n && !/^customer$/i.test(n) ? n : 'Parent';
}

/** "Kali Kannada … Class 4" or "Kali Kannada … Class 4 + 1 more" */
export function booksLabel(items: RecoveryCart['cart_items']): string {
  const titles = (items || []).map((i) => (i.title || '').trim()).filter(Boolean);
  if (!titles.length) return 'your Kannada guidebook';
  const first = cleanParam(titles[0], 90);
  return titles.length === 1 ? first : `${first} + ${titles.length - 1} more`;
}

export interface RecoveryMessage {
  to: string;
  contactName: string;
  bodyParams: [string, string];
  sessionId: string;
  recoveryUrl: string;
  /** Exactly what the customer will read — shown in the admin preview */
  previewText: string;
}

export function buildRecoveryMessage(cart: RecoveryCart): RecoveryMessage {
  const to = toE164India(cart.customer_phone);
  if (!to) throw new RecoveryError('This cart has no valid Indian mobile number.', 400);
  if (!/^[\w-]{1,100}$/.test(cart.session_id || '')) {
    throw new RecoveryError('This cart has an invalid recovery session.', 400);
  }
  const name = greetingName(cart.customer_name);
  const books = booksLabel(cart.cart_items);
  const recoveryUrl = `https://belesu.in/cart?recover=${cart.session_id}`;

  const previewText =
    `Your Belesu Cart is Waiting!\n\n` +
    `Namaskara ${name}! 🙏\n` +
    `We noticed you added ${books} to your Belesu cart, but didn't get a chance to complete your order.\n` +
    `We have temporarily reserved your guidebooks for your child's class! 📚\n` +
    `Please let us know if you have any questions or need help with Kannada guidebooks.\n` +
    `Belesu Bookstore Team\n\n` +
    `[Visit website] → ${recoveryUrl}\n[Complete Order]`;

  return { to, contactName: cleanParam(cart.customer_name || name, 80), bodyParams: [name, books], sessionId: cart.session_id, recoveryUrl, previewText };
}

export class RecoveryError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

/** Reasons a reminder should not go out now; null when it may be sent. */
export function sendBlockReason(cart: RecoveryCart, now = Date.now()): string | null {
  if (cart.status === 'recovered') return 'This cart was already recovered (the customer ordered).';
  if (cart.last_whatsapp_sent_at) {
    const hours = (now - new Date(cart.last_whatsapp_sent_at).getTime()) / 3_600_000;
    if (hours < RESEND_COOLDOWN_HOURS) {
      const ago = hours < 1 ? `${Math.max(1, Math.round(hours * 60))} min` : `${Math.round(hours)} h`;
      return `A reminder was already sent ${ago} ago.`;
    }
  }
  return null;
}

/**
 * Sends the template through WACRM (POST /api/v1/messages). Requires
 * WACRM_API_URL and WACRM_API_KEY (scope messages:send) on the server.
 */
export async function sendRecoveryTemplate(msg: RecoveryMessage): Promise<{ conversationId?: string; messageId?: string }> {
  const base = (process.env.WACRM_API_URL || '').replace(/\/+$/, '');
  const key = process.env.WACRM_API_KEY || '';
  if (!base || !key) throw new RecoveryError('WhatsApp sending is not configured (WACRM_API_URL / WACRM_API_KEY).', 503);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20_000);
  try {
    const res = await fetch(`${base}/api/v1/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: msg.to,
        name: msg.contactName,
        type: 'template',
        template: {
          name: CART_TEMPLATE_NAME,
          language: CART_TEMPLATE_LANGUAGE,
          params: { body: msg.bodyParams, buttonParams: { 0: msg.sessionId } },
        },
      }),
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const detail = data?.error?.message || data?.error || `HTTP ${res.status}`;
      if (res.status === 401) throw new RecoveryError('WACRM rejected the API key — check WACRM_API_KEY on the server.', 502);
      throw new RecoveryError(`WhatsApp could not send the reminder: ${detail}`, 502);
    }
    return { conversationId: data?.data?.conversation_id, messageId: data?.data?.message_id };
  } catch (err) {
    if (err instanceof RecoveryError) throw err;
    if ((err as Error)?.name === 'AbortError') throw new RecoveryError('WACRM did not respond in time. Please try again.', 504);
    throw new RecoveryError('Could not reach WACRM. Please try again.', 502);
  } finally {
    clearTimeout(timer);
  }
}

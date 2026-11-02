import nodemailer from 'nodemailer';

export interface OrderItemEmailData {
  title: string;
  quantity: number;
  price: number;
  productType?: string;
  sku?: string;
}

export interface OrderAddressData {
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postcode?: string;
}

export interface OrderEmailPayload {
  orderNumber: string;
  orderDate?: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  items: OrderItemEmailData[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod?: string;
  paymentId?: string;
  razorpayOrderId?: string;
  shippingAddress?: OrderAddressData | null;
  billingAddress?: OrderAddressData | null;
  isDigitalOnly?: boolean;
}

/**
 * Returns a configured Nodemailer transporter or null if SMTP is not configured
 */
function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = process.env.SMTP_USER;
  const rawPass = process.env.SMTP_PASS;

  if (!user || !rawPass) {
    return null;
  }

  // Google App Passwords often contain spaces (e.g. 'abcd efgh ijkl mnop'), remove them
  const pass = rawPass.replace(/\s+/g, '');

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Renders an address card matching the Belesu Delivery Address Card UI (Image 1)
 */
function formatAddressCardHtml(
  addr: OrderAddressData | null | undefined,
  fallbackName: string,
  fallbackPhone?: string,
  fallbackEmail?: string
): string {
  const recipientName =
    addr?.name ||
    [addr?.firstName, addr?.lastName].filter(Boolean).join(' ').trim() ||
    fallbackName ||
    'Customer';
  const address1 = addr?.address1?.trim() || '';
  const address2 = addr?.address2?.trim() || '';
  const city = addr?.city?.trim() || '';
  const state = addr?.state?.trim() || '';
  const postcode = addr?.postcode?.trim() || '';
  const phone = addr?.phone?.trim() || fallbackPhone?.trim() || '';
  const email = addr?.email?.trim() || fallbackEmail?.trim() || '';

  // Compact Indian postal format: City, State - PIN
  let cityStatePin = '';
  if (city && state) {
    cityStatePin = `${city}, ${state}`;
  } else {
    cityStatePin = city || state;
  }
  if (postcode) {
    cityStatePin = cityStatePin ? `${cityStatePin} - <strong>${postcode}</strong>` : `PIN: <strong>${postcode}</strong>`;
  }

  return `
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; text-align: left; box-sizing: border-box;">
      <div style="font-size: 15px; font-weight: 800; color: #0f172a; margin-bottom: 8px; line-height: 130%;">
        ${recipientName}
      </div>
      ${address1 ? `
      <div style="font-size: 13px; color: #334155; line-height: 150%; margin-bottom: 6px;">
        ${address1}
      </div>` : ''}
      ${address2 ? `
      <div style="font-size: 13px; color: #334155; line-height: 150%; margin-bottom: 6px;">
        ${address2}
      </div>` : ''}
      ${cityStatePin ? `
      <div style="font-size: 13px; color: #334155; line-height: 150%; margin-bottom: 8px;">
        ${cityStatePin}
      </div>` : ''}
      ${phone ? `
      <div style="font-size: 13px; font-weight: 700; color: #0f172a; padding-top: 6px; border-top: 1px solid #e2e8f0; margin-top: 6px;">
        📞 <a href="tel:${phone}" style="color: #0f172a; text-decoration: none;">${phone}</a>
      </div>` : ''}
      ${email ? `
      <div style="font-size: 12px; color: #64748b; padding-top: 4px;">
        ✉️ <a href="mailto:${email}" style="color: #64748b; text-decoration: none;">${email}</a>
      </div>` : ''}
    </div>
  `;
}

/**
 * Builds the HTML content for the order notification email
 * Styled to match the classic WooCommerce "New Order" notification email with modern Delivery Card UI
 */
export function buildOrderNotificationHtml(payload: OrderEmailPayload, isAdminNotice = true): string {
  const dateObj = payload.orderDate ? new Date(payload.orderDate) : new Date();
  const dateStr = dateObj.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const itemsRows = payload.items
    .map(
      (item) => `
      <tr>
        <td style="border: 1px solid #e5e5e5; padding: 12px; text-align: left; vertical-align: middle; color: #636363;">
          ${item.title}${item.sku ? ` <span style="color: #8c8c8c;">(#${item.sku})</span>` : ''}
        </td>
        <td style="border: 1px solid #e5e5e5; padding: 12px; text-align: left; vertical-align: middle; color: #636363;">
          ${item.quantity}
        </td>
        <td style="border: 1px solid #e5e5e5; padding: 12px; text-align: left; vertical-align: middle; color: #636363;">
          ₹${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>
    `
    )
    .join('');

  const shippingAddressHtml = payload.isDigitalOnly
    ? `
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; text-align: left; box-sizing: border-box;">
        <div style="font-size: 15px; font-weight: 800; color: #0f172a; margin-bottom: 6px;">${payload.customerName}</div>
        <div style="color: #166534; font-weight: 700; font-size: 13px; margin-bottom: 4px;">💻 Digital E-Reader Instant Access</div>
        <div style="color: #64748b; font-size: 12px; margin-bottom: 8px;">No physical shipping required. Access available in your Belesu account.</div>
        ${payload.customerPhone ? `<div style="font-size: 13px; font-weight: 700; color: #0f172a; padding-top: 6px; border-top: 1px solid #e2e8f0;">📞 ${payload.customerPhone}</div>` : ''}
        ${payload.customerEmail ? `<div style="font-size: 12px; color: #64748b; padding-top: 4px;">✉️ ${payload.customerEmail}</div>` : ''}
      </div>
    `
    : formatAddressCardHtml(
        payload.shippingAddress,
        payload.customerName,
        payload.customerPhone,
        payload.customerEmail
      );

  const billingAddressHtml = formatAddressCardHtml(
    payload.billingAddress || payload.shippingAddress,
    payload.customerName,
    payload.customerPhone,
    payload.customerEmail
  );

  const headingText = isAdminNotice
    ? `New Order: #${payload.orderNumber}`
    : `Thank you for your order: #${payload.orderNumber}`;

  const greetingText = isAdminNotice
    ? `You've received the following order from ${payload.customerName}:`
    : `Your order has been received and is now being processed:`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${headingText}</title>
</head>
<body style="background-color: #f7f7f7; font-family: 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif; margin: 0; padding: 40px 10px; color: #636363; -webkit-font-smoothing: antialiased;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #dedede; border-radius: 3px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.075);">
    
    <!-- Top Header Banner -->
    <div style="background-color: #7f1ae5; padding: 36px 40px; color: #ffffff;">
      <h1 style="color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif; font-size: 26px; font-weight: 500; line-height: 120%; margin: 0; text-align: left;">
        ${headingText}
      </h1>
    </div>

    <!-- Body Container -->
    <div style="padding: 36px 40px 30px;">
      
      <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 150%; color: #636363;">
        ${greetingText}
      </p>

      <p style="margin: 0 0 24px 0; font-size: 15px; font-weight: bold; line-height: 130%;">
        <span style="color: #7f1ae5; text-decoration: underline;">[Order #${payload.orderNumber}]</span>
        <span style="color: #7f1ae5; font-weight: bold;"> (${dateStr})</span>
      </p>

      <!-- Products & Financials Table -->
      <table cellspacing="0" cellpadding="6" style="width: 100%; border: 1px solid #e5e5e5; vertical-align: middle; margin-bottom: 28px; border-collapse: collapse; font-size: 14px; color: #636363;">
        <thead>
          <tr style="background: #fafafa;">
            <th scope="col" style="border: 1px solid #e5e5e5; padding: 12px; text-align: left; color: #636363; font-weight: 700;">
              Product
            </th>
            <th scope="col" style="border: 1px solid #e5e5e5; padding: 12px; text-align: left; color: #636363; font-weight: 700;">
              Quantity
            </th>
            <th scope="col" style="border: 1px solid #e5e5e5; padding: 12px; text-align: left; color: #636363; font-weight: 700;">
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
          <tr>
            <th scope="row" colspan="2" style="border: 1px solid #e5e5e5; padding: 12px; text-align: left; font-weight: 700; color: #636363;">
              Subtotal:
            </th>
            <td style="border: 1px solid #e5e5e5; padding: 12px; text-align: left; color: #636363;">
              ₹${payload.subtotal.toFixed(2)}
            </td>
          </tr>
          <tr>
            <th scope="row" colspan="2" style="border: 1px solid #e5e5e5; padding: 12px; text-align: left; font-weight: 700; color: #636363;">
              Shipping:
            </th>
            <td style="border: 1px solid #e5e5e5; padding: 12px; text-align: left; color: #636363;">
              ${payload.shippingFee > 0 ? `₹${payload.shippingFee.toFixed(2)} via Flat rate` : 'Free shipping'}
            </td>
          </tr>
          <tr>
            <th scope="row" colspan="2" style="border: 1px solid #e5e5e5; padding: 12px; text-align: left; font-weight: 700; color: #636363;">
              Payment method:
            </th>
            <td style="border: 1px solid #e5e5e5; padding: 12px; text-align: left; color: #636363;">
              ${payload.paymentMethod || 'Credit Card/Debit Card/NetBanking'}
            </td>
          </tr>
          <tr>
            <th scope="row" colspan="2" style="border: 1px solid #e5e5e5; padding: 12px; text-align: left; font-weight: 700; color: #636363;">
              Total:
            </th>
            <td style="border: 1px solid #e5e5e5; padding: 12px; text-align: left; font-weight: 700; color: #636363;">
              ₹${payload.totalAmount.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Addresses Section -->
      <table cellspacing="0" cellpadding="0" style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr>
          <td style="width: 48%; vertical-align: top; padding-right: 2%;">
            <h2 style="color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 800; line-height: 130%; margin: 0 0 10px 0;">
              Billing Address
            </h2>
            ${billingAddressHtml}
          </td>
          <td style="width: 48%; vertical-align: top; padding-left: 2%;">
            <h2 style="color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 800; line-height: 130%; margin: 0 0 10px 0;">
              Delivery Address
            </h2>
            ${shippingAddressHtml}
          </td>
        </tr>
      </table>

      <!-- Footer Message -->
      <p style="margin: 24px 0 6px 0; font-size: 13px; color: #636363;">
        Congratulations on the sale.
      </p>
      <p style="margin: 0; font-size: 11px; color: #999999;">
        Process your orders on the go. Belesu Bookstore · Ckelp Technologies Private Limited
      </p>

    </div>

  </div>
</body>
</html>
  `;
}

/**
 * Resolves the admin notification recipient emails.
 * Supports comma-separated strings in ADMIN_NOTIFICATION_EMAIL.
 * Guarantees that orderforbelesu@gmail.com and rosemeary45@gmail.com are included
 * so alerts always reach both administrative addresses even if VPS env variables vary.
 */
export function getAdminRecipients(): string[] {
  const envVal = process.env.ADMIN_NOTIFICATION_EMAIL;
  const emails: string[] = [];

  if (envVal && envVal.trim()) {
    envVal.split(',').forEach((e) => {
      const trimmed = e.trim().toLowerCase();
      if (trimmed && !emails.includes(trimmed)) {
        emails.push(trimmed);
      }
    });
  }

  // Always ensure both client and store management addresses are included
  const defaultRecipients = ['orderforbelesu@gmail.com', 'rosemeary45@gmail.com'];
  for (const def of defaultRecipients) {
    if (!emails.includes(def)) {
      emails.push(def);
    }
  }

  // Include SMTP_USER if configured
  if (process.env.SMTP_USER) {
    const smtpUser = process.env.SMTP_USER.trim().toLowerCase();
    if (smtpUser && !emails.includes(smtpUser)) {
      emails.push(smtpUser);
    }
  }

  return emails;
}

/**
 * Sends an email notification to the store administrator / client on every new order.
 * Safe & non-blocking: Never throws, logs warnings if SMTP is unconfigured.
 */
export async function sendAdminOrderNotification(
  payload: OrderEmailPayload
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const transporter = getTransporter();

    if (!transporter) {
      console.warn(
        `[email] SMTP is not configured (SMTP_USER or SMTP_PASS missing). Skipped email notification for order #${payload.orderNumber}.`
      );
      return { success: false, error: 'SMTP credentials not configured in .env.local' };
    }

    const recipients = getAdminRecipients();
    if (recipients.length === 0) {
      console.warn(`[email] No admin notification recipients configured.`);
      return { success: false, error: 'No recipient email configured' };
    }

    const senderEmail = process.env.SMTP_FROM || `"Belesu Orders" <${process.env.SMTP_USER}>`;
    const subject = `[Belesu] New order #${payload.orderNumber}`;

    const html = buildOrderNotificationHtml(payload, true);

    console.log(`[email] Dispatching admin notification for order #${payload.orderNumber} to:`, recipients);

    const info = await transporter.sendMail({
      from: senderEmail,
      to: recipients,
      subject,
      html,
    });

    console.log(
      `[email] Admin notification sent successfully for order #${payload.orderNumber}. ` +
      `MessageId: ${info.messageId}, Accepted: ${JSON.stringify(info.accepted)}, Rejected: ${JSON.stringify(info.rejected)}`
    );
    return { success: true, messageId: info.messageId };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`[email] Failed to send admin order notification for order #${payload.orderNumber}:`, errorMsg);
    return { success: false, error: errorMsg };
  }
}

/**
 * Sends an order confirmation receipt to the customer (if they provided an email address).
 */
export async function sendCustomerOrderReceipt(
  payload: OrderEmailPayload
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!payload.customerEmail) {
    return { success: false, error: 'No customer email provided' };
  }

  try {
    const transporter = getTransporter();
    if (!transporter) {
      return { success: false, error: 'SMTP not configured' };
    }

    const senderEmail = process.env.SMTP_FROM || `"Belesu Bookstore" <${process.env.SMTP_USER}>`;
    const subject = `Order Confirmed! Your Belesu Order #${payload.orderNumber}`;
    const html = buildOrderNotificationHtml(payload, false);

    const info = await transporter.sendMail({
      from: senderEmail,
      to: payload.customerEmail,
      subject,
      html,
    });

    console.log(`[email] Customer receipt sent to ${payload.customerEmail} for order #${payload.orderNumber}.`);
    return { success: true, messageId: info.messageId };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`[email] Failed to send customer receipt to ${payload.customerEmail}:`, errorMsg);
    return { success: false, error: errorMsg };
  }
}


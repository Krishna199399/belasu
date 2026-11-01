import nodemailer from 'nodemailer';

export interface OrderItemEmailData {
  title: string;
  quantity: number;
  price: number;
  productType?: string;
  sku?: string;
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
  shippingAddress?: {
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    postcode?: string;
  } | null;
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
 * Builds the HTML content for the order notification email
 * Styled to match the classic WooCommerce "New Order" notification email
 */
function buildOrderNotificationHtml(payload: OrderEmailPayload, isAdminNotice = true): string {
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

  const addr = payload.shippingAddress;
  const addressLines = addr
    ? [
        addr.address1,
        addr.address2,
        addr.city,
        addr.state,
        addr.postcode,
      ].filter(Boolean)
    : [];

  const shippingAddressHtml = payload.isDigitalOnly
    ? `
      <div style="line-height: 160%;">
        <strong>${payload.customerName}</strong><br/>
        <span style="color: #166534; font-weight: bold;">Digital E-Reader Instant Access</span><br/>
        No physical shipping required.<br/>
        ${payload.customerPhone ? `<a href="tel:${payload.customerPhone}" style="color: #7f1ae5; text-decoration: underline;">${payload.customerPhone}</a><br/>` : ''}
        ${payload.customerEmail ? `<a href="mailto:${payload.customerEmail}" style="color: #7f1ae5; text-decoration: underline;">${payload.customerEmail}</a>` : ''}
      </div>
    `
    : `
      <div style="line-height: 160%;">
        <strong>${payload.customerName}</strong><br/>
        ${addressLines.join('<br/>')}<br/>
        ${payload.customerPhone ? `<a href="tel:${payload.customerPhone}" style="color: #7f1ae5; text-decoration: underline;">${payload.customerPhone}</a>` : ''}
      </div>
    `;

  const billingAddressHtml = `
    <div style="line-height: 160%;">
      <strong>${payload.customerName}</strong><br/>
      ${addressLines.length > 0 ? `${addressLines.join('<br/>')}<br/>` : ''}
      ${payload.customerPhone ? `<a href="tel:${payload.customerPhone}" style="color: #7f1ae5; text-decoration: underline;">${payload.customerPhone}</a><br/>` : ''}
      ${payload.customerEmail ? `<a href="mailto:${payload.customerEmail}" style="color: #7f1ae5; text-decoration: underline;">${payload.customerEmail}</a>` : ''}
    </div>
  `;

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
            <h2 style="color: #7f1ae5; font-family: 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif; font-size: 16px; font-weight: bold; line-height: 130%; margin: 0 0 10px 0;">
              Billing address
            </h2>
            <div style="border: 1px solid #e5e5e5; padding: 12px; font-size: 13px; color: #636363; font-style: normal;">
              ${billingAddressHtml}
            </div>
          </td>
          <td style="width: 48%; vertical-align: top; padding-left: 2%;">
            <h2 style="color: #7f1ae5; font-family: 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif; font-size: 16px; font-weight: bold; line-height: 130%; margin: 0 0 10px 0;">
              Shipping address
            </h2>
            <div style="border: 1px solid #e5e5e5; padding: 12px; font-size: 13px; color: #636363; font-style: normal;">
              ${shippingAddressHtml}
            </div>
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

    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.SMTP_USER;
    if (!adminEmail) {
      console.warn(`[email] No ADMIN_NOTIFICATION_EMAIL specified.`);
      return { success: false, error: 'No recipient email configured' };
    }

    const senderEmail = process.env.SMTP_FROM || `"Belesu Orders" <${process.env.SMTP_USER}>`;
    const subject = `[Belesu] New order #${payload.orderNumber}`;

    const html = buildOrderNotificationHtml(payload, true);

    const info = await transporter.sendMail({
      from: senderEmail,
      to: adminEmail,
      subject,
      html,
    });

    console.log(`[email] Admin notification sent successfully for order #${payload.orderNumber}. MessageId: ${info.messageId}`);
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


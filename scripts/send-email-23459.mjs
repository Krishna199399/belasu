/**
 * send-email-23459.mjs
 * One-time script: send admin notification + customer receipt for order #23459
 * Admin:    orderofbelesu@gmail.com  (as requested)
 * Customer: leemarosse@gmail.com
 */

import nodemailer from 'nodemailer';

// ── SMTP Config (from .env.local) ─────────────────────────────────────────────
const SMTP_HOST = 'smtp.gmail.com';
const SMTP_PORT = 465;
const SMTP_USER = 'belesuckelp@gmail.com';
const SMTP_PASS = 'fbfehaxyltaynpwl'; // spaces removed from app password

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: true,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

// ── Order #23459 Details ──────────────────────────────────────────────────────
const ORDER = {
  orderNumber: '23459',
  orderDate:   '2026-11-12T12:17:00Z',   // 5:47 PM IST
  customerName: 'Limarose',
  customerPhone: '9894737528',
  customerEmail: 'leemarosse@gmail.com',
  paymentMethod: 'Razorpay - UPI',
  paymentId:     'pay_TzGEWJzrN5gmaA',
  razorpayOrderId: 'order_TzGELyp1QyF7Eo',
  items: [{
    title:       'Kannada Class 6 — Complete English-Translated Digital Guidebook',
    quantity:    1,
    price:       295,
    productType: 'digital',
    sku:         'SD6-KN',
  }],
  subtotal:    295,
  shippingFee: 0,
  totalAmount: 295,
  isDigitalOnly: true,
};

// ── HTML Builder ──────────────────────────────────────────────────────────────
function buildHtml(isAdmin) {
  const dateStr = new Date(ORDER.orderDate).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });

  const heading = isAdmin
    ? `New Order: #${ORDER.orderNumber}`
    : `Thank you for your order: #${ORDER.orderNumber}`;

  const greeting = isAdmin
    ? `You've received the following order from ${ORDER.customerName}:`
    : `Your order has been received and is now being processed:`;

  const deliveryBlock = `
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;font-family:sans-serif;">
      <div style="font-size:15px;font-weight:800;color:#0f172a;margin-bottom:6px;">${ORDER.customerName}</div>
      <div style="color:#166534;font-weight:700;font-size:13px;margin-bottom:4px;">💻 Digital E-Reader Instant Access</div>
      <div style="color:#64748b;font-size:12px;margin-bottom:8px;">No physical shipping required. Access available in Belesu account.</div>
      <div style="font-size:13px;font-weight:700;color:#0f172a;padding-top:6px;border-top:1px solid #e2e8f0;">📞 ${ORDER.customerPhone}</div>
      <div style="font-size:12px;color:#64748b;padding-top:4px;">✉️ ${ORDER.customerEmail}</div>
    </div>`;

  const footer = isAdmin
    ? `<p style="margin:24px 0 6px 0;font-size:13px;color:#636363;">Congratulations on the sale.</p>
       <p style="margin:0;font-size:11px;color:#999;">Process your orders on the go. Belesu Bookstore · Ckelp Technologies Private Limited</p>`
    : `<p style="margin:24px 0 6px 0;font-size:13px;color:#636363;">Thank you for choosing Belesu! For any assistance, reach out to us at <a href="mailto:belesuckelp@gmail.com" style="color:#7f1ae5;font-weight:700;">belesuckelp@gmail.com</a>.</p>
       <p style="margin:0;font-size:11px;color:#999;">Belesu Bookstore · Ckelp Technologies Private Limited</p>`;

  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${heading}</title></head>
<body style="background:#f7f7f7;font-family:'Helvetica Neue',Helvetica,Roboto,Arial,sans-serif;margin:0;padding:40px 10px;color:#636363;">
<div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #dedede;border-radius:3px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.075);">

  <div style="background:#7f1ae5;padding:36px 40px;color:#fff;">
    <h1 style="color:#fff;font-size:26px;font-weight:500;margin:0;">${heading}</h1>
  </div>

  <div style="padding:36px 40px 30px;">
    <p style="margin:0 0 16px 0;font-size:14px;">${greeting}</p>
    <p style="margin:0 0 24px 0;font-size:15px;font-weight:bold;">
      <span style="color:#7f1ae5;text-decoration:underline;">[Order #${ORDER.orderNumber}]</span>
      <span style="color:#7f1ae5;"> (${dateStr})</span>
    </p>

    <table cellspacing="0" cellpadding="6" style="width:100%;border:1px solid #e5e5e5;border-collapse:collapse;font-size:14px;margin-bottom:28px;">
      <thead><tr style="background:#fafafa;">
        <th style="border:1px solid #e5e5e5;padding:12px;text-align:left;">Product</th>
        <th style="border:1px solid #e5e5e5;padding:12px;text-align:left;">Quantity</th>
        <th style="border:1px solid #e5e5e5;padding:12px;text-align:left;">Price</th>
      </tr></thead>
      <tbody>
        <tr>
          <td style="border:1px solid #e5e5e5;padding:12px;">Kannada Class 6 — Complete English-Translated Digital Guidebook <span style="color:#8c8c8c;">(#SD6-KN)</span></td>
          <td style="border:1px solid #e5e5e5;padding:12px;">1</td>
          <td style="border:1px solid #e5e5e5;padding:12px;">₹295.00</td>
        </tr>
        <tr><th colspan="2" style="border:1px solid #e5e5e5;padding:12px;text-align:left;font-weight:700;">Subtotal:</th><td style="border:1px solid #e5e5e5;padding:12px;">₹295.00</td></tr>
        <tr><th colspan="2" style="border:1px solid #e5e5e5;padding:12px;text-align:left;font-weight:700;">Shipping:</th><td style="border:1px solid #e5e5e5;padding:12px;">Free shipping</td></tr>
        <tr><th colspan="2" style="border:1px solid #e5e5e5;padding:12px;text-align:left;font-weight:700;">Payment method:</th><td style="border:1px solid #e5e5e5;padding:12px;">Razorpay - UPI</td></tr>
        <tr><th colspan="2" style="border:1px solid #e5e5e5;padding:12px;text-align:left;font-weight:700;">Total:</th><td style="border:1px solid #e5e5e5;padding:12px;font-weight:700;">₹295.00</td></tr>
      </tbody>
    </table>

    <table cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;margin-bottom:24px;">
      <tr>
        <td style="width:48%;vertical-align:top;padding-right:2%;">
          <h2 style="font-size:16px;font-weight:800;color:#0f172a;margin:0 0 10px 0;">Billing Address</h2>
          ${deliveryBlock}
        </td>
        <td style="width:48%;vertical-align:top;padding-left:2%;">
          <h2 style="font-size:16px;font-weight:800;color:#0f172a;margin:0 0 10px 0;">Delivery Address</h2>
          ${deliveryBlock}
        </td>
      </tr>
    </table>

    ${footer}
  </div>
</div>
</body></html>`;
}

// ── Send ──────────────────────────────────────────────────────────────────────
async function run() {
  // Verify SMTP connection first
  console.log('🔌 Verifying SMTP connection...');
  await transporter.verify();
  console.log('✅ SMTP connection OK');

  // 1. Admin email → orderofbelesu@gmail.com (as requested) + orderforbelesu@gmail.com (default)
  console.log('\n📧 Sending admin notification → orderofbelesu@gmail.com ...');
  const adminInfo = await transporter.sendMail({
    from: '"Belesu Bookstore" <belesuckelp@gmail.com>',
    replyTo: 'belesuckelp@gmail.com',
    to: ['orderofbelesu@gmail.com', 'orderforbelesu@gmail.com'],
    subject: `[Belesu] New order #23459`,
    html: buildHtml(true),
  });
  console.log('✅ Admin email sent! MessageId:', adminInfo.messageId);
  console.log('   Accepted:', adminInfo.accepted);
  console.log('   Rejected:', adminInfo.rejected);

  // 2. Customer receipt → leemarosse@gmail.com
  console.log('\n📧 Sending customer receipt → leemarosse@gmail.com ...');
  const customerInfo = await transporter.sendMail({
    from: '"Belesu Bookstore" <belesuckelp@gmail.com>',
    replyTo: 'belesuckelp@gmail.com',
    to: 'leemarosse@gmail.com',
    subject: `Order Confirmed! Your Belesu Order #23459`,
    html: buildHtml(false),
  });
  console.log('✅ Customer receipt sent! MessageId:', customerInfo.messageId);
  console.log('   Accepted:', customerInfo.accepted);
  console.log('   Rejected:', customerInfo.rejected);

  console.log('\n🎉 All emails dispatched successfully for Order #23459');
}

run().catch((err) => {
  console.error('❌ Email dispatch failed:', err.message);
  process.exit(1);
});


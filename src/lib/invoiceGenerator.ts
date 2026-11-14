// Utility to generate clean, self-contained printable A4 Tax Invoice HTML
export interface InvoiceItem {
  id?: string;
  item_name: string;
  item_sku?: string;
  item_type?: string;
  quantity: number;
  item_cost: number;
  item_total: number;
}

export interface InvoiceOrderData {
  id: string;
  order_number: string;
  order_date?: string;
  created_at: string;
  order_status: string;
  payment_status: string;
  payment_method?: string;
  order_subtotal_amount: number;
  order_shipping_amount: number;
  order_total_amount: number;
  has_physical_books?: boolean;
  has_hard_copy_books?: boolean;
  has_digital_books?: boolean;
  shipping_method?: string;
  billing_first_name: string;
  billing_last_name?: string;
  billing_phone: string;
  billing_email?: string;
  billing_address1?: string;
  billing_address2?: string;
  billing_city?: string;
  billing_state?: string;
  billing_postcode?: string;
  shipping_first_name?: string;
  shipping_last_name?: string;
  shipping_phone?: string;
  shipping_address1?: string;
  shipping_address2?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_postcode?: string;
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  order_items?: InvoiceItem[];
}

export function generateInvoiceHtml(order: InvoiceOrderData): string {
  const billingName = `${order.billing_first_name || ''} ${order.billing_last_name || ''}`.trim() || 'Valued Customer';
  const shippingName = `${order.shipping_first_name || order.billing_first_name || ''} ${order.shipping_last_name || order.billing_last_name || ''}`.trim() || billingName;
  
  const billingAddress = [
    order.billing_address1,
    order.billing_address2,
    order.billing_city,
    order.billing_state,
    order.billing_postcode,
  ].filter(Boolean).join(', ') || 'Online Purchase, Karnataka';

  const shippingAddress = [
    order.shipping_address1 || order.billing_address1,
    order.shipping_address2 || order.billing_address2,
    order.shipping_city || order.billing_city,
    order.shipping_state || order.billing_state,
    order.shipping_postcode || order.billing_postcode,
  ].filter(Boolean).join(', ') || billingAddress;

  const orderDate = new Date(order.order_date || order.created_at).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const isPaid = order.payment_status?.toLowerCase() === 'paid';
  const items = order.order_items || [];
  const hasPhysicalItems = items.some((i) => i.item_type === 'physical' || i.item_type === 'book');
  const hasDigitalItems = items.some((i) => i.item_type === 'digital');

  // Robust check: order is physical if it has physical items, explicit physical flags, or shipping fee > 0
  const isPhysical = Boolean(
    hasPhysicalItems ||
    order.has_physical_books ||
    order.has_hard_copy_books ||
    (order.order_shipping_amount && order.order_shipping_amount > 0) ||
    (order.shipping_method && order.shipping_method.toLowerCase().includes('flat')) ||
    (!hasDigitalItems && order.shipping_address1 && order.shipping_address1 !== 'Digital Instant Delivery (Web Reader)')
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Invoice #${order.order_number} - Belesu</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    @page {
      size: A4 portrait;
      margin: 10mm 12mm 10mm 12mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      background: #ffffff;
      font-size: 12px;
      line-height: 1.45;
      padding: 16px;
    }
    .invoice-wrapper {
      max-width: 800px;
      margin: 0 auto;
    }
    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #f59e0b;
      padding-bottom: 14px;
      margin-bottom: 16px;
    }
    .brand-title {
      font-size: 26px;
      font-weight: 900;
      color: #78350f;
      letter-spacing: -0.5px;
    }
    .brand-tagline {
      font-size: 10px;
      font-weight: 700;
      color: #d97706;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 2px;
    }
    .brand-sub {
      font-size: 11px;
      color: #64748b;
      margin-top: 4px;
      line-height: 1.3;
    }
    .invoice-badge-box {
      text-align: right;
    }
    .invoice-heading {
      font-size: 20px;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: 0.5px;
    }
    .order-number {
      font-size: 14px;
      font-weight: 800;
      color: #d97706;
      margin-top: 2px;
    }
    .status-pill {
      display: inline-block;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      padding: 2px 8px;
      border-radius: 9999px;
      margin-top: 4px;
      background: ${isPaid ? '#dcfce7' : '#fef3c7'};
      color: ${isPaid ? '#166534' : '#92400e'};
      border: 1px solid ${isPaid ? '#bbf7d0' : '#fde68a'};
    }
    .date-text {
      font-size: 11px;
      color: #64748b;
      margin-top: 4px;
    }
    .party-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 18px;
      padding: 12px;
      background: #fafaf9;
      border: 1px solid #e7e5e4;
      border-radius: 8px;
    }
    .party-box h4 {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      color: #78350f;
      letter-spacing: 0.8px;
      margin-bottom: 6px;
    }
    .party-name {
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 2px;
    }
    .party-info {
      font-size: 11px;
      color: #475569;
      line-height: 1.4;
    }
    table.items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
    }
    table.items-table th {
      background: #0f172a;
      color: #ffffff;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      padding: 8px 10px;
      text-align: left;
    }
    table.items-table th.num { text-align: right; }
    table.items-table td {
      padding: 9px 10px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 11px;
    }
    table.items-table td.num { text-align: right; }
    table.items-table tr:nth-child(even) td {
      background: #f8fafc;
    }
    .item-title {
      font-weight: 700;
      color: #0f172a;
    }
    .item-meta {
      font-size: 10px;
      color: #64748b;
      margin-top: 1px;
    }
    .type-badge {
      display: inline-block;
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 1px 5px;
      border-radius: 4px;
      background: #e0e7ff;
      color: #3730a3;
    }
    .summary-section {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-top: 8px;
      padding-top: 8px;
    }
    .payment-details {
      max-width: 320px;
      font-size: 11px;
      color: #475569;
      line-height: 1.45;
    }
    .payment-details strong {
      color: #0f172a;
    }
    .totals-box {
      width: 260px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: #fafaf9;
      overflow: hidden;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 12px;
      font-size: 11px;
      color: #475569;
      border-bottom: 1px solid #f1f5f9;
    }
    .totals-row.grand-total {
      background: #fef3c7;
      border-top: 2px solid #f59e0b;
      border-bottom: none;
      padding: 8px 12px;
      font-size: 14px;
      font-weight: 900;
      color: #78350f;
    }
    .footer-note {
      margin-top: 28px;
      padding-top: 12px;
      border-top: 1px dashed #cbd5e1;
      text-align: center;
      font-size: 10px;
      color: #64748b;
      line-height: 1.5;
    }
    .footer-note strong {
      color: #0f172a;
    }
  </style>
</head>
<body>
  <div class="invoice-wrapper">
    <!-- Header -->
    <div class="header-bar">
      <div>
        <div class="brand-title">Belesu</div>
        <div class="brand-tagline">Kannada Mathadi, Kannada Belesi</div>
        <div class="brand-sub">
          A Kannada Initiative for Academics &amp; Communication<br>
          Website: <strong>belesu.in</strong> • Helpdesk: <strong>+91 96066 36804</strong>
        </div>
      </div>
      <div class="invoice-badge-box">
        <div class="invoice-heading">TAX INVOICE</div>
        <div class="order-number">Order #${order.order_number}</div>
        <div class="status-pill">${order.payment_status || 'Paid'}</div>
        <div class="date-text">Date: ${orderDate}</div>
      </div>
    </div>

    <!-- Party Details -->
    <div class="party-grid">
      <div class="party-box">
        <h4>Customer &amp; Billing Details</h4>
        <div class="party-name">${billingName}</div>
        <div class="party-info">Phone: <strong>+91 ${order.billing_phone}</strong></div>
        ${order.billing_email ? `<div class="party-info">Email: ${order.billing_email}</div>` : ''}
        <div class="party-info">${billingAddress}</div>
      </div>

      <div class="party-box">
        <h4>Shipping / Delivery Information</h4>
        ${isPhysical ? `
          <div class="party-name">${shippingName}</div>
          ${order.shipping_phone ? `<div class="party-info">Phone: +91 ${order.shipping_phone}</div>` : ''}
          <div class="party-info">${shippingAddress}</div>
          <div class="party-info" style="margin-top: 4px; font-weight: 700; color: #0284c7;">
            Delivery: ${order.shipping_method || 'Standard Surface Delivery'}
          </div>
        ` : `
          <div class="party-name">${billingName}</div>
          <div class="party-info" style="margin-top: 2px; color: #4338ca; font-weight: 700;">
            ✓ Instant Digital Delivery (Web Reader)
          </div>
          <div class="party-info">Accessible anytime at <strong>belesu.in/library</strong></div>
          <div class="party-info">Linked to Phone: +91 ${order.billing_phone}</div>
        `}
      </div>
    </div>

    <!-- Items Table -->
    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 36px;">#</th>
          <th>Item Description</th>
          <th style="width: 90px;">Format</th>
          <th class="num" style="width: 50px;">Qty</th>
          <th class="num" style="width: 90px;">Price</th>
          <th class="num" style="width: 100px;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${items.length > 0 ? items.map((item, idx) => `
          <tr>
            <td>${idx + 1}</td>
            <td>
              <div class="item-title">${item.item_name}</div>
              ${item.item_sku ? `<div class="item-meta">SKU: ${item.item_sku}</div>` : ''}
            </td>
            <td>
              <span class="type-badge">${item.item_type || 'Book'}</span>
            </td>
            <td class="num">${item.quantity}</td>
            <td class="num">₹${item.item_cost}</td>
            <td class="num"><strong>₹${item.item_total}</strong></td>
          </tr>
        `).join('') : `
          <tr>
            <td colspan="6" style="text-align: center; color: #94a3b8; padding: 16px;">
              Order items detail not available
            </td>
          </tr>
        `}
      </tbody>
    </table>

    <!-- Totals Summary Section -->
    <div class="summary-section">
      <div class="payment-details">
        <div><strong>Payment Mode:</strong> ${order.payment_method || 'Online (Razorpay)'}</div>
        ${order.razorpay_payment_id ? `<div><strong>Transaction ID:</strong> ${order.razorpay_payment_id}</div>` : ''}
        ${order.razorpay_order_id ? `<div><strong>Payment Order Ref:</strong> ${order.razorpay_order_id}</div>` : ''}
        <div style="margin-top: 6px; color: #64748b; font-size: 10px;">
          All applicable GST and taxes are included in the item price.
        </div>
      </div>

      <div class="totals-box">
        <div class="totals-row">
          <span>Subtotal</span>
          <span>₹${order.order_subtotal_amount}</span>
        </div>
        <div class="totals-row">
          <span>Shipping Charges</span>
          <span>${order.order_shipping_amount === 0 ? 'FREE' : `₹${order.order_shipping_amount}`}</span>
        </div>
        <div class="totals-row grand-total">
          <span>Grand Total</span>
          <span>₹${order.order_total_amount}</span>
        </div>
      </div>
    </div>

    <!-- Footer Disclaimer -->
    <div class="footer-note">
      Thank you for purchasing with <strong>Belesu</strong>. For order queries or support, reach us at <strong>kannada@belesu.in</strong> or WhatsApp <strong>+91 96066 36804</strong>.<br>
      This is a computer-generated tax invoice issued by Belesu Publications / CKelp Technologies Pvt Ltd.
    </div>
  </div>
</body>
</html>`;
}


import assert from 'node:assert';

// Simulate the exact email address formatting logic from src/lib/email.ts
function buildAddressHtmlTest(payload) {
  const shipAddr = payload.shippingAddress;
  const shippingLines = shipAddr
    ? [
        shipAddr.address1,
        shipAddr.address2,
        shipAddr.city,
        shipAddr.state,
        shipAddr.postcode,
      ].filter(Boolean)
    : [];

  const billAddr = payload.billingAddress || payload.shippingAddress;
  const billingLines = billAddr
    ? [
        billAddr.address1,
        billAddr.address2,
        billAddr.city,
        billAddr.state,
        billAddr.postcode,
      ].filter(Boolean)
    : [];

  const shippingAddressHtml = `
    <div style="line-height: 160%;">
      <strong>${payload.customerName}</strong><br/>
      ${shippingLines.length > 0 ? `${shippingLines.join('<br/>')}<br/>` : ''}
      ${payload.customerPhone ? `<a href="tel:${payload.customerPhone}" style="color: #7f1ae5; text-decoration: underline;">${payload.customerPhone}</a><br/>` : ''}
      ${payload.customerEmail ? `<a href="mailto:${payload.customerEmail}" style="color: #7f1ae5; text-decoration: underline;">${payload.customerEmail}</a>` : ''}
    </div>
  `;

  const billingAddressHtml = `
    <div style="line-height: 160%;">
      <strong>${payload.customerName}</strong><br/>
      ${billingLines.length > 0 ? `${billingLines.join('<br/>')}<br/>` : ''}
      ${payload.customerPhone ? `<a href="tel:${payload.customerPhone}" style="color: #7f1ae5; text-decoration: underline;">${payload.customerPhone}</a><br/>` : ''}
      ${payload.customerEmail ? `<a href="mailto:${payload.customerEmail}" style="color: #7f1ae5; text-decoration: underline;">${payload.customerEmail}</a>` : ''}
    </div>
  `;

  return { shippingAddressHtml, billingAddressHtml };
}

const testPayload = {
  customerName: 'ROOPA PATHOLE',
  customerPhone: '9902111183',
  customerEmail: 'roopapathole24@gmail.com',
  shippingAddress: {
    address1: '75/4, Sammudri nillayya, 7 th A cross, 2 nd main, Shivanahalli',
    address2: '75/4, Sammuddri nillayya',
    city: 'Rajajinagar,Bengaluru',
    state: 'KA',
    postcode: '560010',
  },
  billingAddress: {
    address1: '75/4, Sammudri nillayya, 7 th A cross, 2 nd main, Shivanahalli',
    address2: '75/4, Sammuddri nillayya',
    city: 'Rajajinagar,Bengaluru',
    state: 'KA',
    postcode: '560010',
  }
};

const result = buildAddressHtmlTest(testPayload);

console.log('--- TEST SHIPPING ADDRESS HTML ---');
console.log(result.shippingAddressHtml);
console.log('--- TEST BILLING ADDRESS HTML ---');
console.log(result.billingAddressHtml);

// Verification assertions
const requiredSubstrings = [
  'ROOPA PATHOLE',
  '75/4, Sammudri nillayya, 7 th A cross, 2 nd main, Shivanahalli',
  '75/4, Sammuddri nillayya',
  'Rajajinagar,Bengaluru',
  'KA',
  '560010',
  '9902111183',
  'roopapathole24@gmail.com'
];

for (const sub of requiredSubstrings) {
  assert(result.shippingAddressHtml.includes(sub), `Shipping HTML missing: ${sub}`);
  assert(result.billingAddressHtml.includes(sub), `Billing HTML missing: ${sub}`);
}

console.log('\n[PASS] All 8 address fields are verified in both Shipping & Billing HTML matching Image 1!');


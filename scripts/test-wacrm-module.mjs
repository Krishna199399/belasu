import fs from 'fs';
import path from 'path';

// Load .env.local manually for standalone script test
const envPath = path.resolve('.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const k = trimmed.slice(0, idx).trim();
        const v = trimmed.slice(idx + 1).trim();
        process.env[k] = v;
      }
    }
  }
}

process.env.ENABLE_WHATSAPP_ORDER_NOTIFICATIONS = 'true';

const { sendWhatsAppOrderConfirmation } = await import('../src/lib/wacrm.ts');

async function testModule() {
  console.log('1. Testing Hard Copy Order to 8105829199...');
  const res1 = await sendWhatsAppOrderConfirmation({
    phone: '8105829199',
    name: 'Krishna',
    orderNumber: '23459',
    itemsSummary: 'Savi Kannada Class 1',
    totalAmount: 250,
    isDigital: false,
  });
  console.log('Hard Copy Result:', res1);

  console.log('\n2. Testing Digital Order to 7353648428...');
  const res2 = await sendWhatsAppOrderConfirmation({
    phone: '7353648428',
    name: 'Krishna',
    orderNumber: '23459',
    itemsSummary: 'Kannada Class 6 Digital Guidebook',
    totalAmount: 295,
    isDigital: true,
  });
  console.log('Digital Result:', res2);
}

testModule().catch(console.error);

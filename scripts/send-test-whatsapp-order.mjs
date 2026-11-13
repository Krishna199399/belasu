import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  'https://sjqccpysjxkmnfttoqgf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqcWNjcHlzanhrbW5mdHRvcWdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjA4MzM2MSwiZXhwIjoyMTA3NjU5MzYxfQ.9i6uceidgK58udlIkjT9-mwC5m6JyzOu5s9i5m_qw5I'
);

const ENCRYPTION_KEY = 'fa27331b6e7dded1a2ff99c9a42aad69b208f8ed5a204a19929c7c93a3bb4483';

async function sendTest() {
  const targetPhoneArg = process.argv[2] || '9148155350';
  const typeArg = process.argv[3] || 'hard_copy'; // 'hard_copy' | 'digital'

  // Clean phone to digits (Indian format without +)
  let cleanPhone = targetPhoneArg.replace(/\D/g, '');
  if (cleanPhone.length === 10) cleanPhone = `91${cleanPhone}`;

  console.log(`\n======================================================`);
  console.log(`🚀 BELASU META WHATSAPP TEST DISPATCHER`);
  console.log(`Target Phone: +${cleanPhone}`);
  console.log(`Template Type: ${typeArg}`);
  console.log(`======================================================\n`);

  // 1. Fetch credentials
  const { data: cfg, error: cfgErr } = await sb
    .from('whatsapp_config')
    .select('*')
    .eq('account_id', '7d87d718-75b1-4cda-8df5-1f2780f45cd7')
    .single();

  if (cfgErr || !cfg) throw new Error('WhatsApp config not found in database');

  // 2. Decrypt Meta access token
  const parts = cfg.access_token.split(':');
  const [ivHex, ctHex, tagHex] = parts;
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  decipher.setAuthTag(tag);
  let token = decipher.update(ctHex, 'hex', 'utf8');
  token += decipher.final('utf8');

  // 3. Build payload based on template type
  let templateName = 'belesu_hard_copy_orders';
  let parameters = [];

  if (typeArg === 'digital') {
    templateName = 'belesu_digital_orders';
    parameters = [
      { type: 'text', parameter_name: 'customer_name', text: 'Krishna' },
      { type: 'text', parameter_name: 'order_number', text: '23459' },
      { type: 'text', parameter_name: 'guidebook_name', text: 'Kannada Class 6 Digital Guidebook' },
      { type: 'text', parameter_name: 'total_paid', text: '₹295' },
    ];
  } else {
    templateName = 'belesu_hard_copy_orders';
    parameters = [
      { type: 'text', parameter_name: 'customer_name', text: 'Krishna' },
      { type: 'text', parameter_name: 'order_number', text: '23459' },
      { type: 'text', parameter_name: 'items', text: 'Savi Kannada Class 1' },
      { type: 'text', parameter_name: 'total_amount', text: '₹250' },
    ];
  }

  const payload = {
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
          parameters: parameters,
        },
      ],
    },
  };

  console.log(`Sending template [${templateName}] via Phone Number ID [${cfg.phone_number_id}]...`);

  const metaRes = await fetch(
    `https://graph.facebook.com/v21.0/${cfg.phone_number_id}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );

  const resJson = await metaRes.json();

  if (!metaRes.ok) {
    console.error(`❌ Meta Cloud API Error (${metaRes.status}):`, JSON.stringify(resJson, null, 2));
    process.exit(1);
  }

  console.log(`\n🎉 SUCCESS! Message Dispatched via Meta WhatsApp Cloud API!`);
  console.log(`Message ID:`, resJson.messages?.[0]?.id);
  console.log(`Contact:`, resJson.contacts?.[0]);
  console.log(`\nCheck WhatsApp on +${cleanPhone} right now!\n`);
}

sendTest().catch(console.error);

import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  'https://sjqccpysjxkmnfttoqgf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqcWNjcHlzanhrbW5mdHRvcWdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjA4MzM2MSwiZXhwIjoyMTA3NjU5MzYxfQ.9i6uceidgK58udlIkjT9-mwC5m6JyzOu5s9i5m_qw5I'
);

const ENCRYPTION_KEY = 'fa27331b6e7dded1a2ff99c9a42aad69b208f8ed5a204a19929c7c93a3bb4483';

async function testAuthOtp() {
  const targetPhone = process.argv[2] || '8105829199';
  const cleanPhone = `91${targetPhone.replace(/\D/g, '').slice(-10)}`;
  const testOtp = '849201';

  console.log(`Testing belesu_authentication OTP [${testOtp}] to ${cleanPhone}...`);

  const { data: cfg } = await sb
    .from('whatsapp_config')
    .select('*')
    .eq('account_id', '7d87d718-75b1-4cda-8df5-1f2780f45cd7')
    .single();

  const parts = cfg.access_token.split(':');
  const [ivHex, ctHex, tagHex] = parts;
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    Buffer.from(ivHex, 'hex')
  );
  decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
  let token = decipher.update(ctHex, 'hex', 'utf8') + decipher.final('utf8');

  // Payload for Meta Authentication template with COPY_CODE button
  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: cleanPhone,
    type: 'template',
    template: {
      name: 'belesu_authentication',
      language: { code: 'en' },
      components: [
        {
          type: 'body',
          parameters: [
            {
              type: 'text',
              text: testOtp,
            },
          ],
        },
        {
          type: 'button',
          sub_type: 'url',
          index: '0',
          parameters: [
            {
              type: 'text',
              text: testOtp,
            },
          ],
        },
      ],
    },
  };

  const res = await fetch(`https://graph.facebook.com/v21.0/${cfg.phone_number_id}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  console.log('Status:', res.status);
  console.log('Response:', JSON.stringify(json, null, 2));
}

testAuthOtp().catch(console.error);


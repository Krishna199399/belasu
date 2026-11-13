import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  'https://sjqccpysjxkmnfttoqgf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqcWNjcHlzanhrbW5mdHRvcWdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjA4MzM2MSwiZXhwIjoyMTA3NjU5MzYxfQ.9i6uceidgK58udlIkjT9-mwC5m6JyzOu5s9i5m_qw5I'
);

const ENCRYPTION_KEY = 'fa27331b6e7dded1a2ff99c9a42aad69b208f8ed5a204a19929c7c93a3bb4483';

async function verifyMeta() {
  const { data } = await sb.from('whatsapp_config').select('*').eq('account_id', '7d87d718-75b1-4cda-8df5-1f2780f45cd7').single();
  const parts = data.access_token.split(':');
  const [ivHex, ctHex, tagHex] = parts;
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  decipher.setAuthTag(tag);
  let token = decipher.update(ctHex, 'hex', 'utf8');
  token += decipher.final('utf8');

  console.log(`Checking Meta Graph API for WABA: ${data.waba_id}...`);
  const res = await fetch(`https://graph.facebook.com/v21.0/${data.waba_id}/message_templates`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const json = await res.json();
  if (json.data) {
    console.log(`Found ${json.data.length} templates on Meta:`);
    for (const t of json.data) {
      console.log(`- [${t.status}] ${t.name} (${t.language}) - category: ${t.category}`);
      if (t.name.includes('order') || t.name.includes('belesu')) {
        console.log('   Components:', JSON.stringify(t.components));
      }
    }
  } else {
    console.error('Meta API Error:', json);
  }
}

verifyMeta().catch(console.error);

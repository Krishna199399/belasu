import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  'https://sjqccpysjxkmnfttoqgf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqcWNjcHlzanhrbW5mdHRvcWdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjA4MzM2MSwiZXhwIjoyMTA3NjU5MzYxfQ.9i6uceidgK58udlIkjT9-mwC5m6JyzOu5s9i5m_qw5I'
);

const ENCRYPTION_KEY = 'fa27331b6e7dded1a2ff99c9a42aad69b208f8ed5a204a19929c7c93a3bb4483';

async function test() {
  const { data } = await sb.from('whatsapp_config').select('*').eq('account_id', '7d87d718-75b1-4cda-8df5-1f2780f45cd7').single();
  const parts = data.access_token.split(':');
  const [ivHex, ctHex, tagHex] = parts;
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  decipher.setAuthTag(tag);
  let dec = decipher.update(ctHex, 'hex', 'utf8');
  dec += decipher.final('utf8');
  console.log('Decrypted Token Prefix:', dec.slice(0, 15) + '...', 'Length:', dec.length);
  console.log('Phone Number ID:', data.phone_number_id);
  console.log('WABA ID:', data.waba_id);
}

test().catch(console.error);

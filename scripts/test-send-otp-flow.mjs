import fs from 'fs';
import path from 'path';

// Load .env.local
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

const { sendWhatsAppOtp } = await import('../src/lib/wacrm.ts');
const { createAdminClient } = await import('../src/lib/supabase.ts');

async function testAuthPipeline() {
  const targetPhone = '8105829199';
  const cleanPhone = '8105829199';
  const testOtp = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  console.log(`\n======================================================`);
  console.log(`🚀 TESTING META AUTHENTICATION OTP FLOW`);
  console.log(`Target: +91${cleanPhone}`);
  console.log(`Generated OTP: ${testOtp}`);
  console.log(`======================================================\n`);

  console.log('1. Dispatching via Meta Cloud API...');
  const res = await sendWhatsAppOtp(cleanPhone, testOtp, 'Krishna');
  console.log('Meta Result:', res);

  if (!res.success) {
    throw new Error(`Meta dispatch failed: ${res.error}`);
  }

  console.log('2. Storing in Supabase otps table...');
  const supabase = createAdminClient();
  const { error: upsertErr } = await supabase.from('otps').upsert(
    {
      phone: cleanPhone,
      otp_code: testOtp,
      expires_at: expiresAt,
      name: 'Krishna',
    },
    { onConflict: 'phone' }
  );

  if (upsertErr) throw upsertErr;
  console.log('✅ OTP stored in database!');

  console.log('3. Simulating verification in verify-otp...');
  const { data: record } = await supabase.from('otps').select('*').eq('phone', cleanPhone).single();
  const isMatch = record?.otp_code === testOtp;
  console.log(`Verification Check: [DB Code: ${record?.otp_code}] === [Entered Code: ${testOtp}] -> ${isMatch ? '✅ VERIFIED!' : '❌ MISMATCH'}`);

  console.log(`\nCheck WhatsApp on +91${cleanPhone} for the verification code + Copy code button!\n`);
}

testAuthPipeline().catch(console.error);

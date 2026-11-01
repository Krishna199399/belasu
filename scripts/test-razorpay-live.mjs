import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import Razorpay from 'razorpay';

const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

console.log('Testing Razorpay Live Credentials:');
console.log('Key ID:', key_id);
console.log('Key Secret length:', key_secret ? key_secret.length : 0);

if (!key_id || !key_secret) {
  console.error('Missing Razorpay credentials');
  process.exit(1);
}

const razorpay = new Razorpay({ key_id, key_secret });

async function verifyLiveKeys() {
  try {
    console.log('Attempting to create a test live order (amount: 100 paise / ₹1) to verify auth...');
    const order = await razorpay.orders.create({
      amount: 100, // 100 paise = 1 INR
      currency: 'INR',
      receipt: 'test_live_verify_' + Date.now(),
      notes: { test: 'gravitas_verification' },
    });

    console.log('✓ Successfully created Razorpay Live Order:', {
      id: order.id,
      entity: order.entity,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
    });

    console.log('VERDICT: PASS');
  } catch (err) {
    console.error('❌ Razorpay Live Authentication Failed:', err);
    console.log('VERDICT: FAIL');
    process.exit(1);
  }
}

verifyLiveKeys();


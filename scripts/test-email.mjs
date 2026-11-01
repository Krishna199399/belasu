import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Dynamic import of our module after dotenv loads
const { sendAdminOrderNotification, getAdminRecipients } = await import('../src/lib/email.ts');

console.log('Resolved Admin Recipients:', getAdminRecipients());

console.log('Dispatching test order notification...');
const result = await sendAdminOrderNotification({
  orderNumber: 'TEST-' + Math.floor(100000 + Math.random() * 900000),
  orderDate: new Date().toISOString(),
  customerName: 'Gravitas Verification Test',
  customerPhone: '8105829199',
  customerEmail: 'test@belesu.com',
  items: [
    {
      title: 'ಕನ್ನಡ ಸಾಹಿತ್ಯ ಸಂಚಯ (Kannada Sahitya Sanchaya)',
      quantity: 1,
      price: 250,
      productType: 'physical',
      sku: 'KSS-001',
    },
  ],
  subtotal: 250,
  shippingFee: 48,
  totalAmount: 298,
  paymentMethod: 'UPI / NetBanking',
  paymentId: 'pay_test_verification',
  razorpayOrderId: 'order_test_verification',
  shippingAddress: {
    address1: 'Krishnarajpet, Near Bus Stand',
    city: 'Belagavi',
    state: 'Karnataka',
    postcode: '590001',
  },
  isDigitalOnly: false,
});

console.log('Final Execution Result:', result);
if (result.success) {
  console.log('VERDICT: PASS');
} else {
  console.log('VERDICT: FAIL -- ' + result.error);
  process.exit(1);
}

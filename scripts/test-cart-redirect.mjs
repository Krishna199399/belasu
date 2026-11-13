import { spawn } from 'child_process';

const TEST_PORT = 3099;

async function run() {
  console.log('Starting next start on port ' + TEST_PORT + '...');
  const server = spawn('npx', ['next', 'start', '-p', String(TEST_PORT), '-H', '127.0.0.1'], {
    shell: true,
  });

  await new Promise(r => setTimeout(r, 2000));

  const testUrls = [
    { url: `http://127.0.0.1:${TEST_PORT}/cart`, expectedStatus: 308, expectedLocation: `http://127.0.0.1:${TEST_PORT}/cart/` },
    { url: `http://127.0.0.1:${TEST_PORT}/admin`, expectedStatus: 308, expectedLocation: `http://127.0.0.1:${TEST_PORT}/admin/` },
    { url: `http://127.0.0.1:${TEST_PORT}/auth/login`, expectedStatus: 308, expectedLocation: `http://127.0.0.1:${TEST_PORT}/auth/login/` },
    { url: `http://127.0.0.1:${TEST_PORT}/cart/`, expectedStatus: 200, expectedLocation: null },
    { url: `http://127.0.0.1:${TEST_PORT}/admin/`, expectedStatus: 200, expectedLocation: null },
    { url: `http://127.0.0.1:${TEST_PORT}/auth/login/`, expectedStatus: 200, expectedLocation: null },
  ];

  let allPassed = true;
  for (const t of testUrls) {
    const res = await fetch(t.url, { method: 'GET', redirect: 'manual' });
    const location = res.headers.get('location');
    const status = res.status;
    const isStatusOk = status === t.expectedStatus;
    const isLocationOk = t.expectedLocation ? location === t.expectedLocation : location === null;
    const pass = isStatusOk && isLocationOk;
    console.log(`[${status}] ${t.url} -> Location: ${location} | Expected: ${t.expectedLocation} [${pass ? '✅ PASS' : '❌ FAIL'}]`);
    if (!pass) allPassed = false;
  }

  // Also test POST method to /api/payment/webhook (must NOT redirect)
  const webhookRes = await fetch(`http://127.0.0.1:${TEST_PORT}/api/payment/webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event: 'test' }),
    redirect: 'manual',
  });
  console.log(`[${webhookRes.status}] POST /api/payment/webhook -> Location: ${webhookRes.headers.get('location')} (Must NOT redirect: ${webhookRes.status !== 308 ? '✅ PASS' : '❌ FAIL'})`);

  server.kill();
  console.log(`\nFinal Test Verdict: ${allPassed ? '🎉 ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  process.exit(allPassed ? 0 : 1);
}

run().catch(console.error);

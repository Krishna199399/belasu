import { spawn } from 'child_process';

const TEST_PORT = 3088;

async function run() {
  console.log('Starting next start on port ' + TEST_PORT + '...');
  const server = spawn('npx', ['next', 'start', '-p', String(TEST_PORT), '-H', '127.0.0.1'], {
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  server.stdout.on('data', d => process.stdout.write(`[SERVER] ${d}`));
  server.stderr.on('data', d => process.stderr.write(`[SERVER ERR] ${d}`));

  let ready = false;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 500));
    try {
      const res = await fetch(`http://127.0.0.1:${TEST_PORT}/`);
      if (res.status === 200) {
        ready = true;
        break;
      }
    } catch (e) {
      // still starting
    }
  }

  if (!ready) {
    server.kill();
    throw new Error('Server did not become ready in 10 seconds');
  }

  console.log('\nServer is ready. Testing redirects:\n');

  const testCases = [
    {
      url: `http://127.0.0.1:${TEST_PORT}/shop/books/savi-kannada-class-1/`,
      expected: '/books/savi-kannada-class-1/',
    },
    {
      url: `http://127.0.0.1:${TEST_PORT}/shop/books/savi-kannada-class-2/`,
      expected: '/books/savi-kannada-class-2/',
    },
    {
      url: `http://127.0.0.1:${TEST_PORT}/shop/kali/kali-kannada-english-translated-innovative-guidebook-class-1/`,
      expected: '/books/kali-kannada-english-translated-innovative-guidebook-class-1/',
    },
    {
      url: `http://127.0.0.1:${TEST_PORT}/shop/books/kali-kannada-english-translated-innovative-guidebook-class-2/`,
      expected: '/books/kali-kannada-english-translated-innovative-guidebook-class-2/',
    },
    {
      url: `http://127.0.0.1:${TEST_PORT}/product-category/siri/`,
      expected: '/books/siri-kannada-english-translated-guidebook-class-5/',
    },
    {
      url: `http://127.0.0.1:${TEST_PORT}/product-category/tili/`,
      expected: '/books/tili-kannada-english-translated-innovative-guidebook-class-5/',
    },
    {
      url: `http://127.0.0.1:${TEST_PORT}/shop/`,
      expected: '/books/',
    },
  ];

  let passed = true;
  for (const tc of testCases) {
    const res = await fetch(tc.url, { method: 'HEAD', redirect: 'manual' });
    const location = res.headers.get('location');
    const status = res.status;
    const ok = status === 308 && location === tc.expected;
    console.log(`[${status}] Location: ${location} | Expected: ${tc.expected} -> ${ok ? '✅ PASS' : '❌ FAIL'}`);
    if (!ok) passed = false;
  }

  // Gracefully stop server
  server.kill();
  console.log(`\nAll Redirect Tests Result: ${passed ? '✅ ALL PASSED' : '❌ SOME FAILED'}`);
  process.exit(passed ? 0 : 1);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

import { NextURL } from 'next/dist/server/web/next-url.js';

// Test 1: NextURL clone (Current behavior)
const nextUrl = new NextURL('http://localhost:3000/cart', {
  nextConfig: { trailingSlash: true, skipTrailingSlashRedirect: true },
});
const cloned = nextUrl.clone();
cloned.pathname = '/cart/';
console.log('1. Current (NextURL.clone()):', cloned.toString());

// Test 2: Standard new URL with request.url
const standardUrl = new URL('http://localhost:3000/cart');
const target = new URL('/cart/' + standardUrl.search, standardUrl);
console.log('2. Fixed (standard new URL):', target.toString());


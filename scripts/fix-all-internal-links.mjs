import fs from 'fs';
import path from 'path';

// Exact replacements to add canonical trailing slashes to all internal links
const EXACT_REPLACEMENTS = [
  // Navbar & Auth
  ['href="/admin"', 'href="/admin/"'],
  ['href="/auth/login"', 'href="/auth/login/"'],
  ['href="/library"', 'href="/library/"'],
  ['href="/profile"', 'href="/profile/"'],
  ['href="/cart"', 'href="/cart/"'],
  ['href="/checkout"', 'href="/checkout/"'],
  ['href="/contact"', 'href="/contact/"'],
  ['href="/about"', 'href="/about/"'],
  ['href="/books"', 'href="/books/"'],
  ['href="/digital"', 'href="/digital/"'],
  ['href="/reviews"', 'href="/reviews/"'],
  ['href="/faqs"', 'href="/faqs/"'],
  ['href="/video-gallery"', 'href="/video-gallery/"'],
  ['href="/terms-and-conditions"', 'href="/terms-and-conditions/"'],
  ['href="/privacy-policy"', 'href="/privacy-policy/"'],
  ['href="/returns"', 'href="/returns/"'],
  ['href="/shipping-policy"', 'href="/shipping-policy/"'],

  // Admin Subroutes
  ['href="/admin/orders"', 'href="/admin/orders/"'],
  ['href="/admin/users"', 'href="/admin/users/"'],
  ['href="/admin/products"', 'href="/admin/products/"'],
  ['href="/admin/digital"', 'href="/admin/digital/"'],
  ['href="/admin/inventory"', 'href="/admin/inventory/"'],
  ['href="/admin/analytics"', 'href="/admin/analytics/"'],
  ['href="/admin/settings"', 'href="/admin/settings/"'],
  ['href="/admin/reviews"', 'href="/admin/reviews/"'],

  // Reader
  ['href="/reader/kannada-class-6-guide"', 'href="/reader/kannada-class-6-guide/"'],

  // router.push / router.replace
  ["router.push('/admin')", "router.push('/admin/')"],
  ["router.push('/admin/orders')", "router.push('/admin/orders/')"],
  ["router.push('/cart')", "router.push('/cart/')"],
  ["router.push('/checkout')", "router.push('/checkout/')"],
  ["router.push('/auth/login')", "router.push('/auth/login/')"],
  ["router.push('/library')", "router.push('/library/')"],
  ["router.push('/profile')", "router.push('/profile/')"],
  ["router.replace('/library')", "router.replace('/library/')"],
  ["router.replace('/admin')", "router.replace('/admin/')"],
];

let modifiedCount = 0;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name !== 'node_modules' && e.name !== '.next' && e.name !== '.git') {
        walk(full);
      }
    } else if (/\.(tsx|ts|jsx|js)$/.test(e.name)) {
      let content = fs.readFileSync(full, 'utf8');
      let changed = false;

      for (const [target, replacement] of EXACT_REPLACEMENTS) {
        if (content.includes(target)) {
          content = content.replaceAll(target, replacement);
          changed = true;
        }
      }

      if (changed) {
        fs.writeFileSync(full, content, 'utf8');
        console.log(`Updated: ${path.relative('.', full)}`);
        modifiedCount++;
      }
    }
  }
}

walk('./src');
console.log(`\nFinished updating ${modifiedCount} files with canonical trailing slashes.`);

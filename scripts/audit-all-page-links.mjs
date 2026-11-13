import fs from 'fs';
import path from 'path';

const pages = [];

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name !== 'node_modules' && e.name !== '.next' && e.name !== '.git') {
        scanDir(full);
      }
    } else if (/\.(tsx|ts|jsx|js)$/.test(e.name)) {
      const content = fs.readFileSync(full, 'utf8');
      const matches = content.matchAll(/href=["'](\/[^"']+)["']/g);
      for (const m of matches) {
        const link = m[1];
        // Ignore api, assets, anchors, external, root
        if (
          !link.startsWith('/api') &&
          !link.startsWith('/_next') &&
          !link.includes('.') &&
          !link.startsWith('/#') &&
          link !== '/'
        ) {
          const hasSlash = link.endsWith('/') || link.includes('?');
          if (!hasSlash) {
            pages.push({ file: path.relative('.', full), link });
          }
        }
      }
    }
  }
}

scanDir('./src');

console.log(`Found ${pages.length} internal links missing trailing slashes:`);
for (const p of pages) {
  console.log(`- ${p.file}: ${p.link}`);
}


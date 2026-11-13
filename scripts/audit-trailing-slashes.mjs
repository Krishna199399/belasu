import fs from 'fs';
import path from 'path';

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.next' && f !== '.git') scanDir(full);
    } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
      const content = fs.readFileSync(full, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        // Look for links to /books or /digital
        const hrefMatches = line.matchAll(/href=\{?["'`](\/(?:books|digital|shop)\/[^"'`?#]+)["'`?#]/g);
        for (const m of hrefMatches) {
          const urlPath = m[1];
          if (!urlPath.endsWith('/')) {
            console.log(`${full.replace('d:\\belasu\\', '')}:${idx + 1} -> ${urlPath} (missing /)`);
          }
        }
      });
    }
  }
}

console.log('--- Scanning src for missing trailing slash on book links ---');
scanDir('d:\\belasu\\src');


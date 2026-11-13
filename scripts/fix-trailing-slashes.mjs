import fs from 'fs';
import path from 'path';

// 1. Book detail client files: replace /books/${relBook.slug} -> /books/${relBook.slug}/
const clientFiles = [
  'src/app/books/kali-kannada-english-translated-innovative-guidebook-class-1/KaliClass1Client.tsx',
  'src/app/books/kali-kannada-english-translated-innovative-guidebook-class-2/KaliClass2Client.tsx',
  'src/app/books/kali-kannada-english-translated-innovative-guidebook-class-3/KaliClass3Client.tsx',
  'src/app/books/kali-kannada-english-translated-innovative-guidebook-class-4/KaliClass4Client.tsx',
  'src/app/books/savi-kannada-class-1/SaviClass1Client.tsx',
  'src/app/books/savi-kannada-class-2/SaviClass2Client.tsx',
  'src/app/books/savi-kannada-class-3/SaviClass3Client.tsx',
  'src/app/books/savi-kannada-class-4/SaviClass4Client.tsx',
  'src/app/books/siri-kannada-english-translated-guidebook-class-5/SiriClass5Client.tsx',
  'src/app/books/tili-kannada-english-translated-innovative-guidebook-class-5/TiliClass5Client.tsx',
];

for (const rel of clientFiles) {
  const full = path.join('d:/belasu', rel);
  if (fs.existsSync(full)) {
    let content = fs.readFileSync(full, 'utf8');
    content = content.replaceAll('`/books/${relBook.slug}`', '`/books/${relBook.slug}/`');
    content = content.replaceAll('"/books/${relBook.slug}"', '"/books/${relBook.slug}/"');
    fs.writeFileSync(full, content, 'utf8');
    console.log(`Updated: ${rel}`);
  }
}

// 2. DigitalClient.tsx
const dcPath = 'd:/belasu/src/app/digital/DigitalClient.tsx';
if (fs.existsSync(dcPath)) {
  let content = fs.readFileSync(dcPath, 'utf8');
  content = content.replace("href='/digital/kannada-class-6-guide'", "href='/digital/kannada-class-6-guide/'");
  content = content.replace('href="/digital/kannada-class-6-guide"', 'href="/digital/kannada-class-6-guide/"');
  content = content.replace("href='/books/savi-kannada-class-4'", "href='/books/savi-kannada-class-4/'");
  content = content.replace('href="/books/savi-kannada-class-4"', 'href="/books/savi-kannada-class-4/"');
  content = content.replace("href='/books/savi-kannada-class-3'", "href='/books/savi-kannada-class-3/'");
  content = content.replace('href="/books/savi-kannada-class-3"', 'href="/books/savi-kannada-class-3/"');
  fs.writeFileSync(dcPath, content, 'utf8');
  console.log('Updated: src/app/digital/DigitalClient.tsx');
}

// 3. src/app/digital/[slug]/purchase/page.tsx
const purPath = 'd:/belasu/src/app/digital/[slug]/purchase/page.tsx';
if (fs.existsSync(purPath)) {
  let content = fs.readFileSync(purPath, 'utf8');
  content = content.replaceAll('`/digital/${book.slug}`', '`/digital/${book.slug}/`');
  fs.writeFileSync(purPath, content, 'utf8');
  console.log('Updated: src/app/digital/[slug]/purchase/page.tsx');
}

// 4. src/components/home/DigitalGuidebooksSection.tsx
const dgsPath = 'd:/belasu/src/components/home/DigitalGuidebooksSection.tsx';
if (fs.existsSync(dgsPath)) {
  let content = fs.readFileSync(dgsPath, 'utf8');
  content = content.replace("href='/digital/kannada-class-6-guide'", "href='/digital/kannada-class-6-guide/'");
  content = content.replace('href="/digital/kannada-class-6-guide"', 'href="/digital/kannada-class-6-guide/"');
  fs.writeFileSync(dgsPath, content, 'utf8');
  console.log('Updated: src/components/home/DigitalGuidebooksSection.tsx');
}

// 5. src/components/reader/SecureBookReader.tsx
const sbrPath = 'd:/belasu/src/components/reader/SecureBookReader.tsx';
if (fs.existsSync(sbrPath)) {
  let content = fs.readFileSync(sbrPath, 'utf8');
  content = content.replaceAll('`/digital/${book.slug}/purchase`', '`/digital/${book.slug}/purchase/`');
  fs.writeFileSync(sbrPath, content, 'utf8');
  console.log('Updated: src/components/reader/SecureBookReader.tsx');
}

// 6. src/components/layout/Navbar.tsx
const navPath = 'd:/belasu/src/components/layout/Navbar.tsx';
if (fs.existsSync(navPath)) {
  let content = fs.readFileSync(navPath, 'utf8');
  content = content.replace("href: '/books/savi-kannada-class-3?format=digital'", "href: '/books/savi-kannada-class-3/?format=digital'");
  content = content.replace("href: '/books/savi-kannada-class-4?format=digital'", "href: '/books/savi-kannada-class-4/?format=digital'");
  fs.writeFileSync(navPath, content, 'utf8');
  console.log('Updated: src/components/layout/Navbar.tsx');
}

console.log('Finished updating trailing slashes across all files.');


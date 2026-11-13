const CANONICAL_URLS = [
  'https://belesu.in/',
  'https://belesu.in/books/savi-kannada-class-1/',
  'https://belesu.in/books/kali-kannada-english-translated-innovative-guidebook-class-1/',
  'https://belesu.in/books/savi-kannada-class-2/',
  'https://belesu.in/books/kali-kannada-english-translated-innovative-guidebook-class-2/',
  'https://belesu.in/books/savi-kannada-class-3/',
  'https://belesu.in/books/kali-kannada-english-translated-innovative-guidebook-class-3/',
  'https://belesu.in/books/savi-kannada-class-4/',
  'https://belesu.in/books/kali-kannada-english-translated-innovative-guidebook-class-4/',
  'https://belesu.in/books/siri-kannada-english-translated-guidebook-class-5/',
  'https://belesu.in/books/tili-kannada-english-translated-innovative-guidebook-class-5/',
  'https://belesu.in/books/a-destination-to-speak-kannada/',
  'https://belesu.in/digital/kannada-class-6-guide/',
];

async function verifyUrls() {
  console.log(`Verifying ${CANONICAL_URLS.length} canonical URLs against live server:`);
  let allPass = true;
  for (const url of CANONICAL_URLS) {
    try {
      const res = await fetch(url, { method: 'HEAD', redirect: 'manual' });
      const status = res.status;
      const isOk = status === 200;
      console.log(`[${status}] ${isOk ? '✅' : '❌'} ${url}`);
      if (!isOk) allPass = false;
    } catch (err) {
      console.error(`[ERR] ❌ ${url} - ${err.message}`);
      allPass = false;
    }
  }

  if (allPass) {
    console.log('\n🎉 ALL canonical URLs verified 200 OK directly without redirects!');
  } else {
    console.log('\n⚠️ Some URLs failed or redirected.');
  }
}

verifyUrls();

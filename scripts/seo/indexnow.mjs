#!/usr/bin/env node
// Notify IndexNow (Bing, Yandex, Seznam, Naver...) about new or updated URLs.
//   node scripts/seo/indexnow.mjs https://riseridge.io/blog/foo/ [/blog/bar/ ...]
// The key is public by design. It must match public/<key>.txt, which is served at
// https://riseridge.io/<key>.txt.
import { SITE } from './lib.mjs';

const KEY = '06c365783a6d93b87a17c0fceacee062';
const urls = process.argv.slice(2).map((u) => new URL(u, SITE + '/').toString());
if (urls.length === 0) {
  console.error('Usage: indexnow.mjs <url> [url...]');
  process.exit(1);
}
try {
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: urls }),
  });
  // 200/202 = accepted. 403 = key file not reachable yet (deploy pending).
  console.log(JSON.stringify({ status: res.status, accepted: res.status === 200 || res.status === 202, urls }));
} catch (e) {
  console.log(JSON.stringify({ skipped: `IndexNow unreachable: ${e.cause?.code || e.message}`, urls }));
}

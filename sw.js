const CACHE = 'promptpay-v23';
// path แบบ relative — ใช้ได้ทั้ง Vercel (/) และ GitHub Pages (/Promptpay/)
const ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'icon.svg',
  'icon-192.png',
  'icon-512.png',
  'apple-touch-icon.png',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js',
  'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js',
  'https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;600;700&display=swap'
];
// แคชเฉพาะไฟล์ของแอป/CDN — ห้ามแคช API ของ Supabase
const CACHE_HOSTS = [self.location.host, 'cdnjs.cloudflare.com', 'cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});

const putCache = (req, res) => { if (res.ok) { const c = res.clone(); caches.open(CACHE).then((cache) => cache.put(req, c)); } return res; };

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (!CACHE_HOSTS.includes(url.host)) return;
  const isPage = e.request.mode === 'navigate' || (url.host === self.location.host && /(\/|\.html|\.json|sw\.js)$/.test(url.pathname));
  if (isPage) {
    // หน้าเว็บ: เอาของใหม่จากเน็ตก่อน ออฟไลน์ค่อยใช้แคช
    e.respondWith(fetch(e.request).then((res) => putCache(e.request, res)).catch(() => caches.match(e.request).then((c) => c || caches.match('index.html'))));
    return;
  }
  // ไฟล์อื่น (รูป, ไลบรารี): ใช้แคชก่อน แล้วอัปเดตเบื้องหลัง
  e.respondWith(caches.match(e.request).then((cached) => {
    const fetched = fetch(e.request).then((res) => putCache(e.request, res)).catch(() => cached);
    return cached || fetched;
  }));
});

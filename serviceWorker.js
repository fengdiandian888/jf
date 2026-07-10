/**
 * 减脂App · PWA Service Worker
 * 策略：Network First + Cache Fallback
 * 在线时拉最新 → GitHub 更新后用户秒级获取
 * 离线时用缓存 → 页面依然可打开
 */
const CACHE_NAME = 'jf-v19';
const URLS_TO_CACHE = [
  '/jf/shared.css',
  '/jf/gist-storage.js',
  '/jf/data.js',
  '/jf/manifest.json',
  '/jf/icon-192.png',
  '/jf/icon-512.png'
];
// 注意：HTML页面不预缓存，走运行时 Network First，确保更新后用户立即看到新版本

// 安装：预缓存核心文件
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(URLS_TO_CACHE).catch(function(e) {
        console.warn('SW install cache error:', e);
      });
    })
  );
  self.skipWaiting();
});

// 激活：清理旧缓存
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// 请求拦截：Network First
self.addEventListener('fetch', function(event) {
  // 跳过 API 请求（wttr.in, api.github.com）
  if (event.request.url.includes('api.github.com') || 
      event.request.url.includes('wttr.in')) {
    return; // 不拦截，走正常网络
  }

  event.respondWith(
    fetch(event.request).then(function(response) {
      // 网络成功 → 更新缓存
      if (response && response.status === 200 && response.type === 'basic') {
        const cloned = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, cloned);
        });
      }
      return response;
    }).catch(function() {
      // 网络失败 → 用缓存
      return caches.match(event.request).then(function(cached) {
        return cached || new Response('离线加载失败', { status: 503 });
      });
    })
  );
});

// sw.js - 天使笑長幸福教養概念館專用
// 每次修改 index.html 後，建議同步修改下方的版號 (如 v20260124)
const CACHE_NAME = 'angel-happy-v20260124; 

// 1. 安裝階段：強制跳過等待，讓新版立刻準備接管
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// 2. 啟動階段：清理所有舊的快取，確保空間乾淨
self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            self.clients.claim(),
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('🧹 正在清理舊快取:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        ])
    );
});

// 3. 抓取階段：網路優先策略
self.addEventListener('fetch', (event) => {
    // 絕對不快取 Google Apps Script API 請求
    if (event.request.url.includes('google.com') || event.request.url.includes('macros')) {
        return; // 直接走網路，不進入快取邏輯
    }

    event.respondWith(
        fetch(event.request).catch(() => {
            // 只有在完全斷網時，才從快取拿舊的頁面結構
            return caches.match(event.request);
        })
    );
});

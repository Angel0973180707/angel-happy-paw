// sw.js - 天使笑長幸福教養概念館專用
const CACHE_NAME = 'angel-happy-v20260123'; // 每次發布重大更新時，請修改此版號

// 1. 安裝階段：強制跳過等待
self.addEventListener('install', (event) => {
    // 讓新的 Service Worker 安裝後立即進入啟動狀態，不需等待舊版網頁關閉
    self.skipWaiting();
});

// 2. 啟動階段：清理舊快取並接管頁面
self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            // 強制接管所有開啟的頁面，確保最新功能生效
            self.clients.claim(),
            // 刪除所有不是目前 CACHE_NAME 的舊快取，釋放空間並防止舊資料干擾
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

// 3. 抓取階段：網路優先 (確保資料永遠是最新的)
self.addEventListener('fetch', (event) => {
    // 對於 API 請求 (Google 試算表)，我們不快取，永遠走網路
    if (event.request.url.includes('google.com') || event.request.url.includes('macros')) {
        return; 
    }

    event.respondWith(
        fetch(event.request).catch(() => {
            // 如果沒網路，才從快取抓取 (確保離線可用)
            return caches.match(event.request);
        })
    );
});

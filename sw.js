// sw.js - 天使笑長幸福教養概念館專用
const CACHE_NAME = 'angel-happy-v20260123'; // 更新版號以觸發自動刷新

// 1. 安裝階段：強制跳過等待
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// 2. 啟動階段：清理舊快取並接管頁面
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

// 3. 抓取階段：網路優先 (確保資料永遠是最新的)
self.addEventListener('fetch', (event) => {
    // 關鍵：對 Google 試算表 API 絕不快取，確保工房工具資料即時更新
    if (event.request.url.includes('google.com') || event.request.url.includes('macros')) {
        return; 
    }

    event.respondWith(
        fetch(event.request).catch(() => {
            // 沒網路時才讀取快取的 HTML 結構
            return caches.match(event.request);
        })
    );
});

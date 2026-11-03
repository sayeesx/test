// Epso PWA Cleanup Service Worker
// Target: https://epso-admin-demo.vercel.app/sw.js (Scope: '/')
// Purpose: Automatically unregister legacy Vite PWA service worker, purge old cache storage,
// and reload active tabs to display the new Next.js website.
// Preserves: localStorage, IndexedDB, Cookies, Supabase auth sessions.

self.addEventListener('install', (event) => {
  // Activate immediately without waiting for existing tabs to close
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // 1. Take control of all open clients immediately
      await self.clients.claim();

      // 2. Purge all legacy CacheStorage entries (Workbox precache, Google fonts, runtime caches)
      // NOTE: We only delete caches from CacheStorage.
      // localStorage, IndexedDB, Cookies, and Supabase data are untouched!
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((cacheName) => {
            console.log('[PWA Cleanup SW] Deleting legacy cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      } catch (err) {
        console.error('[PWA Cleanup SW] Error purging caches:', err);
      }

      // 3. Unregister this service worker registration permanently
      try {
        await self.registration.unregister();
        console.log('[PWA Cleanup SW] Service worker unregistered successfully.');
      } catch (err) {
        console.error('[PWA Cleanup SW] Error unregistering service worker:', err);
      }

      // 4. Notify and reload existing open tabs (guarded against infinite reload loops)
      try {
        const clients = await self.clients.matchAll({
          type: 'window',
          includeUncontrolled: true,
        });

        for (const client of clients) {
          if (!client.url) continue;

          // Prevent infinite reload loops by checking URL parameter
          const clientUrl = new URL(client.url);
          if (!clientUrl.searchParams.has('pwa_cleanup')) {
            // Send postMessage for clients with listener
            client.postMessage({ type: 'PWA_CLEANUP_RELOAD' });

            // Direct navigation refresh for tabs running the old Vite HTML
            clientUrl.searchParams.set('pwa_cleanup', '1');
            try {
              await client.navigate(clientUrl.href);
            } catch (navErr) {
              console.warn('[PWA Cleanup SW] Client navigate not supported or blocked:', navErr);
            }
          }
        }
      } catch (clientErr) {
        console.error('[PWA Cleanup SW] Error handling clients:', clientErr);
      }
    })()
  );
});

// Pass-through fetch handler: never cache or intercept anything
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});

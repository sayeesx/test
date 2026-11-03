# Epso Next.js - PWA Migration & Deployment

This Next.js deployment includes backward-compatible PWA cleanup to automatically migrate returning Android and Windows users from the legacy Epso Vite PWA to this Next.js site.

### PWA Cleanup Architecture
- **Legacy Service Worker URL**: `/sw.js` (Scope: `/`)
- **Cleanup Service Worker**: `public/sw.js`
  - Calls `self.skipWaiting()` on install.
  - Calls `self.clients.claim()` on activate.
  - Purges all legacy `CacheStorage` entries (Workbox precache, font caches, runtime caches).
  - Unregisters the service worker (`self.registration.unregister()`).
  - Reloads existing controlled tabs once (protected against reload loops via query parameter & sessionStorage).
  - Preserves `localStorage`, `IndexedDB`, cookies, and Supabase credentials.
- **Verification Page**: [`/pwa-status`](https://epso-admin-demo.vercel.app/pwa-status) for real-time mobile and desktop diagnostics.

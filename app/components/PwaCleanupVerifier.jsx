'use client';

import { useEffect, useState } from 'react';

export default function PwaCleanupVerifier() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Remove ?pwa_cleanup=1 from URL bar cleanly without refreshing
    const url = new URL(window.location.href);
    if (url.searchParams.has('pwa_cleanup')) {
      url.searchParams.delete('pwa_cleanup');
      const cleanUrl = url.pathname + (url.searchParams.toString() ? '?' + url.searchParams.toString() : '') + url.hash;
      window.history.replaceState({}, document.title, cleanUrl);
    }

    // 2. Listen for service worker messages
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'PWA_CLEANUP_RELOAD') {
          if (!sessionStorage.getItem('pwa_cleanup_reloaded')) {
            sessionStorage.setItem('pwa_cleanup_reloaded', 'true');
            console.log('[PWA Cleanup] Reload signal received from worker. Refreshing tab once...');
            window.location.reload();
          }
        }
      });
    }

    // 3. Client-side double check: unregister any legacy workers and delete stale caches
    const runVerification = async () => {
      let swCount = 0;
      let cacheCount = 0;

      if ('serviceWorker' in navigator) {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations();
          swCount = registrations.length;
          for (const reg of registrations) {
            console.log('[PWA Cleanup] Client unregistering legacy service worker:', reg.scope);
            await reg.unregister();
          }
        } catch (e) {
          console.warn('[PWA Cleanup] Error checking service worker registrations:', e);
        }
      }

      if ('caches' in window) {
        try {
          const keys = await caches.keys();
          cacheCount = keys.length;
          for (const key of keys) {
            console.log('[PWA Cleanup] Client deleting legacy cache:', key);
            await caches.delete(key);
          }
        } catch (e) {
          console.warn('[PWA Cleanup] Error checking caches:', e);
        }
      }

      console.log(
        `%c[PWA Migration Status]%c Service Workers Unregistered: ${swCount} | Caches Purged: ${cacheCount} | Supabase & LocalStorage: Untouched`,
        'background: #16a34a; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
        'color: #22c55e;'
      );

      setStatus({
        cleanedWorkers: swCount,
        cleanedCaches: cacheCount,
        timestamp: new Date().toLocaleTimeString(),
      });
    };

    runVerification();
  }, []);

  return null;
}

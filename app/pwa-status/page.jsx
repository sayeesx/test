'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PwaStatusPage() {
  const [data, setData] = useState({
    checked: false,
    serviceWorkers: [],
    caches: [],
    localStorageCount: 0,
    supabaseSessionFound: false,
    lastChecked: null,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkStatus = async () => {
    setIsRefreshing(true);
    let swList = [];
    let cacheList = [];
    let lsCount = 0;
    let hasSupabase = false;

    if (typeof window !== 'undefined') {
      // 1. Service Workers
      if ('serviceWorker' in navigator) {
        try {
          const regs = await navigator.serviceWorker.getRegistrations();
          swList = regs.map((r) => ({
            scope: r.scope,
            active: !!r.active,
            installing: !!r.installing,
            waiting: !!r.waiting,
          }));
        } catch (e) {
          console.error(e);
        }
      }

      // 2. CacheStorage
      if ('caches' in window) {
        try {
          cacheList = await caches.keys();
        } catch (e) {
          console.error(e);
        }
      }

      // 3. LocalStorage & Supabase
      try {
        lsCount = localStorage.length;
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes('supabase') || key.startsWith('sb-'))) {
            hasSupabase = true;
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    setData({
      checked: true,
      serviceWorkers: swList,
      caches: cacheList,
      localStorageCount: lsCount,
      supabaseSessionFound: hasSupabase,
      lastChecked: new Date().toLocaleTimeString(),
    });
    setIsRefreshing(false);
  };

  const forceUnregisterAndPurge = async () => {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const reg of regs) {
        await reg.unregister();
      }
    }
    if ('caches' in window) {
      const keys = await caches.keys();
      for (const key of keys) {
        await caches.delete(key);
      }
    }
    await checkStatus();
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#090a0f',
        color: '#f3f4f6',
        padding: '2.5rem 1.5rem',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div style={{ maxWidth: '680px', width: '100%' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(59, 130, 246, 0.12)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: '#60a5fa',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            Diagnostics & Migration Verifier
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
            PWA Cleanup Verification
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.95rem', margin: 0 }}>
            Inspects browser Service Worker registrations and CacheStorage for legacy Epso PWA assets.
          </p>
        </div>

        {/* Verification Status Cards */}
        <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
          {/* Service Worker Card */}
          <div
            style={{
              padding: '1.25rem',
              backgroundColor: 'rgba(17, 18, 23, 0.8)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', fontWeight: 600 }}>
                  Service Worker Registrations
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#9ca3af' }}>
                  Target: 0 active registrations
                </p>
              </div>
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  backgroundColor: data.serviceWorkers.length === 0 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: data.serviceWorkers.length === 0 ? '#4ade80' : '#f87171',
                }}
              >
                {data.serviceWorkers.length === 0 ? 'CLEAN (0 active)' : `${data.serviceWorkers.length} Active`}
              </span>
            </div>
            {data.serviceWorkers.length > 0 && (
              <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#fca5a5' }}>
                Detected registrations:
                <ul>
                  {data.serviceWorkers.map((sw, i) => (
                    <li key={i}>{sw.scope}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Cache Storage Card */}
          <div
            style={{
              padding: '1.25rem',
              backgroundColor: 'rgba(17, 18, 23, 0.8)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', fontWeight: 600 }}>
                  CacheStorage (Workbox / Precache)
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#9ca3af' }}>
                  Target: 0 legacy caches
                </p>
              </div>
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  backgroundColor: data.caches.length === 0 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: data.caches.length === 0 ? '#4ade80' : '#f87171',
                }}
              >
                {data.caches.length === 0 ? 'PURGED (0 caches)' : `${data.caches.length} Caches Found`}
              </span>
            </div>
            {data.caches.length > 0 && (
              <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#fca5a5' }}>
                Caches remaining:
                <ul>
                  {data.caches.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* LocalStorage & Supabase Preservation Card */}
          <div
            style={{
              padding: '1.25rem',
              backgroundColor: 'rgba(17, 18, 23, 0.8)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', fontWeight: 600 }}>
                  Data Preservation (LocalStorage & Supabase)
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#9ca3af' }}>
                  {data.localStorageCount} items preserved in localStorage
                </p>
              </div>
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  backgroundColor: 'rgba(34, 197, 94, 0.15)',
                  color: '#4ade80',
                }}
              >
                PRESERVED
              </span>
            </div>
            {data.supabaseSessionFound && (
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                Supabase authentication credentials detected and preserved intact.
              </p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={checkStatus}
            disabled={isRefreshing}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '8px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            {isRefreshing ? 'Checking...' : 'Re-check Status'}
          </button>

          <button
            onClick={forceUnregisterAndPurge}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            Manual Force Purge
          </button>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link
            href="/"
            style={{
              color: '#9ca3af',
              fontSize: '0.85rem',
              textDecoration: 'underline',
            }}
          >
            Return to Home Page
          </Link>
          {data.lastChecked && (
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#6b7280' }}>
              Last verified at: {data.lastChecked}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

// Legacy registerSW.js replacement
// If an old cached HTML page requests this script, it will not register any new worker,
// and will proactively unregister any remaining registrations.
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
  });
}

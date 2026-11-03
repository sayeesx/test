import PwaCleanupVerifier from './components/PwaCleanupVerifier';

export const metadata = {
  title: 'Epso - Migration & Deployment Notice',
  description: 'Epso legacy PWA migration and deployment status',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', backgroundColor: '#0a0a0c', color: '#ededed' }}>
        <PwaCleanupVerifier />
        {children}
      </body>
    </html>
  );
}

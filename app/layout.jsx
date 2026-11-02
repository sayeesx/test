export const metadata = {
  title: '404 - Deployment Removed | narrs administration',
  description: 'This deployment was removed by narrs administration.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', backgroundColor: '#0a0a0c', color: '#ededed' }}>
        {children}
      </body>
    </html>
  );
}


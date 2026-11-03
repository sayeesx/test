import Link from 'next/link';

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#090a0f',
        color: '#f3f4f6',
        padding: '2rem 1.5rem',
        boxSizing: 'border-box',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '540px',
          width: '100%',
          padding: '2.5rem 2rem',
          backgroundColor: 'rgba(17, 18, 23, 0.85)',
          backdropFilter: 'blur(12px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* Status Pill Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#ef4444',
              display: 'inline-block',
            }}
          />
          404 • Deployment Notice
        </div>

        {/* 404 Large Number */}
        <h1
          style={{
            margin: '0 0 0.5rem 0',
            fontSize: '5rem',
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            background: 'linear-gradient(180deg, #ffffff 40%, #9ca3af 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          404
        </h1>

        {/* Primary Message */}
        <h2
          style={{
            margin: '0 0 1rem 0',
            fontSize: '1.35rem',
            fontWeight: 600,
            color: '#fca5a5',
            lineHeight: 1.4,
          }}
        >
          This deployment was removed by narrs administration
        </h2>

        {/* Explanatory Description */}
        <p
          style={{
            margin: '0 0 2rem 0',
            fontSize: '0.95rem',
            color: '#9ca3af',
            lineHeight: 1.6,
          }}
        >
          The resource or deployment you are attempting to access has been suspended or taken down. For further details, inquiries, or official updates, please visit the official narrs portal below.
        </p>

        {/* Action Link to www.narrs.in */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <a
            href="https://www.narrs.in"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '0.85rem 1.5rem',
              borderRadius: '10px',
              backgroundColor: '#ffffff',
              color: '#090a0f',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              transition: 'transform 0.15s ease, background-color 0.15s ease',
            }}
          >
            <span>Visit www.narrs.in</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>

        {/* Footer info */}
        <div
          style={{
            marginTop: '2rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            fontSize: '0.8rem',
            color: '#6b7280',
          }}
        >
          NARRS Administration System • All Rights Reserved
        </div>
      </div>
    </main>
  );
}


'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body
        style={{
          background: '#0B0D0E',
          color: '#E6E8EA',
          fontFamily: 'system-ui, sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          margin: 0,
        }}
      >
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '16px' }}>Application Error</h2>
          <p style={{ color: '#8A9096', marginBottom: '24px' }}>
            A critical error occurred. Please reload the page.
          </p>
          <button
            onClick={() => reset()}
            style={{
              background: '#FFB800',
              color: '#000',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '2px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}

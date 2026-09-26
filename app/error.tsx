'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[App Error Boundary]:', error);
  }, [error]);

  return (
    <div
      style={{
        padding: '40px 20px',
        maxWidth: '600px',
        margin: '80px auto',
        textAlign: 'center',
        background: 'var(--panel)',
        border: '1px solid var(--line)',
        borderRadius: '4px',
      }}
    >
      <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>Something went wrong</h2>
      <p style={{ color: 'var(--mute)', marginBottom: '24px' }}>
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={() => reset()}
        className="btn"
        style={{ padding: '10px 20px' }}
      >
        Try again
      </button>
    </div>
  );
}

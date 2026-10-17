'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInAction } from '@/lib/admin-actions';

// Inline miner head SVG — same as homepage logo
function MinerHead({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <defs>
        <linearGradient id="lg-sign" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: '#FF7A3D' }} />
          <stop offset="1" style={{ stopColor: '#FF3D81' }} />
        </linearGradient>
      </defs>
      <circle cx="6.4"  cy="23.3" r="2.5" fill="#F5C9A2" />
      <circle cx="33.6" cy="23.3" r="2.5" fill="#F5C9A2" />
      <circle cx="20"   cy="24"   r="13"  fill="#FFDDBD" />
      <circle cx="9.8"  cy="29.8" r="2.4" fill="#FF8FA3" opacity="0.65" />
      <circle cx="30.2" cy="29.8" r="2.4" fill="#FF8FA3" opacity="0.65" />
      <circle cx="14.2" cy="26.2" r="3.2" fill="#1B1A17" />
      <circle cx="25.8" cy="26.2" r="3.2" fill="#1B1A17" />
      <circle cx="13.1" cy="24.9" r="1.15" fill="#fff" />
      <circle cx="15.4" cy="27.7" r="0.55" fill="#fff" />
      <circle cx="24.7" cy="24.9" r="1.15" fill="#fff" />
      <circle cx="27"   cy="27.7" r="0.55" fill="#fff" />
      <path d="M18.2 30.6 Q20 32.6 21.8 30.6" fill="none" stroke="#1B1A17" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M6.5 19 C6.5 9 12 5 20 5 C28 5 33.5 9 33.5 19 Z" fill="url(#lg-sign)" />
      <rect x="4.5" y="17.5" width="31" height="3.4" rx="1.7" fill="url(#lg-sign)" />
      <rect x="4.5" y="19.6" width="31" height="1.3" rx="0.65" fill="#000" opacity="0.18" />
      <path d="M10 13.5 Q12 9 17 7.4" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="20" cy="12" r="6" fill="#FFE9B0" opacity="0.35" />
      <circle cx="20" cy="12" r="3" fill="#FFF3D6" stroke="#1B1A17" strokeOpacity="0.45" strokeWidth="0.8" />
    </svg>
  );
}

export default function SignInForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('password', password);

    const res = await signInAction(null, formData);

    if (res && res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push('/admin/agents');
      router.refresh();
    }
  };

  return (
    <div className="signin-root">
      <div className="signin-card">
        {/* Logo + wordmark */}
        <Link href="/" className="signin-logo">
          <MinerHead size={36} />
          <span className="signin-wordmark">
            MINSO<span className="signin-gtext">.AI</span>
          </span>
        </Link>

        {/* Divider */}
        <div className="signin-divider" />

        {/* Heading */}
        <div className="signin-eyebrow">SYSTEM CONSOLE</div>
        <h1 className="signin-h1">Admin sign in</h1>
        <p className="signin-sub">Authorised personnel only.</p>

        <form onSubmit={handleSubmit} className="signin-form" noValidate>
          <div className="signin-field">
            <label htmlFor="pw" className="signin-label">Password</label>
            <input
              id="pw"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="signin-input"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="signin-error" role="alert" aria-live="polite">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <div className="signin-actions">
            <button
              id="go"
              type="submit"
              disabled={loading}
              className="signin-btn-primary"
            >
              {loading ? (
                <>
                  <span className="signin-spinner" aria-hidden="true" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0B0B0E"
                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </>
              )}
            </button>
            <Link href="/" className="signin-btn-ghost">
              Back to site
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

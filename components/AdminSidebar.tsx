'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOutAction } from '@/lib/admin-actions';

// Inline miner head SVG with the signature gradient
function MinerHead({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <defs>
        <linearGradient id="lg-adm-nav" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--accent)' }} />
          <stop offset="1" style={{ stopColor: 'var(--accent-2)' }} />
        </linearGradient>
      </defs>
      <circle cx="6.4" cy="23.3" r="2.5" fill="#F5C9A2" />
      <circle cx="33.6" cy="23.3" r="2.5" fill="#F5C9A2" />
      <circle cx="20" cy="24" r="13" fill="#FFDDBD" />
      <circle cx="9.8" cy="29.8" r="2.4" fill="#FF8FA3" opacity="0.65" />
      <circle cx="30.2" cy="29.8" r="2.4" fill="#FF8FA3" opacity="0.65" />
      <circle cx="14.2" cy="26.2" r="3.2" fill="#1B1A17" />
      <circle cx="25.8" cy="26.2" r="3.2" fill="#1B1A17" />
      <circle cx="13.1" cy="24.9" r="1.15" fill="#fff" />
      <circle cx="15.4" cy="27.7" r="0.55" fill="#fff" />
      <circle cx="24.7" cy="24.9" r="1.15" fill="#fff" />
      <circle cx="27" cy="27.7" r="0.55" fill="#fff" />
      <path d="M18.2 30.6 Q20 32.6 21.8 30.6" fill="none" stroke="#1B1A17" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M6.5 19 C6.5 9 12 5 20 5 C28 5 33.5 9 33.5 19 Z" fill="url(#lg-adm-nav)" />
      <rect x="4.5" y="17.5" width="31" height="3.4" rx="1.7" fill="url(#lg-adm-nav)" />
      <rect x="4.5" y="19.6" width="31" height="1.3" rx="0.65" fill="#000" opacity="0.18" />
      <path d="M10 13.5 Q12 9 17 7.4" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="20" cy="12" r="6" fill="#FFE9B0" opacity="0.35" />
      <circle cx="20" cy="12" r="3" fill="#FFF3D6" stroke="#1B1A17" strokeOpacity="0.45" strokeWidth="0.8" />
    </svg>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Auto-close drawer on route transition
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const isAgentsActive = pathname === '/admin/agents' || pathname?.startsWith('/admin/agents/');
  const isClientsActive = pathname?.startsWith('/admin/clients');
  const isAnalyticsActive = pathname?.startsWith('/admin/analytics');
  const isDocsActive = pathname?.startsWith('/admin/documents');
  const isQuestionsActive = pathname?.startsWith('/admin/questions');

  return (
    <aside className={`side ${isMobileOpen ? 'side--open' : ''}`}>
      {/* Brand & Console header */}
      <div className="side-top">
        <div className="side-brand-wrap">
          <Link href="/" className="side-logo-link" aria-label="Go to MINSO homepage">
            <MinerHead size={32} />
            <span className="side-logo-wordmark">
              MINSO<span className="gtext">.AI</span>
            </span>
          </Link>
          <div className="side-console-badge">
            <span className="side-console-badge-dot pulse" />
            COMMAND CONSOLE
          </div>
        </div>

        {/* Mobile toggle button */}
        <button
          type="button"
          className="side-mobile-toggle"
          onClick={() => setIsMobileOpen((prev) => !prev)}
          aria-label={isMobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMobileOpen}
        >
          {isMobileOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Collapsible body container for mobile */}
      <div className="side-collapse-body">

      {/* Navigation links */}
      <nav className="side-nav" aria-label="Admin Navigation">
        <Link
          href="/admin/agents"
          className={`side-link ${isAgentsActive ? 'on' : ''}`}
        >
          <span className="side-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
              <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
              <line x1="6" y1="6" x2="6.01" y2="6" />
              <line x1="6" y1="18" x2="6.01" y2="18" />
            </svg>
          </span>
          <span className="side-link-text">Agents</span>
        </Link>

        <Link
          href="/admin/clients"
          className={`side-link ${isClientsActive ? 'on' : ''}`}
        >
          <span className="side-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 21h18" />
              <path d="M9 8h1" />
              <path d="M9 12h1" />
              <path d="M9 16h1" />
              <path d="M14 8h1" />
              <path d="M14 12h1" />
              <path d="M14 16h1" />
              <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
            </svg>
          </span>
          <span className="side-link-text">Client Deployments</span>
        </Link>

        <Link
          href="/admin/analytics"
          className={`side-link ${isAnalyticsActive ? 'on' : ''}`}
        >
          <span className="side-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          </span>
          <span className="side-link-text">Analytics</span>
        </Link>

        <Link
          href="/admin/documents"
          className={`side-link ${isDocsActive ? 'on' : ''}`}
        >
          <span className="side-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </span>
          <span className="side-link-text">Documents</span>
        </Link>

        <Link
          href="/admin/questions"
          className={`side-link ${isQuestionsActive ? 'on' : ''}`}
        >
          <span className="side-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </span>
          <span className="side-link-text">Question Logs</span>
        </Link>
      </nav>

      <div className="sp" />

      {/* Bottom telemetry status & actions */}
      <div className="side-footer">
        <div className="side-status-pill">
          <span className="side-status-dot pulse" />
          <span>Vector DB Active</span>
        </div>

        <Link href="/" className="side-sub-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="side-icon" aria-hidden="true">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          <span>Public Site</span>
        </Link>

        <form action={signOutAction} className="side-logout-form">
          <button type="submit" className="side-logout-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="side-icon" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Sign Out</span>
          </button>
        </form>
      </div>
      </div>
    </aside>
  );
}

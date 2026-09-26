'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { signOutAction } from '@/lib/admin-actions';

export default function AdminSidebar() {
  const pathname = usePathname();
  const isAgentsActive = pathname === '/admin/agents' || pathname?.startsWith('/admin/agents/');
  const isClientsActive = pathname?.startsWith('/admin/clients');
  const isAnalyticsActive = pathname?.startsWith('/admin/analytics');
  const isDocsActive = pathname?.startsWith('/admin/documents');
  const isQuestionsActive = pathname?.startsWith('/admin/questions');

  return (
    <aside className="side">
      <div className="side-top">
        <Logo size={28} />
        <span className="badge">Command Console</span>
      </div>

      <nav className="side-nav">
        <Link
          href="/admin/agents"
          className={`side-link ${isAgentsActive ? 'on' : ''}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="side-icon">
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
            <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
            <line x1="6" y1="6" x2="6.01" y2="6" />
            <line x1="6" y1="18" x2="6.01" y2="18" />
          </svg>
          <span>Agents</span>
        </Link>

        <Link
          href="/admin/clients"
          className={`side-link ${isClientsActive ? 'on' : ''}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="side-icon">
            <path d="M3 21h18" />
            <path d="M9 8h1" />
            <path d="M9 12h1" />
            <path d="M9 16h1" />
            <path d="M14 8h1" />
            <path d="M14 12h1" />
            <path d="M14 16h1" />
            <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
          </svg>
          <span>Client Deployments</span>
        </Link>

        <Link
          href="/admin/analytics"
          className={`side-link ${isAnalyticsActive ? 'on' : ''}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="side-icon">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          <span>Analytics</span>
        </Link>

        <Link
          href="/admin/documents"
          className={`side-link ${isDocsActive ? 'on' : ''}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="side-icon">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          <span>Documents</span>
        </Link>

        <Link
          href="/admin/questions"
          className={`side-link ${isQuestionsActive ? 'on' : ''}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="side-icon">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>Question Logs</span>
        </Link>
      </nav>

      <div className="sp" />

      {/* Bottom status & links */}
      <div className="side-footer">
        <div className="side-status-pill">
          <span className="side-status-dot" />
          <span>Vector DB Active</span>
        </div>

        <Link href="/" className="side-sub-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="side-icon">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          <span>Public Site</span>
        </Link>

        <form action={signOutAction} className="side-logout-form">
          <button type="submit" className="side-logout-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="side-icon">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}

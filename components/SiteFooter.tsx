import Link from 'next/link';

// Discreet SiteFooter component with subtle hidden admin access
export default function SiteFooter() {
  return (
    <footer className="foot">
      <div className="foot-left">
        <span className="foot-logo-text">MINSO.AI</span>
        <span className="foot-divider">·</span>
        <span>Built for a smarter, safer, more efficient mining industry.</span>
      </div>

      <div className="foot-right">
        {/* Discreet admin link that looks like a subtle lock status indicator */}
        <Link
          href="/admin"
          className="discreet-admin-link"
          title="System Console"
          aria-label="System Console"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="discreet-lock-icon"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </Link>
      </div>
    </footer>
  );
}

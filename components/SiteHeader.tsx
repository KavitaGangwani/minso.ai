import Link from 'next/link';

// Inline miner head SVG — homepage nav style
function MinerHead({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <defs>
        <linearGradient id="lg-hdr" x1="0" y1="0" x2="1" y2="1">
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
      <circle cx="24.7" cy="24.9" r="1.15" fill="#fff" />
      <path d="M18.2 30.6 Q20 32.6 21.8 30.6" fill="none" stroke="#1B1A17" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M6.5 19 C6.5 9 12 5 20 5 C28 5 33.5 9 33.5 19 Z" fill="url(#lg-hdr)" />
      <rect x="4.5" y="17.5" width="31" height="3.4" rx="1.7" fill="url(#lg-hdr)" />
      <rect x="4.5" y="19.6" width="31" height="1.3" rx="0.65" fill="#000" opacity="0.18" />
    </svg>
  );
}

// SiteHeader component aligned with the new homepage design language
export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-header-logo" aria-label="MINSO.AI homepage">
          <MinerHead size={32} />
          <span className="site-header-wordmark">
            MINSO<span className="site-header-gtext">.AI</span>
          </span>
        </Link>
        <nav className="site-header-nav" aria-label="Site navigation">
          <Link href="/#agents" className="site-header-nav-link">Agents</Link>
          <Link href="/#features" className="site-header-nav-link">Why MINSO</Link>
        </nav>
      </div>
    </header>
  );
}

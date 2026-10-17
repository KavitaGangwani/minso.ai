import React from 'react';

/**
 * ChatDocsBackground
 * Minimal, delicate, and translucent statutory document sheets & icons
 * blended into the ambient color glow behind the agent chat page.
 */
export default function ChatDocsBackground() {
  return (
    <div className="chat-docs-bg" aria-hidden="true">
      {/* ── Left side mini document: MMDR Act 1957 ── */}
      <div className="chat-mini-card chat-mini-left floaty">
        <div className="chat-mini-paper chat-mini-paper--warm">
          <div className="chat-mini-label">CENTRAL ACT</div>
          <div className="chat-mini-title">MMDR Act, 1957</div>
          <div className="chat-mini-lines">
            <span className="chat-mini-line" style={{ width: '100%' }} />
            <span className="chat-mini-line" style={{ width: '84%' }} />
            <span className="chat-mini-line" style={{ width: '92%' }} />
          </div>
          <div className="chat-mini-highlight chat-mini-highlight--accent">
            Sec. 21 · Penalties & Mining Leases
          </div>
          <div className="chat-mini-lines" style={{ marginTop: 8 }}>
            <span className="chat-mini-line" style={{ width: '88%' }} />
            <span className="chat-mini-line" style={{ width: '68%' }} />
          </div>
          <div className="chat-mini-page">p. 18</div>
          <div className="chat-mini-stamp">VERIFIED</div>
        </div>
      </div>

      {/* ── Right side mini document: RMMCR 2017 ── */}
      <div className="chat-mini-card chat-mini-right floaty2">
        <div className="chat-mini-paper chat-mini-paper--sand">
          <div className="chat-mini-label">STATE RULES</div>
          <div className="chat-mini-title">RMMCR 2017</div>
          <div className="chat-mini-lines">
            <span className="chat-mini-line" style={{ width: '94%' }} />
            <span className="chat-mini-line" style={{ width: '78%' }} />
            <span className="chat-mini-line" style={{ width: '88%' }} />
          </div>
          <div className="chat-mini-highlight chat-mini-highlight--accent2">
            Minor mineral leases & quarry permits
          </div>
          <div className="chat-mini-lines" style={{ marginTop: 8 }}>
            <span className="chat-mini-line" style={{ width: '82%' }} />
            <span className="chat-mini-line" style={{ width: '72%' }} />
          </div>
          <div className="chat-mini-page">p. 42</div>
          <div className="chat-mini-stamp" style={{ animationDelay: '-2s' }}>VERIFIED</div>
        </div>
      </div>

      {/* ── Top right subtle mini document: DGMS Safety SOP ── */}
      <div className="chat-mini-card chat-mini-top-right floaty3">
        <div className="chat-mini-paper chat-mini-paper--pale">
          <div className="chat-mini-label">SAFETY CIRCULAR</div>
          <div className="chat-mini-title">DGMS Safety SOP</div>
          <div className="chat-mini-lines">
            <span className="chat-mini-line" style={{ width: '90%' }} />
            <span className="chat-mini-line" style={{ width: '96%' }} />
            <span className="chat-mini-line" style={{ width: '74%' }} />
          </div>
          <div className="chat-mini-highlight chat-mini-highlight--accent">
            Precautions before open-pit blasting
          </div>
          <div className="chat-mini-lines" style={{ marginTop: 8 }}>
            <span className="chat-mini-line" style={{ width: '80%' }} />
            <span className="chat-mini-line" style={{ width: '92%' }} />
          </div>
          <div className="chat-mini-page">p. 07</div>
          <div className="chat-mini-stamp" style={{ animationDelay: '-4s' }}>VERIFIED</div>
        </div>
      </div>

      {/* ── Floating line-art icons from the homepage (small & transparent) ── */}
      {/* Scales of justice - left top */}
      <svg
        className="chat-mini-icon chat-mini-icon--scales floaty2"
        width="48"
        height="48"
        viewBox="0 0 64 64"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M32 8v44M18 52h28M32 14H14M32 14h18" />
        <path d="M14 14L6 32h16z" />
        <path d="M50 14l-8 18h16z" />
        <path d="M6 32a8 5 0 0 0 16 0M42 32a8 5 0 0 0 16 0" />
      </svg>

      {/* Hard hat - right top */}
      <svg
        className="chat-mini-icon chat-mini-icon--hardhat floaty3"
        width="44"
        height="44"
        viewBox="0 0 64 64"
        fill="none"
        stroke="var(--accent-2)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 42a24 22 0 0 1 48 0z" />
        <path d="M4 42h56v6H4z" />
        <path d="M32 20v22M22 24v18M42 24v18" />
      </svg>

      {/* Pickaxe - right bottom */}
      <svg
        className="chat-mini-icon chat-mini-icon--pickaxe floaty"
        width="42"
        height="42"
        viewBox="0 0 64 64"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 20c10-12 34-12 44 0" />
        <path d="M32 12v40" />
        <path d="M24 52h16" />
        <path d="M12 22c-2 5-1 9 1 13M52 22c2 5 1 9-1 13" />
      </svg>

      {/* Haul truck - left bottom */}
      <svg
        className="chat-mini-icon chat-mini-icon--truck floaty2"
        width="44"
        height="44"
        viewBox="0 0 64 64"
        fill="none"
        stroke="var(--accent-2)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 38h30l8-14h10v14h4v8H8z" />
        <circle cx="20" cy="48" r="6" fill="#07080B" />
        <circle cx="46" cy="48" r="6" fill="#07080B" />
        <path d="M14 38l6-14h18" />
      </svg>

      {/* Clipboard - left middle */}
      <svg
        className="chat-mini-icon chat-mini-icon--clipboard floaty"
        width="40"
        height="40"
        viewBox="0 0 64 64"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="14" y="10" width="36" height="46" rx="4" />
        <path d="M24 6h16v8H24z" />
        <path d="M22 28h20M22 36h20M22 44h12" />
      </svg>
    </div>
  );
}

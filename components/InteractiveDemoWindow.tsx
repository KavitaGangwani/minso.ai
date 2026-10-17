'use client';

import { useState } from 'react';

const QUERIES = [
  'What is the penalty for illegal mining and unauthorized transportation?',
  "Who won last night\u2019s cricket match?",
];

const ON_STYLE = {
  textAlign: 'left' as const,
  padding: '12px 14px',
  borderRadius: '14px',
  border: '1px solid color-mix(in srgb, var(--accent) 55%, transparent)',
  background: 'color-mix(in srgb, var(--accent) 14%, transparent)',
  color: '#F4F1EC',
  cursor: 'pointer',
};

const OFF_STYLE = {
  textAlign: 'left' as const,
  padding: '12px 14px',
  borderRadius: '14px',
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'transparent',
  color: '#A8A29E',
  cursor: 'pointer',
};

export default function InteractiveDemoWindow() {
  const [active, setActive] = useState(0);

  return (
    <div className="demo-outer">
      <div className="demo-window floaty">
        {/* Title bar */}
        <div className="demo-titlebar">
          <div className="demo-dots" aria-hidden="true">
            <span className="demo-dot" />
            <span className="demo-dot" />
            <span className="demo-dot" />
          </div>
          <div className="demo-title">Rajasthan Mining Law Assistant</div>
          {active === 0 ? (
            <span className="demo-badge-grounded">
              <span className="demo-badge-dot-green pulse" />
              GROUNDING VERIFIED
            </span>
          ) : (
            <span className="demo-badge-none">
              <span className="demo-badge-dot-grey" />
              NO SOURCE FOUND
            </span>
          )}
        </div>

        <div className="demo-body">
          {/* Sidebar – chip selector */}
          <aside className="demo-sidebar">
            <div className="demo-sidebar-label">TRY AN INQUIRY</div>
            <div className="demo-chips">
              <button
                className="chip demo-chip"
                style={active === 0 ? ON_STYLE : OFF_STYLE}
                aria-pressed={active === 0}
                onClick={() => setActive(0)}
              >
                <span className="demo-chip-tag">MMDR ACT 1957</span>
                <span className="demo-chip-text">{QUERIES[0]}</span>
              </button>

              <button
                className="chip demo-chip"
                style={active === 1 ? ON_STYLE : OFF_STYLE}
                aria-pressed={active === 1}
                onClick={() => setActive(1)}
              >
                <span className="demo-chip-tag">OUTSIDE THE DOCUMENTS</span>
                <span className="demo-chip-text">{QUERIES[1]}</span>
              </button>
            </div>
          </aside>

          {/* Content pane */}
          <div className="demo-content">
            {/* User bubble */}
            <div className="demo-user-bubble">
              <div className="demo-user-bubble-inner">{QUERIES[active]}</div>
            </div>

            {/* AI response for query 0 */}
            {active === 0 && (
              <div className="demo-ai-row rise" style={{ '--d': '0.5s' } as React.CSSProperties}>
                <span className="demo-ai-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="#0B0B0E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 7h18l-4 6H7z" />
                  </svg>
                </span>
                <div className="demo-ai-body">
                  <p className="demo-ai-text">
                    Under Section 21 of the MMDR Act 1957 (amended), unauthorized mining, transportation, or storage of minerals is a cognizable offence:
                  </p>
                  <div className="demo-bullets">
                    <div className="demo-bullet-row rise" style={{ '--d': '1.1s' } as React.CSSProperties}>
                      <span className="demo-bullet-dot" />
                      <span>
                        Imprisonment up to 5 years, or a fine up to ₹5,00,000 per hectare, or both.{' '}
                        <span className="demo-citation-number">[1]</span>
                      </span>
                    </div>
                    <div className="demo-bullet-row rise" style={{ '--d': '1.6s' } as React.CSSProperties}>
                      <span className="demo-bullet-dot" />
                      <span>
                        Any tool, equipment, vehicle, or animal used in unlawful extraction is liable to confiscation by the competent court.{' '}
                        <span className="demo-citation-number">[1]</span>
                      </span>
                    </div>
                    <div className="demo-bullet-row rise" style={{ '--d': '2.1s' } as React.CSSProperties}>
                      <span className="demo-bullet-dot" />
                      <span>
                        State authorities may recover the full market value of the mineral along with rent, royalty, and tax for the entire illegal period.{' '}
                        <span className="demo-citation-number">[2]</span>
                      </span>
                    </div>
                  </div>
                  <div className="demo-citations rise" style={{ '--d': '2.6s' } as React.CSSProperties}>
                    <span className="demo-citation-chip">[1] MMDR Act · Sec. 21(1) &amp; 21(4) · p. 18</span>
                    <span className="demo-citation-chip">[2] MMDR Act · Sec. 21(5) · p. 19</span>
                  </div>
                </div>
              </div>
            )}

            {/* AI response for query 1 */}
            {active === 1 && (
              <div className="demo-ai-row rise" style={{ '--d': '0.5s' } as React.CSSProperties}>
                <span className="demo-ai-icon-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="#E6E1DA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 7h18l-4 6H7z" />
                  </svg>
                </span>
                <div className="demo-ai-body">
                  <p className="demo-ai-text">
                    I couldn&apos;t find this in the loaded documents, so I won&apos;t guess.
                  </p>
                  <p className="demo-no-source-text rise" style={{ '--d': '1.2s' } as React.CSSProperties}>
                    MINSO only answers from the acts, rules and SOPs loaded into an agent. When the answer isn&apos;t on a page, it says so instead of making up regulatory guidance.
                  </p>
                  <div className="demo-no-citations rise" style={{ '--d': '1.8s' } as React.CSSProperties}>
                    0 citations · nothing invented
                  </div>
                </div>
              </div>
            )}

            {/* Mock text input */}
            <div className="demo-input-mock">
              Ask anything about the loaded documents
              <span className="caret" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

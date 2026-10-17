import '@/app/home.css';
import HeroPit from '@/components/HeroPit';
import InteractiveDemoWindow from '@/components/InteractiveDemoWindow';
import HaulRoadScene from '@/components/HaulRoadScene';
import { getAllAgents } from '@/lib/agents';
import type { Agent } from '@/lib/types';

export const dynamic = 'force-dynamic';

// ---------------------------------------------------------------------------
// Miner head SVG (same art as app/icon.svg) – inlined for nav logo
// ---------------------------------------------------------------------------
function MinerHead({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <defs>
        <linearGradient id="lg-nav" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--accent)' }} />
          <stop offset="1" style={{ stopColor: 'var(--accent-2)' }} />
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
      <path d="M6.5 19 C6.5 9 12 5 20 5 C28 5 33.5 9 33.5 19 Z" fill="url(#lg-nav)" />
      <rect x="4.5" y="17.5" width="31" height="3.4" rx="1.7" fill="url(#lg-nav)" />
      <rect x="4.5" y="19.6" width="31" height="1.3" rx="0.65" fill="#000" opacity="0.18" />
      <path d="M10 13.5 Q12 9 17 7.4" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="20" cy="12" r="6" fill="#FFE9B0" opacity="0.35" />
      <circle cx="20" cy="12" r="3" fill="#FFF3D6" stroke="#1B1A17" strokeOpacity="0.45" strokeWidth="0.8" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Dynamic SVG Icons for Agent Cards
// ---------------------------------------------------------------------------
function AgentIcon({ text, size = 44 }: { text?: string; size?: number }) {
  const norm = (text || '').toLowerCase();
  if (norm.includes('law') || norm.includes('legal') || norm.includes('statut') || norm.includes('rajasthan')) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none"
        stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M32 8v44M18 52h28M32 14H14M32 14h18" />
        <path d="M14 14L6 32h16z" />
        <path d="M50 14l-8 18h16z" />
        <path d="M6 32a8 5 0 0 0 16 0M42 32a8 5 0 0 0 16 0" />
      </svg>
    );
  }
  if (norm.includes('safe') || norm.includes('sop') || norm.includes('hazard') || norm.includes('dgms') || norm.includes('protocol')) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="var(--accent)"
        strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 42a24 22 0 0 1 48 0z" />
        <path d="M4 42h56v6H4z" />
        <path d="M32 20v22M22 24v18M42 24v18" />
      </svg>
    );
  }
  if (norm.includes('operat') || norm.includes('haul') || norm.includes('truck') || norm.includes('fleet') || norm.includes('pit')) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="var(--accent)"
        strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 38h30l8-14h10v14h4v8H8z" />
        <circle cx="20" cy="48" r="6" fill="#07080B" />
        <circle cx="46" cy="48" r="6" fill="#07080B" />
        <path d="M14 38l6-14h18" />
      </svg>
    );
  }
  // Default general / ambassador / compliance badge
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="var(--accent)"
      strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="14" y="10" width="36" height="46" rx="4" />
      <path d="M24 6h16v8H24z" />
      <path d="M22 28h20M22 36h20M22 44h12" />
    </svg>
  );
}

function ComingSoonIcon({ text }: { text?: string }) {
  const norm = (text || '').toLowerCase();
  if (norm.includes('safe') || norm.includes('sop') || norm.includes('hazard') || norm.includes('dgms')) {
    return (
      <svg width="40" height="40" viewBox="0 0 64 64" fill="none" stroke="#A8A29E"
        strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 42a24 22 0 0 1 48 0z" />
        <path d="M4 42h56v6H4z" />
        <path d="M32 20v22M22 24v18M42 24v18" />
      </svg>
    );
  }
  if (norm.includes('operat') || norm.includes('haul') || norm.includes('truck') || norm.includes('fleet')) {
    return (
      <svg width="40" height="40" viewBox="0 0 64 64" fill="none" stroke="#A8A29E"
        strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 38h30l8-14h10v14h4v8H8z" />
        <circle cx="20" cy="48" r="6" fill="#07080B" />
        <circle cx="46" cy="48" r="6" fill="#07080B" />
        <path d="M14 38l6-14h18" />
      </svg>
    );
  }
  return (
    <svg width="40" height="40" viewBox="0 0 64 64" fill="none" stroke="#A8A29E"
      strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="14" y="10" width="36" height="46" rx="4" />
      <path d="M24 6h16v8H24z" />
      <path d="M22 28h20M22 36h20M22 44h12" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Home Page
// ---------------------------------------------------------------------------
export default async function HomePage() {
  const allAgents = await getAllAgents();
  const activeAgents = allAgents.filter((a) => a.published);
  const comingSoonAgents = allAgents.filter((a) => !a.published);

  return (
    <div className="home-root">

      {/* ================================================================
          HERO SECTION
      ================================================================ */}
      <section id="top" className="hero-section">
        {/* Background – pit mine SVG + orbs + grid overlay */}
        <div className="hero-bg" aria-hidden="true">
          <HeroPit />
          <div className="orb orb1" style={{ width: 520, height: 520, left: -140, top: -100, background: 'color-mix(in srgb, var(--accent) 28%, transparent)' }} />
          <div className="orb orb2" style={{ width: 480, height: 480, right: -120, top: 40, background: 'color-mix(in srgb, var(--accent-2) 24%, transparent)' }} />
          <div className="hero-fade-top" />
          <div className="hero-grid" />
          <div className="hero-fade-bottom" />
        </div>

        {/* ── Floating glass nav ── */}
        <div className="home-nav-outer">
          <div className="home-nav-inner glass">
            <a href="#top" className="home-nav-logo">
              <MinerHead size={40} />
              <span className="home-nav-wordmark">
                MINSO<span className="gtext">.AI</span>
              </span>
            </a>
            <nav className="home-nav-links" aria-label="Main navigation">
              <a href="#documents">Documents</a>
              <a href="#agents">Agents</a>
              <a href="#features">Why MINSO</a>
              <a href="#agents" className="btn-nav">Choose an agent</a>
            </nav>
          </div>
        </div>

        {/* ── Hero copy ── */}
        <div className="hero-copy">
          {/* Live rotating pill */}
          <div className="hero-live-pill glass">
            <span className="hero-live-badge">LIVE</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Now reading
              <span className="words">
                <span className="words-track" style={{ color: '#F4F1EC', fontWeight: 600, textAlign: 'left' }}>
                  <span style={{ display: 'block', height: 30 }}>MMDR Act 1957</span>
                  <span style={{ display: 'block', height: 30 }}>RMMCR 2017</span>
                  <span style={{ display: 'block', height: 30 }}>DGMS circulars</span>
                  <span style={{ display: 'block', height: 30 }}>Mine safety SOPs</span>
                  <span style={{ display: 'block', height: 30 }}>MMDR Act 1957</span>
                </span>
              </span>
            </span>
          </div>

          {/* Headline */}
          <h1 className="hero-h1">
            Ask the mining<br />
            <span className="hero-h1-accent gtext">paperwork.</span>
          </h1>

          <p className="hero-sub">
            AI agents for the mining industry. Each one reads its own documents and shows the page every answer came from.
          </p>

          <div className="hero-buttons">
            <a href="#agents" className="btn-primary">
              Choose an agent
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0B0B0E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <a href="#window" className="btn-ghost glass">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#F4F1EC" aria-hidden="true">
                <path d="M7 4l13 8-13 8z" />
              </svg>
              Try interactive demo
            </a>
          </div>
        </div>

        {/* ── Interactive demo window (client component) ── */}
        <div id="window">
          <InteractiveDemoWindow />
        </div>

        <div className="hero-spacer" />
      </section>

      {/* ================================================================
          PAPER TRAIL SECTION
      ================================================================ */}
      <section id="documents" className="paper-trail-section">
        <div className="paper-trail-head">
          <div className="section-eyebrow">THE PAPER TRAIL</div>
          <h2 className="section-h2">
            Acts, rules and circulars,{' '}
            <span className="section-h2-serif gtext">ready for you.</span>
          </h2>
          <p className="section-sub">Each answer points to the exact page. Hover a document to pull it out of the pile.</p>
        </div>

        {/* Cards + floating icons */}
        <div className="paper-trail-cards">
          {/* Floating line-art icons */}
          {/* Scales of justice */}
          <svg className="floaty2 float-icon" width="92" height="92" viewBox="0 0 64 64" fill="none"
            stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
            style={{ left: 0, top: -40 }} aria-hidden="true">
            <path d="M32 8v44M18 52h28M32 14H14M32 14h18" />
            <path d="M14 14L6 32h16z" />
            <path d="M50 14l-8 18h16z" />
            <path d="M6 32a8 5 0 0 0 16 0M42 32a8 5 0 0 0 16 0" />
          </svg>
          {/* Hard hat */}
          <svg className="floaty3 float-icon" width="88" height="88" viewBox="0 0 64 64" fill="none"
            stroke="var(--accent-2)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
            style={{ right: 0, top: -30 }} aria-hidden="true">
            <path d="M8 42a24 22 0 0 1 48 0z" />
            <path d="M4 42h56v6H4z" />
            <path d="M32 20v22M22 24v18M42 24v18" />
          </svg>
          {/* Pickaxe-style / hard hat bottom right */}
          <svg className="floaty float-icon" width="84" height="84" viewBox="0 0 64 64" fill="none"
            stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
            style={{ right: 60, bottom: -60 }} aria-hidden="true">
            <path d="M10 20c10-12 34-12 44 0" />
            <path d="M32 12v40" />
            <path d="M24 52h16" />
            <path d="M12 22c-2 5-1 9 1 13M52 22c2 5 1 9-1 13" />
          </svg>
          {/* Haul truck bottom left */}
          <svg className="floaty2 float-icon" width="84" height="84" viewBox="0 0 64 64" fill="none"
            stroke="var(--accent-2)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
            style={{ left: 50, bottom: -60 }} aria-hidden="true">
            <path d="M8 38h30l8-14h10v14h4v8H8z" />
            <circle cx="20" cy="48" r="6" fill="#07080B" />
            <circle cx="46" cy="48" r="6" fill="#07080B" />
            <path d="M14 38l6-14h18" />
          </svg>

          {/* Paper card 1 – MMDR Act */}
          <div className="paper paper-card" style={{ background: '#F1EBDD', transform: 'rotate(-5deg)' }}>
            <div className="paper-label">CENTRAL ACT</div>
            <div className="paper-title">MMDR Act, 1957</div>
            <div className="paper-lines">
              <span className="paper-line" style={{ width: '100%' }} />
              <span className="paper-line" style={{ width: '86%' }} />
              <span className="paper-line" style={{ width: '94%' }} />
            </div>
            <div className="paper-highlight" style={{ background: 'color-mix(in srgb, var(--accent) 38%, #F1EBDD)' }}>
              Sec. 21 · Penalties for illegal mining and transportation
            </div>
            <div className="paper-lines" style={{ marginTop: 16 }}>
              <span className="paper-line" style={{ width: '92%' }} />
              <span className="paper-line" style={{ width: '70%' }} />
            </div>
            <div className="paper-page">p. 18</div>
            <div className="paper-stamp stamp">VERIFIED</div>
          </div>

          {/* Paper card 2 – RMMCR */}
          <div className="paper paper-card" style={{ background: '#EEE7D6', transform: 'rotate(1.5deg) translateY(24px)' }}>
            <div className="paper-label">STATE RULES</div>
            <div className="paper-title">RMMCR 2017</div>
            <div className="paper-lines">
              <span className="paper-line" style={{ width: '96%' }} />
              <span className="paper-line" style={{ width: '80%' }} />
              <span className="paper-line" style={{ width: '90%' }} />
            </div>
            <div className="paper-highlight" style={{ background: 'color-mix(in srgb, var(--accent-2) 32%, #EEE7D6)' }}>
              Minor mineral lease renewal and extension
            </div>
            <div className="paper-lines" style={{ marginTop: 16 }}>
              <span className="paper-line" style={{ width: '88%' }} />
              <span className="paper-line" style={{ width: '74%' }} />
            </div>
            <div className="paper-stamp stamp" style={{ animationDelay: '-2s' }}>VERIFIED</div>
          </div>

          {/* Paper card 3 – DGMS Safety SOP */}
          <div className="paper paper-card" style={{ background: '#F4EFE3', transform: 'rotate(5deg)' }}>
            <div className="paper-label">SAFETY CIRCULAR</div>
            <div className="paper-title">DGMS Safety SOP</div>
            <div className="paper-lines">
              <span className="paper-line" style={{ width: '90%' }} />
              <span className="paper-line" style={{ width: '100%' }} />
              <span className="paper-line" style={{ width: '78%' }} />
            </div>
            <div className="paper-highlight" style={{ background: 'color-mix(in srgb, var(--accent) 38%, #F4EFE3)' }}>
              Precautions before open-pit blasting
            </div>
            <div className="paper-lines" style={{ marginTop: 16 }}>
              <span className="paper-line" style={{ width: '84%' }} />
              <span className="paper-line" style={{ width: '96%' }} />
            </div>
            <div className="paper-stamp stamp" style={{ animationDelay: '-4s' }}>VERIFIED</div>
          </div>
        </div>
      </section>

      {/* ================================================================
          AGENTS SECTION
      ================================================================ */}
      <section id="agents" className="agents-section">
        <div className="agents-layout">
          {/* Intro copy */}
          <div className="agents-intro">
            <div className="agents-intro-eyebrow">AI AGENTS</div>
            <h2 className="agents-intro-h2">
              Choose an agent and{' '}
              <span className="section-h2-serif gtext">ask it directly.</span>
            </h2>
            <p className="agents-intro-sub">
              One agent per set of documents, so answers never mix across sources.
            </p>
          </div>

          {/* Agent cards */}
          <div className="agents-cards">
            {activeAgents.length === 0 && comingSoonAgents.length === 0 && (
              <div className="agent-soon glass" style={{ textAlign: 'center', justifyContent: 'center', padding: '36px' }}>
                <p style={{ color: '#A8A29E', margin: 0 }}>No agents configured yet. Add or publish agents via the System Console.</p>
              </div>
            )}

            {/* Active / Available Agents */}
            {activeAgents.map((agent) => (
              <a
                key={agent.id}
                href={`/agents/${agent.id}`}
                className="agent-featured card-h"
                aria-label={`Open ${agent.name}`}
              >
                <div className="agent-featured-top">
                  <span className="agent-available-badge">
                    <span className="agent-available-dot pulse" />
                    AVAILABLE
                  </span>
                  <AgentIcon text={`${agent.id} ${agent.name} ${(agent.tags || []).join(' ')}`} />
                </div>
                <h3 className="agent-featured-name">{agent.name}</h3>
                <p className="agent-featured-desc">
                  {agent.description || 'Statutory AI assistant with source-grounded answers.'}
                </p>
                <div className="agent-featured-footer">
                  {agent.tags && agent.tags.length > 0 && (
                    <div className="agent-tags">
                      {agent.tags.map((t) => (
                        <span key={t} className="agent-tag glass">{t}</span>
                      ))}
                    </div>
                  )}
                  <span className="agent-open-btn">
                    Open agent
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0B0B0E"
                      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </div>
              </a>
            ))}

            {/* Coming Soon Agents */}
            {comingSoonAgents.map((agent) => (
              <div key={agent.id} className="agent-soon glass card-h">
                <ComingSoonIcon text={`${agent.id} ${agent.name} ${(agent.tags || []).join(' ')}`} />
                <div className="agent-soon-info">
                  <h3 className="agent-soon-name">{agent.name}</h3>
                  <p className="agent-soon-desc">
                    {agent.description || 'Knowledge base integration and indexing in progress.'}
                  </p>
                  {agent.tags && agent.tags.length > 0 && (
                    <div className="agent-tags" style={{ marginTop: '8px' }}>
                      {agent.tags.map((t) => (
                        <span key={t} className="agent-tag glass" style={{ fontSize: '11px', padding: '3px 8px' }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="agent-soon-badge">COMING SOON</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          FEATURES / WHY MINSO BENTO GRID
      ================================================================ */}
      <section id="features" className="features-section">
        <div className="features-head">
          <div className="section-eyebrow">BUILT FOR MINING COMPLIANCE</div>
          <h2 className="section-h2">
            Why industrial teams rely on{' '}
            <span className="section-h2-serif gtext">MINSO.AI</span>
          </h2>
          <p className="section-sub">
            Engineered specifically for the complex statutory and operational realities of mining enterprises.
          </p>
        </div>

        <div className="features-grid">
          {/* Wide card 1 – Zero-hallucination */}
          <div className="feature-card feature-card-wide glass card-h">
            <div className="feature-card-orb"
              style={{ right: -60, top: -60, width: 260, height: 260, background: 'color-mix(in srgb, var(--accent) 30%, transparent)' }}
              aria-hidden="true" />
            <div style={{ position: 'relative' }}>
              <span className="feature-icon-wrap"
                style={{ background: 'color-mix(in srgb, var(--accent) 16%, transparent)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="var(--accent)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z" />
                  <path d="M9 12l2.2 2.2L15.5 10" />
                </svg>
              </span>
              <h3 className="feature-h3 feature-h3-wide">Strict zero-hallucination</h3>
              <p className="feature-p feature-p-wide">
                If an uploaded mining act or SOP doesn&apos;t explicitly contain the answer, MINSO reports silence rather than fabricating regulatory guidance.
              </p>
              <div className="feature-demo-bar">
                <span className="feature-demo-bar-dot" />
                I couldn&apos;t find this in the loaded documents.
              </div>
            </div>
          </div>

          {/* Slim card – Page-accurate grounding */}
          <div className="feature-card feature-card-slim glass card-h">
            <span className="feature-icon-wrap" style={{ background: 'rgba(74,222,166,0.12)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="#4ADEA6" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 3h8l4 4v14H7z" />
                <path d="M15 3v4h4" />
                <path d="M10 12h6M10 16h6" />
              </svg>
            </span>
            <h3 className="feature-h3 feature-h3-slim">Page-accurate grounding</h3>
            <p className="feature-p feature-p-slim">
              Every answer comes with clickable citation chips referencing the exact document title, statutory rule, section, and page number.
            </p>
            <div className="feature-citation-chips">
              <span className="feature-citation-chip">Sec. 21 · p. 18</span>
              <span className="feature-citation-chip">Sec. 21(5) · p. 19</span>
            </div>
          </div>

          {/* Slim card – Isolated agent sandboxes */}
          <div className="feature-card feature-card-slim glass card-h">
            <span className="feature-icon-wrap"
              style={{ background: 'color-mix(in srgb, var(--accent-2) 16%, transparent)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="var(--accent-2)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3l9 5-9 5-9-5z" />
                <path d="M3 13l9 5 9-5" />
              </svg>
            </span>
            <h3 className="feature-h3 feature-h3-slim">Isolated agent sandboxes</h3>
            <p className="feature-p feature-p-slim">
              Partition lease deeds, DGMS circulars, state concession rules, and internal safety SOPs into dedicated, ring-fenced knowledge agents.
            </p>
            <div className="feature-sandbox-chips">
              <span className="feature-sandbox-chip">Lease deeds</span>
              <span className="feature-sandbox-chip">DGMS</span>
              <span className="feature-sandbox-chip">SOPs</span>
            </div>
          </div>

          {/* Wide card 2 – Sub-second lookup */}
          <div className="feature-card feature-card-wide glass card-h">
            <div className="feature-card-orb"
              style={{ left: -60, bottom: -80, width: 280, height: 280, background: 'color-mix(in srgb, var(--accent-2) 28%, transparent)' }}
              aria-hidden="true" />
            <div style={{ position: 'relative' }}>
              <span className="feature-icon-wrap"
                style={{ background: 'color-mix(in srgb, var(--accent-2) 16%, transparent)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="var(--accent-2)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M13 2L5 14h6l-1 8 8-12h-6z" />
                </svg>
              </span>
              <h3 className="feature-h3 feature-h3-wide">Sub-second statutory lookup</h3>
              <p className="feature-p feature-p-wide">
                Query 500+ page gazettes and concession schedules in milliseconds, cutting down legal compliance research from hours to seconds.
              </p>
              <div className="feature-speed-bar-row">
                <span className="feature-speed-label" style={{ color: '#8C8782' }}>HOURS</span>
                <div className="feature-speed-track">
                  <div className="feature-speed-fill bar" />
                </div>
                <span className="feature-speed-label" style={{ color: 'var(--accent)' }}>SECONDS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          CLOSING CTA – night haul-road scene
      ================================================================ */}
      <section className="cta-section">
        <div className="cta-box">
          <HaulRoadScene />
          <div className="cta-overlay" aria-hidden="true" />
          <div className="cta-content">
            <div className="section-eyebrow">START ASKING</div>
            <h2 className="cta-h2">
              Ready to query your{' '}
              <span className="cta-h2-serif gtext">mining documentation?</span>
            </h2>
            <p className="cta-sub" style={{ maxWidth: 640 }}>
              Select an assistant to explore Rajasthan mining laws, DGMS safety SOPs, or internal operational manuals — or let us build a custom agent tailored specifically to your work or minesite based on your requirements.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', marginTop: 36 }}>
              <a href="mailto:contact@minso.ai?subject=Custom%20Agent%20Request%20for%20Minesite" className="cta-btn" style={{ marginTop: 0 }}>
                Create a custom agent for your minesite
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0B0B0E"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
              <a href="#agents" className="btn-ghost glass" style={{ minHeight: 60, padding: '0 28px', borderRadius: 999, fontSize: 16, fontWeight: 600, display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
                Explore existing agents
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          FOOTER
      ================================================================ */}
      <footer className="home-footer">
        <div className="home-footer-inner">
          <div className="home-footer-left">
            <span className="home-footer-wordmark">
              MINSO<span className="gtext">.AI</span>
            </span>
            <span>Built for a smarter, safer, more efficient mining industry.</span>
          </div>
          <a href="/admin" className="home-footer-link">System console</a>
        </div>
      </footer>

    </div>
  );
}

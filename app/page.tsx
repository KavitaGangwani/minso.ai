import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import MiningHeroVisual from '@/components/MiningHeroVisual';
import AgentCard from '@/components/AgentCard';
import HomeQuerySimulator from '@/components/HomeQuerySimulator';
import { getPublishedAgents } from '@/lib/agents';
import type { Agent } from '@/lib/types';

// Force dynamic so changes in published state reflect immediately
export const dynamic = 'force-dynamic';

// Sample fallback agents to guarantee the full 4-card showcase matching reference mockup
const MOCK_SHOWCASE_AGENTS: Agent[] = [
  {
    id: 'rajasthan-mining-law',
    name: 'Rajasthan Mining Legal Assistant',
    description: 'An AI assistant for exploring Rajasthan mining laws, rules, regulations and related legal documents.',
    tags: ['Rajasthan', 'Mining Law', 'Legal', 'Documents'],
    instructions: '',
    published: true,
    created_at: new Date().toISOString(),
    chunk_size: 800,
    chunk_overlap: 100,
    top_k: 6,
    min_score: 0.5,
  },
  {
    id: 'mine-safety-sop',
    name: 'Mining Safety Assistant',
    description: 'Get answers on safety procedures, risk assessments, DGMS guidelines and best operational practices.',
    tags: ['Safety', 'Compliance', 'Procedures'],
    instructions: '',
    published: true,
    created_at: new Date().toISOString(),
    chunk_size: 800,
    chunk_overlap: 100,
    top_k: 6,
    min_score: 0.5,
  },
  {
    id: 'mining-operations-assistant',
    name: 'Mining Operations Assistant',
    description: 'Support for day-to-day operations, haulage planning, bench extraction and production questions.',
    tags: ['Operations', 'Planning', 'Production'],
    instructions: '',
    published: false,
    created_at: new Date().toISOString(),
    chunk_size: 800,
    chunk_overlap: 100,
    top_k: 6,
    min_score: 0.5,
  },
  {
    id: 'mining-documentation-assistant',
    name: 'Mining Documentation Assistant',
    description: 'Help with statutory reports, lease forms, royalty calculation templates and documentation requirements.',
    tags: ['Reports', 'Templates', 'Compliance'],
    instructions: '',
    published: false,
    created_at: new Date().toISOString(),
    chunk_size: 800,
    chunk_overlap: 100,
    top_k: 6,
    min_score: 0.5,
  },
];

export default async function HomePage() {
  const publishedAgents = await getPublishedAgents();

  // Merge published database agents with showcase list so the UI always has full 4-card grid
  const displayAgents: { agent: Agent; isComingSoon: boolean }[] = [];

  // Add real published agents first
  publishedAgents.forEach((pa) => {
    displayAgents.push({ agent: pa, isComingSoon: false });
  });

  // Supplement with mock showcase cards if fewer than 4 agents exist in database
  MOCK_SHOWCASE_AGENTS.forEach((mock) => {
    const alreadyExists = displayAgents.some((d) => d.agent.id === mock.id);
    if (!alreadyExists && displayAgents.length < 4) {
      displayAgents.push({
        agent: mock,
        isComingSoon: !mock.published,
      });
    }
  });

  return (
    <>
      {/* Clean top header */}
      <SiteHeader />

      {/* Yellow and black hazard stripe */}
      <div className="hazard" />

      {/* Main Container */}
      <main className="wrap">
        {/* ================= HERO SECTION ================= */}
        <section className="hero">
          <div>
            <h1>
              Ask the mining <span>paperwork.</span>
            </h1>

            <p>
              AI agents for the mining industry. Each one reads its own documents
              and shows the page every answer came from.
            </p>

            <div className="hero-actions">
              <a href="#agents" className="btn">
                Choose an agent &rarr;
              </a>
              <a href="#demo" className="btn line">
                Try interactive demo
              </a>
            </div>
          </div>

          {/* Clean High-Tech Visual Schematic Graphic */}
          <div className="hero-visual-wrapper">
            <MiningHeroVisual />
          </div>
        </section>

        {/* ================= AI AGENTS 4-CARD GRID ================= */}
        <section id="agents" className="section-block agents-showcase-section">
          <div className="section-header">
            <h2>AI AGENTS</h2>
            <p className="sub">Choose an agent and ask it directly.</p>
          </div>

          <div className="showcase-agent-grid">
            {displayAgents.map(({ agent, isComingSoon }) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                isComingSoon={isComingSoon}
              />
            ))}
          </div>
        </section>

        {/* ================= INTERACTIVE SIMULATOR ================= */}
        <section id="demo" className="section-block">
          <div className="section-header">
            <span className="section-eyebrow">LIVE CITATION ENGINE</span>
            <h2>Test Statutory Retrieval in Action</h2>
            <p className="sub">
              Select an inquiry to see how MINSO parses complex mining legal frameworks into clause-by-clause verifiable answers.
            </p>
          </div>

          <HomeQuerySimulator />
        </section>

        {/* ================= VALUE PILLARS / FEATURES ================= */}
        <section className="section-block">
          <div className="section-header">
            <span className="section-eyebrow">BUILT FOR MINING COMPLIANCE</span>
            <h2>Why Industrial Teams Rely on MINSO.AI</h2>
            <p className="sub">
              Engineered specifically for the complex statutory and operational realities of mining enterprises.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3>Strict Zero-Hallucination</h3>
              <p>
                If an uploaded mining act or SOP doesn't explicitly contain the answer, MINSO reports silence rather than fabricating regulatory guidance.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <h3>Page-Accurate Grounding</h3>
              <p>
                Every answer comes with clickable citation chips referencing the exact document title, statutory rule, section, and page number.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                  <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                  <line x1="6" y1="6" x2="6.01" y2="6" />
                  <line x1="6" y1="18" x2="6.01" y2="18" />
                </svg>
              </div>
              <h3>Isolated Agent Sandboxes</h3>
              <p>
                Partition lease deeds, DGMS circulars, state concession rules, and internal safety SOPs into dedicated, ring-fenced knowledge agents.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 14 14" />
                </svg>
              </div>
              <h3>Sub-Second Statutory Lookup</h3>
              <p>
                Query 500+ page gazettes and concession schedules in milliseconds, cutting down legal compliance research from hours to seconds.
              </p>
            </div>
          </div>
        </section>

        {/* ================= 3-STEP WORKFLOW ================= */}
        <section className="section-block workflow-section">
          <div className="section-header">
            <span className="section-eyebrow">PRECISION PIPELINE</span>
            <h2>How MINSO Indexes Your Paperwork</h2>
            <p className="sub">
              From raw statutory gazette PDFs to verifiable legal intelligence in three automated steps.
            </p>
          </div>

          <div className="workflow-steps">
            <div className="workflow-step">
              <div className="step-num">01</div>
              <h4>Ingest & Extract</h4>
              <p>
                Upload PDFs of state minor mineral rules, central acts (MMDR 1957), DGMS safety circulars, or internal mine SOPs.
              </p>
            </div>

            <div className="workflow-divider">&rarr;</div>

            <div className="workflow-step">
              <div className="step-num">02</div>
              <h4>Stratified Chunking</h4>
              <p>
                Documents are parsed into semantic chunks that preserve statutory hierarchy, section boundaries, and schedule tables.
              </p>
            </div>

            <div className="workflow-divider">&rarr;</div>

            <div className="workflow-step">
              <div className="step-num">03</div>
              <h4>Cited Synthesis</h4>
              <p>
                Queries execute hybrid vector search to synthesize plain-language answers backed by instant source verification chips.
              </p>
            </div>
          </div>
        </section>

        {/* ================= FINAL CALL-TO-ACTION ================= */}
        <section className="section-block cta-banner">
          <div className="cta-inner">
            <div className="cta-hazard-bar" />
            <div className="cta-body">
              <span className="section-eyebrow">START ASKING</span>
              <h2>Ready to query your mining documentation?</h2>
              <p>
                Select an assistant to explore Rajasthan mining laws, DGMS safety SOPs, or internal operational manuals.
              </p>
              <div className="cta-buttons">
                <a href="#agents" className="btn">
                  Choose an Agent &rarr;
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Site footer with discreet lock */}
      <SiteFooter />
    </>
  );
}

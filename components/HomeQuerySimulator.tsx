'use client';

import { useState } from 'react';
import Link from 'next/link';
import CitationChip from './CitationChip';

interface DemoQuery {
  id: string;
  agentName: string;
  agentId: string;
  question: string;
  summary: string;
  keyPoints: string[];
  citations: Array<{ document: string; section?: string; page?: number }>;
  statuteTag: string;
}

const DEMO_QUERIES: DemoQuery[] = [
  {
    id: 'mmdr-penalty',
    agentName: 'Rajasthan Mining Law Assistant',
    agentId: 'rajasthan-mining-law',
    statuteTag: 'MMDR Act 1957',
    question: 'What is the penalty for illegal mining and unauthorized transportation?',
    summary: 'Under Section 21 of the MMDR Act 1957 (amended), unauthorized mining, transportation, or storage of minerals is a cognizable offence:',
    keyPoints: [
      'Imprisonment up to 5 years, or a fine up to ₹5,00,000 per hectare, or both.',
      'Any tool, equipment, vehicle, or animal used in unlawful extraction is liable to confiscation by the competent court.',
      'State authorities may recover the full market value of the mineral along with rent, royalty, and tax for the entire illegal period.'
    ],
    citations: [
      { document: 'MMDR Act, 1957', section: 'Sec. 21(1) & 21(4)', page: 18 },
      { document: 'MMDR Act, 1957', section: 'Sec. 21(5)', page: 19 }
    ]
  },
  {
    id: 'rmmcr-renewal',
    agentName: 'Rajasthan Mining Law Assistant',
    agentId: 'rajasthan-mining-law',
    statuteTag: 'RMMCR 2017',
    question: 'How do I apply for renewal or extension of a Minor Mineral concession lease?',
    summary: 'According to Rule 14 & Rule 28 of the Rajasthan Minor Mineral Concession Rules, 2017:',
    keyPoints: [
      'Renewal application must be submitted in Form-3 at least 12 months prior to lease expiry.',
      'Requires non-refundable fee payment and valid Environmental Clearance (EC) from SEIAA/DEIAA.',
      'No renewal is granted if the lessee has defaulted on dead rent, royalty, or DMF contributions.'
    ],
    citations: [
      { document: 'Rajasthan Minor Mineral Concession Rules, 2017', section: 'Rule 14(2)', page: 24 },
      { document: 'Rajasthan Minor Mineral Concession Rules, 2017', section: 'Rule 28', page: 38 }
    ]
  },
  {
    id: 'mine-safety-blast',
    agentName: 'Mine Safety SOP Assistant',
    agentId: 'mine-safety-sop',
    statuteTag: 'DGMS Safety SOP',
    question: 'What mandatory safety precautions are required before open-pit blasting?',
    summary: 'As prescribed under DGMS Metalliferous Mines Regulations (MMR) & standard safety SOPs:',
    keyPoints: [
      'Danger zone perimeter of at least 500 meters must be evacuated and guarded by sentries with red flags.',
      'Audible sirens must be sounded at 10-minute, 5-minute, and 1-minute intervals prior to firing.',
      'Post-blast inspection for misfires can only occur after a mandatory waiting period of 30 minutes with blast clearance signal.'
    ],
    citations: [
      { document: 'DGMS Metalliferous Mines Regulations', section: 'Reg. 164 · Danger Zone', page: 42 },
      { document: 'Mine Safety Standard Operating Procedure', section: 'SOP-BLAST-04', page: 8 }
    ]
  }
];

export default function HomeQuerySimulator() {
  const [selectedId, setSelectedId] = useState<string>(DEMO_QUERIES[0].id);
  const current = DEMO_QUERIES.find((q) => q.id === selectedId) || DEMO_QUERIES[0];

  return (
    <div className="query-simulator-container">
      <div className="sim-header">
        <div className="sim-pill">
          <span className="sim-dot" />
          Interactive Statutory Grounding Simulator
        </div>
        <p className="sim-subtitle">
          Select a sample regulatory inquiry below to see how MINSO verifies each clause with exact statutory citations.
        </p>
      </div>

      {/* Query Selector Tabs */}
      <div className="sim-tabs" role="tablist">
        {DEMO_QUERIES.map((item) => {
          const isActive = item.id === selectedId;
          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={isActive}
              className={`sim-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setSelectedId(item.id)}
            >
              <span className="sim-tab-badge">{item.statuteTag}</span>
              <span className="sim-tab-text">{item.question}</span>
            </button>
          );
        })}
      </div>

      {/* Simulated Terminal / Output Window */}
      <div className="sim-terminal">
        <div className="sim-terminal-bar">
          <div className="sim-term-dots">
            <span />
            <span />
            <span />
          </div>
          <div className="sim-term-title">
            <span>Agent:</span> {current.agentName}
          </div>
          <div className="sim-term-status">
            <span className="sim-status-indicator" />
            Grounding Verified
          </div>
        </div>

        <div className="sim-terminal-body">
          {/* User Question */}
          <div className="sim-msg sim-msg-user">
            <div className="sim-msg-label">INQUIRY</div>
            <p>{current.question}</p>
          </div>

          {/* Agent Answer */}
          <div className="sim-msg sim-msg-agent">
            <div className="sim-msg-label">GROUNDED SYNTHESIS</div>
            <p className="sim-ans-summary">{current.summary}</p>
            <ul className="sim-points">
              {current.keyPoints.map((pt, i) => (
                <li key={i}>{pt}</li>
              ))}
            </ul>

            {/* Citations Box */}
            <div className="sim-citations-wrap">
              <span className="sim-citations-label">VERIFIED STATUTORY CITATIONS:</span>
              <div className="sim-chips">
                {current.citations.map((c, i) => (
                  <CitationChip key={i} citation={c} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA inside Simulator */}
        <div className="sim-terminal-footer">
          <span>Need to query custom mining documents or state acts?</span>
          <Link href={`/agents/${current.agentId}`} className="btn btn-sm">
            Launch {current.agentName} &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

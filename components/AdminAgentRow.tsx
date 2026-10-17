'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Agent } from '@/lib/types';
import PublishToggle from './PublishToggle';

interface AdminAgentRowProps {
  agent: Agent;
  documentCount: number | { total: number; pdf: number; url: number; text: number };
}

export default function AdminAgentRow({
  agent,
  documentCount,
}: AdminAgentRowProps) {
  const [isPublished, setIsPublished] = useState(agent.published);
  const totalCount = typeof documentCount === 'number' ? documentCount : documentCount.total || 0;
  const countsObj = typeof documentCount === 'object' ? documentCount : null;

  return (
    <tr className="adm-table-row">
      <td>
        <div className="adm-agent-name">{agent.name}</div>
        <div className="adm-agent-id"><code>{agent.id}</code></div>
        {agent.tags.length > 0 && (
          <div className="adm-agent-tags">
            {agent.tags.map((t) => (
              <span key={t} className="adm-tag-pill glass">{t}</span>
            ))}
          </div>
        )}
      </td>
      <td>
        <div className="adm-doc-count-wrap">
          <span className="adm-doc-badge">{totalCount} {totalCount === 1 ? 'source' : 'sources'}</span>
          {countsObj && totalCount > 0 && (
            <div className="adm-doc-subtypes">
              {countsObj.pdf > 0 && <span className="adm-doc-subpill">📄 {countsObj.pdf} PDF</span>}
              {countsObj.url > 0 && <span className="adm-doc-subpill">🌐 {countsObj.url} Web</span>}
              {countsObj.text > 0 && <span className="adm-doc-subpill">📝 {countsObj.text} Text</span>}
            </div>
          )}
        </div>
      </td>
      <td>
        <span className={`adm-status-pill ${isPublished ? 'adm-status-pill--published' : 'adm-status-pill--draft'}`}>
          <span className={`adm-status-dot ${isPublished ? 'adm-status-dot--live pulse' : ''}`} />
          {isPublished ? 'Published' : 'Draft'}
        </span>
      </td>
      <td>
        <PublishToggle
          agentId={agent.id}
          initialPublished={agent.published}
          onStatusChange={setIsPublished}
        />
      </td>
      <td>
        <div className="adm-row-actions">
          <Link href={`/admin/agents/${agent.id}`} className="adm-action-link edit">
            <span>Configure</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
          {isPublished && (
            <Link href={`/agents/${agent.id}`} target="_blank" className="adm-action-link test" title="Test public chat window">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              <span>Test</span>
            </Link>
          )}
        </div>
      </td>
    </tr>
  );
}

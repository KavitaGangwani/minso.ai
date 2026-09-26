import Link from 'next/link';
import type { Agent } from '@/lib/types';
import AgentIllustration from './AgentIllustration';

interface AgentCardProps {
  agent: Agent;
  isComingSoon?: boolean;
}

export default function AgentCard({ agent, isComingSoon = false }: AgentCardProps) {
  const isAvailable = agent.published && !isComingSoon;

  const cardContent = (
    <div className={`agent-card-box ${isAvailable ? 'available-card' : 'disabled-card'}`}>
      {/* Top Bar with Status Badge */}
      <div className="agent-card-header">
        {isAvailable ? (
          <span className="agent-status-badge available">
            <span className="status-dot green" />
            Available
          </span>
        ) : (
          <span className="agent-status-badge coming-soon">
            Coming Soon
          </span>
        )}
      </div>

      {/* Illustration Area */}
      <div className="agent-card-art">
        <AgentIllustration type={`${agent.id} ${agent.name} ${agent.tags.join(' ')}`} />
      </div>

      {/* Content Body */}
      <div className="agent-card-body">
        <h3 className="agent-card-title">{agent.name}</h3>
        <p className="agent-card-desc">{agent.description}</p>

        {/* Tags */}
        <div className="agent-card-tags">
          {agent.tags.map((tag) => (
            <span key={tag} className="tag-pill">
              {tag}
            </span>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="agent-card-action">
          {isAvailable ? (
            <span className="agent-btn-active">
              Open Agent &rarr;
            </span>
          ) : (
            <span className="agent-btn-disabled">
              Coming Soon &rarr;
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (isAvailable) {
    return (
      <Link
        href={`/agents/${agent.id}`}
        className="agent-card-link"
        aria-label={`Open ${agent.name}`}
      >
        {cardContent}
      </Link>
    );
  }

  return <div className="agent-card-link">{cardContent}</div>;
}

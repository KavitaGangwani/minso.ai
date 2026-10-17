import { notFound } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import ChatWindow from '@/components/ChatWindow';
import { getAgent } from '@/lib/agents';
import ChatDocsBackground from '@/components/ChatDocsBackground';
import '@/app/home.css';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { agentId: string };
}

// Generate dynamic metadata for the chat page from Supabase
export async function generateMetadata({ params }: PageProps) {
  const agent = await getAgent(params.agentId);

  if (!agent || !agent.published) {
    return { title: 'Agent Not Found – MINSO.AI' };
  }

  return {
    title: `${agent.name} – MINSO.AI`,
    description: agent.description,
  };
}

// Agent Chat page for a specific published agent
export default async function AgentChatPage({ params }: PageProps) {
  const agent = await getAgent(params.agentId);

  if (!agent || !agent.published) {
    notFound();
  }

  return (
    <div className="chat-page-root">
      {/* ── Ambient color orbs (vibrant pink & orange glowing background) ── */}
      <div className="orb chat-scene-orb1" aria-hidden="true" />
      <div className="orb chat-scene-orb2" aria-hidden="true" />
      <div className="orb chat-scene-orb3" aria-hidden="true" />

      {/* ── Dot grid ── */}
      <div className="hero-grid chat-scene-grid" aria-hidden="true" />

      {/* ── Top and bottom fades ── */}
      <div className="chat-scene-fade-top"    aria-hidden="true" />
      <div className="chat-scene-fade-bottom" aria-hidden="true" />

      {/* ── Blended documents theme from the homepage (paper cards, stamps & legal icons) ── */}
      <ChatDocsBackground />

      {/* ── Site nav and chat UI (above background) ── */}
      <div className="chat-page-content">
        <SiteHeader />
        <ChatWindow agent={agent} />
      </div>
    </div>
  );
}

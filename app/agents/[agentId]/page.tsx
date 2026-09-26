import { notFound } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import ChatWindow from '@/components/ChatWindow';
import { getAgent } from '@/lib/agents';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { agentId: string };
}

// Generate dynamic metadata for the chat page from Supabase
export async function generateMetadata({ params }: PageProps) {
  const agent = await getAgent(params.agentId);

  if (!agent || !agent.published) {
    return {
      title: 'Agent Not Found – MINSO.AI',
    };
  }

  return {
    title: `${agent.name} – MINSO.AI`,
    description: agent.description,
  };
}

// Agent Chat page for a specific published agent
export default async function AgentChatPage({ params }: PageProps) {
  const agent = await getAgent(params.agentId);

  // Show 404 if agent does not exist in Supabase or is unpublished
  if (!agent || !agent.published) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <ChatWindow agent={agent} />
    </>
  );
}

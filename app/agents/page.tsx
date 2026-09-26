import { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import AgentCard from '@/components/AgentCard';
import { getPublishedAgents } from '@/lib/agents';

// Force dynamic so changes in published state in SQLite reflect immediately
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Agents – MINSO.AI',
  description: 'Pick an agent and start asking questions from mining documents.',
};

// Agents index page listing all published agents from Supabase database
export default async function AgentsPage() {
  const publishedAgents = await getPublishedAgents();

  return (
    <>
      <SiteHeader />

      <main className="wrap">
        <h2 className="pt">Agents</h2>
        <p className="sub">Pick an agent and start asking.</p>

        <div className="grid">
          {publishedAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </main>

      <SiteFooter />
    </>
  );
}

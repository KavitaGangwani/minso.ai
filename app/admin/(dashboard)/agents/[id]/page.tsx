import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getAgent } from '@/lib/agents';
import { getDocumentsByAgentId } from '@/lib/documents';
import { getAgentAnalytics } from '@/lib/analytics';
import AgentInstructionsForm from '@/components/AgentInstructionsForm';
import DocumentUploadSection from '@/components/DocumentUploadSection';
import DocumentRowItem from '@/components/DocumentRowItem';
import PublishToggle from '@/components/PublishToggle';
import AgentChunkAnalytics from '@/components/AgentChunkAnalytics';
import AgentChunkingSettingsForm from '@/components/AgentChunkingSettingsForm';
import DeleteAgentButton from '@/components/DeleteAgentButton';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const agent = await getAgent(params.id);
  if (!agent) return { title: 'Agent Not Found – MINSO.AI Admin' };
  return {
    title: `Edit ${agent.name} – MINSO.AI Admin`,
  };
}

// Edit Agent details, prompt instructions, multi-source documents, analytics, and visibility
export default async function EditAgentPage({ params }: PageProps) {
  const agent = await getAgent(params.id);
  if (!agent) {
    notFound();
  }

  const documents = await getDocumentsByAgentId(agent.id);
  const analytics = await getAgentAnalytics(agent.id);

  return (
    <>
      <p>
        <Link href="/admin/agents" style={{ color: 'var(--mute)' }}>
          ← Agents
        </Link>
      </p>
      <h2>{agent.name}</h2>
      <p className="sub">Edit how this agent behaves and what it knows.</p>

      {/* Instructions Box */}
      <AgentInstructionsForm
        agentId={agent.id}
        initialInstructions={agent.instructions}
      />

      {/* Documents Box supporting PDFs, Web Links, and Plain Text */}
      <div className="box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3>Knowledge Base Documents</h3>
          <span style={{ fontSize: '13px', color: 'var(--mute)' }}>
            {documents.length} {documents.length === 1 ? 'source' : 'sources'}
          </span>
        </div>

        <div id="docs">
          {documents.length === 0 ? (
            <div className="sub" style={{ margin: 0 }}>
              No documents yet. Add a PDF, website link, or raw text below to start.
            </div>
          ) : (
            documents.map((doc) => (
              <DocumentRowItem
                key={doc.id}
                document={doc}
                agentId={agent.id}
              />
            ))
          )}
        </div>

        {/* Multi-Source Knowledge Intake: PDF, Web URL, Plain Text */}
        <DocumentUploadSection agentId={agent.id} />
      </div>

      {/* Performance & Chunking Analytics Box */}
      {analytics && <AgentChunkAnalytics analytics={analytics} />}

      {/* Chunking & Retrieval Parameters Box */}
      <AgentChunkingSettingsForm
        agentId={agent.id}
        initialChunkSize={agent.chunk_size}
        initialChunkOverlap={agent.chunk_overlap}
        initialTopK={agent.top_k}
        initialMinScore={agent.min_score}
      />

      {/* Visibility Box */}
      <div className="box" style={{ marginTop: '24px' }}>
        <h3>Visibility</h3>
        <div className="row">
          <span>Show on public site</span>
          <PublishToggle
            agentId={agent.id}
            initialPublished={agent.published}
          />
        </div>
      </div>

      {/* Delete Agent Section */}
      <DeleteAgentButton agentId={agent.id} agentName={agent.name} />
    </>
  );
}


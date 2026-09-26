import { Metadata } from 'next';
import Link from 'next/link';
import { getAllDocuments } from '@/lib/documents';
import DocumentRowItem from '@/components/DocumentRowItem';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Documents & Knowledge Base – MINSO.AI Admin',
  description: 'Manage and monitor all ingested PDFs, web links, and text documents across mining agents.',
};

export default async function DocumentsManagementPage() {
  const documents = await getAllDocuments();

  const counts = {
    total: documents.length,
    pdf: documents.filter((d) => !d.doc_type || d.doc_type === 'pdf').length,
    url: documents.filter((d) => d.doc_type === 'url').length,
    text: documents.filter((d) => d.doc_type === 'text').length,
    indexed: documents.filter((d) => d.status === 'indexed').length,
  };

  return (
    <>
      <h2>Documents & Knowledge Base</h2>
      <p className="sub">
        Central registry of all PDFs, website links, and plain text documents across all agents.
      </p>

      {/* KPI Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', padding: '14px', borderRadius: '2px' }}>
          <div style={{ fontSize: '12px', color: 'var(--mute)', textTransform: 'uppercase' }}>Total Documents</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-big-shoulders)' }}>
            {counts.total}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--ok)', marginTop: '2px' }}>
            {counts.indexed} indexed
          </div>
        </div>

        <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', padding: '14px', borderRadius: '2px' }}>
          <div style={{ fontSize: '12px', color: 'var(--mute)', textTransform: 'uppercase' }}>PDF Documents</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#FFB81C', fontFamily: 'var(--font-big-shoulders)' }}>
            {counts.pdf}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--mute)', marginTop: '2px' }}>PDF Acts & Manuals</div>
        </div>

        <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', padding: '14px', borderRadius: '2px' }}>
          <div style={{ fontSize: '12px', color: 'var(--mute)', textTransform: 'uppercase' }}>Web Links</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#68B5FF', fontFamily: 'var(--font-big-shoulders)' }}>
            {counts.url}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--mute)', marginTop: '2px' }}>Scraped URLs</div>
        </div>

        <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', padding: '14px', borderRadius: '2px' }}>
          <div style={{ fontSize: '12px', color: 'var(--mute)', textTransform: 'uppercase' }}>Text Documents</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#5DBB7A', fontFamily: 'var(--font-big-shoulders)' }}>
            {counts.text}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--mute)', marginTop: '2px' }}>SOPs & Manual Notes</div>
        </div>
      </div>

      {/* Document Registry List */}
      <div className="box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3>All Ingested Sources</h3>
          <Link href="/admin/agents" style={{ color: 'var(--amber)', fontSize: '14px' }}>
            Go to Agents to add new sources →
          </Link>
        </div>

        {documents.length === 0 ? (
          <div className="sub" style={{ margin: 0 }}>
            No documents in the system yet.
          </div>
        ) : (
          <div id="docs">
            {documents.map((doc) => (
              <div key={doc.id} style={{ borderBottom: '1px solid var(--line)', paddingBottom: '4px' }}>
                <div style={{ fontSize: '12px', color: 'var(--mute)', paddingTop: '6px' }}>
                  Assigned to:{' '}
                  <Link
                    href={`/admin/agents/${doc.agent_id}`}
                    style={{ color: 'var(--amber)', textDecoration: 'underline' }}
                  >
                    {doc.agent_name || doc.agent_id}
                  </Link>
                </div>
                <DocumentRowItem document={doc} agentId={doc.agent_id} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

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
      <div className="adm-kpi-grid">
        <div className="adm-kpi-card">
          <div className="adm-kpi-label">Total Documents</div>
          <div className="adm-kpi-val" style={{ color: 'var(--ink)' }}>{counts.total}</div>
          <div className="adm-kpi-sub" style={{ color: 'var(--ok)' }}>{counts.indexed} indexed in vector DB</div>
        </div>

        <div className="adm-kpi-card">
          <div className="adm-kpi-label">PDF Documents</div>
          <div className="adm-kpi-val" style={{ color: 'var(--accent)' }}>{counts.pdf}</div>
          <div className="adm-kpi-sub">Statutory Acts, Gazettes & Manuals</div>
        </div>

        <div className="adm-kpi-card">
          <div className="adm-kpi-label">Web Links</div>
          <div className="adm-kpi-val" style={{ color: '#68B5FF' }}>{counts.url}</div>
          <div className="adm-kpi-sub">Scraped Mining Portals & URLs</div>
        </div>

        <div className="adm-kpi-card">
          <div className="adm-kpi-label">Text Documents</div>
          <div className="adm-kpi-val" style={{ color: '#5DBB7A' }}>{counts.text}</div>
          <div className="adm-kpi-sub">Internal SOPs & Circular Notes</div>
        </div>
      </div>

      {/* Document Registry List */}
      <div className="box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <h3 style={{ margin: 0 }}>All Ingested Sources</h3>
          <Link href="/admin/agents" className="btn line btn-sm btn-inline-action">
            <span>Go to Agents to add sources</span>
            <span>&rarr;</span>
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

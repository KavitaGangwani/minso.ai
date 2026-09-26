import { Metadata } from 'next';
import Link from 'next/link';
import { getAllAgents } from '@/lib/agents';
import { getDocumentCountsByAgent } from '@/lib/documents';
import AdminAgentRow from '@/components/AdminAgentRow';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Agents Registry – MINSO.AI Admin',
  description: 'Manage mining AI agents and their knowledge sources.',
};

export default async function AdminAgentsPage() {
  const agents = await getAllAgents();
  const documentCounts = await getDocumentCountsByAgent();

  const totalAgents = agents.length;
  const publishedCount = agents.filter((a) => a.published).length;
  const draftCount = totalAgents - publishedCount;
  const totalDocs = Object.values(documentCounts).reduce((sum, c) => sum + (c.total || 0), 0);

  return (
    <>
      {/* Header bar */}
      <div className="adm-header-row">
        <div>
          <h2>Agents Registry</h2>
          <p className="sub">Configure autonomous mining statutory agents and knowledge base permissions.</p>
        </div>
        <Link href="/admin/agents/new" className="btn btn-sm">
          + Create New Agent
        </Link>
      </div>

      {/* Top Level Metric KPIs */}
      <div className="adm-kpi-grid">
        <div className="adm-kpi-card">
          <div className="adm-kpi-label">Total Agents</div>
          <div className="adm-kpi-val">{totalAgents}</div>
          <div className="adm-kpi-sub">Configured in registry</div>
        </div>

        <div className="adm-kpi-card">
          <div className="adm-kpi-label">Published Live</div>
          <div className="adm-kpi-val" style={{ color: 'var(--ok)' }}>{publishedCount}</div>
          <div className="adm-kpi-sub">Active on public site</div>
        </div>

        <div className="adm-kpi-card">
          <div className="adm-kpi-label">Draft / Inactive</div>
          <div className="adm-kpi-val" style={{ color: 'var(--mute)' }}>{draftCount}</div>
          <div className="adm-kpi-sub">Hidden from public</div>
        </div>

        <div className="adm-kpi-card">
          <div className="adm-kpi-label">Ingested Sources</div>
          <div className="adm-kpi-val" style={{ color: '#68B5FF' }}>{totalDocs}</div>
          <div className="adm-kpi-sub">PDFs, Web URLs, & Text</div>
        </div>
      </div>

      {/* Agents Table */}
      <div className="adm-table-container">
        <table>
          <thead>
            <tr>
              <th>Agent & Tags</th>
              <th>Knowledge Sources</th>
              <th>Status</th>
              <th>Live Toggle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <AdminAgentRow
                key={agent.id}
                agent={agent}
                documentCount={documentCounts[agent.id] || { total: 0, pdf: 0, url: 0, text: 0 }}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

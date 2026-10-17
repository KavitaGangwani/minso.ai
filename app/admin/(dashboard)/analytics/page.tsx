import { Metadata } from 'next';
import Link from 'next/link';
import { getGlobalAnalytics } from '@/lib/analytics';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Analytics & Performance – MINSO.AI Admin',
  description: 'Agent performance analytics, chunking sizes, and latency metrics.',
};

export default async function AnalyticsDashboardPage() {
  const analytics = await getGlobalAnalytics();
  const { chunkAnalytics, docTypeBreakdown } = analytics;
  const dist = chunkAnalytics.sizeDistribution;
  const totalChunks = chunkAnalytics.totalChunks || 1;

  const smallPct = Math.round((dist.small / totalChunks) * 100);
  const medPct = Math.round((dist.medium / totalChunks) * 100);
  const optPct = Math.round((dist.optimal / totalChunks) * 100);
  const lrgPct = Math.round((dist.large / totalChunks) * 100);

  return (
    <>
      <h2>Analytics & Performance</h2>
      <p className="sub">
        Platform metrics, chunking distribution analytics, retrieval latencies, and query logs.
      </p>

      {/* Top Level Metric KPIs */}
      <div className="adm-kpi-grid">
        <div className="adm-kpi-card">
          <div className="adm-kpi-label">Total Queries</div>
          <div className="adm-kpi-val" style={{ color: 'var(--accent)' }}>
            {analytics.totalQueries}
          </div>
          <div className="adm-kpi-sub">
            Grounded citation rate: <strong style={{ color: 'var(--ok)' }}>{analytics.groundedQueryRate}%</strong>
          </div>
        </div>

        <div className="adm-kpi-card">
          <div className="adm-kpi-label">Avg Response Latency</div>
          <div className="adm-kpi-val" style={{ color: '#5DBB7A' }}>
            {analytics.avgResponseMs > 0 ? `${analytics.avgResponseMs}ms` : '—'}
          </div>
          <div className="adm-kpi-sub">
            {analytics.avgRetrievalMs}ms retrieval · {analytics.avgLlmMs}ms generation
          </div>
        </div>

        <div className="adm-kpi-card">
          <div className="adm-kpi-label">Total Chunks Indexed</div>
          <div className="adm-kpi-val" style={{ color: '#68B5FF' }}>
            {chunkAnalytics.totalChunks}
          </div>
          <div className="adm-kpi-sub">
            Avg {chunkAnalytics.avgChunkChars} chars (~{chunkAnalytics.avgChunkTokens} tokens)
          </div>
        </div>

        <div className="adm-kpi-card">
          <div className="adm-kpi-label">Knowledge Sources</div>
          <div className="adm-kpi-val" style={{ color: 'var(--ink)' }}>
            {analytics.totalDocuments}
          </div>
          <div className="adm-kpi-sub">
            {docTypeBreakdown.pdf} PDFs · {docTypeBreakdown.url} URLs · {docTypeBreakdown.text} Texts
          </div>
        </div>
      </div>

      {/* Chunking Analytics & Distribution Inspector */}
      <div className="box" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <h3 style={{ margin: 0 }}>Global Chunking Inspector & Size Distribution</h3>
          <span style={{ fontSize: '13px', color: 'var(--mute)' }}>
            Total indexed characters: <strong style={{ color: 'var(--ink)' }}>{chunkAnalytics.totalCharacters.toLocaleString()}</strong>
          </span>
        </div>

        {/* Multi-segment chunk size bar */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
            <span style={{ color: 'var(--mute)' }}>Chunk Size Window Distribution</span>
            <span style={{ color: 'var(--mute)', fontFamily: 'var(--font-jetbrains)' }}>Range: {chunkAnalytics.minChunkChars} – {chunkAnalytics.maxChunkChars} chars</span>
          </div>

          <div style={{ display: 'flex', height: '10px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '999px', overflow: 'hidden' }}>
            {dist.small > 0 && (
              <div
                style={{ width: `${smallPct}%`, backgroundColor: '#8E9299' }}
                title={`Small (<300 chars): ${dist.small} chunks (${smallPct}%)`}
              />
            )}
            {dist.medium > 0 && (
              <div
                style={{ width: `${medPct}%`, backgroundColor: '#68B5FF' }}
                title={`Medium (300-700 chars): ${dist.medium} chunks (${medPct}%)`}
              />
            )}
            {dist.optimal > 0 && (
              <div
                style={{ width: `${optPct}%`, backgroundColor: '#5DBB7A' }}
                title={`Optimal (700-1000 chars): ${dist.optimal} chunks (${optPct}%)`}
              />
            )}
            {dist.large > 0 && (
              <div
                style={{ width: `${lrgPct}%`, backgroundColor: '#FF7A3D' }}
                title={`Large (>1000 chars): ${dist.large} chunks (${lrgPct}%)`}
              />
            )}
          </div>
        </div>

        {/* Legend / Metrics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            background: 'rgba(255, 255, 255, 0.02)',
            padding: '16px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#8E9299', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '11.5px', color: 'var(--mute)' }}>Small (&lt; 300 chars)</div>
              <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--ink)' }}>{dist.small} chunks ({smallPct}%)</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#68B5FF', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '11.5px', color: 'var(--mute)' }}>Medium (300–700 chars)</div>
              <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--ink)' }}>{dist.medium} chunks ({medPct}%)</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#5DBB7A', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '11.5px', color: 'var(--mute)' }}>Optimal (700–1000 chars)</div>
              <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--ink)' }}>{dist.optimal} chunks ({optPct}%)</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#FF7A3D', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '11.5px', color: 'var(--mute)' }}>Large (&gt; 1000 chars)</div>
              <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--ink)' }}>{dist.large} chunks ({lrgPct}%)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Per-Agent Analytics Table */}
      <div style={{ marginBottom: '28px' }}>
        <h3 style={{ marginBottom: '14px' }}>Agent Performance Breakdown</h3>
        <div className="adm-table-container">
          <table>
            <thead>
              <tr>
                <th>Agent</th>
                <th>Status</th>
                <th>Documents Breakdown</th>
                <th>Chunks</th>
                <th>Avg Chunk Size</th>
                <th>Queries</th>
                <th>Avg Latency</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {analytics.agentAnalytics.map((agent) => (
                <tr key={agent.agentId}>
                  <td style={{ fontWeight: 600 }}>{agent.agentName}</td>
                  <td>
                    <span className={`st ${agent.published ? 'pub' : ''}`}>
                      {agent.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: 'var(--mute)' }}>
                      📄 {agent.docCounts.pdf} &nbsp; 🌐 {agent.docCounts.url} &nbsp; 📝 {agent.docCounts.text}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '13px' }}>{agent.chunkAnalytics.totalChunks}</td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '13px' }}>{agent.chunkAnalytics.avgChunkChars} chars</span>{' '}
                    <span style={{ color: 'var(--mute)', fontSize: '11.5px' }}>
                      (~{agent.chunkAnalytics.avgChunkTokens} tok)
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '13px' }}>{agent.queryCount}</td>
                  <td style={{ color: '#5DBB7A', fontWeight: 600, fontFamily: 'var(--font-jetbrains)' }}>
                    {agent.avgTotalMs > 0 ? `${agent.avgTotalMs}ms` : '—'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link href={`/admin/agents/${agent.agentId}`} className="adm-action-link edit">
                      Inspect &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Query Latency & Grounding Logs */}
      <div>
        <div className="adm-header-row" style={{ marginBottom: '14px' }}>
          <div>
            <h3 style={{ margin: 0 }}>Recent Query Logs</h3>
          </div>
          <Link href="/admin/questions" className="btn line btn-sm btn-inline-action">
            <span>View all questions</span>
            <span>&rarr;</span>
          </Link>
        </div>

        <div className="adm-table-container">
          <table>
            <thead>
              <tr>
                <th>Question</th>
                <th>Origin</th>
                <th>Agent</th>
                <th>Retrieval Time</th>
                <th>LLM Generation</th>
                <th>Total Latency</th>
                <th>Grounding Sources</th>
                <th>Logged</th>
              </tr>
            </thead>
            <tbody>
              {analytics.recentLogs.slice(0, 8).map((log) => (
                <tr key={log.id}>
                  <td style={{ fontWeight: 500, maxWidth: '280px' }}>{log.question}</td>
                  <td>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '3px 9px',
                        borderRadius: '999px',
                        fontWeight: 600,
                        background: log.client_name ? 'rgba(104, 181, 255, 0.12)' : 'rgba(255, 122, 61, 0.12)',
                        color: log.client_name ? '#68B5FF' : 'var(--accent)',
                        border: log.client_name ? '1px solid rgba(104, 181, 255, 0.3)' : '1px solid rgba(255, 122, 61, 0.25)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {log.client_name ? `🏢 ${log.client_name}` : '🌐 Main Site'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--mute)', fontSize: '13px' }}>{log.agent_name || log.agent_id}</td>
                  <td style={{ color: 'var(--mute)', fontFamily: 'var(--font-jetbrains)', fontSize: '12px' }}>{Math.round(log.retrieval_ms)}ms</td>
                  <td style={{ color: 'var(--mute)', fontFamily: 'var(--font-jetbrains)', fontSize: '12px' }}>{Math.round(log.llm_ms)}ms</td>
                  <td style={{ color: 'var(--accent)', fontWeight: 600, fontFamily: 'var(--font-jetbrains)', fontSize: '12px' }}>{Math.round(log.total_ms)}ms</td>
                  <td>
                    <span className={`st ${log.sources_count > 0 ? 'pub' : ''}`} style={{ fontSize: '11.5px' }}>
                      {log.sources_count} cited ({log.chunks_retrieved} eval)
                    </span>
                  </td>
                  <td style={{ color: 'var(--mute)', fontSize: '12px', fontFamily: 'var(--font-jetbrains)' }}>
                    {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

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
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', padding: '18px', borderRadius: '2px' }}>
          <div style={{ fontSize: '13px', color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Queries
          </div>
          <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--amber)', fontFamily: 'var(--font-big-shoulders)', lineHeight: 1.1 }}>
            {analytics.totalQueries}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--mute)', marginTop: '4px' }}>
            Grounded citation rate: <strong style={{ color: 'var(--ok)' }}>{analytics.groundedQueryRate}%</strong>
          </div>
        </div>

        <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', padding: '18px', borderRadius: '2px' }}>
          <div style={{ fontSize: '13px', color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Avg Response Latency
          </div>
          <div style={{ fontSize: '36px', fontWeight: 800, color: '#5DBB7A', fontFamily: 'var(--font-big-shoulders)', lineHeight: 1.1 }}>
            {analytics.avgResponseMs > 0 ? `${analytics.avgResponseMs}ms` : '—'}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--mute)', marginTop: '4px' }}>
            {analytics.avgRetrievalMs}ms retrieval · {analytics.avgLlmMs}ms generation
          </div>
        </div>

        <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', padding: '18px', borderRadius: '2px' }}>
          <div style={{ fontSize: '13px', color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Chunks Indexed
          </div>
          <div style={{ fontSize: '36px', fontWeight: 800, color: '#68B5FF', fontFamily: 'var(--font-big-shoulders)', lineHeight: 1.1 }}>
            {chunkAnalytics.totalChunks}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--mute)', marginTop: '4px' }}>
            Avg {chunkAnalytics.avgChunkChars} chars (~{chunkAnalytics.avgChunkTokens} tokens)
          </div>
        </div>

        <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', padding: '18px', borderRadius: '2px' }}>
          <div style={{ fontSize: '13px', color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Knowledge Sources
          </div>
          <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-big-shoulders)', lineHeight: 1.1 }}>
            {analytics.totalDocuments}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--mute)', marginTop: '4px' }}>
            {docTypeBreakdown.pdf} PDFs · {docTypeBreakdown.url} URLs · {docTypeBreakdown.text} Texts
          </div>
        </div>
      </div>

      {/* Chunking Analytics & Distribution Inspector */}
      <div className="box" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3>Global Chunking Inspector & Size Distribution</h3>
          <span style={{ fontSize: '13px', color: 'var(--mute)' }}>
            Total indexed characters: <strong>{chunkAnalytics.totalCharacters.toLocaleString()}</strong>
          </span>
        </div>

        {/* Multi-segment chunk size bar */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
            <span style={{ color: 'var(--mute)' }}>Chunk Size Window Distribution</span>
            <span style={{ color: 'var(--mute)' }}>Range: {chunkAnalytics.minChunkChars} – {chunkAnalytics.maxChunkChars} chars</span>
          </div>

          <div style={{ display: 'flex', height: '14px', background: 'var(--rock2)', borderRadius: '2px', overflow: 'hidden' }}>
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
                style={{ width: `${lrgPct}%`, backgroundColor: '#FFB81C' }}
                title={`Large (>1000 chars): ${dist.large} chunks (${lrgPct}%)`}
              />
            )}
          </div>
        </div>

        {/* Legend / Metrics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            background: 'var(--bg)',
            padding: '14px',
            border: '1px solid var(--line)',
            borderRadius: '2px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#8E9299' }} />
            <div>
              <div style={{ fontSize: '12px', color: 'var(--mute)' }}>Small (&lt; 300 chars)</div>
              <div style={{ fontWeight: 600 }}>{dist.small} chunks ({smallPct}%)</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#68B5FF' }} />
            <div>
              <div style={{ fontSize: '12px', color: 'var(--mute)' }}>Medium (300–700 chars)</div>
              <div style={{ fontWeight: 600 }}>{dist.medium} chunks ({medPct}%)</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#5DBB7A' }} />
            <div>
              <div style={{ fontSize: '12px', color: 'var(--mute)' }}>Optimal (700–1000 chars)</div>
              <div style={{ fontWeight: 600 }}>{dist.optimal} chunks ({optPct}%)</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#FFB81C' }} />
            <div>
              <div style={{ fontSize: '12px', color: 'var(--mute)' }}>Large (&gt; 1000 chars)</div>
              <div style={{ fontWeight: 600 }}>{dist.large} chunks ({lrgPct}%)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Per-Agent Analytics Table */}
      <div style={{ marginBottom: '28px' }}>
        <h3 style={{ fontSize: '28px', marginBottom: '12px' }}>Agent Performance Breakdown</h3>
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
                  <span style={{ fontSize: '13px', color: 'var(--mute)' }}>
                    📄 {agent.docCounts.pdf} &nbsp; 🌐 {agent.docCounts.url} &nbsp; 📝 {agent.docCounts.text}
                  </span>
                </td>
                <td>{agent.chunkAnalytics.totalChunks}</td>
                <td>
                  {agent.chunkAnalytics.avgChunkChars} chars{' '}
                  <span style={{ color: 'var(--mute)', fontSize: '12px' }}>
                    (~{agent.chunkAnalytics.avgChunkTokens} tok)
                  </span>
                </td>
                <td>{agent.queryCount}</td>
                <td style={{ color: '#5DBB7A', fontWeight: 600 }}>
                  {agent.avgTotalMs > 0 ? `${agent.avgTotalMs}ms` : '—'}
                </td>
                <td>
                  <Link href={`/admin/agents/${agent.agentId}`} style={{ color: 'var(--amber)', fontSize: '13px' }}>
                    Inspect →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Query Latency & Grounding Logs */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '28px' }}>Recent Query Logs</h3>
          <Link href="/admin/questions" style={{ color: 'var(--amber)', fontSize: '14px' }}>
            View all questions →
          </Link>
        </div>

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
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontWeight: 600,
                      background: log.client_name ? 'rgba(104, 181, 255, 0.12)' : 'rgba(255, 184, 0, 0.1)',
                      color: log.client_name ? '#68B5FF' : 'var(--amber)',
                      border: log.client_name ? '1px solid rgba(104, 181, 255, 0.3)' : '1px solid rgba(255, 184, 0, 0.3)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {log.client_name ? `🏢 ${log.client_name}` : '🌐 Main Site'}
                  </span>
                </td>
                <td style={{ color: 'var(--mute)', fontSize: '13px' }}>{log.agent_name || log.agent_id}</td>
                <td style={{ color: 'var(--mute)' }}>{Math.round(log.retrieval_ms)}ms</td>
                <td style={{ color: 'var(--mute)' }}>{Math.round(log.llm_ms)}ms</td>
                <td style={{ color: 'var(--amber)', fontWeight: 600 }}>{Math.round(log.total_ms)}ms</td>
                <td>
                  <span className={`st ${log.sources_count > 0 ? 'pub' : ''}`} style={{ fontSize: '12px' }}>
                    {log.sources_count} cited ({log.chunks_retrieved} evaluated)
                  </span>
                </td>
                <td style={{ color: 'var(--mute)', fontSize: '12px' }}>
                  {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

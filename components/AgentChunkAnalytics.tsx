import type { AgentAnalytics } from '@/lib/types';

interface AgentChunkAnalyticsProps {
  analytics: AgentAnalytics;
}

export default function AgentChunkAnalytics({ analytics }: AgentChunkAnalyticsProps) {
  const { chunkAnalytics, docCounts } = analytics;
  const dist = chunkAnalytics.sizeDistribution;
  const total = chunkAnalytics.totalChunks || 1;

  const smallPct = Math.round((dist.small / total) * 100);
  const medPct = Math.round((dist.medium / total) * 100);
  const optPct = Math.round((dist.optimal / total) * 100);
  const lrgPct = Math.round((dist.large / total) * 100);

  return (
    <div className="box" style={{ marginTop: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h3>Analytics & Chunking Performance</h3>
        <span style={{ fontSize: '13px', color: 'var(--mute)' }}>
          {analytics.queryCount} {analytics.queryCount === 1 ? 'query answered' : 'queries answered'}
        </span>
      </div>

      {/* KPI Metric Cards */}
      <div className="adm-kpi-grid" style={{ marginBottom: '20px' }}>
        <div className="adm-kpi-card">
          <div className="adm-kpi-label">Total Chunks</div>
          <div className="adm-kpi-val" style={{ color: 'var(--accent)' }}>
            {chunkAnalytics.totalChunks}
          </div>
          <div className="adm-kpi-sub">
            across {docCounts.total} docs ({docCounts.pdf} PDF · {docCounts.url} URL · {docCounts.text} Text)
          </div>
        </div>

        <div className="adm-kpi-card">
          <div className="adm-kpi-label">Avg Chunk Size</div>
          <div className="adm-kpi-val" style={{ color: 'var(--ink)' }}>
            {chunkAnalytics.avgChunkChars} <span style={{ fontSize: '14px', fontWeight: 400, color: 'var(--mute)' }}>chars</span>
          </div>
          <div className="adm-kpi-sub">
            ~{chunkAnalytics.avgChunkTokens} tokens / chunk
          </div>
        </div>

        <div className="adm-kpi-card">
          <div className="adm-kpi-label">Chunk Range</div>
          <div className="adm-kpi-val" style={{ color: 'var(--ink)' }}>
            {chunkAnalytics.minChunkChars} - {chunkAnalytics.maxChunkChars}
          </div>
          <div className="adm-kpi-sub">
            min to max characters
          </div>
        </div>

        <div className="adm-kpi-card">
          <div className="adm-kpi-label">Avg Response Latency</div>
          <div className="adm-kpi-val" style={{ color: '#5DBB7A' }}>
            {analytics.avgTotalMs > 0 ? `${analytics.avgTotalMs}ms` : '—'}
          </div>
          <div className="adm-kpi-sub">
            {analytics.avgRetrievalMs}ms retrieval · {analytics.avgLlmMs}ms LLM
          </div>
        </div>
      </div>

      {/* Chunk Size Distribution Visualization */}
      <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '12px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600 }}>Chunk Size Distribution Breakdown</span>
          <span style={{ fontSize: '12px', color: 'var(--mute)', fontFamily: 'var(--font-jetbrains)' }}>Target window: 700–1000 chars (Optimal)</span>
        </div>

        {/* Multi-segment progress bar */}
        <div style={{ display: 'flex', height: '10px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '999px', overflow: 'hidden', marginBottom: '12px' }}>
          {dist.small > 0 && <div style={{ width: `${smallPct}%`, backgroundColor: '#8E9299' }} title={`Small (<300c): ${dist.small}`} />}
          {dist.medium > 0 && <div style={{ width: `${medPct}%`, backgroundColor: '#68B5FF' }} title={`Medium (300-700c): ${dist.medium}`} />}
          {dist.optimal > 0 && <div style={{ width: `${optPct}%`, backgroundColor: '#5DBB7A' }} title={`Optimal (700-1000c): ${dist.optimal}`} />}
          {dist.large > 0 && <div style={{ width: `${lrgPct}%`, backgroundColor: '#FF7A3D' }} title={`Large (>1000c): ${dist.large}`} />}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#8E9299', flexShrink: 0 }} />
            <span>&lt; 300c: <strong style={{ color: 'var(--ink)' }}>{dist.small}</strong> ({smallPct}%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#68B5FF', flexShrink: 0 }} />
            <span>300–700c: <strong style={{ color: 'var(--ink)' }}>{dist.medium}</strong> ({medPct}%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#5DBB7A', flexShrink: 0 }} />
            <span>700–1000c: <strong style={{ color: 'var(--ink)' }}>{dist.optimal}</strong> ({optPct}%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FF7A3D', flexShrink: 0 }} />
            <span>&gt; 1000c: <strong style={{ color: 'var(--ink)' }}>{dist.large}</strong> ({lrgPct}%)</span>
          </div>
        </div>
      </div>

      {/* Recent Queries Table */}
      <div>
        <h4 style={{ fontSize: '14px', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--mute)', fontFamily: 'var(--font-jetbrains)' }}>
          Recent Question Logs
        </h4>
        {analytics.recentQueries.length === 0 ? (
          <div style={{ fontSize: '13px', color: 'var(--mute)' }}>
            No queries logged for this agent yet. Questions asked on the public chat interface will appear here in real-time.
          </div>
        ) : (
          <div className="adm-table-container">
            <table>
              <thead>
                <tr>
                  <th>Question</th>
                  <th style={{ width: '100px' }}>Retrieval</th>
                  <th style={{ width: '100px' }}>LLM Time</th>
                  <th style={{ width: '90px' }}>Sources</th>
                  <th style={{ width: '110px' }}>Total Time</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recentQueries.map((q) => (
                  <tr key={q.id}>
                    <td style={{ fontWeight: 500 }}>{q.question}</td>
                    <td style={{ color: 'var(--mute)', fontFamily: 'var(--font-jetbrains)', fontSize: '12px' }}>{Math.round(q.retrieval_ms)}ms</td>
                    <td style={{ color: 'var(--mute)', fontFamily: 'var(--font-jetbrains)', fontSize: '12px' }}>{Math.round(q.llm_ms)}ms</td>
                    <td>
                      <span className={`st ${q.sources_count > 0 ? 'pub' : ''}`} style={{ fontSize: '11px' }}>
                        {q.sources_count} cited
                      </span>
                    </td>
                    <td style={{ color: 'var(--accent)', fontWeight: 600, fontFamily: 'var(--font-jetbrains)', fontSize: '12px' }}>
                      {Math.round(q.total_ms)}ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

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
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <div style={{ background: 'var(--bg)', padding: '12px', border: '1px solid var(--line)', borderRadius: '2px' }}>
          <div style={{ fontSize: '12px', color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Chunks
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--amber)', fontFamily: 'var(--font-big-shoulders)' }}>
            {chunkAnalytics.totalChunks}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--mute)', marginTop: '2px' }}>
            across {docCounts.total} docs ({docCounts.pdf} PDF · {docCounts.url} URL · {docCounts.text} Text)
          </div>
        </div>

        <div style={{ background: 'var(--bg)', padding: '12px', border: '1px solid var(--line)', borderRadius: '2px' }}>
          <div style={{ fontSize: '12px', color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Avg Chunk Size
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-big-shoulders)' }}>
            {chunkAnalytics.avgChunkChars} <span style={{ fontSize: '14px', fontWeight: 400, color: 'var(--mute)' }}>chars</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--mute)', marginTop: '2px' }}>
            ~{chunkAnalytics.avgChunkTokens} tokens / chunk
          </div>
        </div>

        <div style={{ background: 'var(--bg)', padding: '12px', border: '1px solid var(--line)', borderRadius: '2px' }}>
          <div style={{ fontSize: '12px', color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Chunk Range
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-big-shoulders)' }}>
            {chunkAnalytics.minChunkChars} - {chunkAnalytics.maxChunkChars}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--mute)', marginTop: '2px' }}>
            min to max characters
          </div>
        </div>

        <div style={{ background: 'var(--bg)', padding: '12px', border: '1px solid var(--line)', borderRadius: '2px' }}>
          <div style={{ fontSize: '12px', color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Avg Response Latency
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#5DBB7A', fontFamily: 'var(--font-big-shoulders)' }}>
            {analytics.avgTotalMs > 0 ? `${analytics.avgTotalMs}ms` : '—'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--mute)', marginTop: '2px' }}>
            {analytics.avgRetrievalMs}ms retrieval · {analytics.avgLlmMs}ms LLM
          </div>
        </div>
      </div>

      {/* Chunk Size Distribution Visualization */}
      <div style={{ background: 'var(--bg)', padding: '14px', border: '1px solid var(--line)', borderRadius: '2px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600 }}>Chunk Size Distribution Breakdown</span>
          <span style={{ fontSize: '12px', color: 'var(--mute)' }}>Target window: 700–1000 chars (Optimal)</span>
        </div>

        {/* Multi-segment progress bar */}
        <div style={{ display: 'flex', height: '10px', background: 'var(--rock2)', borderRadius: '2px', overflow: 'hidden', marginBottom: '10px' }}>
          {dist.small > 0 && <div style={{ width: `${smallPct}%`, backgroundColor: '#8E9299' }} title={`Small (<300c): ${dist.small}`} />}
          {dist.medium > 0 && <div style={{ width: `${medPct}%`, backgroundColor: '#68B5FF' }} title={`Medium (300-700c): ${dist.medium}`} />}
          {dist.optimal > 0 && <div style={{ width: `${optPct}%`, backgroundColor: '#5DBB7A' }} title={`Optimal (700-1000c): ${dist.optimal}`} />}
          {dist.large > 0 && <div style={{ width: `${lrgPct}%`, backgroundColor: '#FFB81C' }} title={`Large (>1000c): ${dist.large}`} />}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#8E9299' }} />
            <span>&lt; 300 chars: <strong>{dist.small}</strong> ({smallPct}%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#68B5FF' }} />
            <span>300–700 chars: <strong>{dist.medium}</strong> ({medPct}%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#5DBB7A' }} />
            <span>700–1000 chars: <strong>{dist.optimal}</strong> ({optPct}%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FFB81C' }} />
            <span>&gt; 1000 chars: <strong>{dist.large}</strong> ({lrgPct}%)</span>
          </div>
        </div>
      </div>

      {/* Recent Queries Table */}
      <div>
        <h4 style={{ fontSize: '16px', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Recent Question Logs
        </h4>
        {analytics.recentQueries.length === 0 ? (
          <div style={{ fontSize: '13px', color: 'var(--mute)' }}>
            No queries logged for this agent yet. Questions asked on the public chat interface will appear here in real-time.
          </div>
        ) : (
          <table style={{ width: '100%', fontSize: '13px' }}>
            <thead>
              <tr>
                <th style={{ padding: '8px 10px' }}>Question</th>
                <th style={{ padding: '8px 10px', width: '90px' }}>Retrieval</th>
                <th style={{ padding: '8px 10px', width: '90px' }}>LLM Time</th>
                <th style={{ padding: '8px 10px', width: '80px' }}>Sources</th>
                <th style={{ padding: '8px 10px', width: '110px' }}>Total Time</th>
              </tr>
            </thead>
            <tbody>
              {analytics.recentQueries.map((q) => (
                <tr key={q.id}>
                  <td style={{ padding: '8px 10px', fontWeight: 500 }}>{q.question}</td>
                  <td style={{ padding: '8px 10px', color: 'var(--mute)' }}>{Math.round(q.retrieval_ms)}ms</td>
                  <td style={{ padding: '8px 10px', color: 'var(--mute)' }}>{Math.round(q.llm_ms)}ms</td>
                  <td style={{ padding: '8px 10px' }}>
                    <span className={`st ${q.sources_count > 0 ? 'pub' : ''}`} style={{ fontSize: '11px' }}>
                      {q.sources_count} cited
                    </span>
                  </td>
                  <td style={{ padding: '8px 10px', color: '#FFB81C', fontWeight: 600 }}>
                    {Math.round(q.total_ms)}ms
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

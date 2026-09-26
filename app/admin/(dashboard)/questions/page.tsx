import { Metadata } from 'next';
import Link from 'next/link';
import { getAllQueryLogs } from '@/lib/analytics';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Question Logs & Audit – MINSO.AI Admin',
  description: 'Inspect live user queries, grounding performance, and retrieval latencies.',
};

export default async function QuestionsLogsPage() {
  const logs = await getAllQueryLogs(100);

  const totalLogs = logs.length;
  const groundedLogs = logs.filter((l) => l.sources_count > 0).length;
  const avgLatency =
    totalLogs > 0
      ? Math.round(logs.reduce((sum, l) => sum + (l.total_ms || 0), 0) / totalLogs)
      : 0;

  return (
    <>
      <div className="adm-header-row">
        <div>
          <h2>Question Logs</h2>
          <p className="sub">
            Real-time audit log of inquiries asked across all agents, retrieval latency, and verified citation sources.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link href="/admin/analytics" className="btn line btn-sm btn-inline-action">
            <span>View Latency Analytics</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="adm-kpi-grid">
        <div className="adm-kpi-card">
          <div className="adm-kpi-label">Total Questions Logged</div>
          <div className="adm-kpi-val">{totalLogs}</div>
          <div className="adm-kpi-sub">Across all agents</div>
        </div>

        <div className="adm-kpi-card">
          <div className="adm-kpi-label">Grounded with Citations</div>
          <div className="adm-kpi-val" style={{ color: 'var(--ok)' }}>{groundedLogs}</div>
          <div className="adm-kpi-sub">{totalLogs > 0 ? Math.round((groundedLogs / totalLogs) * 100) : 100}% citation rate</div>
        </div>

        <div className="adm-kpi-card">
          <div className="adm-kpi-label">Avg Total Latency</div>
          <div className="adm-kpi-val" style={{ color: '#68B5FF' }}>
            {avgLatency > 0 ? `${avgLatency}ms` : '—'}
          </div>
          <div className="adm-kpi-sub">Retrieval + LLM synthesis</div>
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="box" style={{ padding: '36px', textAlign: 'center' }}>
          <h3>No questions have been logged yet</h3>
          <p className="sub" style={{ margin: '8px 0 20px' }}>
            Ask a question in any published agent to see live performance telemetry and citations logged here.
          </p>
          <Link href="/admin/agents" className="btn btn-sm btn-inline-action">
            <span>Open Agents Registry</span>
            <span>&rarr;</span>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {logs.map((log) => (
            <div
              key={log.id}
              className="box"
              style={{
                marginBottom: 0,
                borderLeft: log.sources_count > 0 ? '4px solid var(--ok)' : '4px solid var(--mute)',
                background: 'var(--panel)',
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      color: 'var(--mute)',
                    }}
                  >
                    Agent:
                  </span>
                  <Link
                    href={`/admin/agents/${log.agent_id}`}
                    style={{ color: 'var(--amber)', fontWeight: 700, fontSize: '14px' }}
                  >
                    {log.agent_name || log.agent_id}
                  </Link>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', fontSize: '12px' }}>
                  <span style={{ color: 'var(--mute)' }}>
                    Retrieval: <strong>{Math.round(log.retrieval_ms)}ms</strong>
                  </span>
                  <span style={{ color: 'var(--line)' }}>|</span>
                  <span style={{ color: 'var(--mute)' }}>
                    LLM: <strong>{Math.round(log.llm_ms)}ms</strong>
                  </span>
                  <span style={{ color: 'var(--line)' }}>|</span>
                  <span style={{ color: 'var(--amber)', fontWeight: 700 }}>
                    Total: {Math.round(log.total_ms)}ms
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '16.5px', fontWeight: 700, color: 'var(--ink)', marginBottom: '10px' }}>
                {log.question}
              </div>

              <div
                style={{
                  fontSize: '14px',
                  color: 'var(--ink)',
                  background: 'var(--bg)',
                  padding: '12px 16px',
                  borderRadius: '2px',
                  border: '1px solid var(--line)',
                  lineHeight: 1.55,
                  marginBottom: '12px',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {log.answer}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '12px', color: 'var(--mute)' }}>
                <span className={`st ${log.sources_count > 0 ? 'pub' : ''}`} style={{ fontSize: '11.5px' }}>
                  {log.sources_count > 0 ? `✓ ${log.sources_count} Citations Grounded` : 'Ungrounded / Fallback Reply'}
                </span>
                <span>
                  {new Date(log.created_at).toLocaleString([], {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

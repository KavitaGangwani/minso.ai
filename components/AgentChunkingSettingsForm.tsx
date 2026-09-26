'use client';

import { useState } from 'react';
import { saveChunkingSettingsAction } from '@/lib/admin-actions';

interface AgentChunkingSettingsFormProps {
  agentId: string;
  initialChunkSize: number;
  initialChunkOverlap: number;
  initialTopK: number;
  initialMinScore: number;
}

export default function AgentChunkingSettingsForm({
  agentId,
  initialChunkSize,
  initialChunkOverlap,
  initialTopK,
  initialMinScore,
}: AgentChunkingSettingsFormProps) {
  const [chunkSize, setChunkSize] = useState(initialChunkSize ?? 800);
  const [chunkOverlap, setChunkOverlap] = useState(initialChunkOverlap ?? 100);
  const [topK, setTopK] = useState(initialTopK ?? 6);
  const [minScore, setMinScore] = useState(initialMinScore ?? 0.50);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const result = await saveChunkingSettingsAction(agentId, {
        chunk_size: Number(chunkSize),
        chunk_overlap: Number(chunkOverlap),
        top_k: Number(topK),
        min_score: Number(minScore),
      });

      if (result && result.error) {
        setMessage({ text: result.error, isError: true });
      } else {
        setMessage({ text: 'Chunking settings saved successfully.', isError: false });
        setTimeout(() => {
          setMessage((curr) => (curr?.isError ? curr : null));
        }, 3500);
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to save settings', isError: true });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="box" style={{ marginTop: '24px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h3>Chunking & Retrieval Settings</h3>
        <p className="sub" style={{ margin: 0, fontSize: '14px' }}>
          Configure text segmentation windows and vector search retrieval parameters for this agent.
        </p>
      </div>

      {message && (
        <div
          style={{
            padding: '10px 14px',
            marginBottom: '16px',
            borderRadius: '2px',
            fontSize: '14px',
            background: message.isError ? 'rgba(255, 122, 107, 0.15)' : 'rgba(93, 187, 122, 0.15)',
            border: message.isError ? '1px solid #FF7A6B' : '1px solid var(--ok)',
            color: message.isError ? '#FF7A6B' : 'var(--ok)',
          }}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            marginBottom: '18px',
          }}
        >
          {/* Chunk Size */}
          <div>
            <label
              htmlFor="chunk-size-input"
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                textTransform: 'uppercase',
                color: 'var(--mute)',
                marginBottom: '6px',
              }}
            >
              Chunk Size (Characters)
            </label>
            <input
              id="chunk-size-input"
              type="number"
              min={100}
              max={4000}
              step={50}
              value={chunkSize}
              onChange={(e) => setChunkSize(Number(e.target.value))}
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'var(--bg)',
                border: '1px solid var(--line)',
                borderRadius: '2px',
                fontSize: '14px',
              }}
            />
            <div style={{ fontSize: '12px', color: 'var(--mute)', marginTop: '4px' }}>
              Target character window per chunk (default: 800).
            </div>
          </div>

          {/* Chunk Overlap */}
          <div>
            <label
              htmlFor="chunk-overlap-input"
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                textTransform: 'uppercase',
                color: 'var(--mute)',
                marginBottom: '6px',
              }}
            >
              Chunk Overlap (Characters)
            </label>
            <input
              id="chunk-overlap-input"
              type="number"
              min={0}
              max={1000}
              step={10}
              value={chunkOverlap}
              onChange={(e) => setChunkOverlap(Number(e.target.value))}
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'var(--bg)',
                border: '1px solid var(--line)',
                borderRadius: '2px',
                fontSize: '14px',
              }}
            />
            <div style={{ fontSize: '12px', color: 'var(--mute)', marginTop: '4px' }}>
              Sliding overlap across consecutive passages (default: 100).
            </div>
          </div>

          {/* Top K */}
          <div>
            <label
              htmlFor="top-k-input"
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                textTransform: 'uppercase',
                color: 'var(--mute)',
                marginBottom: '6px',
              }}
            >
              Top K Chunks
            </label>
            <input
              id="top-k-input"
              type="number"
              min={1}
              max={30}
              step={1}
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'var(--bg)',
                border: '1px solid var(--line)',
                borderRadius: '2px',
                fontSize: '14px',
              }}
            />
            <div style={{ fontSize: '12px', color: 'var(--mute)', marginTop: '4px' }}>
              Maximum retrieved passages provided to LLM (default: 6).
            </div>
          </div>

          {/* Min Score Threshold */}
          <div>
            <label
              htmlFor="min-score-input"
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                textTransform: 'uppercase',
                color: 'var(--mute)',
                marginBottom: '6px',
              }}
            >
              Min Score Threshold (0.0 – 1.0)
            </label>
            <input
              id="min-score-input"
              type="number"
              min={0.0}
              max={1.0}
              step={0.05}
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'var(--bg)',
                border: '1px solid var(--line)',
                borderRadius: '2px',
                fontSize: '14px',
              }}
            />
            <div style={{ fontSize: '12px', color: 'var(--mute)', marginTop: '4px' }}>
              Minimum similarity score to qualify as citation (default: 0.50).
            </div>
          </div>
        </div>

        {/* Warning Note */}
        <div
          style={{
            padding: '12px 14px',
            background: 'var(--panel2)',
            border: '1px solid var(--line)',
            borderLeft: '4px solid var(--amber)',
            borderRadius: '2px',
            fontSize: '13px',
            color: 'var(--ink)',
            marginBottom: '18px',
            lineHeight: 1.5,
          }}
        >
          <strong style={{ color: 'var(--amber)' }}>Note:</strong> Changing chunk size requires reprocessing existing documents to take effect.
        </div>

        <button
          type="submit"
          className="btn"
          disabled={loading}
          style={{ padding: '9px 20px', fontSize: '14px', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Saving Settings...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}

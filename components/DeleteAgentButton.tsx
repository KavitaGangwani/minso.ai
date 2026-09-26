'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteAgentAction } from '@/lib/admin-actions';

interface DeleteAgentButtonProps {
  agentId: string;
  agentName: string;
}

export default function DeleteAgentButton({
  agentId,
  agentName,
}: DeleteAgentButtonProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setError(null);
    setLoading(true);

    try {
      const result = await deleteAgentAction(agentId);
      if (result && result.error) {
        setError(result.error);
        setLoading(false);
      } else {
        router.push('/admin/agents');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete agent.');
      setLoading(false);
    }
  }

  return (
    <div
      className="box"
      style={{
        marginTop: '28px',
        border: '1px solid rgba(255, 122, 107, 0.35)',
        background: 'rgba(255, 122, 107, 0.03)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h3 style={{ color: '#FF7A6B', marginBottom: '4px' }}>Danger Zone</h3>
          <p className="sub" style={{ margin: 0, fontSize: '14px' }}>
            Permanently delete this agent, its uploaded documents, chunk embeddings, and query history.
          </p>
        </div>

        {!showConfirm && (
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            style={{
              background: 'rgba(255, 122, 107, 0.12)',
              color: '#FF7A6B',
              border: '1.5px solid #FF7A6B',
              padding: '10px 18px',
              borderRadius: '2px',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            Delete Agent
          </button>
        )}
      </div>

      {error && (
        <div
          style={{
            padding: '10px 14px',
            background: 'rgba(255, 122, 107, 0.15)',
            border: '1px solid #FF7A6B',
            borderRadius: '2px',
            color: '#FF7A6B',
            fontSize: '14px',
            marginTop: '14px',
          }}
        >
          {error}
        </div>
      )}

      {showConfirm && (
        <div
          style={{
            marginTop: '18px',
            padding: '16px',
            background: 'var(--panel2)',
            border: '1px solid rgba(255, 122, 107, 0.4)',
            borderRadius: '2px',
          }}
        >
          <div style={{ color: 'var(--ink)', fontWeight: 600, fontSize: '15px', marginBottom: '8px' }}>
            ⚠️ Confirm Deletion of &ldquo;{agentName}&rdquo;
          </div>
          <p style={{ color: 'var(--mute)', fontSize: '14px', margin: '0 0 16px', lineHeight: 1.5 }}>
            This will permanently remove the agent row, its document records, all chunk embeddings, its storage folder (<code style={{ color: 'var(--amber)', background: 'var(--bg)', padding: '2px 5px', borderRadius: '2px' }}>data/documents/{agentId}</code>), and query logs. <strong style={{ color: '#FF7A6B' }}>This action cannot be undone.</strong>
          </p>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              style={{
                background: '#FF7A6B',
                color: '#1A0000',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '2px',
                fontWeight: 700,
                fontSize: '14px',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Deleting Agent...' : 'Yes, Permanently Delete Agent'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowConfirm(false);
                setError(null);
              }}
              disabled={loading}
              className="btn line"
              style={{ padding: '9px 18px', fontSize: '14px' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

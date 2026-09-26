'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createAgentAction } from '@/lib/admin-actions';
import { slugifyAgentName } from '@/lib/utils';

const DEFAULT_INSTRUCTIONS =
  "Answer only from the provided sources. Cite the section and page. If unsure, say you don't know.";

export default function CreateAgentForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [instructions, setInstructions] = useState(DEFAULT_INSTRUCTIONS);
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slug = slugifyAgentName(name);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedInstructions = instructions.trim();

    if (!trimmedName) {
      setError('Please enter an agent name.');
      return;
    }

    if (!slug) {
      setError('Agent name must contain letters or numbers to generate a valid ID.');
      return;
    }

    if (!trimmedInstructions) {
      setError('Agent instructions are required.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.set('name', trimmedName);
      formData.set('description', description.trim());
      formData.set('tags', tags.trim());
      formData.set('instructions', trimmedInstructions);
      formData.set('published', published ? 'true' : 'false');

      const result = await createAgentAction(null, formData);

      if (result && result.error) {
        setError(result.error);
        setLoading(false);
      } else if (result && result.success && result.agentId) {
        router.push(`/admin/agents/${result.agentId}`);
      } else {
        setError('An unexpected error occurred. Please try again.');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create agent.');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '680px' }}>
      <div className="box">
        <h3>Agent Details</h3>
        <p className="sub" style={{ marginBottom: '18px' }}>
          Define the identity and knowledge parameters for this agent.
        </p>

        {error && (
          <div
            style={{
              padding: '12px 14px',
              background: 'rgba(255, 122, 107, 0.12)',
              border: '1px solid #FF7A6B',
              borderRadius: '2px',
              color: '#FF7A6B',
              fontSize: '14px',
              marginBottom: '18px',
            }}
          >
            {error}
          </div>
        )}

        {/* Agent Name */}
        <div style={{ marginBottom: '16px' }}>
          <label
            htmlFor="agent-name"
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              textTransform: 'uppercase',
              color: 'var(--mute)',
              marginBottom: '6px',
            }}
          >
            Agent Name <span style={{ color: 'var(--amber)' }}>*</span>
          </label>
          <input
            id="agent-name"
            type="text"
            required
            placeholder="e.g. Rajasthan Mining Law Assistant"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 14px',
              background: 'var(--bg)',
              border: '1px solid var(--line)',
              borderRadius: '2px',
              fontSize: '15px',
            }}
          />
          {slug ? (
            <div style={{ fontSize: '12px', color: 'var(--mute)', marginTop: '5px' }}>
              Generated Agent ID:{' '}
              <code
                style={{
                  color: 'var(--amber)',
                  background: 'var(--panel2)',
                  padding: '2px 6px',
                  borderRadius: '2px',
                  fontFamily: 'monospace',
                }}
              >
                {slug}
              </code>
            </div>
          ) : (
            <div style={{ fontSize: '12px', color: 'var(--mute)', marginTop: '5px' }}>
              Agent ID will be auto-generated from name (lowercase, hyphens, alphanumeric).
            </div>
          )}
        </div>

        {/* Description */}
        <div style={{ marginBottom: '16px' }}>
          <label
            htmlFor="agent-desc"
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              textTransform: 'uppercase',
              color: 'var(--mute)',
              marginBottom: '6px',
            }}
          >
            Description
          </label>
          <input
            id="agent-desc"
            type="text"
            placeholder="e.g. Ask about mining acts, rules and lease procedures."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 14px',
              background: 'var(--bg)',
              border: '1px solid var(--line)',
              borderRadius: '2px',
              fontSize: '15px',
            }}
          />
        </div>

        {/* Tags */}
        <div style={{ marginBottom: '16px' }}>
          <label
            htmlFor="agent-tags"
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              textTransform: 'uppercase',
              color: 'var(--mute)',
              marginBottom: '6px',
            }}
          >
            Tags (Comma-separated)
          </label>
          <input
            id="agent-tags"
            type="text"
            placeholder="e.g. Law, Rajasthan, Compliance"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 14px',
              background: 'var(--bg)',
              border: '1px solid var(--line)',
              borderRadius: '2px',
              fontSize: '15px',
            }}
          />
          <div style={{ fontSize: '12px', color: 'var(--mute)', marginTop: '4px' }}>
            Optional categories displayed on public agent cards.
          </div>
        </div>

        {/* Instructions */}
        <div style={{ marginBottom: '20px' }}>
          <label
            htmlFor="agent-instructions"
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              textTransform: 'uppercase',
              color: 'var(--mute)',
              marginBottom: '6px',
            }}
          >
            Prompt Instructions <span style={{ color: 'var(--amber)' }}>*</span>
          </label>
          <textarea
            id="agent-instructions"
            required
            rows={4}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 14px',
              background: 'var(--bg)',
              border: '1px solid var(--line)',
              borderRadius: '2px',
              fontSize: '14px',
              lineHeight: 1.5,
              minHeight: '100px',
            }}
          />
          <div style={{ fontSize: '12px', color: 'var(--mute)', marginTop: '4px' }}>
            System instructions that constrain how the LLM answers and cites documents.
          </div>
        </div>

        {/* Published Toggle */}
        <div
          className="row"
          style={{
            padding: '14px 0',
            borderTop: '1px solid var(--line)',
            borderBottom: '1px solid var(--line)',
            marginBottom: '24px',
          }}
        >
          <div>
            <div style={{ fontWeight: 600, fontSize: '15px' }}>Published Status</div>
            <div style={{ fontSize: '13px', color: 'var(--mute)' }}>
              Make this agent visible on the public site immediately (off by default).
            </div>
          </div>
          <label className="sw" aria-label="Publish toggle">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              disabled={loading}
            />
            <i />
          </label>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="submit"
            className="btn"
            disabled={loading || !name.trim() || !instructions.trim()}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Creating Agent...' : 'Create Agent'}
          </button>
          <Link
            href="/admin/agents"
            className="btn line"
            style={{ pointerEvents: loading ? 'none' : 'auto' }}
          >
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
}

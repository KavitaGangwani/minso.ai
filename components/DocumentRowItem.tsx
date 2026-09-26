'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { Document } from '@/lib/types';
import { deleteDocumentAction } from '@/lib/admin-actions';

interface DocumentRowItemProps {
  document: Document;
  agentId: string;
}

// Single document row in the agent document list with type badge, chunk count, status, and action buttons
export default function DocumentRowItem({
  document,
  agentId,
}: DocumentRowItemProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isDeleting, startDeleteTransition] = useTransition();
  const [currentStatus, setCurrentStatus] = useState(document.status);
  const [errorMessage, setErrorMessage] = useState(document.error);

  const docType = document.doc_type || 'pdf';

  const handleProcess = async () => {
    setLoading(true);
    setCurrentStatus('processing');
    setErrorMessage(null);

    try {
      const response = await fetch('/api/admin/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId: document.id,
          agentId,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setCurrentStatus('indexed');
        setErrorMessage(null);
        router.refresh();
      } else {
        setCurrentStatus('failed');
        setErrorMessage(result.error || 'Failed to process document');
      }
    } catch (err: any) {
      setCurrentStatus('failed');
      setErrorMessage(err.message || 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!confirm(`Are you sure you want to delete "${document.filename}"?`)) {
      return;
    }

    startDeleteTransition(async () => {
      await deleteDocumentAction(document.id, agentId);
      router.refresh();
    });
  };

  const isIndexed = currentStatus === 'indexed';
  const isFailed = currentStatus === 'failed';
  const isProcessing = loading || currentStatus === 'processing';

  const typeConfig = {
    pdf: { label: 'PDF', icon: '📄', color: '#FFB81C' },
    url: { label: 'WEB', icon: '🌐', color: '#68B5FF' },
    text: { label: 'TEXT', icon: '📝', color: '#5DBB7A' },
  }[docType] || { label: 'DOC', icon: '📄', color: '#ECE8DF' };

  return (
    <div className="row" style={{ padding: '10px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            padding: '2px 6px',
            borderRadius: '2px',
            backgroundColor: 'var(--panel2)',
            border: `1px solid ${typeConfig.color}44`,
            color: typeConfig.color,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            flexShrink: 0,
          }}
        >
          <span>{typeConfig.icon}</span> {typeConfig.label}
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0, overflow: 'hidden' }}>
          <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {document.filename}
          </span>
          {document.source_url && (
            <a
              href={document.source_url}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: '12px', color: 'var(--mute)', textDecoration: 'underline' }}
            >
              {document.source_url}
            </a>
          )}
          {errorMessage && (
            <span style={{ fontSize: '12px', color: '#FF7A6B' }}>
              {errorMessage}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        {isIndexed && typeof document.chunk_count === 'number' && document.chunk_count > 0 && (
          <span
            style={{
              fontSize: '12px',
              color: 'var(--mute)',
              background: 'var(--bg)',
              padding: '2px 7px',
              borderRadius: '2px',
              border: '1px solid var(--line)',
            }}
          >
            {document.chunk_count} {document.chunk_count === 1 ? 'chunk' : 'chunks'}
          </span>
        )}

        <span
          className={`st ${isIndexed ? 'pub' : ''}`}
          style={
            isFailed ? { color: '#FF7A6B', borderColor: '#FF7A6B' } : undefined
          }
        >
          {isProcessing
            ? 'Processing...'
            : isIndexed
            ? 'Indexed'
            : isFailed
            ? 'Failed'
            : 'Uploaded'}
        </span>

        <button
          className="btn line"
          style={{ padding: '4px 10px', fontSize: '13px' }}
          onClick={handleProcess}
          disabled={isProcessing || isDeleting}
        >
          {isProcessing
            ? 'Processing...'
            : isIndexed || isFailed
            ? 'Reprocess'
            : 'Process'}
        </button>

        <button
          className="btn line"
          style={{
            padding: '4px 8px',
            fontSize: '13px',
            color: 'var(--mute)',
            borderColor: 'transparent',
          }}
          onClick={handleDelete}
          disabled={isProcessing || isDeleting}
          title="Delete document"
        >
          {isDeleting ? '...' : '🗑️'}
        </button>
      </div>
    </div>
  );
}


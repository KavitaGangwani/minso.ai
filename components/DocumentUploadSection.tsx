'use client';

import { useState, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  uploadDocumentAction,
  addWebLinkAction,
  addPlainTextAction,
} from '@/lib/admin-actions';

interface DocumentUploadSectionProps {
  agentId: string;
}

export default function DocumentUploadSection({ agentId }: DocumentUploadSectionProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'pdf' | 'url' | 'text'>('pdf');
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // PDF ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Web link state
  const [webUrl, setWebUrl] = useState('');
  const [webTitle, setWebTitle] = useState('');

  // Plain text state
  const [textTitle, setTextTitle] = useState('');
  const [textContent, setTextContent] = useState('');

  // Handle PDF file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setErrorMsg('');
    setSuccessMsg('');

    const formData = new FormData();
    formData.append('file', files[0]);

    startTransition(async () => {
      const result = await uploadDocumentAction(agentId, formData);
      if (result && result.error) {
        setErrorMsg(result.error);
      } else {
        setSuccessMsg(`Uploaded "${files[0].name}". Click "Process" below to index.`);
        router.refresh();
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    });
  };

  // Handle Web link submit
  const handleWebLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!webUrl.trim()) {
      setErrorMsg('Please enter a website URL');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');

    startTransition(async () => {
      const result = await addWebLinkAction(agentId, webUrl, webTitle);
      if (result && result.error) {
        setErrorMsg(result.error);
      } else {
        setSuccessMsg(`Added web link "${webTitle || webUrl}". Click "Process" below to index.`);
        setWebUrl('');
        setWebTitle('');
        router.refresh();
      }
    });
  };

  // Handle Plain text submit
  const handlePlainTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textTitle.trim()) {
      setErrorMsg('Please provide a title for this text');
      return;
    }
    if (!textContent.trim() || textContent.trim().length < 20) {
      setErrorMsg('Text content should be at least 20 characters');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');

    startTransition(async () => {
      const result = await addPlainTextAction(agentId, textTitle, textContent);
      if (result && result.error) {
        setErrorMsg(result.error);
      } else {
        setSuccessMsg(`Added text "${textTitle}". Click "Process" below to index.`);
        setTextTitle('');
        setTextContent('');
        router.refresh();
      }
    });
  };

  return (
    <div style={{ marginTop: '20px', borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
        <button
          type="button"
          onClick={() => { setActiveTab('pdf'); setErrorMsg(''); setSuccessMsg(''); }}
          className={`btn line ${activeTab === 'pdf' ? 'tab-active' : ''}`}
          style={{
            padding: '6px 14px',
            fontSize: '13px',
            backgroundColor: activeTab === 'pdf' ? 'var(--panel2)' : 'transparent',
            borderColor: activeTab === 'pdf' ? 'var(--amber)' : 'var(--line)',
            color: activeTab === 'pdf' ? 'var(--amber)' : 'var(--mute)',
          }}
        >
          📄 PDF Upload
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('url'); setErrorMsg(''); setSuccessMsg(''); }}
          className={`btn line ${activeTab === 'url' ? 'tab-active' : ''}`}
          style={{
            padding: '6px 14px',
            fontSize: '13px',
            backgroundColor: activeTab === 'url' ? 'var(--panel2)' : 'transparent',
            borderColor: activeTab === 'url' ? 'var(--amber)' : 'var(--line)',
            color: activeTab === 'url' ? 'var(--amber)' : 'var(--mute)',
          }}
        >
          🌐 Website Link (URL)
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('text'); setErrorMsg(''); setSuccessMsg(''); }}
          className={`btn line ${activeTab === 'text' ? 'tab-active' : ''}`}
          style={{
            padding: '6px 14px',
            fontSize: '13px',
            backgroundColor: activeTab === 'text' ? 'var(--panel2)' : 'transparent',
            borderColor: activeTab === 'text' ? 'var(--amber)' : 'var(--line)',
            color: activeTab === 'text' ? 'var(--amber)' : 'var(--mute)',
          }}
        >
          📝 Plain Text / Notes
        </button>
      </div>

      {/* PDF Upload Tab */}
      {activeTab === 'pdf' && (
        <div style={{ background: 'var(--bg)', padding: '14px', border: '1px solid var(--line)', borderRadius: '2px' }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'var(--mute)' }}>
            Upload legal gazettes, mining acts, manuals, or safety procedures in PDF format.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
          <button
            className="btn line"
            id="up"
            type="button"
            disabled={isPending}
            onClick={() => fileInputRef.current?.click()}
          >
            {isPending ? 'Uploading...' : 'Choose PDF File'}
          </button>
        </div>
      )}

      {/* Website Link Tab */}
      {activeTab === 'url' && (
        <form onSubmit={handleWebLinkSubmit} style={{ background: 'var(--bg)', padding: '14px', border: '1px solid var(--line)', borderRadius: '2px' }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'var(--mute)' }}>
            Provide a web page URL. Content will be scraped, structured, and vectorized.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '10px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Title (optional, e.g. Ministry Rules)"
              value={webTitle}
              onChange={(e) => setWebTitle(e.target.value)}
              style={{ padding: '8px 12px', background: 'var(--panel)', border: '1px solid var(--line)', color: 'var(--ink)' }}
            />
            <input
              type="url"
              required
              placeholder="https://example.gov.in/rules/mining-act-2024"
              value={webUrl}
              onChange={(e) => setWebUrl(e.target.value)}
              style={{ padding: '8px 12px', background: 'var(--panel)', border: '1px solid var(--line)', color: 'var(--ink)' }}
            />
            <button
              type="submit"
              className="btn"
              disabled={isPending}
              style={{ padding: '8px 16px', fontSize: '14px' }}
            >
              {isPending ? 'Adding...' : 'Add Link'}
            </button>
          </div>
        </form>
      )}

      {/* Plain Text Tab */}
      {activeTab === 'text' && (
        <form onSubmit={handlePlainTextSubmit} style={{ background: 'var(--bg)', padding: '14px', border: '1px solid var(--line)', borderRadius: '2px' }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'var(--mute)' }}>
            Paste raw regulatory notices, internal guidelines, or SOP procedures directly.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="text"
              required
              placeholder="Document Title (e.g. Blasting Safety Checklist)"
              value={textTitle}
              onChange={(e) => setTextTitle(e.target.value)}
              style={{ padding: '8px 12px', background: 'var(--panel)', border: '1px solid var(--line)', color: 'var(--ink)' }}
            />
            <textarea
              required
              rows={4}
              placeholder="Paste or write detailed knowledge text here..."
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              style={{ padding: '10px 12px', background: 'var(--panel)', border: '1px solid var(--line)', color: 'var(--ink)', minHeight: '100px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                className="btn"
                disabled={isPending}
                style={{ padding: '8px 16px', fontSize: '14px' }}
              >
                {isPending ? 'Saving...' : 'Add Text Document'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Feedback Messages */}
      {errorMsg && (
        <div style={{ color: '#FF7A6B', fontSize: '14px', marginTop: '10px' }}>
          ⚠️ {errorMsg}
        </div>
      )}
      {successMsg && (
        <div style={{ color: 'var(--ok)', fontSize: '14px', marginTop: '10px' }}>
          ✓ {successMsg}
        </div>
      )}
    </div>
  );
}

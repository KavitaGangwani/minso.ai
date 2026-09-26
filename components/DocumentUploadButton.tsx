'use client';

import { useRef, useState, useTransition } from 'react';
import { uploadDocumentAction } from '@/lib/admin-actions';

// Upload PDF button with instant file selection and submission
export default function DocumentUploadButton({ agentId }: { agentId: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setErrorMessage('');
    const formData = new FormData();
    formData.append('file', files[0]);

    startTransition(async () => {
      const result = await uploadDocumentAction(agentId, formData);
      if (result && result.error) {
        setErrorMessage(result.error);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    });
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <button
        className="btn line"
        id="up"
        type="button"
        disabled={isPending}
        onClick={() => fileInputRef.current?.click()}
      >
        {isPending ? 'Uploading...' : 'Upload PDF'}
      </button>
      {errorMessage && (
        <span style={{ color: '#FF7A6B', marginLeft: '12px', fontSize: '14px' }}>
          {errorMessage}
        </span>
      )}
    </div>
  );
}

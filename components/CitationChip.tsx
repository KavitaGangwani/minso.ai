export interface CitationInfo {
  document: string;
  section?: string;
  page?: number;
}

// Citation chip showing document name, section, and page number
export default function CitationChip({
  citation,
}: {
  citation: string | CitationInfo;
}) {
  const doc = typeof citation === 'string' ? citation : citation.document;
  const isUrl = doc.startsWith('http://') || doc.startsWith('https://');

  const displayText =
    typeof citation === 'string'
      ? citation
      : `${citation.document}${citation.section && !citation.section.startsWith('Page ') ? ` · ${citation.section}` : ''}${
          citation.page && !isUrl ? ` · p. ${citation.page}` : ''
        }`;

  const inner = (
    <>
      {isUrl ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )}
      <span>{displayText}</span>
    </>
  );

  return (
    <span className="cite-chip">
      {isUrl ? (
        <a
          href={doc}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'inherit', textDecoration: 'none', display: 'contents' }}
        >
          {inner}
        </a>
      ) : (
        inner
      )}
    </span>
  );
}

export interface CitationInfo {
  document: string;
  section?: string;
  page?: number;
}

// Chip component showing citation reference with document name, section, and page
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

  return (
    <span className="chip">
      {isUrl ? (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ) : (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <path d="M12 3v18M6 21h12M4 7h16M4 7l-3 8a3.5 3.5 0 0 0 6 0zM20 7l-3 8a3.5 3.5 0 0 0 6 0z" />
        </svg>
      )}
      {isUrl ? (
        <a
          href={doc}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          {displayText}
        </a>
      ) : (
        displayText
      )}
    </span>
  );
}

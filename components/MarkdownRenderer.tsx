import React from 'react';

// Format inline tokens: **bold**, *italic*, `code`, and [1] or [1, p. 19] bracket citations
export function formatInlineMarkdown(text: string): React.ReactNode[] {
  // Regex splitting by:
  // 1. **bold**
  // 2. *italic*
  // 3. `inline code`
  // 4. [1] or [1, Section: ..., p. 12] citations
  const tokenRegex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[\d+(?:,\s*[^\]]+)?\])/g;

  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Bold: **text**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={index} style={{ fontWeight: 600, color: 'inherit' }}>
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Italic: *text*
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }

    // Inline Code: `code`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={index}
          style={{
            background: 'var(--panel2)',
            padding: '2px 5px',
            borderRadius: '3px',
            fontSize: '0.9em',
            fontFamily: 'monospace',
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Citation badge: [1] or [1, p. 19] or [1, Section: ...]
    if (part.startsWith('[') && part.endsWith(']') && /\[\d+/.test(part)) {
      return (
        <span
          key={index}
          className="cite-pill"
          title={`Citation reference: ${part}`}
        >
          {part}
        </span>
      );
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

// Render multiline Markdown text with headings, ordered/unordered lists, and clean paragraphs
export function MarkdownRenderer({ content }: { content: string }) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let currentList: { type: 'ol' | 'ul'; items: React.ReactNode[] } | null = null;

  const flushList = (key: number) => {
    if (!currentList) return;
    if (currentList.type === 'ol') {
      elements.push(
        <ol
          key={`list-${key}`}
          style={{
            margin: '8px 0 12px',
            paddingLeft: '22px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          {currentList.items.map((item, idx) => (
            <li key={idx} style={{ lineHeight: '1.6' }}>
              {item}
            </li>
          ))}
        </ol>
      );
    } else {
      elements.push(
        <ul
          key={`list-${key}`}
          style={{
            margin: '8px 0 12px',
            paddingLeft: '22px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          {currentList.items.map((item, idx) => (
            <li key={idx} style={{ lineHeight: '1.6' }}>
              {item}
            </li>
          ))}
        </ul>
      );
    }
    currentList = null;
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Empty line separates blocks
    if (!trimmed) {
      flushList(index);
      return;
    }

    // Numbered list item: "1. ", "2. ", etc.
    const olMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (olMatch) {
      if (currentList && currentList.type !== 'ol') {
        flushList(index);
      }
      if (!currentList) {
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(formatInlineMarkdown(olMatch[2]));
      return;
    }

    // Bullet list item: "- ", "* ", "• "
    const ulMatch = trimmed.match(/^[-*•]\s+(.*)$/);
    if (ulMatch) {
      if (currentList && currentList.type !== 'ul') {
        flushList(index);
      }
      if (!currentList) {
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(formatInlineMarkdown(ulMatch[1]));
      return;
    }

    // If regular paragraph / header, flush active list first
    flushList(index);

    // Heading: ### Heading
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h4
          key={`h4-${index}`}
          style={{
            margin: '14px 0 6px',
            fontSize: '15px',
            fontWeight: 600,
            color: 'var(--amber)',
          }}
        >
          {formatInlineMarkdown(trimmed.slice(4))}
        </h4>
      );
      return;
    }

    if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
      const headingText = trimmed.replace(/^#+\s*/, '');
      elements.push(
        <h3
          key={`h3-${index}`}
          style={{
            margin: '16px 0 8px',
            fontSize: '16px',
            fontWeight: 600,
            color: 'var(--amber)',
          }}
        >
          {formatInlineMarkdown(headingText)}
        </h3>
      );
      return;
    }

    // Normal paragraph
    elements.push(
      <p
        key={`p-${index}`}
        style={{
          margin: '0 0 10px',
          lineHeight: '1.65',
        }}
      >
        {formatInlineMarkdown(trimmed)}
      </p>
    );
  });

  flushList(lines.length);

  return <div className="markdown-body">{elements}</div>;
}

export default MarkdownRenderer;

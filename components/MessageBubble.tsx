import MarkdownRenderer from './MarkdownRenderer';
import CitationChip, { CitationInfo } from './CitationChip';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text?: string;
  citations?: Array<string | CitationInfo>;
  isTyping?: boolean;
  isError?: boolean;
}

// Single chat message bubble supporting user prompts, assistant replies, errors, citations, and typing dots
export default function MessageBubble({ message }: { message: ChatMessage }) {
  if (message.sender === 'user') {
    return (
      <div className="msg-row msg-row--user">
        <div className="msg-bubble msg-bubble--user">{message.text}</div>
      </div>
    );
  }

  // Assistant typing indicator
  if (message.isTyping) {
    return (
      <div className="msg-row msg-row--ai">
        <div className="msg-ai-icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 40 40" fill="none">
            <defs>
              <linearGradient id="lg-bubble" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#FF7A3D" />
                <stop offset="1" stopColor="#FF3D81" />
              </linearGradient>
            </defs>
            <circle cx="6.4" cy="23.3" r="2.5" fill="#F5C9A2" />
            <circle cx="33.6" cy="23.3" r="2.5" fill="#F5C9A2" />
            <circle cx="20" cy="24" r="13" fill="#FFDDBD" />
            <circle cx="14.2" cy="26.2" r="3.2" fill="#1B1A17" />
            <circle cx="25.8" cy="26.2" r="3.2" fill="#1B1A17" />
            <path d="M6.5 19 C6.5 9 12 5 20 5 C28 5 33.5 9 33.5 19 Z" fill="url(#lg-bubble)" />
            <rect x="4.5" y="17.5" width="31" height="3.4" rx="1.7" fill="url(#lg-bubble)" />
          </svg>
        </div>
        <div className="msg-bubble msg-bubble--ai" aria-label="Agent is typing">
          <span className="msg-typing-dots">
            <i />
            <i />
            <i />
          </span>
        </div>
      </div>
    );
  }

  const isNotFoundAnswer =
    !message.text ||
    message.text.toLowerCase().includes('could not find this in my documents') ||
    message.text.toLowerCase().startsWith('i could not find') ||
    message.text.toLowerCase().includes('the free model is busy');

  return (
    <div className="msg-row msg-row--ai">
      <div className="msg-ai-icon" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 40 40" fill="none">
          <defs>
            <linearGradient id="lg-bubble2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#FF7A3D" />
              <stop offset="1" stopColor="#FF3D81" />
            </linearGradient>
          </defs>
          <circle cx="6.4" cy="23.3" r="2.5" fill="#F5C9A2" />
          <circle cx="33.6" cy="23.3" r="2.5" fill="#F5C9A2" />
          <circle cx="20" cy="24" r="13" fill="#FFDDBD" />
          <circle cx="14.2" cy="26.2" r="3.2" fill="#1B1A17" />
          <circle cx="25.8" cy="26.2" r="3.2" fill="#1B1A17" />
          <path d="M6.5 19 C6.5 9 12 5 20 5 C28 5 33.5 9 33.5 19 Z" fill="url(#lg-bubble2)" />
          <rect x="4.5" y="17.5" width="31" height="3.4" rx="1.7" fill="url(#lg-bubble2)" />
        </svg>
      </div>
      <div
        className={`msg-bubble msg-bubble--ai${message.isError ? ' msg-bubble--error' : ''}`}
      >
        <div style={{ lineHeight: '1.65' }}>
          {message.text ? <MarkdownRenderer content={message.text} /> : null}
        </div>

        {!isNotFoundAnswer && message.citations && message.citations.length > 0 && (
          <div className="msg-citations">
            <span className="msg-citations-label">Sources</span>
            <div className="msg-citations-chips">
              {message.citations.map((cite, index) => (
                <CitationChip key={index} citation={cite} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
    return <div className="m u">{message.text}</div>;
  }

  // Assistant typing indicator
  if (message.isTyping) {
    return (
      <div className="m a" aria-label="Agent is typing">
        <span className="dots">
          <i />
          <i />
          <i />
        </span>
      </div>
    );
  }

  const isNotFoundAnswer =
    !message.text ||
    message.text.toLowerCase().includes('could not find this in my documents') ||
    message.text.toLowerCase().startsWith('i could not find') ||
    message.text.toLowerCase().includes('the free model is busy');

  return (
    <div
      className="m a"
      style={
        message.isError
          ? { borderColor: '#FF7A6B', borderLeftColor: '#FF7A6B' }
          : undefined
      }
    >
      <div style={{ lineHeight: '1.6' }}>
        {message.text ? (
          <MarkdownRenderer content={message.text} />
        ) : null}
      </div>

      {!isNotFoundAnswer && message.citations && message.citations.length > 0 && (
        <div
          style={{
            marginTop: '8px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
          }}
        >
          {message.citations.map((cite, index) => (
            <CitationChip key={index} citation={cite} />
          ))}
        </div>
      )}
    </div>
  );
}

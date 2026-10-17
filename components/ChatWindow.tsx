'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import type { Agent } from '@/lib/types';
import MessageBubble, { ChatMessage } from './MessageBubble';

const DEFAULT_SUGGESTED_QUESTIONS: Record<string, string[]> = {
  'rajasthan-mining-law': [
    'What is the maximum period for which a mining lease can be granted?',
    'What is required when applying for a mining lease on Khatedari land?',
    'What notice period is required before cancellation or adverse orders?',
  ],
  'mine-safety-sop': [
    'What mandatory safety precautions are required before open-pit blasting?',
    'What are the mandatory PPE requirements for open-cast workers?',
    'What is the emergency protocol during bench or slope failure?',
  ],
};

// Inline miner head SVG for chat header
function MinerHead({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="lg-chat" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: '#FF7A3D' }} />
          <stop offset="1" style={{ stopColor: '#FF3D81' }} />
        </linearGradient>
      </defs>
      <circle cx="6.4"  cy="23.3" r="2.5" fill="#F5C9A2" />
      <circle cx="33.6" cy="23.3" r="2.5" fill="#F5C9A2" />
      <circle cx="20"   cy="24"   r="13"  fill="#FFDDBD" />
      <circle cx="9.8"  cy="29.8" r="2.4" fill="#FF8FA3" opacity="0.65" />
      <circle cx="30.2" cy="29.8" r="2.4" fill="#FF8FA3" opacity="0.65" />
      <circle cx="14.2" cy="26.2" r="3.2" fill="#1B1A17" />
      <circle cx="25.8" cy="26.2" r="3.2" fill="#1B1A17" />
      <circle cx="13.1" cy="24.9" r="1.15" fill="#fff" />
      <circle cx="24.7" cy="24.9" r="1.15" fill="#fff" />
      <path d="M18.2 30.6 Q20 32.6 21.8 30.6" fill="none" stroke="#1B1A17" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M6.5 19 C6.5 9 12 5 20 5 C28 5 33.5 9 33.5 19 Z" fill="url(#lg-chat)" />
      <rect x="4.5" y="17.5" width="31" height="3.4" rx="1.7" fill="url(#lg-chat)" />
    </svg>
  );
}

// Interactive chat window for conversing with an agent powered by real RAG
export default function ChatWindow({ agent }: { agent: Agent }) {
  const suggestedQuestions =
    DEFAULT_SUGGESTED_QUESTIONS[agent.id] ||
    DEFAULT_SUGGESTED_QUESTIONS['rajasthan-mining-law'];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: "Hello. I answer from my documents and show the source for every answer. If they don't cover it, I'll say so.",
    },
  ]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const msgsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to latest message
  useEffect(() => {
    msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    setShowSuggestions(false);
    setInputValue('');
    setLoading(true);

    const userMessageId = 'user-' + Date.now();
    const typingMessageId = 'typing-' + Date.now();

    setMessages((prev) => [
      ...prev,
      { id: userMessageId, sender: 'user', text: trimmed },
      { id: typingMessageId, sender: 'assistant', isTyping: true },
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: agent.id,
          question: trimmed,
          source: 'main-website',
          clientId: 'client-direct',
          clientDomain: window.location.origin || 'https://minso.ai',
        }),
      });

      let data: any = null;
      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        try { data = await response.json(); }
        catch { data = { error: 'Invalid JSON received from server.' }; }
      } else {
        const textError = await response.text();
        data = { error: response.ok ? textError : `Server error (${response.status}): ${response.statusText || 'Function execution failed'}` };
      }

      if (!response.ok || data?.error) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === typingMessageId
              ? { id: 'reply-' + Date.now(), sender: 'assistant', text: data?.error || 'Failed to get answer. Please try again.', isError: true }
              : msg
          )
        );
      } else {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === typingMessageId
              ? { id: 'reply-' + Date.now(), sender: 'assistant', text: data.answer || 'I could not find this in my documents.', citations: data.sources || [] }
              : msg
          )
        );
      }
    } catch (err: any) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === typingMessageId
            ? { id: 'reply-' + Date.now(), sender: 'assistant', text: err.message || 'An error occurred while communicating with the agent.', isError: true }
            : msg
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-root">
      <div className="chat-layout">
        {/* ── Header ── */}
        <div className="chat-header">
          <div className="chat-header-left">
            <Link href="/" className="chat-back-link" aria-label="Back to homepage">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="chat-agent-identity">
              <div className="chat-agent-icon">
                <MinerHead size={28} />
              </div>
              <div className="chat-agent-meta">
                <span className="chat-agent-label">MINING AGENT</span>
                <h1 className="chat-agent-name">{agent.name}</h1>
              </div>
            </div>
          </div>
          <div className="chat-status-badge">
            <span className="chat-status-dot" />
            LIVE
          </div>
        </div>

        {/* ── Messages ── */}
        <div className="chat-msgs" id="msgs">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          <div ref={msgsEndRef} />
        </div>

        {/* ── Suggested questions ── */}
        {showSuggestions && (
          <div className="chat-suggestions" id="sugg">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                className="chat-suggestion-btn"
                onClick={() => handleSend(q)}
                disabled={loading}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* ── Input bar ── */}
        <div className="chat-input-row">
          <input
            id="q"
            className="chat-input"
            placeholder="Ask a question about mining laws, regulations or procedures…"
            aria-label="Your question"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(inputValue); }}
            disabled={loading}
          />
          <button
            id="send"
            className={`chat-send-btn${loading ? ' chat-send-btn--loading' : ''}`}
            onClick={() => handleSend(inputValue)}
            disabled={loading}
            aria-label={loading ? 'Thinking…' : 'Send message'}
          >
            {loading ? (
              <span className="chat-send-spinner" aria-hidden="true" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}
          </button>
        </div>

        {/* ── Grounding note ── */}
        <div className="chat-grounding-note">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z" />
          </svg>
          Answers are grounded exclusively in indexed source documents. Every response cites its source.
        </div>
      </div>
    </div>
  );
}

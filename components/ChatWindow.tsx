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

    // Add user message + typing placeholder
    setMessages((prev) => [
      ...prev,
      { id: userMessageId, sender: 'user', text: trimmed },
      { id: typingMessageId, sender: 'assistant', isTyping: true },
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        try {
          data = await response.json();
        } catch {
          data = { error: 'Invalid JSON received from server.' };
        }
      } else {
        const textError = await response.text();
        data = { error: response.ok ? textError : `Server error (${response.status}): ${response.statusText || 'Function execution failed'}` };
      }

      if (!response.ok || data?.error) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === typingMessageId
              ? {
                  id: 'reply-' + Date.now(),
                  sender: 'assistant',
                  text: data?.error || 'Failed to get answer. Please try again.',
                  isError: true,
                }
              : msg
          )
        );
      } else {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === typingMessageId
              ? {
                  id: 'reply-' + Date.now(),
                  sender: 'assistant',
                  text: data.answer || 'I could not find this in my documents.',
                  citations: data.sources || [],
                }
              : msg
          )
        );
      }
    } catch (err: any) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === typingMessageId
            ? {
                id: 'reply-' + Date.now(),
                sender: 'assistant',
                text:
                  err.message ||
                  'An error occurred while communicating with the agent.',
                isError: true,
              }
            : msg
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat">
      {/* Chat header with back link and agent title */}
      <div className="chead">
        <Link href="/agents" className="btn line">
          Agents
        </Link>
        <svg
          width="28"
          height="28"
          style={{ color: 'var(--amber)' }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <path d="M12 3v18M6 21h12M4 7h16M4 7l-3 8a3.5 3.5 0 0 0 6 0zM20 7l-3 8a3.5 3.5 0 0 0 6 0z" />
        </svg>
        <h2>{agent.name}</h2>
      </div>

      {/* Messages stream */}
      <div className="msgs" id="msgs">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={msgsEndRef} />
      </div>

      {/* Suggested questions buttons */}
      {showSuggestions && (
        <div className="sugg" id="sugg">
          {suggestedQuestions.map((q) => (
            <button key={q} onClick={() => handleSend(q)} disabled={loading}>
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Message input bar */}
      <div className="input">
        <input
          id="q"
          placeholder="Ask a question"
          aria-label="Your question"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend(inputValue);
          }}
          disabled={loading}
        />
        <button
          className="btn"
          id="send"
          onClick={() => handleSend(inputValue)}
          disabled={loading}
        >
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </div>

      <div className="note">
        Answers are grounded exclusively in indexed source documents.
      </div>
    </div>
  );
}

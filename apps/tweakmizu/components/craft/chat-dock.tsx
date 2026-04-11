'use client';

import './chat-dock.css';
import { useRef, useState, type FormEvent } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@aspect/react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  toolCalls?: Array<{ name: string; rationale: string }>;
  pending?: boolean;
}

interface ChatDockProps {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  streaming: boolean;
  placeholder?: string;
}

export function ChatDock({
  messages,
  onSend,
  streaming,
  placeholder = 'Describe what you want to build...',
}: ChatDockProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || streaming) return;
    onSend(trimmed);
    setInput('');
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="craft-chat">
      <header className="craft-chat__header">
        <Sparkles size={14} className="craft-chat__header-icon" />
        <span className="craft-chat__header-title">AI assistant</span>
      </header>

      <div className="craft-chat__messages" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="craft-chat__welcome">
            <p>
              Describe your product and I&apos;ll generate the design system — language, components,
              pages, mock data. Or ask me to change anything.
            </p>
            <div className="craft-chat__suggestions">
              {[
                'Build an accounting product for UK SMBs with invoicing, VAT, and bank reconciliation',
                'Make the primary color less vibrant',
                'Add a Purchase Orders page with approval workflow',
                'Move Settings below Reports in the nav',
              ].map((s) => (
                <button
                  key={s}
                  type="button"
                  className="craft-chat__suggestion"
                  onClick={() => {
                    setInput(s);
                    inputRef.current?.focus();
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'craft-chat__bubble',
                msg.role === 'user' ? 'craft-chat__bubble--user' : 'craft-chat__bubble--ai',
              )}
            >
              <div className="craft-chat__bubble-content">{msg.content}</div>
              {msg.toolCalls?.map((tc, i) => (
                <div key={i} className="craft-chat__tool-call">
                  <span className="craft-chat__tool-name">{tc.name}</span>
                  <span className="craft-chat__tool-rationale">{tc.rationale}</span>
                </div>
              ))}
              {msg.pending ? <Loader2 size={14} className="craft-chat__spinner" /> : null}
            </div>
          ))
        )}
      </div>

      <form className="craft-chat__input-row" onSubmit={handleSubmit}>
        <textarea
          ref={inputRef}
          className="craft-chat__input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={streaming}
          aria-label="Chat input"
        />
        <button
          type="submit"
          className="craft-chat__send"
          disabled={!input.trim() || streaming}
          aria-label="Send message"
        >
          {streaming ? <Loader2 size={16} className="craft-chat__spinner" /> : <Send size={16} />}
        </button>
      </form>
    </div>
  );
}

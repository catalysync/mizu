'use client';

import './prompt-panel.css';
import { Badge } from '@aspect/react';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import { ChatDock } from './chat-dock';
import { useCraftChat } from '@/hooks/use-craft-chat';
import { useIsPro } from './craft-pro-context';

export function PromptPanel() {
  const { messages, streaming, send } = useCraftChat();
  const isPro = useIsPro();
  const userMessageCount = messages.filter((m) => m.role === 'user').length;

  return (
    <div className="craft-prompt">
      <header className="craft-prompt__header">
        <div className="craft-prompt__header-row">
          <Badge tone="neutral">AI</Badge>
          {!isPro ? (
            <span className="craft-prompt__usage">
              {userMessageCount}/5 messages this hour ·{' '}
              <Link href="/pricing" className="craft-prompt__upgrade-link">
                <Sparkles size={10} /> Upgrade for unlimited
              </Link>
            </span>
          ) : (
            <Badge tone="success">Pro — unlimited</Badge>
          )}
        </div>
        <h1 className="craft-prompt__title">Describe what you want</h1>
        <p className="craft-prompt__lede">
          Tell the AI about your product — domain, audience, features, tone — and it generates the
          entire design system: language, entities, pages, mock data, navigation. Every mutation
          streams to the preview in real time.
        </p>
      </header>

      <div className="craft-prompt__grid">
        <div className="craft-prompt__chat">
          <ChatDock
            messages={messages}
            onSend={send}
            streaming={streaming}
            placeholder="Build an accounting product for UK SMBs with invoicing, VAT, and bank reconciliation..."
          />
        </div>
        {/* Preview is in the persistent craft-shell layout */}
      </div>
    </div>
  );
}

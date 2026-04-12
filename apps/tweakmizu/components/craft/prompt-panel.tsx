'use client';

import './prompt-panel.css';
import { Badge } from '@aspect/react';
import { ChatDock } from './chat-dock';
import { PreviewDock } from './preview-dock';
import { useCraftChat } from '@/hooks/use-craft-chat';

export function PromptPanel() {
  const { messages, streaming, send } = useCraftChat();

  return (
    <div className="craft-prompt">
      <header className="craft-prompt__header">
        <Badge tone="neutral">AI</Badge>
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
        <div className="craft-prompt__preview">
          <PreviewDock />
        </div>
      </div>
    </div>
  );
}

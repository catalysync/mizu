'use client';

import './craft-landing.css';
import { ArchetypePicker } from './archetype-picker';
import { ChatDock } from './chat-dock';
import { useCraftChat } from '@/hooks/use-craft-chat';

export function CraftLanding() {
  const { messages, streaming, send } = useCraftChat();

  return (
    <div className="craft-landing">
      <div className="craft-landing__presets">
        <ArchetypePicker />
      </div>
      <div className="craft-landing__chat">
        <ChatDock
          messages={messages}
          onSend={send}
          streaming={streaming}
          placeholder="Describe what you're building — I'll generate the whole design system..."
        />
      </div>
    </div>
  );
}

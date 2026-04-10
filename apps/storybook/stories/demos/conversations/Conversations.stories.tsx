import type { Meta, StoryObj } from '@storybook/react-vite';
import '@aspect/css/themes/customer-engagement';
import { Badge, Button, Textarea, Stack, Inline, Separator } from '@aspect/react';
import { conversations, activeThread, type Conversation, type Message } from './data';
import { ConversationsShell } from './ConversationsShell';
import { ContactsPage } from './ContactsPage';
import { SavedRepliesPage } from './SavedRepliesPage';

function ConversationItem({ conv, active }: { conv: Conversation; active?: boolean }) {
  return (
    <div className="mizu-conversation-item" aria-current={active ? 'page' : undefined}>
      <div className="mizu-conversation-item__header">
        <span className="mizu-conversation-item__avatar">{conv.avatar}</span>
        <span
          className={`mizu-conversation-item__name ${conv.unread ? 'mizu-conversation-item__name--unread' : ''}`}
        >
          {conv.name}
        </span>
        <span className="mizu-caption">{conv.time}</span>
      </div>
      <span className="mizu-caption mizu-conversation-item__preview">{conv.preview}</span>
    </div>
  );
}

function ChatBubble({ msg }: { msg: Message }) {
  const variant = msg.sender === 'customer' ? 'inbound' : msg.sender === 'bot' ? 'bot' : 'outbound';
  return (
    <div className={`mizu-chat-bubble mizu-chat-bubble--${variant}`}>
      <div className="mizu-chat-bubble__sender">
        {msg.name} · {msg.time}
      </div>
      {msg.text}
    </div>
  );
}

function InboxPage() {
  return (
    <>
      <Inline align="center" gap="0.5rem">
        <h2 className="mizu-h4" style={{ flex: 1 }}>
          Sarah Chen
        </h2>
        <Badge tone="success">Open</Badge>
        <Button size="sm" variant="ghost">
          Resolve
        </Button>
        <Button size="sm" variant="ghost">
          Snooze
        </Button>
      </Inline>
      <Separator />
      <div className="mizu-chat-thread">
        {activeThread.map((msg) => (
          <ChatBubble key={msg.id} msg={msg} />
        ))}
      </div>
      <Separator />
      <Inline gap="0.5rem" align="end">
        <div style={{ flex: 1 }}>
          <Textarea placeholder="Type a reply…" aria-label="Reply" rows={2} />
        </div>
        <Button variant="primary">Send</Button>
      </Inline>
    </>
  );
}

const meta = {
  title: 'Demos/Conversations',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inbox: Story = {
  render: () => (
    <ConversationsShell active="inbox">
      <InboxPage />
    </ConversationsShell>
  ),
};

export const Contacts: Story = {
  render: () => (
    <ConversationsShell active="contacts">
      <ContactsPage />
    </ConversationsShell>
  ),
};

export const SavedReplies: Story = {
  render: () => (
    <ConversationsShell active="saved-replies">
      <SavedRepliesPage />
    </ConversationsShell>
  ),
};

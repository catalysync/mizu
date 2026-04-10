import type { Meta, StoryObj } from '@storybook/react-vite';
import '@aspect/css/themes/customer-engagement';
import {
  AppLayout,
  AppHeader,
  AppContent,
  Badge,
  Button,
  Input,
  Textarea,
  Stack,
  Inline,
  Separator,
} from '@aspect/react';
import { conversations, activeThread, type Conversation, type Message } from './data';

function ConversationItem({ conv, active }: { conv: Conversation; active?: boolean }) {
  return (
    <div
      className="mizu-app-sidebar__item"
      aria-current={active ? 'page' : undefined}
      style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.25rem' }}
    >
      <Inline align="center" gap="0.5rem">
        <span
          style={{
            width: '2rem',
            height: '2rem',
            borderRadius: 'var(--mizu-radius-full)',
            background: 'var(--mizu-action-primary-default)',
            color: 'var(--mizu-text-inverse)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'var(--mizu-font-size-xs)',
            fontWeight: 'var(--mizu-font-weight-semibold)',
            flexShrink: 0,
          }}
        >
          {conv.avatar}
        </span>
        <span
          style={{
            flex: 1,
            fontWeight: conv.unread ? 'var(--mizu-font-weight-semibold)' : undefined,
          }}
        >
          {conv.name}
        </span>
        <span className="mizu-caption">{conv.time}</span>
      </Inline>
      <span
        className="mizu-caption"
        style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
      >
        {conv.preview}
      </span>
    </div>
  );
}

function ChatBubble({ msg }: { msg: Message }) {
  const isCustomer = msg.sender === 'customer';
  const isBot = msg.sender === 'bot';
  return (
    <div style={{ display: 'flex', justifyContent: isCustomer ? 'flex-start' : 'flex-end' }}>
      <div
        style={{
          maxWidth: '70%',
          padding: 'var(--mizu-spacing-3) var(--mizu-spacing-4)',
          borderRadius: 'var(--mizu-radius-lg)',
          background: isCustomer
            ? 'var(--mizu-surface-secondary)'
            : isBot
              ? 'color-mix(in srgb, var(--mizu-action-primary-default) 10%, transparent)'
              : 'var(--mizu-action-primary-default)',
          color: !isCustomer && !isBot ? 'var(--mizu-text-inverse)' : 'var(--mizu-text-primary)',
          fontSize: 'var(--mizu-font-size-sm)',
          lineHeight: 'var(--mizu-font-line-height-normal)',
        }}
      >
        <div
          style={{
            fontWeight: 'var(--mizu-font-weight-semibold)',
            marginBottom: '0.25rem',
            fontSize: 'var(--mizu-font-size-xs)',
          }}
        >
          {msg.name} · {msg.time}
        </div>
        {msg.text}
      </div>
    </div>
  );
}

function ConversationsInbox() {
  return (
    <AppLayout style={{ minHeight: '720px' }} data-mizu-theme="customer-engagement">
      <AppHeader
        brand={<>aspect support</>}
        actions={
          <Inline gap="0.5rem" align="center">
            <Badge tone="info">2 unread</Badge>
            <Button size="sm" variant="primary">
              New conversation
            </Button>
          </Inline>
        }
      />
      <aside
        className="mizu-app-sidebar"
        aria-label="Conversations"
        style={{ width: '20rem', gridArea: 'sidebar' }}
      >
        <div style={{ padding: '0 var(--mizu-spacing-2) var(--mizu-spacing-2)' }}>
          <Input size="sm" placeholder="Search conversations…" aria-label="Search" />
        </div>
        <Stack gap="0">
          {conversations.map((c, i) => (
            <ConversationItem key={c.id} conv={c} active={i === 0} />
          ))}
        </Stack>
      </aside>
      <AppContent>
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
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <Stack gap="0.75rem">
            {activeThread.map((msg) => (
              <ChatBubble key={msg.id} msg={msg} />
            ))}
          </Stack>
        </div>
        <Separator />
        <Inline gap="0.5rem" align="end">
          <div style={{ flex: 1 }}>
            <Textarea placeholder="Type a reply…" aria-label="Reply" rows={2} />
          </div>
          <Button variant="primary">Send</Button>
        </Inline>
      </AppContent>
    </AppLayout>
  );
}

const meta = {
  title: 'Demos/Conversations',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inbox: Story = {
  render: () => <ConversationsInbox />,
};

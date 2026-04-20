import type { OutputFile, RenderContext } from '@/lib/patterns/types';
import { definePattern } from '@/lib/patterns/types';
import { Button, Card, CardBody, Inline, Input, Stack } from '@aspect/react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

const messages: Message[] = [
  {
    id: 'm1',
    role: 'user',
    content: 'What are the key differences between cloud and edge databases?',
    time: '2:14 PM',
  },
  {
    id: 'm2',
    role: 'assistant',
    content:
      'Cloud databases live in a few regions and scale vertically or with read replicas — good for transactional consistency. Edge databases replicate to many POPs and prioritize low latency reads — good for globally-distributed read traffic. The tradeoff is consistency vs. latency.',
    time: '2:14 PM',
  },
  {
    id: 'm3',
    role: 'user',
    content: 'Which would you pick for a real-time chat product?',
    time: '2:15 PM',
  },
  {
    id: 'm4',
    role: 'assistant',
    content:
      'A hybrid is typical: a strongly consistent cloud DB (Postgres, Planetscale) for user + message persistence, plus Redis or a pubsub layer at the edge for realtime fanout. Don\u2019t push writes to the edge — it fights the consistency model.',
    time: '2:15 PM',
  },
];

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
      }}
    >
      <div
        style={{
          maxWidth: '70%',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--mizu-radius-lg)',
          background: isUser
            ? 'var(--mizu-action-primary-default)'
            : 'var(--mizu-surface-secondary)',
          color: isUser ? 'var(--mizu-text-inverse)' : 'var(--mizu-text-primary)',
        }}
      >
        <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.5 }}>{message.content}</p>
        <span
          style={{
            fontSize: '0.6875rem',
            opacity: 0.7,
            marginTop: '0.25rem',
            display: 'block',
          }}
        >
          {message.time}
        </span>
      </div>
    </div>
  );
}

function Preview() {
  return (
    <Card>
      <CardBody>
        <Stack gap="1rem">
          <Stack gap="0.75rem">
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
          </Stack>
          <Inline gap="0.5rem" align="center">
            <Input placeholder="Ask a follow-up…" style={{ flex: 1 }} aria-label="Chat input" />
            <Button variant="primary">Send</Button>
          </Inline>
        </Stack>
      </CardBody>
    </Card>
  );
}

const TEMPLATE = `import { Button, Card, CardBody, Inline, Input, Stack } from '@aspect/react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

const messages: Message[] = [
  { id: 'm1', role: 'user', content: 'What are the key differences between cloud and edge databases?', time: '2:14 PM' },
  { id: 'm2', role: 'assistant', content: 'Cloud databases live in a few regions and scale with read replicas. Edge databases replicate to many POPs for low-latency reads.', time: '2:14 PM' },
];

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      <div
        style={{
          maxWidth: '70%',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--mizu-radius-lg)',
          background: isUser ? 'var(--mizu-action-primary-default)' : 'var(--mizu-surface-secondary)',
          color: isUser ? 'var(--mizu-text-inverse)' : 'var(--mizu-text-primary)',
        }}
      >
        <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.5 }}>{message.content}</p>
        <span style={{ fontSize: '0.6875rem', opacity: 0.7, marginTop: '0.25rem', display: 'block' }}>{message.time}</span>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Card>
      <CardBody>
        <Stack gap="1rem">
          <Stack gap="0.75rem">
            {messages.map((m) => <MessageBubble key={m.id} message={m} />)}
          </Stack>
          <Inline gap="0.5rem" align="center">
            <Input placeholder="Ask a follow-up…" style={{ flex: 1 }} aria-label="Chat input" />
            <Button variant="primary">Send</Button>
          </Inline>
        </Stack>
      </CardBody>
    </Card>
  );
}
`;

export const aiChat = definePattern({
  meta: {
    id: 'ai.chat',
    name: 'AI Chat',
    description:
      'Streaming-style chat page with message bubbles (user on the right, assistant on the left) and an inline composer at the bottom.',
    kind: 'page',
    industries: ['ai-product', 'saas-admin'],
    tier: 'free',
    depends: [
      '@aspect/react#Card',
      '@aspect/react#Button',
      '@aspect/react#Input',
      '@aspect/react#Stack',
      '@aspect/react#Inline',
    ],
    sources: [
      {
        system: 'claude.ai',
        relationship: 'ia-borrowed',
        notes: 'Message bubble + inline composer pattern from Claude, ChatGPT, Perplexity.',
      },
      {
        system: 'linear',
        relationship: 'visual-rhythm',
        notes: 'Compact card density echoes Linear inline chat threads.',
      },
    ],
  },
  Preview,
  renderReact(_ctx: RenderContext): OutputFile[] {
    return [
      {
        path: 'app/chat/page.tsx',
        contents: TEMPLATE,
      },
    ];
  },
});

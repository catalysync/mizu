import type { OutputFile, RenderContext } from '@/lib/patterns/types';
import { definePattern } from '@/lib/patterns/types';
import { Badge, Button, Card, CardBody, Inline, Stack } from '@aspect/react';

interface SavedReply {
  id: string;
  title: string;
  shortcut: string;
  body: string;
  category: string;
}

const replies: SavedReply[] = [
  {
    id: '1',
    title: 'Refund processed',
    shortcut: '/refund',
    body: "I've issued a refund of {{amount}} for your account. It should appear in your account within 3-5 business days. Is there anything else I can help with?",
    category: 'Billing',
  },
  {
    id: '2',
    title: 'Password reset',
    shortcut: '/password',
    body: "You can reset your password at https://app.example.com/reset. If you're still having trouble, let me know and I can help from my end.",
    category: 'Account',
  },
  {
    id: '3',
    title: 'Feature request logged',
    shortcut: '/feature',
    body: "Thanks for the suggestion! I've logged this as a feature request with our product team. While I can't guarantee a timeline, we review these regularly and prioritize based on customer demand.",
    category: 'Product',
  },
  {
    id: '4',
    title: 'Escalation to engineering',
    shortcut: '/escalate',
    body: "I'm escalating this to our engineering team for a deeper investigation. You'll receive an update within 24 hours.",
    category: 'Technical',
  },
];

function Preview() {
  return (
    <Stack gap="1rem">
      <Inline gap="0.5rem" align="center" style={{ justifyContent: 'space-between' }}>
        <span className="text-muted-foreground text-sm">
          {replies.length} templates · Type the shortcut in any reply to insert
        </span>
        <Button size="sm" variant="primary">
          New reply
        </Button>
      </Inline>
      <Stack gap="0.75rem">
        {replies.map((r) => (
          <Card key={r.id}>
            <CardBody>
              <Stack gap="0.5rem">
                <Inline gap="0.5rem" align="center" style={{ justifyContent: 'space-between' }}>
                  <Inline gap="0.5rem" align="center">
                    <strong className="mizu-body--sm">{r.title}</strong>
                    <Badge tone="neutral">{r.category}</Badge>
                  </Inline>
                  <code
                    className="mizu-caption"
                    style={{
                      padding: '0.125rem 0.375rem',
                      background: 'var(--mizu-surface-secondary)',
                      borderRadius: 'var(--mizu-radius-sm)',
                      fontFamily: 'var(--mizu-font-family-mono)',
                    }}
                  >
                    {r.shortcut}
                  </code>
                </Inline>
                <span className="mizu-caption" style={{ color: 'var(--mizu-text-secondary)' }}>
                  {r.body}
                </span>
                <Inline gap="0.5rem">
                  <Button size="sm" variant="ghost">
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost">
                    Delete
                  </Button>
                </Inline>
              </Stack>
            </CardBody>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}

const TEMPLATE = `import { Badge, Button, Card, CardBody, Inline, Stack } from '@aspect/react';

interface SavedReply {
  id: string;
  title: string;
  shortcut: string;
  body: string;
  category: string;
}

const replies: SavedReply[] = [
  { id: '1', title: 'Refund processed', shortcut: '/refund', body: 'I have issued a refund...', category: 'Billing' },
  { id: '2', title: 'Password reset', shortcut: '/password', body: 'You can reset your password...', category: 'Account' },
  { id: '3', title: 'Feature request logged', shortcut: '/feature', body: 'Thanks for the suggestion...', category: 'Product' },
];

export default function SavedRepliesPage() {
  return (
    <Stack gap="1rem">
      <Stack gap="0.75rem">
        {replies.map((r) => (
          <Card key={r.id}>
            <CardBody>
              <Stack gap="0.5rem">
                <Inline gap="0.5rem" align="center" style={{ justifyContent: 'space-between' }}>
                  <Inline gap="0.5rem" align="center">
                    <strong className="mizu-body--sm">{r.title}</strong>
                    <Badge tone="neutral">{r.category}</Badge>
                  </Inline>
                  <code className="mizu-caption" style={{ padding: '0.125rem 0.375rem', background: 'var(--mizu-surface-secondary)', borderRadius: 'var(--mizu-radius-sm)', fontFamily: 'var(--mizu-font-family-mono)' }}>
                    {r.shortcut}
                  </code>
                </Inline>
                <span className="mizu-caption" style={{ color: 'var(--mizu-text-secondary)' }}>
                  {r.body}
                </span>
                <Inline gap="0.5rem">
                  <Button size="sm" variant="ghost">Edit</Button>
                  <Button size="sm" variant="ghost">Delete</Button>
                </Inline>
              </Stack>
            </CardBody>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
`;

export const conversationsSavedReplies = definePattern({
  meta: {
    id: 'conversations.saved-replies',
    name: 'Saved Replies',
    description:
      'Saved reply templates for support products — card stack with title, category, shortcut, body, and edit/delete actions.',
    kind: 'page',
    industries: ['saas-admin', 'other'],
    tier: 'free',
    depends: [
      '@aspect/react#Card',
      '@aspect/react#Badge',
      '@aspect/react#Button',
      '@aspect/react#Stack',
      '@aspect/react#Inline',
    ],
    sources: [
      {
        system: 'mizu-storybook-conversations-demo',
        relationship: 'concept-reference',
        notes: 'Ported from apps/storybook/stories/demos/conversations/SavedRepliesPage.tsx',
      },
      {
        system: 'intercom',
        relationship: 'ia-borrowed',
        notes: 'Saved reply shortcut convention borrowed from Intercom macros.',
      },
      {
        system: 'linear',
        relationship: 'visual-rhythm',
        notes: 'Card stack spacing echoes Linear templates surface.',
      },
    ],
  },
  Preview,
  renderReact(_ctx: RenderContext): OutputFile[] {
    return [
      {
        path: 'app/saved-replies/page.tsx',
        contents: TEMPLATE,
      },
    ];
  },
});

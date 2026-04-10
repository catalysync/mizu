import {
  AppContentHeader,
  Card,
  CardBody,
  Badge,
  Button,
  Stack,
  Inline,
  Separator,
} from '@aspect/react';

const replies = [
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
    body: "You can reset your password at https://app.aspect.dev/reset. If you're still having trouble, let me know and I can help from my end.",
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
    body: "I'm escalating this to our engineering team for a deeper investigation. You'll receive an update within 24 hours. In the meantime, {{workaround}}.",
    category: 'Technical',
  },
  {
    id: '5',
    title: 'Upgrade info',
    shortcut: '/upgrade',
    body: 'Great question! The {{plan}} plan includes {{features}}. You can upgrade directly from Settings → Billing, or I can apply the change for you right now. Would you like me to go ahead?',
    category: 'Billing',
  },
];

export function SavedRepliesPage() {
  return (
    <Stack gap="1rem">
      <AppContentHeader
        title="Saved Replies"
        description={`${replies.length} templates · Type the shortcut in any reply to insert`}
        actions={
          <Button size="sm" variant="primary">
            New reply
          </Button>
        }
      />
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

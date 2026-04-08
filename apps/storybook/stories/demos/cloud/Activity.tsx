import * as React from 'react';
import { Card, Badge, Stack, EmptyState, Button } from '@aspect/react';
import { mockActivity, type ActivityEntry } from './data';
import { IconActivity } from './icons';

const TYPE_TONE: Record<ActivityEntry['type'], React.ComponentProps<typeof Badge>['tone']> = {
  deploy: 'info',
  config: 'neutral',
  addon: 'success',
  env: 'warning',
};

export function ActivityPage() {
  if (mockActivity.length === 0) {
    return (
      <EmptyState
        icon={<IconActivity width="48" height="48" />}
        title="No activity yet"
        description="Deploy your first app to see release history, build logs, and config changes here."
        actions={<Button variant="primary">Deploy a template</Button>}
      />
    );
  }

  return (
    <Card>
      <Stack gap="0">
        {mockActivity.map((entry, i) => (
          <div
            key={entry.id}
            style={{
              padding: '1rem 1.25rem',
              borderTop: i === 0 ? 'none' : '1px solid var(--mizu-border-default)',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start',
            }}
          >
            <Badge tone={TYPE_TONE[entry.type]}>{entry.type}</Badge>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--mizu-text-primary)' }}>
                <strong>{entry.app}</strong> — {entry.message}
              </div>
              <div
                style={{
                  marginTop: '0.25rem',
                  fontSize: '0.75rem',
                  color: 'var(--mizu-text-secondary)',
                }}
              >
                {entry.user} · {entry.when}
              </div>
            </div>
          </div>
        ))}
      </Stack>
    </Card>
  );
}

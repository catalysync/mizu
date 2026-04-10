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
        {mockActivity.map((entry) => (
          <div key={entry.id} className="mizu-activity-entry">
            <Badge tone={TYPE_TONE[entry.type]}>{entry.type}</Badge>
            <div className="mizu-activity-entry__body">
              <div className="mizu-activity-entry__message">
                <strong>{entry.app}</strong> — {entry.message}
              </div>
              <div className="mizu-activity-entry__meta">
                {entry.user} · {entry.when}
              </div>
            </div>
          </div>
        ))}
      </Stack>
    </Card>
  );
}

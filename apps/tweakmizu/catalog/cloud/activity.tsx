import * as React from 'react';
import { Badge, Button, Card, EmptyState, Stack } from '@aspect/react';
import { definePattern } from '@/lib/patterns/types';
import type { OutputFile, RenderContext } from '@/lib/patterns/types';

type ActivityType = 'deploy' | 'config' | 'addon' | 'env';

interface ActivityEntry {
  id: string;
  type: ActivityType;
  app: string;
  message: string;
  user: string;
  when: string;
}

const TYPE_TONE: Record<ActivityType, React.ComponentProps<typeof Badge>['tone']> = {
  deploy: 'info',
  config: 'neutral',
  addon: 'success',
  env: 'warning',
};

const entries: ActivityEntry[] = [
  {
    id: '1',
    type: 'deploy',
    app: 'payments-api',
    message: 'deployed v124.3 to production',
    user: 'you',
    when: '2m ago',
  },
  {
    id: '2',
    type: 'env',
    app: 'payments-api',
    message: 'updated STRIPE_WEBHOOK_SECRET',
    user: 'you',
    when: '12m ago',
  },
  {
    id: '3',
    type: 'addon',
    app: 'data-ingest',
    message: 'attached S3 bucket',
    user: 'you',
    when: '1h ago',
  },
  {
    id: '4',
    type: 'config',
    app: 'marketing-site',
    message: 'scaled to 4 dynos',
    user: 'you',
    when: '3h ago',
  },
];

function Preview() {
  if (entries.length === 0) {
    return (
      <EmptyState
        title="No activity yet"
        description="Deploy your first app to see release history, build logs, and config changes."
        actions={<Button variant="primary">Deploy a template</Button>}
      />
    );
  }

  return (
    <Card>
      <Stack gap="0">
        {entries.map((entry) => (
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

const TEMPLATE = `import * as React from 'react';
import { Card, Badge, Stack, EmptyState, Button } from '@aspect/react';

type ActivityType = 'deploy' | 'config' | 'addon' | 'env';

interface ActivityEntry {
  id: string;
  type: ActivityType;
  app: string;
  message: string;
  user: string;
  when: string;
}

const TYPE_TONE: Record<ActivityType, React.ComponentProps<typeof Badge>['tone']> = {
  deploy: 'info',
  config: 'neutral',
  addon: 'success',
  env: 'warning',
};

const entries: ActivityEntry[] = [
  { id: '1', type: 'deploy', app: 'payments-api', message: 'deployed v124.3 to production', user: 'you', when: '2m ago' },
  { id: '2', type: 'env', app: 'payments-api', message: 'updated STRIPE_WEBHOOK_SECRET', user: 'you', when: '12m ago' },
  { id: '3', type: 'addon', app: 'data-ingest', message: 'attached S3 bucket', user: 'you', when: '1h ago' },
  { id: '4', type: 'config', app: 'marketing-site', message: 'scaled to 4 dynos', user: 'you', when: '3h ago' },
];

export default function ActivityPage() {
  if (entries.length === 0) {
    return (
      <EmptyState
        title="No activity yet"
        description="Deploy your first app to see release history, build logs, and config changes."
        actions={<Button variant="primary">Deploy a template</Button>}
      />
    );
  }

  return (
    <Card>
      <Stack gap="0">
        {entries.map((entry) => (
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
`;

export const cloudActivity = definePattern({
  meta: {
    id: 'cloud.activity',
    name: 'Cloud Activity Feed',
    description:
      'Chronological activity feed for a cloud platform — deploys, env var changes, addon attachments, config updates.',
    kind: 'page',
    industries: ['cloud'],
    tier: 'free',
    depends: [
      '@aspect/react#Card',
      '@aspect/react#Badge',
      '@aspect/react#Stack',
      '@aspect/react#EmptyState',
      '@aspect/react#Button',
    ],
    sources: [
      {
        system: 'mizu-storybook-cloud-demo',
        relationship: 'concept-reference',
        notes: 'Ported from apps/storybook/stories/demos/cloud/Activity.tsx',
      },
      {
        system: 'heroku',
        relationship: 'ia-borrowed',
        notes:
          'Activity tab pattern with chronological stream is borrowed from the Heroku app detail view.',
      },
    ],
  },
  Preview,
  renderReact(_ctx: RenderContext): OutputFile[] {
    return [
      {
        path: 'app/activity/page.tsx',
        contents: TEMPLATE,
      },
    ];
  },
});

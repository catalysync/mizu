import * as React from 'react';
import { Badge, Button, Card, CardBody, CardFooter, CardHeader, Grid, Inline } from '@aspect/react';
import { definePattern } from '@/lib/patterns/types';
import type { OutputFile, RenderContext } from '@/lib/patterns/types';

type AppStatus = 'running' | 'building' | 'crashed' | 'idle';

interface AppRecord {
  id: string;
  name: string;
  framework: string;
  region: string;
  url: string;
  lastDeploy: string;
  status: AppStatus;
  addons: string[];
}

const STATUS_TONE: Record<AppStatus, React.ComponentProps<typeof Badge>['tone']> = {
  running: 'success',
  building: 'info',
  crashed: 'danger',
  idle: 'neutral',
};

const STATUS_LABEL: Record<AppStatus, string> = {
  running: 'Running',
  building: 'Building',
  crashed: 'Crashed',
  idle: 'Idle',
};

const apps: AppRecord[] = [
  {
    id: '1',
    name: 'payments-api',
    framework: 'Next.js',
    region: 'us-east',
    url: 'https://payments-api.example.com',
    lastDeploy: '2h ago',
    status: 'running',
    addons: ['Postgres', 'Redis'],
  },
  {
    id: '2',
    name: 'marketing-site',
    framework: 'Astro',
    region: 'eu-west',
    url: 'https://example.com',
    lastDeploy: '1d ago',
    status: 'running',
    addons: [],
  },
  {
    id: '3',
    name: 'data-ingest',
    framework: 'Python',
    region: 'us-west',
    url: 'https://data-ingest.example.com',
    lastDeploy: '12m ago',
    status: 'building',
    addons: ['S3'],
  },
];

function AppCard({ app }: { app: AppRecord }) {
  return (
    <Card interactive>
      <CardHeader>
        <Inline align="center" gap="0.5rem">
          <h3 className="mizu-card__title">{app.name}</h3>
          <Badge tone={STATUS_TONE[app.status]} dot>
            {STATUS_LABEL[app.status]}
          </Badge>
        </Inline>
        <p className="mizu-card__description">
          {app.framework} · {app.region}
        </p>
      </CardHeader>
      <CardBody>
        <dl className="mizu-kv-pairs">
          <dt>URL</dt>
          <dd>{app.url}</dd>
          <dt>Last deploy</dt>
          <dd>{app.lastDeploy}</dd>
          <dt>Add-ons</dt>
          <dd>
            {app.addons.length > 0 ? (
              <Inline gap="0.25rem">
                {app.addons.map((a) => (
                  <Badge key={a} tone="neutral">
                    {a}
                  </Badge>
                ))}
              </Inline>
            ) : (
              <span className="mizu-caption">None</span>
            )}
          </dd>
        </dl>
      </CardBody>
      <CardFooter>
        <Button size="sm" variant="ghost">
          Open
        </Button>
        <Button size="sm" variant="ghost">
          Logs
        </Button>
      </CardFooter>
    </Card>
  );
}

function Preview() {
  return (
    <Grid gap="1rem" min="20rem">
      {apps.map((app) => (
        <AppCard key={app.id} app={app} />
      ))}
    </Grid>
  );
}

const TEMPLATE = `import * as React from 'react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Grid,
  Inline,
} from '@aspect/react';

type AppStatus = 'running' | 'building' | 'crashed' | 'idle';

interface AppRecord {
  id: string;
  name: string;
  framework: string;
  region: string;
  url: string;
  lastDeploy: string;
  status: AppStatus;
  addons: string[];
}

const STATUS_TONE: Record<AppStatus, React.ComponentProps<typeof Badge>['tone']> = {
  running: 'success',
  building: 'info',
  crashed: 'danger',
  idle: 'neutral',
};

const STATUS_LABEL: Record<AppStatus, string> = {
  running: 'Running',
  building: 'Building',
  crashed: 'Crashed',
  idle: 'Idle',
};

const apps: AppRecord[] = [
  { id: '1', name: 'payments-api', framework: 'Next.js', region: 'us-east', url: 'https://payments-api.example.com', lastDeploy: '2h ago', status: 'running', addons: ['Postgres', 'Redis'] },
  { id: '2', name: 'marketing-site', framework: 'Astro', region: 'eu-west', url: 'https://example.com', lastDeploy: '1d ago', status: 'running', addons: [] },
  { id: '3', name: 'data-ingest', framework: 'Python', region: 'us-west', url: 'https://data-ingest.example.com', lastDeploy: '12m ago', status: 'building', addons: ['S3'] },
];

function AppCard({ app }: { app: AppRecord }) {
  return (
    <Card interactive>
      <CardHeader>
        <Inline align="center" gap="0.5rem">
          <h3 className="mizu-card__title">{app.name}</h3>
          <Badge tone={STATUS_TONE[app.status]} dot>{STATUS_LABEL[app.status]}</Badge>
        </Inline>
        <p className="mizu-card__description">{app.framework} · {app.region}</p>
      </CardHeader>
      <CardBody>
        <dl className="mizu-kv-pairs">
          <dt>URL</dt><dd>{app.url}</dd>
          <dt>Last deploy</dt><dd>{app.lastDeploy}</dd>
          <dt>Add-ons</dt>
          <dd>
            {app.addons.length > 0 ? (
              <Inline gap="0.25rem">
                {app.addons.map((a) => <Badge key={a} tone="neutral">{a}</Badge>)}
              </Inline>
            ) : <span className="mizu-caption">None</span>}
          </dd>
        </dl>
      </CardBody>
      <CardFooter>
        <Button size="sm" variant="ghost">Open</Button>
        <Button size="sm" variant="ghost">Logs</Button>
      </CardFooter>
    </Card>
  );
}

export default function AppsPage() {
  return (
    <Grid gap="1rem" min="20rem">
      {apps.map((app) => <AppCard key={app.id} app={app} />)}
    </Grid>
  );
}
`;

export const cloudApps = definePattern({
  meta: {
    id: 'cloud.apps',
    name: 'Cloud Apps Grid',
    description:
      'PaaS apps grid with status pills, framework + region, add-ons list, and deploy/logs actions.',
    kind: 'page',
    industries: ['cloud'],
    tier: 'free',
    depends: [
      '@aspect/react#Card',
      '@aspect/react#Badge',
      '@aspect/react#Grid',
      '@aspect/react#Inline',
      '@aspect/react#Button',
    ],
    sources: [
      {
        system: 'mizu-storybook-cloud-demo',
        relationship: 'concept-reference',
        notes: 'Ported from apps/storybook/stories/demos/cloud/Apps.tsx',
      },
      {
        system: 'heroku',
        relationship: 'ia-borrowed',
        notes: 'Card grid with colored status dot matches Heroku dashboard convention.',
      },
      {
        system: 'railway',
        relationship: 'inspired-by',
        notes: 'Card density + add-ons strip echoes Railway 2024 dashboard redesign.',
      },
    ],
  },
  Preview,
  renderReact(_ctx: RenderContext): OutputFile[] {
    return [
      {
        path: 'app/apps/page.tsx',
        contents: TEMPLATE,
      },
    ];
  },
});

import * as React from 'react';
import { Card, CardHeader, CardBody, CardFooter, Badge, Grid, Inline, Button } from '@aspect/react';
import { mockApps, type AppRecord, type AppStatus } from './data';

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

function AppCard({ app }: { app: AppRecord }) {
  return (
    <Card interactive>
      <CardHeader>
        <Inline align="center" gap="0.5rem">
          <h3 className="mizu-card__title" style={{ flex: 1 }}>
            {app.name}
          </h3>
          <Badge tone={STATUS_TONE[app.status]} dot>
            {STATUS_LABEL[app.status]}
          </Badge>
        </Inline>
        <p className="mizu-card__description">
          {app.framework} · {app.region}
        </p>
      </CardHeader>
      <CardBody>
        <dl
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '0.5rem 1rem',
            margin: 0,
            fontSize: '0.875rem',
          }}
        >
          <dt style={{ color: 'var(--mizu-text-secondary)' }}>URL</dt>
          <dd style={{ margin: 0 }}>{app.url}</dd>
          <dt style={{ color: 'var(--mizu-text-secondary)' }}>Last deploy</dt>
          <dd style={{ margin: 0 }}>{app.lastDeploy}</dd>
          <dt style={{ color: 'var(--mizu-text-secondary)' }}>Add-ons</dt>
          <dd style={{ margin: 0 }}>
            {app.addons.length > 0 ? (
              <Inline gap="0.25rem">
                {app.addons.map((a) => (
                  <Badge key={a} tone="neutral">
                    {a}
                  </Badge>
                ))}
              </Inline>
            ) : (
              <span style={{ color: 'var(--mizu-text-disabled)' }}>None</span>
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

export function AppsPage() {
  return (
    <Grid gap="1rem" min="20rem">
      {mockApps.map((app) => (
        <AppCard key={app.id} app={app} />
      ))}
    </Grid>
  );
}

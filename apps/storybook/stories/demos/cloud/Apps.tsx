import { Badge, Button, Card, CardBody, CardFooter, CardHeader, Grid, Inline } from '@aspect/react';
import * as React from 'react';
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

export function AppsPage() {
  return (
    <Grid gap="1rem" min="20rem">
      {mockApps.map((app) => (
        <AppCard key={app.id} app={app} />
      ))}
    </Grid>
  );
}

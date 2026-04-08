import * as React from 'react';
import { Card, CardHeader, CardBody, CardFooter, Badge, Button, Grid } from '@aspect/react';
import { mockTemplates, type Template } from './data';

const CATEGORY_LABEL: Record<Template['category'], string> = {
  framework: 'Framework',
  fullstack: 'Full stack',
  database: 'Database',
  ai: 'AI',
};

const CATEGORY_TONE: Record<Template['category'], React.ComponentProps<typeof Badge>['tone']> = {
  framework: 'info',
  fullstack: 'success',
  database: 'neutral',
  ai: 'warning',
};

export function TemplatesPage() {
  return (
    <Grid gap="1rem" min="18rem">
      {mockTemplates.map((tpl) => (
        <Card key={tpl.id} interactive>
          <CardHeader>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <h3 className="mizu-card__title" style={{ flex: 1 }}>
                {tpl.name}
              </h3>
              <Badge tone={CATEGORY_TONE[tpl.category]}>{CATEGORY_LABEL[tpl.category]}</Badge>
            </div>
            <p className="mizu-card__description">{tpl.description}</p>
          </CardHeader>
          <CardBody>
            <p
              style={{
                margin: 0,
                fontSize: '0.75rem',
                color: 'var(--mizu-text-secondary)',
              }}
            >
              {tpl.deploys.toLocaleString()} deploys
            </p>
          </CardBody>
          <CardFooter>
            <Button size="sm" variant="primary">
              Deploy
            </Button>
            <Button size="sm" variant="ghost">
              View source
            </Button>
          </CardFooter>
        </Card>
      ))}
    </Grid>
  );
}

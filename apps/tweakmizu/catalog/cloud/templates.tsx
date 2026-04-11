import * as React from 'react';
import { Badge, Button, Card, CardBody, CardFooter, CardHeader, Grid, Inline } from '@aspect/react';
import { definePattern } from '@/lib/patterns/types';
import type { OutputFile, RenderContext } from '@/lib/patterns/types';

type TemplateCategory = 'framework' | 'fullstack' | 'database' | 'ai';

interface Template {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  deploys: number;
}

const CATEGORY_LABEL: Record<TemplateCategory, string> = {
  framework: 'Framework',
  fullstack: 'Full stack',
  database: 'Database',
  ai: 'AI',
};

const CATEGORY_TONE: Record<TemplateCategory, React.ComponentProps<typeof Badge>['tone']> = {
  framework: 'info',
  fullstack: 'success',
  database: 'neutral',
  ai: 'warning',
};

const templates: Template[] = [
  {
    id: '1',
    name: 'Next.js App Router',
    description: 'React 19 + Tailwind v4 starter with app router, auth, and a demo dashboard.',
    category: 'framework',
    deploys: 42_300,
  },
  {
    id: '2',
    name: 'Postgres + Redis',
    description: 'Managed Postgres 16 and Redis 7 with automated backups.',
    category: 'database',
    deploys: 19_800,
  },
  {
    id: '3',
    name: 'LLM Chat Starter',
    description: 'Streaming chat UI + vector store + OpenAI-compatible API wrapper.',
    category: 'ai',
    deploys: 8_740,
  },
  {
    id: '4',
    name: 'FastAPI + Postgres',
    description: 'Python API with async routes, SQLModel, and Alembic migrations.',
    category: 'fullstack',
    deploys: 12_560,
  },
];

function Preview() {
  return (
    <Grid gap="1rem" min="18rem">
      {templates.map((tpl) => (
        <Card key={tpl.id} interactive>
          <CardHeader>
            <Inline align="start" gap="0.5rem">
              <h3 className="mizu-card__title">{tpl.name}</h3>
              <Badge tone={CATEGORY_TONE[tpl.category]}>{CATEGORY_LABEL[tpl.category]}</Badge>
            </Inline>
            <p className="mizu-card__description">{tpl.description}</p>
          </CardHeader>
          <CardBody>
            <p className="mizu-caption">{tpl.deploys.toLocaleString()} deploys</p>
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

const TEMPLATE = `import * as React from 'react';
import { Card, CardHeader, CardBody, CardFooter, Badge, Button, Grid, Inline } from '@aspect/react';

type TemplateCategory = 'framework' | 'fullstack' | 'database' | 'ai';

interface Template {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  deploys: number;
}

const CATEGORY_LABEL: Record<TemplateCategory, string> = {
  framework: 'Framework',
  fullstack: 'Full stack',
  database: 'Database',
  ai: 'AI',
};

const CATEGORY_TONE: Record<TemplateCategory, React.ComponentProps<typeof Badge>['tone']> = {
  framework: 'info',
  fullstack: 'success',
  database: 'neutral',
  ai: 'warning',
};

const templates: Template[] = [
  { id: '1', name: 'Next.js App Router', description: 'React 19 + Tailwind v4 starter with app router, auth, and a demo dashboard.', category: 'framework', deploys: 42_300 },
  { id: '2', name: 'Postgres + Redis', description: 'Managed Postgres 16 and Redis 7 with automated backups.', category: 'database', deploys: 19_800 },
  { id: '3', name: 'LLM Chat Starter', description: 'Streaming chat UI + vector store + OpenAI-compatible API wrapper.', category: 'ai', deploys: 8_740 },
  { id: '4', name: 'FastAPI + Postgres', description: 'Python API with async routes, SQLModel, and Alembic migrations.', category: 'fullstack', deploys: 12_560 },
];

export default function TemplatesPage() {
  return (
    <Grid gap="1rem" min="18rem">
      {templates.map((tpl) => (
        <Card key={tpl.id} interactive>
          <CardHeader>
            <Inline align="start" gap="0.5rem">
              <h3 className="mizu-card__title">{tpl.name}</h3>
              <Badge tone={CATEGORY_TONE[tpl.category]}>{CATEGORY_LABEL[tpl.category]}</Badge>
            </Inline>
            <p className="mizu-card__description">{tpl.description}</p>
          </CardHeader>
          <CardBody>
            <p className="mizu-caption">{tpl.deploys.toLocaleString()} deploys</p>
          </CardBody>
          <CardFooter>
            <Button size="sm" variant="primary">Deploy</Button>
            <Button size="sm" variant="ghost">View source</Button>
          </CardFooter>
        </Card>
      ))}
    </Grid>
  );
}
`;

export const cloudTemplates = definePattern({
  meta: {
    id: 'cloud.templates',
    name: 'Cloud Templates Grid',
    description:
      'One-click deploy templates grid with categories, description, deploy counts, and primary actions.',
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
        notes: 'Ported from apps/storybook/stories/demos/cloud/Templates.tsx',
      },
      {
        system: 'railway',
        relationship: 'ia-borrowed',
        notes: 'Templates grid pattern is Railway one-click deploy UX.',
      },
      {
        system: 'vercel',
        relationship: 'inspired-by',
        notes: 'Deploy count display is borrowed from Vercel templates marketplace.',
      },
    ],
  },
  Preview,
  renderReact(_ctx: RenderContext): OutputFile[] {
    return [
      {
        path: 'app/templates/page.tsx',
        contents: TEMPLATE,
      },
    ];
  },
});

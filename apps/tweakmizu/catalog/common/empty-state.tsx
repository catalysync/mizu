import type { OutputFile, RenderContext } from '@/lib/patterns/types';
import { definePattern } from '@/lib/patterns/types';
import { Button, Card, CardBody, EmptyState, Stack } from '@aspect/react';
import { FileStack } from 'lucide-react';

function Preview() {
  return (
    <Card>
      <CardBody>
        <EmptyState
          icon={<FileStack className="h-12 w-12" />}
          title="Nothing here yet"
          description="Kick things off by creating your first item. It takes less than a minute."
          actions={
            <Stack gap="0.5rem" align="start">
              <Button variant="primary">Get started</Button>
            </Stack>
          }
        />
      </CardBody>
    </Card>
  );
}

const TEMPLATE = `import { Button, Card, CardBody, EmptyState, Stack } from '@aspect/react';
import { FileStack } from 'lucide-react';

export default function EmptyStatePage() {
  return (
    <Card>
      <CardBody>
        <EmptyState
          icon={<FileStack className="h-12 w-12" />}
          title="Nothing here yet"
          description="Kick things off by creating your first item. It takes less than a minute."
          actions={
            <Stack gap="0.5rem" align="start">
              <Button variant="primary">Get started</Button>
            </Stack>
          }
        />
      </CardBody>
    </Card>
  );
}
`;

export const commonEmptyState = definePattern({
  meta: {
    id: 'common.empty-state',
    name: 'Empty State',
    description:
      'Canonical empty state: icon, title, description, and a primary action. Works for any list or detail view with no data.',
    kind: 'section',
    industries: ['cloud', 'saas-admin', 'ecommerce', 'fintech', 'ai-product', 'devtools', 'other'],
    tier: 'free',
    depends: [
      '@aspect/react#EmptyState',
      '@aspect/react#Card',
      '@aspect/react#Button',
      '@aspect/react#Stack',
    ],
    sources: [
      {
        system: 'linear',
        relationship: 'visual-rhythm',
        notes: 'Friendly empty state copy + single primary action echoes Linear.',
      },
      {
        system: 'basecamp',
        relationship: 'ia-borrowed',
        notes: 'Icon + title + one-sentence description pattern from Basecamp.',
      },
    ],
  },
  Preview,
  renderReact(_ctx: RenderContext): OutputFile[] {
    return [
      {
        path: 'app/empty/page.tsx',
        contents: TEMPLATE,
      },
    ];
  },
});

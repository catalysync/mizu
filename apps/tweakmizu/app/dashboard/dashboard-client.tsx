'use client';

import { useMemo } from 'react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  EmptyState,
  Grid,
  Inline,
  Stack,
} from '@aspect/react';
import { FileStack, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { usePlansStore } from '@/store/plans-store';

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function DashboardClient() {
  const plans = usePlansStore((state) => state.plans);
  const deletePlan = usePlansStore((state) => state.deletePlan);

  const sorted = useMemo(
    () => Object.values(plans).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [plans],
  );

  if (sorted.length === 0) {
    return (
      <Card>
        <CardBody>
          <EmptyState
            icon={<FileStack className="h-12 w-12" />}
            title="No projects yet"
            description="Generate your first starter from the studio — it only takes a minute."
            actions={
              <Link href="/studio/new">
                <Button variant="primary">
                  <Plus className="mr-2 h-4 w-4" />
                  New project
                </Button>
              </Link>
            }
          />
        </CardBody>
      </Card>
    );
  }

  return (
    <Stack gap="1rem">
      <Inline gap="0.75rem" align="center" style={{ justifyContent: 'space-between' }}>
        <span className="text-sm text-muted-foreground">
          {sorted.length} project{sorted.length === 1 ? '' : 's'}
        </span>
        <Link href="/studio/new">
          <Button variant="primary" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New project
          </Button>
        </Link>
      </Inline>

      <Grid gap="1rem" min="20rem">
        {sorted.map((plan) => (
          <Card key={plan.id}>
            <CardHeader title={plan.intent.productName} description={plan.intent.description} />
            <CardBody>
              <Stack gap="0.75rem">
                <Inline gap="0.375rem" align="center">
                  <Badge tone="neutral">{plan.intent.industry}</Badge>
                  <Badge tone="info">{plan.intent.stack}</Badge>
                  <Badge tone="neutral">{plan.intent.tone}</Badge>
                </Inline>
                <span className="text-xs text-muted-foreground">
                  {plan.entries.length} pages · created {formatDate(plan.createdAt)}
                </span>
              </Stack>
            </CardBody>
            <CardFooter>
              <Link href={`/studio/${plan.id}`}>
                <Button variant="primary" size="sm">
                  Open
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deletePlan(plan.id)}
                aria-label={`Delete ${plan.intent.productName}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </Grid>
    </Stack>
  );
}

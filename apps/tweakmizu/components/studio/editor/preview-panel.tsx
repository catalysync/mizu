'use client';

import { useEffect, useRef } from 'react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Inline,
  Input,
  Stack,
} from '@aspect/react';
import { applyThemeToElement } from '@/utils/apply-theme';
import type { ThemeStyleProps } from '@/types/theme';

interface Props {
  styles: ThemeStyleProps;
}

export function EditorPreviewPanel({ styles }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    applyThemeToElement(ref.current, styles);
  }, [styles]);

  return (
    <div
      ref={ref}
      aria-label="Theme preview"
      style={{
        background: 'var(--mizu-surface-default)',
        color: 'var(--mizu-text-primary)',
        borderRadius: 'var(--mizu-radius-lg)',
        border: '1px solid var(--mizu-border-default)',
        padding: '1.5rem',
        fontFamily: 'var(--mizu-font-family-sans)',
      }}
    >
      <Stack gap="1.5rem">
        <Stack gap="0.5rem">
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Theme preview</h3>
          <p style={{ margin: 0, color: 'var(--mizu-text-secondary)', fontSize: '0.875rem' }}>
            Every component below reads from the tokens you edit on the left.
          </p>
        </Stack>

        <Card>
          <CardHeader
            title="Account settings"
            description="Update your team profile and notification preferences."
          />
          <CardBody>
            <Stack gap="1rem">
              <Input label="Team name" defaultValue="Aspect Labs" />
              <Input label="Contact email" defaultValue="hi@aspect.dev" />
              <Inline gap="0.5rem" align="center">
                <Badge tone="success">Active plan</Badge>
                <Badge tone="info">14 members</Badge>
                <Badge tone="warning">Trial ends soon</Badge>
              </Inline>
            </Stack>
          </CardBody>
          <CardFooter>
            <Button variant="ghost" size="sm">
              Cancel
            </Button>
            <Button variant="primary" size="sm">
              Save changes
            </Button>
          </CardFooter>
        </Card>

        <Stack gap="0.75rem">
          <h4
            style={{
              margin: 0,
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--mizu-text-secondary)',
            }}
          >
            Button variants
          </h4>
          <Inline gap="0.5rem" align="center">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </Inline>
        </Stack>

        <Stack gap="0.75rem">
          <h4
            style={{
              margin: 0,
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--mizu-text-secondary)',
            }}
          >
            Badge tones
          </h4>
          <Inline gap="0.5rem" align="center">
            <Badge tone="neutral">Neutral</Badge>
            <Badge tone="info">Info</Badge>
            <Badge tone="success">Success</Badge>
            <Badge tone="warning">Warning</Badge>
            <Badge tone="danger">Danger</Badge>
          </Inline>
        </Stack>
      </Stack>
    </div>
  );
}

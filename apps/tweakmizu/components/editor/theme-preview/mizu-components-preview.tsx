'use client';

import type { ThemeStyleProps } from '@/types/theme';
import { applyThemeToElement } from '@/utils/apply-theme';
import {
  Alert,
  AlertTitle,
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Input,
  Progress,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tag,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@aspect/react';
import { useEffect, useRef } from 'react';

interface MizuComponentsPreviewProps {
  styles: ThemeStyleProps;
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section>
    <h3
      style={{
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: 'var(--mizu-text-secondary)',
        margin: '0 0 0.75rem',
        fontWeight: 600,
      }}
    >
      {title}
    </h3>
    {children}
  </section>
);

export default function MizuComponentsPreview({ styles }: MizuComponentsPreviewProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      applyThemeToElement(ref.current, styles);
    }
  }, [styles]);

  return (
    <div
      ref={ref}
      style={{
        padding: '1.5rem',
        background: 'var(--mizu-surface-default)',
        color: 'var(--mizu-text-primary)',
        fontFamily: 'var(--mizu-font-family-sans)',
      }}
    >
      <Stack gap="2rem">
        <Section title="Buttons">
          <Stack gap="0.75rem">
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
              <Button variant="primary" loading>
                Loading
              </Button>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Button variant="primary" size="sm">
                Small
              </Button>
              <Button variant="primary" size="md">
                Medium
              </Button>
              <Button variant="primary" size="lg">
                Large
              </Button>
            </div>
          </Stack>
        </Section>

        <Section title="Cards">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <Card>
              <CardHeader title="Revenue" description="Total earnings for the last 30 days" />
              <CardBody>
                <div style={{ fontSize: '2rem', fontWeight: 700 }}>$24,319</div>
                <div
                  style={{ color: 'var(--mizu-feedback-success-default)', fontSize: '0.875rem' }}
                >
                  ↑ 12.4% from last month
                </div>
              </CardBody>
              <CardFooter>
                <Button variant="secondary" size="sm">
                  View report
                </Button>
              </CardFooter>
            </Card>
            <Card interactive>
              <CardHeader title="Customers" description="Active subscriptions" />
              <CardBody>
                <div style={{ fontSize: '2rem', fontWeight: 700 }}>1,284</div>
                <Progress value={72} max={100} />
              </CardBody>
            </Card>
          </div>
        </Section>

        <Section title="Form">
          <Card>
            <CardBody>
              <Stack gap="1rem">
                <div>
                  <label htmlFor="preview-email" className="mizu-body--sm">
                    Email
                  </label>
                  <Input
                    id="preview-email"
                    type="email"
                    placeholder="you@example.com"
                    style={{ marginTop: 4 }}
                  />
                </div>
                <div>
                  <label htmlFor="preview-message" className="mizu-body--sm">
                    Message
                  </label>
                  <Textarea
                    id="preview-message"
                    placeholder="Tell us what you think..."
                    rows={3}
                    style={{ marginTop: 4 }}
                  />
                </div>
                <div>
                  <span className="mizu-body--sm">Role</span>
                  <Select>
                    <SelectTrigger aria-label="Role" style={{ marginTop: 4 }}>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Checkbox id="tos" />
                  <label htmlFor="tos" className="mizu-body--sm">
                    I agree to the terms of service
                  </label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Switch id="notif" aria-label="Email notifications" />
                  <label htmlFor="notif" className="mizu-body--sm">
                    Email notifications
                  </label>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <Button variant="ghost">Cancel</Button>
                  <Button variant="primary">Submit</Button>
                </div>
              </Stack>
            </CardBody>
          </Card>
        </Section>

        <Section title="Feedback">
          <Stack gap="0.5rem">
            <Alert tone="info">
              <AlertTitle>Heads up</AlertTitle>
              You can customize any semantic token in the sidebar.
            </Alert>
            <Alert tone="success">
              <AlertTitle>Saved</AlertTitle>
              Your theme has been applied successfully.
            </Alert>
            <Alert tone="warning">
              <AlertTitle>Warning</AlertTitle>
              Changing surface colors may affect contrast ratios.
            </Alert>
            <Alert tone="danger">
              <AlertTitle>Error</AlertTitle>
              Could not parse the pasted CSS.
            </Alert>
          </Stack>
        </Section>

        <Section title="Badges & Tags">
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Badge>Default</Badge>
            <Badge tone="info">Info</Badge>
            <Badge tone="success">Active</Badge>
            <Badge tone="warning">Pending</Badge>
            <Badge tone="danger">Failed</Badge>
            <Tag>design</Tag>
            <Tag>tokens</Tag>
            <Tag>themes</Tag>
          </div>
        </Section>

        <Section title="Table">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>Role</TableHeader>
                <TableHeader>Status</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Avatar size="sm">AB</Avatar>
                    Alice Brown
                  </div>
                </TableCell>
                <TableCell>Admin</TableCell>
                <TableCell>
                  <Badge tone="success">Active</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Avatar size="sm">CD</Avatar>
                    Carla Diaz
                  </div>
                </TableCell>
                <TableCell>Editor</TableCell>
                <TableCell>
                  <Badge tone="warning">Invited</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Avatar size="sm">EF</Avatar>
                    Eric Foster
                  </div>
                </TableCell>
                <TableCell>Viewer</TableCell>
                <TableCell>
                  <Badge>Inactive</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Section>

        <Section title="Tooltip & Skeleton">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary">Hover me</Button>
              </TooltipTrigger>
              <TooltipContent>Tooltip powered by mizu</TooltipContent>
            </Tooltip>
            <Stack gap="0.5rem" style={{ flex: 1, maxWidth: 300 }}>
              <Skeleton style={{ height: 12, width: '80%' }} />
              <Skeleton style={{ height: 12, width: '60%' }} />
              <Skeleton style={{ height: 12, width: '70%' }} />
            </Stack>
          </div>
        </Section>

        <Section title="Typography">
          <Stack gap="0.5rem">
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700 }}>Heading 1</h1>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Heading 2</h2>
            <p className="mizu-body" style={{ margin: 0 }}>
              Body text — the quick brown fox jumps over the lazy dog.
            </p>
            <p className="mizu-body--sm" style={{ margin: 0, color: 'var(--mizu-text-secondary)' }}>
              Secondary small text used for captions, helper text, and metadata.
            </p>
            <code
              style={{
                fontFamily: 'var(--mizu-font-family-mono)',
                background: 'var(--mizu-surface-secondary)',
                padding: '0.125rem 0.375rem',
                borderRadius: 'var(--mizu-radius-sm)',
                fontSize: '0.875rem',
                alignSelf: 'flex-start',
              }}
            >
              monospace code
            </code>
          </Stack>
        </Section>
      </Stack>
    </div>
  );
}

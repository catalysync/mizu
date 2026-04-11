import {
  Badge,
  Button,
  Card,
  Inline,
  Input,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@aspect/react';
import { definePattern } from '@/lib/patterns/types';
import type { OutputFile, RenderContext } from '@/lib/patterns/types';

interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  conversations: number;
  lastSeen: string;
  plan: 'Free' | 'Pro' | 'Team' | 'Enterprise';
}

const contacts: Contact[] = [
  {
    id: 'c1',
    name: 'Sarah Chen',
    email: 'sarah@acme.com',
    company: 'Acme Corp',
    conversations: 8,
    lastSeen: '2m ago',
    plan: 'Pro',
  },
  {
    id: 'c2',
    name: 'James Okafor',
    email: 'james@globex.io',
    company: 'Globex Inc',
    conversations: 3,
    lastSeen: '15m ago',
    plan: 'Team',
  },
  {
    id: 'c3',
    name: 'Priya Patel',
    email: 'priya@initech.dev',
    company: 'Initech',
    conversations: 12,
    lastSeen: '1h ago',
    plan: 'Pro',
  },
  {
    id: 'c4',
    name: 'Alex Kim',
    email: 'alex@umbrella.co',
    company: 'Umbrella Co',
    conversations: 1,
    lastSeen: '3h ago',
    plan: 'Free',
  },
  {
    id: 'c5',
    name: 'Maria Santos',
    email: 'maria@stark.ind',
    company: 'Stark Industries',
    conversations: 6,
    lastSeen: '1d ago',
    plan: 'Enterprise',
  },
];

const PLAN_TONE: Record<Contact['plan'], 'neutral' | 'info' | 'success' | 'warning'> = {
  Free: 'neutral',
  Pro: 'info',
  Team: 'success',
  Enterprise: 'warning',
};

function Preview() {
  return (
    <Stack gap="1rem">
      <Inline gap="0.75rem" align="center">
        <Input size="sm" placeholder="Search contacts…" aria-label="Search contacts" />
        <Button size="sm" variant="primary">
          Add contact
        </Button>
      </Inline>

      <Card>
        <Table density="compact">
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Company</TableHeader>
              <TableHeader>Conversations</TableHeader>
              <TableHeader>Last seen</TableHeader>
              <TableHeader>Plan</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <Stack gap="0.125rem" align="start">
                    <strong>{c.name}</strong>
                    <span style={{ color: 'var(--mizu-text-secondary)', fontSize: '0.75rem' }}>
                      {c.email}
                    </span>
                  </Stack>
                </TableCell>
                <TableCell>{c.company}</TableCell>
                <TableCell>{c.conversations}</TableCell>
                <TableCell>{c.lastSeen}</TableCell>
                <TableCell>
                  <Badge tone={PLAN_TONE[c.plan]}>{c.plan}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </Stack>
  );
}

const TEMPLATE = `import {
  Badge,
  Button,
  Card,
  Inline,
  Input,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@aspect/react';

interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  conversations: number;
  lastSeen: string;
  plan: 'Free' | 'Pro' | 'Team' | 'Enterprise';
}

const contacts: Contact[] = [
  { id: 'c1', name: 'Sarah Chen', email: 'sarah@acme.com', company: 'Acme Corp', conversations: 8, lastSeen: '2m ago', plan: 'Pro' },
  { id: 'c2', name: 'James Okafor', email: 'james@globex.io', company: 'Globex Inc', conversations: 3, lastSeen: '15m ago', plan: 'Team' },
  { id: 'c3', name: 'Priya Patel', email: 'priya@initech.dev', company: 'Initech', conversations: 12, lastSeen: '1h ago', plan: 'Pro' },
  { id: 'c4', name: 'Alex Kim', email: 'alex@umbrella.co', company: 'Umbrella Co', conversations: 1, lastSeen: '3h ago', plan: 'Free' },
  { id: 'c5', name: 'Maria Santos', email: 'maria@stark.ind', company: 'Stark Industries', conversations: 6, lastSeen: '1d ago', plan: 'Enterprise' },
];

const PLAN_TONE: Record<Contact['plan'], 'neutral' | 'info' | 'success' | 'warning'> = {
  Free: 'neutral',
  Pro: 'info',
  Team: 'success',
  Enterprise: 'warning',
};

export default function ContactsPage() {
  return (
    <Stack gap="1rem">
      <Inline gap="0.75rem" align="center">
        <Input size="sm" placeholder="Search contacts…" aria-label="Search contacts" />
        <Button size="sm" variant="primary">Add contact</Button>
      </Inline>
      <Card>
        <Table density="compact">
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Company</TableHeader>
              <TableHeader>Conversations</TableHeader>
              <TableHeader>Last seen</TableHeader>
              <TableHeader>Plan</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map((c) => (
              <TableRow key={c.id}>
                <TableCell><strong>{c.name}</strong></TableCell>
                <TableCell>{c.company}</TableCell>
                <TableCell>{c.conversations}</TableCell>
                <TableCell>{c.lastSeen}</TableCell>
                <TableCell><Badge tone={PLAN_TONE[c.plan]}>{c.plan}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </Stack>
  );
}
`;

export const conversationsContacts = definePattern({
  meta: {
    id: 'conversations.contacts',
    name: 'Conversations Contacts Table',
    description:
      'Contacts directory with compact table, plan-tone badges, and search/add bar for support or messaging products.',
    kind: 'page',
    industries: ['saas-admin', 'other'],
    tier: 'free',
    depends: [
      '@aspect/react#Card',
      '@aspect/react#Table',
      '@aspect/react#Badge',
      '@aspect/react#Input',
      '@aspect/react#Button',
      '@aspect/react#Stack',
      '@aspect/react#Inline',
    ],
    sources: [
      {
        system: 'mizu-storybook-conversations-demo',
        relationship: 'concept-reference',
        notes: 'Ported from apps/storybook/stories/demos/conversations/ContactsPage.tsx',
      },
      {
        system: 'intercom',
        relationship: 'ia-borrowed',
        notes: 'Contacts list pattern with plan pill + last-seen column mirrors Intercom Inbox.',
      },
    ],
  },
  Preview,
  renderReact(_ctx: RenderContext): OutputFile[] {
    return [
      {
        path: 'app/contacts/page.tsx',
        contents: TEMPLATE,
      },
    ];
  },
});

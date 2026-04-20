import type { OutputFile, RenderContext } from '@/lib/patterns/types';
import { definePattern } from '@/lib/patterns/types';
import {
  Badge,
  Button,
  Card,
  Inline,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@aspect/react';

interface Member {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  status: 'active' | 'invited';
  joined: string;
}

const members: Member[] = [
  {
    id: '1',
    name: 'Ifedayo Damilola',
    email: 'dami@catalysync.dev',
    role: 'owner',
    status: 'active',
    joined: 'Mar 2, 2025',
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah@acme.com',
    role: 'admin',
    status: 'active',
    joined: 'Apr 18, 2025',
  },
  {
    id: '3',
    name: 'James Okafor',
    email: 'james@globex.io',
    role: 'member',
    status: 'active',
    joined: 'Jun 3, 2025',
  },
  {
    id: '4',
    name: 'Priya Patel',
    email: 'priya@initech.dev',
    role: 'member',
    status: 'invited',
    joined: '—',
  },
];

const ROLE_TONE: Record<Member['role'], 'success' | 'info' | 'neutral'> = {
  owner: 'success',
  admin: 'info',
  member: 'neutral',
};

function Preview() {
  return (
    <Stack gap="1rem">
      <Inline gap="0.5rem" align="center" style={{ justifyContent: 'space-between' }}>
        <span className="text-muted-foreground text-sm">
          {members.length} members · {members.filter((m) => m.status === 'invited').length} pending
        </span>
        <Button variant="primary" size="sm">
          Invite member
        </Button>
      </Inline>

      <Card>
        <Table density="compact">
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Role</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Joined</TableHeader>
              <TableHeader></TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((m) => (
              <TableRow key={m.id}>
                <TableCell>
                  <Stack gap="0.125rem" align="start">
                    <strong>{m.name}</strong>
                    <span
                      style={{
                        color: 'var(--mizu-text-secondary)',
                        fontSize: '0.75rem',
                      }}
                    >
                      {m.email}
                    </span>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Badge tone={ROLE_TONE[m.role]}>{m.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge tone={m.status === 'active' ? 'success' : 'warning'}>{m.status}</Badge>
                </TableCell>
                <TableCell>{m.joined}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    Manage
                  </Button>
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
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@aspect/react';

interface Member {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  status: 'active' | 'invited';
  joined: string;
}

const members: Member[] = [
  { id: '1', name: 'Ifedayo Damilola', email: 'dami@catalysync.dev', role: 'owner', status: 'active', joined: 'Mar 2, 2025' },
  { id: '2', name: 'Sarah Chen', email: 'sarah@acme.com', role: 'admin', status: 'active', joined: 'Apr 18, 2025' },
  { id: '3', name: 'James Okafor', email: 'james@globex.io', role: 'member', status: 'active', joined: 'Jun 3, 2025' },
];

const ROLE_TONE: Record<Member['role'], 'success' | 'info' | 'neutral'> = {
  owner: 'success',
  admin: 'info',
  member: 'neutral',
};

export default function TeamPage() {
  return (
    <Stack gap="1rem">
      <Inline gap="0.5rem" align="center" style={{ justifyContent: 'space-between' }}>
        <span>{members.length} members</span>
        <Button variant="primary" size="sm">Invite member</Button>
      </Inline>
      <Card>
        <Table density="compact">
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Role</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Joined</TableHeader>
              <TableHeader></TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((m) => (
              <TableRow key={m.id}>
                <TableCell><strong>{m.name}</strong></TableCell>
                <TableCell><Badge tone={ROLE_TONE[m.role]}>{m.role}</Badge></TableCell>
                <TableCell><Badge tone={m.status === 'active' ? 'success' : 'warning'}>{m.status}</Badge></TableCell>
                <TableCell>{m.joined}</TableCell>
                <TableCell><Button variant="ghost" size="sm">Manage</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </Stack>
  );
}
`;

export const commonTeamMembers = definePattern({
  meta: {
    id: 'common.team-members',
    name: 'Team Members',
    description:
      'Team administration table with role + status pills, invite action, and per-row manage button.',
    kind: 'page',
    industries: ['cloud', 'saas-admin', 'ecommerce', 'fintech', 'ai-product', 'devtools', 'other'],
    tier: 'free',
    depends: [
      '@aspect/react#Card',
      '@aspect/react#Table',
      '@aspect/react#Badge',
      '@aspect/react#Button',
      '@aspect/react#Stack',
      '@aspect/react#Inline',
    ],
    sources: [
      {
        system: 'github',
        relationship: 'ia-borrowed',
        notes: 'Team members table with role column pattern from GitHub organization settings.',
      },
      {
        system: 'linear',
        relationship: 'visual-rhythm',
        notes: 'Compact table density echoes Linear workspace members.',
      },
      {
        system: 'notion',
        relationship: 'inspired-by',
        notes: 'Role pill coloring inspired by Notion workspace members.',
      },
    ],
  },
  Preview,
  renderReact(_ctx: RenderContext): OutputFile[] {
    return [
      {
        path: 'app/team/page.tsx',
        contents: TEMPLATE,
      },
    ];
  },
});

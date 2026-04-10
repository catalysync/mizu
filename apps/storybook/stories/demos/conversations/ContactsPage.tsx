import {
  AppContentHeader,
  Card,
  Badge,
  Button,
  Stack,
  Inline,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  Input,
} from '@aspect/react';

const contacts = [
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
  {
    id: 'c6',
    name: 'David Nguyen',
    email: 'david@wayne.ent',
    company: 'Wayne Enterprises',
    conversations: 15,
    lastSeen: '2d ago',
    plan: 'Enterprise',
  },
];

export function ContactsPage() {
  return (
    <Stack gap="1rem">
      <AppContentHeader
        title="Contacts"
        description={`${contacts.length} contacts`}
        actions={
          <Button size="sm" variant="primary">
            Add contact
          </Button>
        }
      />
      <Input size="sm" placeholder="Search contacts…" aria-label="Search contacts" />
      <Card>
        <Table density="compact">
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Company</TableHeader>
              <TableHeader>Conversations</TableHeader>
              <TableHeader>Plan</TableHeader>
              <TableHeader>Last seen</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <strong>{c.name}</strong>
                </TableCell>
                <TableCell style={{ color: 'var(--mizu-text-secondary)' }}>{c.email}</TableCell>
                <TableCell>{c.company}</TableCell>
                <TableCell>{c.conversations}</TableCell>
                <TableCell>
                  <Badge
                    tone={
                      c.plan === 'Enterprise' ? 'info' : c.plan === 'Free' ? 'neutral' : 'success'
                    }
                  >
                    {c.plan}
                  </Badge>
                </TableCell>
                <TableCell style={{ color: 'var(--mizu-text-secondary)' }}>{c.lastSeen}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </Stack>
  );
}

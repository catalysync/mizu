'use client';

import { Button, Card, CardBody, CardHeader, Inline, Input, Stack } from '@aspect/react';
import { Plus, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

interface Team {
  id: string;
  name: string;
  slug: string;
  role: 'owner' | 'admin' | 'member';
}

export function TeamClient({ existingTeams }: { existingTeams: Team[] }) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inviteTeamId = existingTeams[0]?.id ?? '';
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteBusy, setInviteBusy] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const response = await fetch('/api/team/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug }),
      });
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? 'Create failed');
        return;
      }
      setCreating(false);
      setName('');
      setSlug('');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setBusy(false);
    }
  };

  const handleInvite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inviteTeamId) return;
    setInviteBusy(true);
    setInviteError(null);
    setInviteUrl(null);
    try {
      const response = await fetch('/api/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId: inviteTeamId, email: inviteEmail }),
      });
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setInviteError(data.error ?? 'Invite failed');
        return;
      }
      const data = (await response.json()) as { acceptUrl: string };
      setInviteUrl(data.acceptUrl);
      await navigator.clipboard.writeText(data.acceptUrl).catch(() => undefined);
      setInviteEmail('');
    } catch (err) {
      setInviteError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setInviteBusy(false);
    }
  };

  if (!creating && existingTeams.length === 0) {
    return (
      <Stack gap="0.75rem">
        <p className="text-muted-foreground text-sm">
          Team tier: $39/mo for 3 seats + $12/mo per additional seat.
        </p>
        <Inline gap="0.5rem" align="center">
          <Button variant="primary" onClick={() => setCreating(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create team
          </Button>
        </Inline>
      </Stack>
    );
  }

  return (
    <Stack gap="1.5rem">
      {creating ? (
        <Card>
          <CardHeader title="New team" />
          <CardBody>
            <form onSubmit={handleCreate}>
              <Stack gap="0.75rem">
                <Input
                  label="Team name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  minLength={2}
                  maxLength={80}
                />
                <Input
                  label="Slug (lowercase, dashes)"
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
                  pattern="[a-z0-9\-]+"
                  required
                  minLength={2}
                  maxLength={60}
                />
                {error ? (
                  <span className="text-danger text-sm" role="alert">
                    {error}
                  </span>
                ) : null}
                <Inline gap="0.5rem" align="center">
                  <Button type="submit" variant="primary" loading={busy}>
                    Create team
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => setCreating(false)}>
                    Cancel
                  </Button>
                </Inline>
              </Stack>
            </form>
          </CardBody>
        </Card>
      ) : null}

      {existingTeams.length > 0 ? (
        <Card>
          <CardHeader title="Invite a member" />
          <CardBody>
            <form onSubmit={handleInvite}>
              <Stack gap="0.75rem">
                <Input
                  label="Email"
                  type="email"
                  value={inviteEmail}
                  onChange={(event) => setInviteEmail(event.target.value)}
                  required
                />
                {inviteError ? (
                  <span className="text-danger text-sm" role="alert">
                    {inviteError}
                  </span>
                ) : null}
                <Inline gap="0.5rem" align="center">
                  <Button type="submit" variant="primary" loading={inviteBusy}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create invite link
                  </Button>
                  {inviteUrl ? (
                    <span className="text-muted-foreground text-xs">Copied to clipboard</span>
                  ) : null}
                </Inline>
                {inviteUrl ? (
                  <code className="bg-muted text-foreground block rounded px-2 py-1 text-xs">
                    {inviteUrl}
                  </code>
                ) : null}
              </Stack>
            </form>
          </CardBody>
        </Card>
      ) : null}

      {!creating && existingTeams.length > 0 ? (
        <Inline gap="0.5rem" align="center">
          <Button variant="secondary" onClick={() => setCreating(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New team
          </Button>
        </Inline>
      ) : null}
    </Stack>
  );
}

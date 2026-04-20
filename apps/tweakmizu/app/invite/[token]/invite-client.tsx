'use client';

import { Button, Inline, Stack } from '@aspect/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
  token: string;
  expired: boolean;
  accepted: boolean;
  teamName: string;
}

export function InviteClient({ token, expired, accepted, teamName }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (accepted) {
    return (
      <Stack gap="0.75rem">
        <p className="text-muted-foreground text-sm">
          This invite has already been accepted. You should already be a member of {teamName}.
        </p>
        <Inline gap="0.5rem" align="center">
          <Button asChild variant="primary">
            <Link href="/dashboard/team">Go to team</Link>
          </Button>
        </Inline>
      </Stack>
    );
  }

  if (expired) {
    return (
      <Stack gap="0.75rem">
        <p className="text-danger text-sm">
          This invite has expired. Ask the team owner to send a new one.
        </p>
      </Stack>
    );
  }

  const handleAccept = async () => {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch('/api/team/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      if (!response.ok) {
        if (response.status === 401) {
          setError('Sign in first, then click the invite link again.');
          return;
        }
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? 'Accept failed');
        return;
      }
      router.push('/dashboard/team');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Stack gap="0.75rem">
      <Inline gap="0.5rem" align="center">
        <Button variant="primary" loading={busy} onClick={handleAccept}>
          Accept invite
        </Button>
        <Button asChild variant="ghost">
          <Link href="/signin">Sign in first</Link>
        </Button>
      </Inline>
      {error ? (
        <p className="text-danger text-sm" role="alert">
          {error}
        </p>
      ) : null}
    </Stack>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { Button, Badge, Stack } from '@aspect/react';
import { useCraftStore } from '@/store/craft-store';
import { profileToCss } from '@/lib/craft/profile-to-css';
import type { DesignLanguageProfile } from '@/lib/craft/profile';

interface SharedProfileViewProps {
  profile: {
    id: string;
    name: string;
    archetype: string | null;
    domain: string | null;
    profileJson: unknown;
  };
}

export function SharedProfileView({ profile }: SharedProfileViewProps) {
  const router = useRouter();
  const importProfile = useCraftStore((s) => s.importProfile);
  const p = profile.profileJson as DesignLanguageProfile;
  const vars = profileToCss(p);

  const handleFork = () => {
    const result = importProfile(profile.profileJson);
    if (result.ok) router.push('/craft/foundation');
  };

  return (
    <div style={{ maxWidth: '40rem', margin: '0 auto' }}>
      <Stack gap="1.5rem">
        <div
          style={{
            ...(vars as React.CSSProperties),
            padding: '2rem',
            borderRadius: 'var(--mizu-radius-lg)',
            background: 'var(--mizu-surface-secondary)',
            border: '1px solid var(--mizu-border-subtle)',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              marginBottom: '1rem',
            }}
          >
            <span
              style={{
                width: '2rem',
                height: '2rem',
                borderRadius: 'var(--mizu-radius-md)',
                background: 'var(--mizu-action-primary-default)',
              }}
            />
            <span
              style={{
                width: '2rem',
                height: '2rem',
                borderRadius: 'var(--mizu-radius-md)',
                background: 'var(--mizu-feedback-success-default)',
              }}
            />
            <span
              style={{
                width: '2rem',
                height: '2rem',
                borderRadius: 'var(--mizu-radius-md)',
                background: 'var(--mizu-surface-default)',
                border: '1px solid var(--mizu-border-default)',
              }}
            />
          </div>
          <div
            style={{
              background: 'var(--mizu-surface-default)',
              borderRadius: 'var(--mizu-radius-lg)',
              padding: '1rem',
              border: '1px solid var(--mizu-border-subtle)',
            }}
          >
            <div style={{ fontWeight: 600, color: 'var(--mizu-text-primary)' }}>{profile.name}</div>
            <div
              style={{
                fontSize: '0.8125rem',
                color: 'var(--mizu-text-secondary)',
                marginTop: '0.25rem',
              }}
            >
              {p.description ?? `A ${profile.archetype ?? 'custom'} design language`}
            </div>
          </div>
        </div>

        <Stack gap="0.5rem">
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{profile.name}</h1>
          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
            {profile.archetype ? <Badge tone="info">{profile.archetype}</Badge> : null}
            {profile.domain ? <Badge tone="neutral">{profile.domain}</Badge> : null}
          </div>
        </Stack>

        <Button variant="primary" onClick={handleFork}>
          Fork this profile and start editing
        </Button>
      </Stack>
    </div>
  );
}

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { CraftShell } from '@/components/craft/craft-shell';

export const metadata: Metadata = {
  title: 'craft — tweakmizu',
  description:
    'Author your design language on top of mizu. Knob-based token editing, archetype presets, AI-assisted profiles, and a one-click themed starter export.',
};

export default async function CraftLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    redirect('/signin?callbackUrl=/craft');
  }

  return (
    <CraftShell
      user={{
        id: session.user.id,
        name: session.user.name ?? session.user.email ?? 'You',
        email: session.user.email ?? '',
      }}
    >
      {children}
    </CraftShell>
  );
}

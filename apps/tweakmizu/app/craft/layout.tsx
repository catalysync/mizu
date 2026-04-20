import { CraftShell } from '@/components/craft/craft-shell';
import { auth } from '@/lib/auth';
import { getCraftProStatus } from '@/lib/craft/pro-gate';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

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

  const { isPro } = await getCraftProStatus();

  return (
    <CraftShell
      user={{
        id: session.user.id,
        name: session.user.name ?? session.user.email ?? 'You',
        email: session.user.email ?? '',
      }}
      isPro={isPro}
    >
      {children}
    </CraftShell>
  );
}

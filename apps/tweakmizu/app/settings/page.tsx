import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { getSubscriptionStatus } from '@/lib/subscription';
import { getUserProfiles } from '@/actions/craft-profiles';
import { STUDIO_FREE_GENERATIONS_PER_HOUR } from '@/lib/constants';
import { SettingsPage } from './settings-page';

export const metadata: Metadata = {
  title: 'Settings — tweakmizu',
  description: 'Manage your tweakmizu account, subscription, and saved design profiles.',
};

export default async function SettingsRoute() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    redirect('/signin?callbackUrl=/settings');
  }

  const sub = await getSubscriptionStatus(session.user.id);

  let profiles: Awaited<ReturnType<typeof getUserProfiles>> = [];
  try {
    profiles = await getUserProfiles();
  } catch {
    // If profiles fail to load, show an empty list rather than crashing
  }

  return (
    <SettingsPage
      user={{
        id: session.user.id,
        name: session.user.name ?? session.user.email ?? 'You',
        email: session.user.email ?? '',
        createdAt: session.user.createdAt,
      }}
      plan={{
        isPro: sub.isSubscribed,
        currentPeriodEnd: sub.currentPeriodEnd,
      }}
      aiLimit={STUDIO_FREE_GENERATIONS_PER_HOUR}
      profiles={profiles}
    />
  );
}

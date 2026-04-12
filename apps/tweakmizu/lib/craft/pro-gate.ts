import 'server-only';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { getSubscriptionStatus } from '@/lib/subscription';

export interface CraftProStatus {
  isPro: boolean;
  userId: string | null;
}

export async function getCraftProStatus(): Promise<CraftProStatus> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) return { isPro: false, userId: null };
    const sub = await getSubscriptionStatus(session.user.id);
    return { isPro: sub.isSubscribed, userId: session.user.id };
  } catch {
    return { isPro: false, userId: null };
  }
}

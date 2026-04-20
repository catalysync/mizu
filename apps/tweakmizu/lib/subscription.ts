import { db } from '@/db';
import { subscription } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import 'server-only';
import { PRO_PRODUCT_ID } from './constants';

export type SubscriptionStatus = {
  isSubscribed: boolean;
  productId: string | null;
  currentPeriodEnd: Date | null;
};

export async function getActiveSubscription(
  userId: string,
): Promise<typeof subscription.$inferSelect | null> {
  const rows = await db
    .select()
    .from(subscription)
    .where(and(eq(subscription.userId, userId), eq(subscription.status, 'active')));
  return rows[0] ?? null;
}

export async function getSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
  const active = await getActiveSubscription(userId);
  if (!active) {
    return { isSubscribed: false, productId: null, currentPeriodEnd: null };
  }

  const isPro = PRO_PRODUCT_ID !== '' && active.productId === PRO_PRODUCT_ID;
  return {
    isSubscribed: isPro,
    productId: active.productId,
    currentPeriodEnd: active.currentPeriodEnd,
  };
}

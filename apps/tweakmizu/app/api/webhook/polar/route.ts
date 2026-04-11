import { db } from '@/db';
import { subscription } from '@/db/schema';
import { Webhooks } from '@polar-sh/nextjs';

function safeDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  return new Date(value);
}

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET ?? '',
  onPayload: async ({ data, type }) => {
    const subscriptionEvents = [
      'subscription.created',
      'subscription.active',
      'subscription.canceled',
      'subscription.revoked',
      'subscription.uncanceled',
      'subscription.updated',
    ] as const;

    if (!subscriptionEvents.includes(type as (typeof subscriptionEvents)[number])) {
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const d = data as any;
      const userId = d.customer?.externalId ?? null;

      const row = {
        id: d.id,
        createdAt: new Date(d.createdAt),
        modifiedAt: safeDate(d.modifiedAt),
        amount: d.amount,
        currency: d.currency,
        recurringInterval: d.recurringInterval,
        status: d.status,
        currentPeriodStart: safeDate(d.currentPeriodStart) ?? new Date(),
        currentPeriodEnd: safeDate(d.currentPeriodEnd) ?? new Date(),
        cancelAtPeriodEnd: d.cancelAtPeriodEnd ?? false,
        canceledAt: safeDate(d.canceledAt),
        startedAt: safeDate(d.startedAt) ?? new Date(),
        endsAt: safeDate(d.endsAt),
        endedAt: safeDate(d.endedAt),
        customerId: d.customerId,
        productId: d.productId,
        discountId: d.discountId ?? null,
        checkoutId: d.checkoutId ?? '',
        customerCancellationReason: d.customerCancellationReason ?? null,
        customerCancellationComment: d.customerCancellationComment ?? null,
        metadata: d.metadata ? JSON.stringify(d.metadata) : null,
        customFieldData: d.customFieldData ? JSON.stringify(d.customFieldData) : null,
        userId: userId as string | null,
      };

      await db
        .insert(subscription)
        .values(row)
        .onConflictDoUpdate({
          target: subscription.id,
          set: {
            modifiedAt: row.modifiedAt ?? new Date(),
            amount: row.amount,
            currency: row.currency,
            recurringInterval: row.recurringInterval,
            status: row.status,
            currentPeriodStart: row.currentPeriodStart,
            currentPeriodEnd: row.currentPeriodEnd,
            cancelAtPeriodEnd: row.cancelAtPeriodEnd,
            canceledAt: row.canceledAt,
            startedAt: row.startedAt,
            endsAt: row.endsAt,
            endedAt: row.endedAt,
            customerId: row.customerId,
            productId: row.productId,
            discountId: row.discountId,
            checkoutId: row.checkoutId,
            customerCancellationReason: row.customerCancellationReason,
            customerCancellationComment: row.customerCancellationComment,
            metadata: row.metadata,
            customFieldData: row.customFieldData,
            userId: row.userId,
          },
        });
    } catch (error) {
      console.error('polar webhook handler failed', { type, error });
    }
  },
});

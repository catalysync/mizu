import { NextResponse, type NextRequest } from 'next/server';
import { randomBytes } from 'node:crypto';
import { z } from 'zod';
import { db } from '@/db';
import { share } from '@/db/schema';
import { tryGetCurrentUserId } from '@/lib/shared';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const shareRequestSchema = z.object({
  plan: z.any(),
});

export async function POST(req: NextRequest) {
  const userId = await tryGetCurrentUserId(req);
  if (!userId) {
    return NextResponse.json({ error: 'Sign in to create share links' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = shareRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid share request' }, { status: 422 });
  }

  const plan = parsed.data.plan as { id: string; intent: { productName: string } };
  if (!plan?.id || !plan?.intent?.productName) {
    return NextResponse.json({ error: 'Invalid plan shape' }, { status: 422 });
  }

  const token = randomBytes(12).toString('base64url');
  const id = randomBytes(8).toString('hex');
  const now = new Date();

  try {
    await db.insert(share).values({
      id,
      token,
      userId,
      projectId: plan.id,
      planJson: plan,
      expiresAt: null,
      views: 0,
      createdAt: now,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to create share',
        detail: error instanceof Error ? error.message : 'unknown',
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ token, url: `/share/${token}` });
}

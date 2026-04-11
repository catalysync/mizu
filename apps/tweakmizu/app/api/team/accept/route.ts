import { randomBytes } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { teamInvite, teamMember } from '@/db/schema';
import { tryGetCurrentUserId } from '@/lib/shared';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const acceptSchema = z.object({
  token: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const userId = await tryGetCurrentUserId(req);
  if (!userId) {
    return NextResponse.json({ error: 'Sign in to accept an invite' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = acceptSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid accept request' }, { status: 422 });
  }

  const rows = await db
    .select()
    .from(teamInvite)
    .where(eq(teamInvite.token, parsed.data.token))
    .limit(1);

  if (rows.length === 0) {
    return NextResponse.json({ error: 'Invite not found' }, { status: 404 });
  }

  const invite = rows[0];

  if (invite.acceptedAt) {
    return NextResponse.json({ error: 'Invite already accepted' }, { status: 409 });
  }
  if (invite.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Invite expired' }, { status: 410 });
  }

  const memberId = randomBytes(8).toString('hex');
  const now = new Date();

  try {
    await db.insert(teamMember).values({
      id: memberId,
      teamId: invite.teamId,
      userId,
      role: invite.role,
      joinedAt: now,
    });
    await db.update(teamInvite).set({ acceptedAt: now }).where(eq(teamInvite.id, invite.id));
  } catch (error) {
    return NextResponse.json(
      { error: 'Accept failed', detail: error instanceof Error ? error.message : 'unknown' },
      { status: 500 },
    );
  }

  return NextResponse.json({ teamId: invite.teamId, role: invite.role });
}

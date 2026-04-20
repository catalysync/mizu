import { db } from '@/db';
import { team, teamInvite, teamMember } from '@/db/schema';
import { tryGetCurrentUserId } from '@/lib/shared';
import { and, eq } from 'drizzle-orm';
import { NextResponse, type NextRequest } from 'next/server';
import { randomBytes } from 'node:crypto';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const inviteSchema = z.object({
  teamId: z.string().min(1),
  email: z.string().email(),
  role: z.enum(['admin', 'member']).default('member'),
});

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  const userId = await tryGetCurrentUserId(req);
  if (!userId) {
    return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = inviteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid invite input', issues: parsed.error.issues },
      { status: 422 },
    );
  }

  const callerMembership = await db
    .select()
    .from(teamMember)
    .where(and(eq(teamMember.teamId, parsed.data.teamId), eq(teamMember.userId, userId)))
    .limit(1);

  if (callerMembership.length === 0) {
    return NextResponse.json({ error: 'Not a team member' }, { status: 403 });
  }

  const callerRole = callerMembership[0].role;
  if (callerRole !== 'owner' && callerRole !== 'admin') {
    return NextResponse.json({ error: 'Only owners and admins can invite' }, { status: 403 });
  }

  const teamRow = await db.select().from(team).where(eq(team.id, parsed.data.teamId)).limit(1);

  if (teamRow.length === 0) {
    return NextResponse.json({ error: 'Team not found' }, { status: 404 });
  }

  const id = randomBytes(8).toString('hex');
  const token = randomBytes(16).toString('base64url');
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SEVEN_DAYS_MS);

  try {
    await db.insert(teamInvite).values({
      id,
      teamId: parsed.data.teamId,
      email: parsed.data.email.toLowerCase(),
      role: parsed.data.role,
      invitedBy: userId,
      token,
      expiresAt,
      acceptedAt: null,
      createdAt: now,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Create invite failed', detail: error instanceof Error ? error.message : 'unknown' },
      { status: 500 },
    );
  }

  const origin = req.nextUrl.origin;
  return NextResponse.json({ id, token, acceptUrl: `${origin}/invite/${token}` });
}

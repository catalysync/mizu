import { db } from '@/db';
import { team, teamMember } from '@/db/schema';
import { tryGetCurrentUserId } from '@/lib/shared';
import { NextResponse, type NextRequest } from 'next/server';
import { randomBytes } from 'node:crypto';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const createTeamSchema = z.object({
  name: z.string().min(2).max(80),
  slug: z
    .string()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, or dashes'),
});

export async function POST(req: NextRequest) {
  const userId = await tryGetCurrentUserId(req);
  if (!userId) {
    return NextResponse.json({ error: 'Sign in to create a team' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = createTeamSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid team input', issues: parsed.error.issues },
      { status: 422 },
    );
  }

  const id = randomBytes(8).toString('hex');
  const memberId = randomBytes(8).toString('hex');
  const now = new Date();

  try {
    await db.insert(team).values({
      id,
      name: parsed.data.name,
      slug: parsed.data.slug,
      ownerId: userId,
      createdAt: now,
      updatedAt: now,
    });
    await db.insert(teamMember).values({
      id: memberId,
      teamId: id,
      userId,
      role: 'owner',
      joinedAt: now,
    });
    return NextResponse.json({ id, slug: parsed.data.slug });
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'unknown';
    if (/unique|duplicate/i.test(detail)) {
      return NextResponse.json({ error: 'Team slug is already taken' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Create team failed', detail }, { status: 500 });
  }
}

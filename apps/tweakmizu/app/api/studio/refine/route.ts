import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { refinePlan } from '@/lib/studio/refine';
import type { Plan } from '@/lib/studio/composer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const refineRequestSchema = z.object({
  plan: z.any(),
  refinement: z.string().min(1).max(1000),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = refineRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid refine request', issues: parsed.error.issues },
      { status: 422 },
    );
  }

  try {
    const result = await refinePlan(parsed.data.plan as Plan, parsed.data.refinement);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Refine failed', detail: error instanceof Error ? error.message : 'unknown' },
      { status: 500 },
    );
  }
}

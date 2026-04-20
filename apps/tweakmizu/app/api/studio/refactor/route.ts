import { refactorFile } from '@/lib/studio/refactor';
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const refactorRequestSchema = z.object({
  path: z.string().min(1),
  contents: z.string().min(1),
  instruction: z.string().min(1).max(1000),
  substrate: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = refactorRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid refactor request', issues: parsed.error.issues },
      { status: 422 },
    );
  }

  try {
    const result = await refactorFile({
      path: parsed.data.path,
      contents: parsed.data.contents,
      instruction: parsed.data.instruction,
      substrate: parsed.data.substrate ?? {},
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Refactor failed', detail: error instanceof Error ? error.message : 'unknown' },
      { status: 500 },
    );
  }
}

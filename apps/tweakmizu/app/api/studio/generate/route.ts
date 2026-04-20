import { composeWithClaude } from '@/lib/studio/claude-composer';
import { intentSpecSchema } from '@/types/studio';
import { NextResponse, type NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = intentSpecSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid intent spec', issues: parsed.error.issues },
      { status: 422 },
    );
  }

  try {
    const result = await composeWithClaude(parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Composer failed',
        detail: error instanceof Error ? error.message : 'unknown',
      },
      { status: 500 },
    );
  }
}

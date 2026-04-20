import { editThemeWithClaude } from '@/lib/studio/edit-theme';
import type { ThemeStyleProps } from '@/types/theme';
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const editRequestSchema = z.object({
  instruction: z.string().min(1).max(500),
  styles: z.record(z.string(), z.string()),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = editRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid edit-theme request', issues: parsed.error.issues },
      { status: 422 },
    );
  }

  try {
    const result = await editThemeWithClaude(
      parsed.data.instruction,
      parsed.data.styles as ThemeStyleProps,
    );
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Edit failed', detail: error instanceof Error ? error.message : 'unknown' },
      { status: 500 },
    );
  }
}

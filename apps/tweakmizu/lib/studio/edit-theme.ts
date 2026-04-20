import type { ThemeStyleProps } from '@/types/theme';
import Anthropic from '@anthropic-ai/sdk';

const MODEL = 'claude-sonnet-4-5';
const MAX_TOKENS = 2048;

const editTool: Anthropic.Tool = {
  name: 'edit_theme',
  description: 'Apply a set of token edits to the current theme.',
  input_schema: {
    type: 'object',
    required: ['edits', 'rationale'],
    properties: {
      edits: {
        type: 'array',
        description: 'List of theme token edits to apply.',
        items: {
          type: 'object',
          required: ['key', 'value'],
          properties: {
            key: {
              type: 'string',
              description:
                'A top-level ThemeStyleProps key (action-primary-default, surface-default, radius-md, font-family-sans, etc.)',
            },
            value: {
              type: 'string',
              description: 'The new CSS value for this token.',
            },
          },
        },
      },
      rationale: {
        type: 'string',
        description: 'A one-sentence explanation of WHAT changed.',
      },
    },
  },
};

const ALLOWED_KEYS = new Set([
  'action-primary-default',
  'action-primary-hover',
  'action-primary-active',
  'action-destructive-default',
  'feedback-success-default',
  'feedback-warning-default',
  'feedback-danger-default',
  'surface-default',
  'surface-secondary',
  'surface-inverse',
  'text-primary',
  'text-secondary',
  'text-inverse',
  'text-disabled',
  'border-default',
  'border-strong',
  'radius-sm',
  'radius-md',
  'radius-lg',
  'radius-xl',
  'shadow-sm',
  'shadow-md',
  'shadow-lg',
  'shadow-xl',
  'font-family-sans',
  'font-family-mono',
  'duration-fast',
  'duration-normal',
] as const);

export interface ThemeEditResult {
  ok: boolean;
  edits?: Partial<ThemeStyleProps>;
  rationale?: string;
  error?: string;
}

export async function editThemeWithClaude(
  instruction: string,
  currentStyles: ThemeStyleProps,
): Promise<ThemeEditResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { ok: false, error: 'ANTHROPIC_API_KEY not configured' };
  }
  if (!instruction.trim()) {
    return { ok: false, error: 'Empty instruction' };
  }

  const summary = {
    'action-primary-default': currentStyles['action-primary-default'],
    'surface-default': currentStyles['surface-default'],
    'text-primary': currentStyles['text-primary'],
    'border-default': currentStyles['border-default'],
    'radius-md': currentStyles['radius-md'],
    'font-family-sans': currentStyles['font-family-sans'],
  };

  const systemPrompt = `You are a mizu theme editor. The user describes how they want the theme to feel in natural language, and you emit a small set of token edits.

Only emit edits for these allowed keys:
${Array.from(ALLOWED_KEYS).join(', ')}

Rules:
1. Emit 2-8 edits. Be surgical — only change what the instruction implies.
2. Color values must be valid CSS colors (hex, rgb, hsl, oklch, named).
3. Radius and shadow values must be valid CSS length/shadow strings.
4. Font family values must be valid font-family strings.
5. You MUST call the \`edit_theme\` tool exactly once. No prose.

Current theme summary:
${JSON.stringify(summary, null, 2)}`;

  try {
    const anthropic = new Anthropic({ apiKey });
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages: [{ role: 'user', content: instruction }],
      tools: [editTool],
      tool_choice: { type: 'tool', name: 'edit_theme' },
    });

    const toolUse = response.content.find(
      (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use',
    );
    if (!toolUse) {
      return { ok: false, error: 'no tool use in response' };
    }

    const input = toolUse.input as {
      edits: Array<{ key: string; value: string }>;
      rationale: string;
    };

    if (!Array.isArray(input.edits) || input.edits.length === 0) {
      return { ok: false, error: 'empty edits' };
    }

    const edits: Partial<ThemeStyleProps> = {};
    for (const edit of input.edits) {
      if (!ALLOWED_KEYS.has(edit.key as never)) continue;
      if (typeof edit.value !== 'string' || edit.value.length === 0) continue;
      (edits as Record<string, string>)[edit.key] = edit.value;
    }

    if (Object.keys(edits).length === 0) {
      return { ok: false, error: 'all edits filtered out (unknown keys)' };
    }

    return { ok: true, edits, rationale: input.rationale };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'unknown error',
    };
  }
}

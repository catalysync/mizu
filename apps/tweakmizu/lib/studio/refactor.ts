import Anthropic from '@anthropic-ai/sdk';

const MODEL = 'claude-sonnet-4-5';
const MAX_TOKENS = 8192;

export interface RefactorInput {
  path: string;
  contents: string;
  instruction: string;
  substrate: Record<string, unknown>;
}

export interface RefactorResult {
  ok: boolean;
  contents?: string;
  error?: string;
}

const refactorTool: Anthropic.Tool = {
  name: 'emit_refactored_file',
  description: 'Emit the refactored contents of a single file.',
  input_schema: {
    type: 'object',
    required: ['contents'],
    properties: {
      contents: {
        type: 'string',
        description: 'The full updated file contents, including all imports and exports.',
      },
    },
  },
};

export async function refactorFile(input: RefactorInput): Promise<RefactorResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { ok: false, error: 'ANTHROPIC_API_KEY not configured' };
  }
  if (!input.instruction.trim()) {
    return { ok: false, error: 'Refactor instruction is empty' };
  }

  const systemPrompt = `You are a senior React engineer refactoring a single file inside a tweakmizu-generated project.

The project uses the mizu design system. Read the substrate summary below and respect it:
- Use layout primitives (Stack, Inline, Cluster, Grid, Center, Split) from @aspect/react instead of manual flex/grid CSS.
- Use semantic tokens (--mizu-text-*, --mizu-surface-*, --mizu-border-*, --mizu-action-*).
- Use mizu components (Button, Card, Input, Table, etc.) over raw HTML.
- Do not introduce new variants beyond what the substrate allows.

Substrate summary:
${JSON.stringify(input.substrate, null, 2).slice(0, 2000)}

You MUST call the \`emit_refactored_file\` tool exactly once with the full refactored file contents. Do NOT output prose outside the tool call.`;

  const userPrompt = `File path: ${input.path}

Current contents:
\`\`\`
${input.contents}
\`\`\`

Refactor instruction:
"""
${input.instruction}
"""

Emit the refactored file.`;

  try {
    const anthropic = new Anthropic({ apiKey });
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
      tools: [refactorTool],
      tool_choice: { type: 'tool', name: 'emit_refactored_file' },
    });

    const toolUse = response.content.find(
      (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use',
    );

    if (!toolUse) {
      return { ok: false, error: 'no tool use in response' };
    }

    const contents = (toolUse.input as { contents?: string }).contents;
    if (typeof contents !== 'string' || contents.length === 0) {
      return { ok: false, error: 'empty contents' };
    }

    return { ok: true, contents };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'unknown error',
    };
  }
}

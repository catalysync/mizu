import { filterPatterns } from '@/lib/patterns/registry';
import Anthropic from '@anthropic-ai/sdk';
import type { Plan } from './composer';

const MODEL = 'claude-sonnet-4-5';
const MAX_TOKENS = 4096;

const refineTool: Anthropic.Tool = {
  name: 'refine_plan',
  description: 'Emit a refined plan after applying the user refinement instructions.',
  input_schema: {
    type: 'object',
    required: ['entries', 'rationale'],
    properties: {
      entries: {
        type: 'array',
        items: {
          type: 'object',
          required: ['patternId', 'route', 'title'],
          properties: {
            patternId: { type: 'string' },
            route: { type: 'string' },
            title: { type: 'string' },
          },
        },
      },
      rationale: {
        type: 'string',
        description: 'Short explanation of WHAT changed and WHY.',
      },
    },
  },
};

export interface RefineResult {
  plan: Plan;
  source: 'claude' | 'unchanged';
  error?: string;
}

export async function refinePlan(original: Plan, refinement: string): Promise<RefineResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { plan: original, source: 'unchanged', error: 'ANTHROPIC_API_KEY not configured' };
  }
  if (!refinement.trim()) {
    return { plan: original, source: 'unchanged' };
  }

  const candidates = filterPatterns({ industry: original.intent.industry, tier: 'free' });
  const pool = candidates.length > 0 ? candidates : filterPatterns({ tier: 'free' });
  const validIds = new Set(pool.map((c) => c.meta.id));

  const catalogBlock = pool
    .map((p) => `- ${p.meta.id}: ${p.meta.name} — ${p.meta.description}`)
    .join('\n');

  const currentEntries = original.entries
    .map((e) => `- ${e.route}: ${e.patternId} (${e.title})`)
    .join('\n');

  const systemPrompt = `You are a design system composer refining an existing tweakmizu project plan.

The user has an existing plan and wants to change it. Call the \`refine_plan\` tool exactly once with the new entries after applying their refinement.

Rules:
1. Every patternId MUST exist in the Available Patterns list. Do not invent.
2. Keep entries that still make sense — only change what the user's refinement asks about.
3. The rationale should describe WHAT changed, not the whole plan.

Available Patterns:
${catalogBlock}`;

  const userPrompt = `Current plan for "${original.intent.productName}" (${original.intent.industry}, ${original.intent.tone}):
${currentEntries}

Previous rationale: ${original.rationale}

User refinement:
"""
${refinement}
"""

Emit the refined plan now.`;

  try {
    const anthropic = new Anthropic({ apiKey });
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
      tools: [refineTool],
      tool_choice: { type: 'tool', name: 'refine_plan' },
    });

    const toolUse = response.content.find(
      (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use',
    );

    if (!toolUse) {
      return { plan: original, source: 'unchanged', error: 'no tool use in response' };
    }

    const input = toolUse.input as {
      entries: Array<{ patternId: string; route: string; title: string }>;
      rationale: string;
    };

    if (!Array.isArray(input.entries) || input.entries.length === 0) {
      return { plan: original, source: 'unchanged', error: 'empty entries' };
    }

    for (const entry of input.entries) {
      if (!validIds.has(entry.patternId)) {
        return {
          plan: original,
          source: 'unchanged',
          error: `unknown patternId ${entry.patternId}`,
        };
      }
    }

    const refinedPlan: Plan = {
      ...original,
      id: `plan-${Date.now()}`,
      entries: input.entries.map((e) => ({
        patternId: e.patternId,
        route: e.route.startsWith('/') ? e.route : `/${e.route}`,
        title: e.title,
      })),
      rationale: input.rationale || original.rationale,
      createdAt: new Date().toISOString(),
    };

    return { plan: refinedPlan, source: 'claude' };
  } catch (error) {
    return {
      plan: original,
      source: 'unchanged',
      error: error instanceof Error ? error.message : 'unknown error',
    };
  }
}

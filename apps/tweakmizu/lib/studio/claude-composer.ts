import { filterPatterns } from '@/lib/patterns/registry';
import type { PatternModule } from '@/lib/patterns/types';
import type { IntentSpec } from '@/types/studio';
import Anthropic from '@anthropic-ai/sdk';
import type { Plan, PlanEntry } from './composer';
import { compose as deterministicCompose } from './composer';

const MODEL = 'claude-sonnet-4-5';
const MAX_TOKENS = 4096;

const emitPlanTool: Anthropic.Tool = {
  name: 'emit_plan',
  description: 'Emit the project composition plan with selected patterns and rationale.',
  input_schema: {
    type: 'object',
    required: ['entries', 'rationale'],
    properties: {
      entries: {
        type: 'array',
        description:
          'One entry per requested page. Each entry assigns a catalog pattern id to a route.',
        items: {
          type: 'object',
          required: ['patternId', 'route', 'title'],
          properties: {
            patternId: {
              type: 'string',
              description:
                'The exact id of a pattern from the available catalog. Must be present in the list.',
            },
            route: { type: 'string' },
            title: { type: 'string' },
          },
        },
      },
      rationale: {
        type: 'string',
        description:
          'A 2-3 sentence human-readable explanation of the pattern choices, tailored to the user.',
      },
    },
  },
};

function buildSystemPrompt(candidates: PatternModule[]): string {
  const catalogBlock = candidates
    .map((p) => {
      const industries = p.meta.industries.join(', ');
      const deps = p.meta.depends.slice(0, 5).join(', ');
      return `- id: ${p.meta.id}\n  name: ${p.meta.name}\n  kind: ${p.meta.kind}\n  industries: ${industries}\n  description: ${p.meta.description}\n  deps: ${deps}`;
    })
    .join('\n\n');

  return `You are a design system composer for tweakmizu, an AI-native design system studio. Your only job is to select patterns from the catalog below and assign them to the user's requested pages.

You MUST call the \`emit_plan\` tool exactly once. Do NOT output prose outside the tool call.

Rules:
1. Every patternId in your plan MUST exactly match an id from the Available Patterns list. Do not invent new ids.
2. One entry per requested page. If the user asks for 4 pages, emit 4 entries.
3. Match patterns to pages by semantic fit (topic, industry). If nothing fits, pick the closest available.
4. The rationale must explain WHY you chose these patterns for THIS user's intent (2-3 sentences, plain English, no bullet points).
5. Keep patterns diverse — prefer distinct ids across entries when possible.

Available Patterns:

${catalogBlock}`;
}

function buildUserMessage(intent: IntentSpec): string {
  const pageList = intent.pages.map((p, i) => `${i + 1}. ${p.label} (route: ${p.slug})`).join('\n');

  return `Intent:
- Product: ${intent.productName}
- Description: ${intent.description}
- Industry: ${intent.industry}
- Stack: ${intent.stack}
- Tone: ${intent.tone}
- Density: ${intent.density}
${intent.refinement ? `- Extra constraints: ${intent.refinement}\n` : ''}
Requested pages:
${pageList}

Emit the plan now.`;
}

interface ClaudePlanEntry {
  patternId: string;
  route: string;
  title: string;
}

interface ClaudePlanInput {
  entries: ClaudePlanEntry[];
  rationale: string;
}

function validateClaudeOutput(
  input: ClaudePlanInput,
  candidates: PatternModule[],
): { ok: true; entries: PlanEntry[]; rationale: string } | { ok: false; reason: string } {
  if (!Array.isArray(input.entries) || input.entries.length === 0) {
    return { ok: false, reason: 'missing entries' };
  }
  const validIds = new Set(candidates.map((c) => c.meta.id));
  const cleaned: PlanEntry[] = [];
  for (const entry of input.entries) {
    if (!entry.patternId || !entry.route || !entry.title) {
      return { ok: false, reason: 'malformed entry' };
    }
    if (!validIds.has(entry.patternId)) {
      return { ok: false, reason: `unknown patternId ${entry.patternId}` };
    }
    cleaned.push({
      patternId: entry.patternId,
      route: entry.route.startsWith('/') ? entry.route : `/${entry.route}`,
      title: entry.title,
    });
  }
  return { ok: true, entries: cleaned, rationale: input.rationale ?? '' };
}

export async function composeWithClaude(intent: IntentSpec): Promise<{
  plan: Plan;
  source: 'claude' | 'fallback';
  error?: string;
}> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    const { plan } = deterministicCompose(intent);
    return { plan, source: 'fallback', error: 'ANTHROPIC_API_KEY is not configured' };
  }

  const candidates = filterPatterns({ industry: intent.industry, tier: 'free' });
  const pool = candidates.length > 0 ? candidates : filterPatterns({ tier: 'free' });

  try {
    const anthropic = new Anthropic({ apiKey });
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: buildSystemPrompt(pool),
      messages: [{ role: 'user', content: buildUserMessage(intent) }],
      tools: [emitPlanTool],
      tool_choice: { type: 'tool', name: 'emit_plan' },
    });

    const toolUse = response.content.find(
      (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use',
    );

    if (!toolUse || toolUse.name !== 'emit_plan') {
      const { plan } = deterministicCompose(intent);
      return { plan, source: 'fallback', error: 'no tool use in response' };
    }

    const validation = validateClaudeOutput(toolUse.input as ClaudePlanInput, pool);
    if (!validation.ok) {
      const { plan } = deterministicCompose(intent);
      return { plan, source: 'fallback', error: validation.reason };
    }

    const usedIds = new Set(validation.entries.map((e) => e.patternId));
    const plan: Plan = {
      id: `plan-${Date.now()}`,
      intent,
      entries: validation.entries,
      unusedPatternIds: pool.map((p) => p.meta.id).filter((id) => !usedIds.has(id)),
      rationale: validation.rationale,
      createdAt: new Date().toISOString(),
    };

    return { plan, source: 'claude' };
  } catch (error) {
    const { plan } = deterministicCompose(intent);
    return {
      plan,
      source: 'fallback',
      error: error instanceof Error ? error.message : 'unknown error',
    };
  }
}

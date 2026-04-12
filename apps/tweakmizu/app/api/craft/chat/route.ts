import Anthropic from '@anthropic-ai/sdk';
import { CRAFT_TOOLS } from '@/lib/craft/agent-tools';
import { getPackForDomain } from '@/lib/craft/packs';
import { getCurrentUserId } from '@/lib/shared';

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a design system architect. Users describe the product they want to build, and you generate a complete design system for it by calling tools.

Your job:
1. Understand the product (domain, audience, feature set)
2. Pick the right design language knobs (hue, chroma, shape, density, type, motion)
3. Define the domain entities (Customer, Invoice, etc.) with realistic typed fields
4. Generate pages with proper compositions (headers, tables, forms, KPI rows, activity lists, wizards)
5. Set up the navigation structure

Rules:
- Always call tools to make changes. Never just describe what you would do.
- After making tool calls, explain *why* you chose those values in 1-2 sentences. This teaches the user about design language trade-offs.
- When the user says "add X page", infer what sections that page needs based on the domain. A finance "Invoices" page needs a table section with an Invoice entity, not just an empty page.
- When defining entities, use realistic field types: "currency" for money, "badge" for status enums, "date" for dates, "email" for emails.
- When setting language knobs, cite which real design systems use similar choices (e.g. "Stripe uses muted chroma for seriousness").
- You can call multiple tools in one response.
- Keep rationale concise — 1-2 sentences per major decision.

Available mizu component catalog (for reference when building pages):
Button, Input, Select, Textarea, Checkbox, Radio, Switch, Table, Card, Badge, Heading, Label, Spinner, Link, Fieldset, DefinitionList, Field, NumberInput, PasswordInput, Form, TimeInput, FileInput, DatePicker, DateRangePicker, Calendar, StepFlow, Pagination, Modal, Drawer, Tooltip, Tabs, DropdownMenu, Popover, Separator, Accordion, Progress, Skeleton, Toast, CommandMenu, Slider, ScrollArea, Alert, Breadcrumb, Avatar, Tag, EmptyState

Finance components: CurrencyInput, TaxRateInput, InvoiceLineItem, LedgerRow, ChartOfAccounts, ReconciliationRow, KpiCard, MetricTile, DeltaIndicator, TransactionRow, AccountSummary`;

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response('AI features are not configured.', { status: 503 });
  }

  await getCurrentUserId();

  const { messages, profile } = await request.json();

  const contextMessage = `Current profile state:\n\`\`\`json\n${JSON.stringify(
    {
      name: profile.name,
      archetype: profile.archetype,
      identity: profile.app?.identity,
      foundation: profile.foundation,
      shape: profile.shape,
      density: profile.density,
      type: profile.type,
      motion: profile.motion,
      entities: profile.app?.entities?.map((e: { id: string; name: string }) => e.name),
      pages: profile.app?.pages?.map((p: { id: string; title: string }) => p.title),
      nav: profile.app?.shell?.nav?.map((n: { pageId: string }) => n.pageId),
    },
    null,
    2,
  )}\n\`\`\``;

  const anthropicMessages = messages.map((m: { role: string; content: string }) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }));

  // Inject profile context before the latest user message
  if (anthropicMessages.length > 0) {
    const last = anthropicMessages[anthropicMessages.length - 1];
    if (last.role === 'user') {
      last.content = `${contextMessage}\n\nUser request: ${last.content}`;
    }
  }

  // Inject domain pack context if available — this is what makes the AI
  // generate Sage-level products instead of generic dashboards.
  const domain = profile.app?.identity?.domain;
  const pack = domain ? getPackForDomain(domain) : undefined;
  const systemPrompt = pack
    ? `${SYSTEM_PROMPT}\n\n--- DOMAIN PACK: ${pack.name} ---\n\n${pack.promptContext}`
    : SYSTEM_PROMPT;

  const stream = client.messages.stream({
    model: 'claude-sonnet-4-5-20250514',
    max_tokens: 4096,
    system: systemPrompt,
    tools: CRAFT_TOOLS,
    messages: anthropicMessages,
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (err) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'error', error: String(err) })}\n\n`),
        );
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

'use client';

import { useMemo, useState } from 'react';
import { Badge, Button, Inline, Split, Stack } from '@aspect/react';
import { Code2, Download, Eye, Sliders } from 'lucide-react';
import Link from 'next/link';
import { buildProjectZip, downloadBlob } from '@/lib/studio/exporter';
import { resolvePatternsForPlan } from '@/lib/studio/composer';
import { usePlansStore } from '@/store/plans-store';
import { cn } from '@/utils/cn';

type Tab = 'preview' | 'editor' | 'code' | 'export';

const TABS: Array<{ id: Tab; label: string; icon: typeof Eye }> = [
  { id: 'preview', label: 'Preview', icon: Eye },
  { id: 'editor', label: 'Editor', icon: Sliders },
  { id: 'code', label: 'Code', icon: Code2 },
  { id: 'export', label: 'Export', icon: Download },
];

export function ProjectView({ projectId }: { projectId: string }) {
  const plan = usePlansStore((state) => state.plans[projectId]);
  const [activeTab, setActiveTab] = useState<Tab>('preview');
  const [activeEntry, setActiveEntry] = useState<number>(0);

  const patterns = useMemo(() => (plan ? resolvePatternsForPlan(plan) : []), [plan]);

  if (!plan) {
    return <MissingPlan />;
  }

  const entry = plan.entries[activeEntry];
  const pattern = patterns[activeEntry];

  return (
    <Stack gap="1.5rem">
      <Stack as="header" gap="0.75rem">
        <Inline gap="0.5rem" align="center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            {plan.intent.productName}
          </h1>
          <Badge tone="neutral">{plan.intent.industry}</Badge>
          <Badge tone="info">{plan.intent.stack}</Badge>
          <Badge tone="neutral">{plan.intent.tone}</Badge>
        </Inline>
        <p className="text-sm text-muted-foreground">{plan.intent.description}</p>
        <p className="text-xs text-muted-foreground">{plan.rationale}</p>
      </Stack>

      <div role="tablist" aria-label="Project view tabs" className="border-b border-border">
        <Inline gap="0.25rem" align="center">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  '-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:border-border-strong hover:text-foreground',
                )}
              >
                <Inline gap="0.375rem" align="center">
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </Inline>
              </button>
            );
          })}
        </Inline>
      </div>

      {activeTab === 'preview' ? (
        <PreviewTab
          plan={plan}
          activeIndex={activeEntry}
          setActiveIndex={setActiveEntry}
          patterns={patterns}
          entry={entry}
          pattern={pattern}
        />
      ) : null}
      {activeTab === 'editor' ? <EditorTab /> : null}
      {activeTab === 'code' ? (
        <CodeTab
          plan={plan}
          activeIndex={activeEntry}
          setActiveIndex={setActiveEntry}
          patterns={patterns}
        />
      ) : null}
      {activeTab === 'export' ? <ExportTab plan={plan} /> : null}
    </Stack>
  );
}

function MissingPlan() {
  return (
    <Stack gap="1rem" className="rounded-lg border border-border bg-muted/30 p-8">
      <h2 className="text-lg font-semibold text-foreground">Project not found</h2>
      <p className="text-sm text-muted-foreground">
        Plans are stored locally in your browser. This project may have been generated on a
        different device, or cleared from storage.
      </p>
      <div>
        <Button asChild variant="primary" size="sm">
          <Link href="/studio/new">Generate a new project</Link>
        </Button>
      </div>
    </Stack>
  );
}

type StoredPlan = NonNullable<ReturnType<typeof usePlansStore.getState>['plans'][string]>;
type PlanEntry = StoredPlan['entries'][number];
type ResolvedPattern = ReturnType<typeof resolvePatternsForPlan>[number];

function PreviewTab({
  plan,
  activeIndex,
  setActiveIndex,
  patterns,
  entry,
  pattern,
}: {
  plan: StoredPlan;
  activeIndex: number;
  setActiveIndex: (n: number) => void;
  patterns: ResolvedPattern[];
  entry: PlanEntry | undefined;
  pattern: ResolvedPattern | undefined;
}) {
  const Preview = pattern?.Preview;
  return (
    <Split fraction="240px" gap="1.5rem">
      <Stack as="nav" gap="0.25rem" aria-label="Generated pages">
        {plan.entries.map((item, index) => {
          const active = index === activeIndex;
          const p = patterns[index];
          return (
            <button
              key={`${item.patternId}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-current={active ? 'true' : undefined}
              className={cn(
                'rounded-lg border px-3 py-2 text-left transition-colors',
                active
                  ? 'border-primary bg-primary/5'
                  : 'border-transparent hover:border-border hover:bg-muted/60',
              )}
            >
              <Stack gap="0.25rem" align="start">
                <span className="text-sm font-semibold text-foreground">{item.title}</span>
                <span className="text-xs text-muted-foreground">{item.route}</span>
                <span className="text-[11px] text-muted-foreground">
                  {p?.meta.name ?? item.patternId}
                </span>
              </Stack>
            </button>
          );
        })}
      </Stack>
      <section
        aria-label={`Preview of ${entry?.title ?? 'page'}`}
        className="rounded-lg border border-border bg-background p-6"
      >
        {Preview ? (
          <Preview />
        ) : (
          <div className="text-sm text-muted-foreground">
            Pattern {entry?.patternId} could not be resolved from the registry.
          </div>
        )}
      </section>
    </Split>
  );
}

function EditorTab() {
  return (
    <div className="rounded-lg border border-dashed border-border p-8">
      <p className="text-sm text-muted-foreground">
        Theme editor for the project lands in a follow-up commit. It will embed the mizu studio
        editor and scope tokens to this project.
      </p>
    </div>
  );
}

function CodeTab({
  plan,
  activeIndex,
  setActiveIndex,
  patterns,
}: {
  plan: StoredPlan;
  activeIndex: number;
  setActiveIndex: (n: number) => void;
  patterns: ResolvedPattern[];
}) {
  const pattern = patterns[activeIndex];
  const files =
    pattern?.renderReact({
      productName: plan.intent.productName,
      description: plan.intent.description,
    }) ?? [];

  return (
    <Split fraction="240px" gap="1.5rem">
      <Stack as="nav" gap="0.25rem" aria-label="Generated files">
        {plan.entries.map((item, index) => {
          const active = index === activeIndex;
          return (
            <button
              key={`${item.patternId}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-current={active ? 'true' : undefined}
              className={cn(
                'rounded-lg border px-3 py-2 text-left text-sm transition-colors',
                active
                  ? 'border-primary bg-primary/5 text-foreground'
                  : 'border-transparent text-muted-foreground hover:border-border hover:bg-muted/60',
              )}
            >
              {item.route}
            </button>
          );
        })}
      </Stack>
      <Stack gap="0.75rem">
        {files.map((file) => (
          <article key={file.path} className="overflow-hidden rounded-lg border border-border">
            <header className="border-b border-border bg-muted/40 px-3 py-2 text-xs">
              <Inline align="center" gap="0.5rem" style={{ justifyContent: 'space-between' }}>
                <code className="text-foreground">{file.path}</code>
                <span className="text-muted-foreground">
                  {file.contents.split('\n').length} lines
                </span>
              </Inline>
            </header>
            <pre className="max-h-[480px] overflow-auto bg-background p-4 text-xs leading-relaxed text-foreground">
              {file.contents}
            </pre>
          </article>
        ))}
      </Stack>
    </Split>
  );
}

function ExportTab({ plan }: { plan: StoredPlan }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setBusy(true);
    setError(null);
    try {
      const blob = await buildProjectZip(plan);
      downloadBlob(blob, `${plan.intent.productName.replace(/\s+/g, '-').toLowerCase()}.zip`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to build zip');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Stack gap="1rem">
      <Stack gap="0.75rem" className="rounded-lg border border-border bg-background p-6">
        <h2 className="text-lg font-semibold text-foreground">Download as a zip</h2>
        <p className="text-sm text-muted-foreground">
          The generated project is a standalone Next.js app. Unzip, run <code>pnpm install</code>,
          then <code>pnpm dev</code>.
        </p>
        <Inline gap="0.5rem" align="center">
          <Button onClick={handleDownload} variant="primary" loading={busy}>
            <Download className="mr-2 h-4 w-4" />
            Download zip
          </Button>
          {error ? <span className="text-sm text-danger">{error}</span> : null}
        </Inline>
      </Stack>
      <Stack gap="0.5rem" className="rounded-lg border border-dashed border-border p-6">
        <h3 className="text-sm font-semibold text-foreground">Coming next</h3>
        <p className="text-sm text-muted-foreground">
          GitHub push and share link are queued up. Copy-to-Cursor-rules and Claude Code skill
          generation are already baked into the substrate file inside the zip.
        </p>
      </Stack>
    </Stack>
  );
}

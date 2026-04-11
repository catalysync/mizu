'use client';

import { useMemo, useState } from 'react';
import { Badge, Button } from '@aspect/react';
import { Code2, Download, Eye, Sliders } from 'lucide-react';
import Link from 'next/link';
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
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            {plan.intent.productName}
          </h1>
          <Badge tone="neutral">{plan.intent.industry}</Badge>
          <Badge tone="info">{plan.intent.stack}</Badge>
          <Badge tone="neutral">{plan.intent.tone}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{plan.intent.description}</p>
        <p className="text-xs text-muted-foreground">{plan.rationale}</p>
      </header>

      <div
        role="tablist"
        aria-label="Project view tabs"
        className="flex flex-wrap items-center gap-1 border-b border-border"
      >
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
                '-mb-px flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:border-border-strong hover:text-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
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
      {activeTab === 'export' ? <ExportTab /> : null}
    </div>
  );
}

function MissingPlan() {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-muted/30 p-8">
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
    </div>
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
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <nav aria-label="Generated pages" className="flex flex-col gap-1">
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
                'flex flex-col gap-1 rounded-lg border px-3 py-2 text-left transition-colors',
                active
                  ? 'border-primary bg-primary/5'
                  : 'border-transparent hover:border-border hover:bg-muted/60',
              )}
            >
              <span className="text-sm font-semibold text-foreground">{item.title}</span>
              <span className="text-xs text-muted-foreground">{item.route}</span>
              <span className="text-[11px] text-muted-foreground">
                {p?.meta.name ?? item.patternId}
              </span>
            </button>
          );
        })}
      </nav>
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
    </div>
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
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <nav aria-label="Generated files" className="flex flex-col gap-1">
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
      </nav>
      <div className="flex flex-col gap-3">
        {files.map((file) => (
          <article key={file.path} className="overflow-hidden rounded-lg border border-border">
            <header className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2 text-xs">
              <code className="text-foreground">{file.path}</code>
              <span className="text-muted-foreground">
                {file.contents.split('\n').length} lines
              </span>
            </header>
            <pre className="max-h-[480px] overflow-auto bg-background p-4 text-xs leading-relaxed text-foreground">
              {file.contents}
            </pre>
          </article>
        ))}
      </div>
    </div>
  );
}

function ExportTab() {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-dashed border-border p-8">
      <p className="text-sm text-muted-foreground">
        Zip download, GitHub push, and share link land in the next commit. The generated code is
        already resolvable via the Code tab.
      </p>
    </div>
  );
}

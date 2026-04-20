'use client';

import { StudioEditorShell } from '@/components/studio/editor/editor-shell';
import { RefactorPanel } from '@/components/studio/refactor-panel';
import { RefineModal } from '@/components/studio/refine-modal';
import { resolvePatternsForPlan } from '@/lib/studio/composer';
import { buildProjectZip, downloadBlob } from '@/lib/studio/exporter';
import { usePlansStore } from '@/store/plans-store';
import { cn } from '@/utils/cn';
import { Badge, Button, Inline, Split, Stack } from '@aspect/react';
import { Code2, Download, Eye, Sliders, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

type Tab = 'preview' | 'editor' | 'code' | 'export';

const TABS: Array<{ id: Tab; label: string; icon: typeof Eye }> = [
  { id: 'preview', label: 'Preview', icon: Eye },
  { id: 'editor', label: 'Editor', icon: Sliders },
  { id: 'code', label: 'Code', icon: Code2 },
  { id: 'export', label: 'Export', icon: Download },
];

export function ProjectView({ projectId }: { projectId: string }) {
  const plan = usePlansStore((state) => state.plans[projectId]);
  const savePlan = usePlansStore((state) => state.savePlan);
  const deletePlan = usePlansStore((state) => state.deletePlan);
  const [activeTab, setActiveTab] = useState<Tab>('preview');
  const [activeEntry, setActiveEntry] = useState<number>(0);
  const [refineOpen, setRefineOpen] = useState(false);

  const patterns = useMemo(() => (plan ? resolvePatternsForPlan(plan) : []), [plan]);

  if (!plan) {
    return <MissingPlan />;
  }

  const entry = plan.entries[activeEntry];
  const pattern = patterns[activeEntry];

  const handleRefined = (next: typeof plan) => {
    savePlan(next);
    if (next.id !== plan.id) {
      deletePlan(plan.id);
      window.location.pathname = `/studio/${next.id}`;
    }
  };

  return (
    <Stack gap="1.5rem">
      <Stack as="header" gap="0.75rem">
        <Inline gap="0.5rem" align="center" style={{ justifyContent: 'space-between' }}>
          <Inline gap="0.5rem" align="center">
            <h1 className="text-foreground text-2xl font-bold tracking-tight md:text-3xl">
              {plan.intent.productName}
            </h1>
            <Badge tone="neutral">{plan.intent.industry}</Badge>
            <Badge tone="info">{plan.intent.stack}</Badge>
            <Badge tone="neutral">{plan.intent.tone}</Badge>
          </Inline>
          <Button variant="secondary" size="sm" onClick={() => setRefineOpen(true)}>
            <Sparkles className="mr-2 h-4 w-4" />
            Refine with AI
          </Button>
        </Inline>
        <p className="text-muted-foreground text-sm">{plan.intent.description}</p>
        <p className="text-muted-foreground text-xs">{plan.rationale}</p>
      </Stack>

      {refineOpen ? (
        <RefineModal plan={plan} onRefined={handleRefined} onClose={() => setRefineOpen(false)} />
      ) : null}

      <div role="tablist" aria-label="Project view tabs" className="border-border border-b">
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
                    : 'text-muted-foreground hover:border-border-strong hover:text-foreground border-transparent',
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
    <Stack gap="1rem" className="border-border bg-muted/30 rounded-lg border p-8">
      <h2 className="text-foreground text-lg font-semibold">Project not found</h2>
      <p className="text-muted-foreground text-sm">
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
    <Split fraction="240px 1fr" gap="1.5rem">
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
                  : 'hover:border-border hover:bg-muted/60 border-transparent',
              )}
            >
              <Stack gap="0.25rem" align="start">
                <span className="text-foreground text-sm font-semibold">{item.title}</span>
                <span className="text-muted-foreground text-xs">{item.route}</span>
                <span className="text-muted-foreground text-[11px]">
                  {p?.meta.name ?? item.patternId}
                </span>
              </Stack>
            </button>
          );
        })}
      </Stack>
      <section
        aria-label={`Preview of ${entry?.title ?? 'page'}`}
        className="border-border bg-background rounded-lg border p-6"
      >
        {Preview ? (
          <Preview />
        ) : (
          <div className="text-muted-foreground text-sm">
            Pattern {entry?.patternId} could not be resolved from the registry.
          </div>
        )}
      </section>
    </Split>
  );
}

function EditorTab() {
  return <StudioEditorShell />;
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
  const [refactorPath, setRefactorPath] = useState<string | null>(null);
  const pattern = patterns[activeIndex];
  const files =
    pattern?.renderReact({
      productName: plan.intent.productName,
      description: plan.intent.description,
    }) ?? [];

  const substrate = {
    industry: plan.intent.industry,
    stack: plan.intent.stack,
    patterns: plan.entries.map((e) => e.patternId),
    primitives: ['Stack', 'Inline', 'Cluster', 'Grid', 'Center', 'Split'],
    importPath: '@aspect/react',
  };

  return (
    <Split fraction="240px 1fr" gap="1.5rem">
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
                  : 'text-muted-foreground hover:border-border hover:bg-muted/60 border-transparent',
              )}
            >
              {item.route}
            </button>
          );
        })}
      </Stack>
      <Stack gap="0.75rem">
        {files.map((file) => (
          <article key={file.path} className="border-border overflow-hidden rounded-lg border">
            <header className="border-border bg-muted/40 border-b px-3 py-2 text-xs">
              <Inline align="center" gap="0.5rem" style={{ justifyContent: 'space-between' }}>
                <code className="text-foreground">{file.path}</code>
                <Inline gap="0.5rem" align="center">
                  <span className="text-muted-foreground">
                    {file.contents.split('\n').length} lines
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setRefactorPath(refactorPath === file.path ? null : file.path)}
                  >
                    <Sparkles className="mr-1 h-3 w-3" />
                    Refactor
                  </Button>
                </Inline>
              </Inline>
            </header>
            {refactorPath === file.path ? (
              <RefactorPanel
                path={file.path}
                contents={file.contents}
                substrate={substrate}
                onClose={() => setRefactorPath(null)}
              />
            ) : null}
            <pre className="bg-background text-foreground max-h-[480px] overflow-auto p-4 text-xs leading-relaxed">
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
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareBusy, setShareBusy] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

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

  const handleShare = async () => {
    setShareBusy(true);
    setShareError(null);
    try {
      const response = await fetch('/api/studio/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      if (!response.ok) {
        const text = await response.text();
        setShareError(`Share failed: ${text}`);
        return;
      }
      const data = (await response.json()) as { token: string; url: string };
      const absoluteUrl = `${window.location.origin}${data.url}`;
      setShareUrl(absoluteUrl);
      await navigator.clipboard.writeText(absoluteUrl);
    } catch (err) {
      setShareError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setShareBusy(false);
    }
  };

  return (
    <Stack gap="1rem">
      <Stack gap="0.75rem" className="border-border bg-background rounded-lg border p-6">
        <h2 className="text-foreground text-lg font-semibold">Download as a zip</h2>
        <p className="text-muted-foreground text-sm">
          The generated project is a standalone Next.js app. Unzip, run <code>pnpm install</code>,
          then <code>pnpm dev</code>. Includes <code>.cursor/rules</code> and{' '}
          <code>.claude/skills</code> so subsequent AI edits inherit the grammar.
        </p>
        <Inline gap="0.5rem" align="center">
          <Button onClick={handleDownload} variant="primary" loading={busy}>
            <Download className="mr-2 h-4 w-4" />
            Download zip
          </Button>
          {error ? <span className="text-danger text-sm">{error}</span> : null}
        </Inline>
      </Stack>

      <Stack gap="0.75rem" className="border-border bg-background rounded-lg border p-6">
        <h2 className="text-foreground text-lg font-semibold">Share link</h2>
        <p className="text-muted-foreground text-sm">
          Create a read-only preview URL for this project. Sign-in required — the share is tied to
          your account.
        </p>
        <Inline gap="0.5rem" align="center">
          <Button onClick={handleShare} variant="secondary" loading={shareBusy}>
            Create share link
          </Button>
          {shareError ? <span className="text-danger text-sm">{shareError}</span> : null}
        </Inline>
        {shareUrl ? (
          <Inline gap="0.5rem" align="center">
            <code className="bg-muted text-foreground rounded px-2 py-1 text-xs">{shareUrl}</code>
            <span className="text-muted-foreground text-xs">(copied to clipboard)</span>
          </Inline>
        ) : null}
      </Stack>
    </Stack>
  );
}

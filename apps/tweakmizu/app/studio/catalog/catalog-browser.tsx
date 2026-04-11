'use client';

import { useMemo, useState } from 'react';
import { Badge } from '@aspect/react';
import { getAllPatterns } from '@/lib/patterns/registry';
import type { PatternModule } from '@/lib/patterns/types';
import type { Industry } from '@/types/studio';
import { cn } from '@/utils/cn';

type IndustryFilter = Industry | 'all';

const INDUSTRY_LABELS: Record<IndustryFilter, string> = {
  all: 'All',
  cloud: 'Cloud',
  'saas-admin': 'SaaS Admin',
  ecommerce: 'E-commerce',
  fintech: 'Fintech',
  editorial: 'Editorial',
  'ai-product': 'AI',
  devtools: 'Dev tools',
  other: 'Other',
};

export function CatalogBrowser() {
  const allPatterns = useMemo(() => getAllPatterns(), []);
  const [filter, setFilter] = useState<IndustryFilter>('all');
  const [selectedId, setSelectedId] = useState<string>(allPatterns[0]?.meta.id ?? '');

  const visible = useMemo(() => {
    if (filter === 'all') return allPatterns;
    return allPatterns.filter((p) => p.meta.industries.includes(filter));
  }, [allPatterns, filter]);

  const selected = allPatterns.find((p) => p.meta.id === selectedId) ?? visible[0];

  const activeFilters: IndustryFilter[] = ['all', 'cloud', 'saas-admin', 'ecommerce'];

  return (
    <div className="flex flex-col gap-6">
      <div role="tablist" aria-label="Filter patterns by industry" className="flex flex-wrap gap-2">
        {activeFilters.map((id) => {
          const active = id === filter;
          return (
            <button
              key={id}
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(id)}
              type="button"
              className={cn(
                'rounded-full border px-3 py-1 text-sm transition-colors',
                active
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-foreground hover:border-border-strong',
              )}
            >
              {INDUSTRY_LABELS[id]}
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <nav aria-label="Pattern list" className="flex flex-col gap-1">
          {visible.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No patterns match the current filter yet.
            </p>
          ) : null}
          {visible.map((pattern) => (
            <PatternListItem
              key={pattern.meta.id}
              pattern={pattern}
              active={pattern.meta.id === selected?.meta.id}
              onSelect={() => setSelectedId(pattern.meta.id)}
            />
          ))}
        </nav>

        {selected ? <PatternDetail key={selected.meta.id} pattern={selected} /> : null}
      </div>
    </div>
  );
}

function PatternListItem({
  pattern,
  active,
  onSelect,
}: {
  pattern: PatternModule;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={active ? 'true' : undefined}
      className={cn(
        'flex flex-col gap-1 rounded-lg border px-3 py-2.5 text-left transition-colors',
        active
          ? 'border-primary bg-primary/5'
          : 'border-transparent hover:border-border hover:bg-muted/60',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-foreground">{pattern.meta.name}</span>
        <Badge tone={pattern.meta.tier === 'free' ? 'neutral' : 'info'}>{pattern.meta.tier}</Badge>
      </div>
      <span className="text-xs text-muted-foreground">{pattern.meta.id}</span>
    </button>
  );
}

function PatternDetail({ pattern }: { pattern: PatternModule }) {
  const { meta, Preview } = pattern;
  return (
    <article className="flex flex-col gap-5">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-semibold text-foreground">{meta.name}</h2>
          <Badge tone="neutral">{meta.kind}</Badge>
          {meta.industries.map((i) => (
            <Badge key={i} tone="info">
              {i}
            </Badge>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">{meta.description}</p>
      </header>

      <section
        aria-label={`Live preview of ${meta.name}`}
        className="rounded-lg border border-border bg-background p-6"
      >
        <Preview />
      </section>

      <section aria-label="Pattern sources" className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Sources
        </h3>
        <ul className="flex flex-col gap-1 text-sm text-foreground">
          {meta.sources.map((source, index) => (
            <li key={`${source.system}-${index}`} className="flex flex-wrap gap-2">
              <strong>{source.system}</strong>
              <span className="text-muted-foreground">({source.relationship})</span>
              {source.notes ? (
                <span className="text-muted-foreground">— {source.notes}</span>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Component dependencies" className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Depends on
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {meta.depends.map((dep) => (
            <code key={dep} className="rounded bg-muted px-2 py-0.5 text-xs text-foreground">
              {dep}
            </code>
          ))}
        </div>
      </section>
    </article>
  );
}

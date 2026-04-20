'use client';

import { getAllPatterns } from '@/lib/patterns/registry';
import type { PatternModule } from '@/lib/patterns/types';
import type { Industry } from '@/types/studio';
import { cn } from '@/utils/cn';
import { Badge, Cluster, Inline, Split, Stack } from '@aspect/react';
import { useMemo, useState } from 'react';

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
    <Stack gap="1.5rem">
      <Cluster gap="0.5rem" role="tablist" aria-label="Filter patterns by industry">
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
      </Cluster>

      <Split fraction="280px 1fr" gap="1.5rem">
        <Stack as="nav" gap="0.25rem" aria-label="Pattern list">
          {visible.length === 0 ? (
            <p className="text-muted-foreground text-sm">
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
        </Stack>

        {selected ? <PatternDetail key={selected.meta.id} pattern={selected} /> : null}
      </Split>
    </Stack>
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
        'rounded-lg border px-3 py-2.5 text-left transition-colors',
        active
          ? 'border-primary bg-primary/5'
          : 'hover:border-border hover:bg-muted/60 border-transparent',
      )}
    >
      <Stack gap="0.25rem" align="start">
        <Inline
          gap="0.5rem"
          align="center"
          style={{ justifyContent: 'space-between', width: '100%' }}
        >
          <span className="text-foreground text-sm font-semibold">{pattern.meta.name}</span>
          <Badge tone={pattern.meta.tier === 'free' ? 'neutral' : 'info'}>
            {pattern.meta.tier}
          </Badge>
        </Inline>
        <span className="text-muted-foreground text-xs">{pattern.meta.id}</span>
      </Stack>
    </button>
  );
}

function PatternDetail({ pattern }: { pattern: PatternModule }) {
  const { meta, Preview } = pattern;
  return (
    <Stack as="article" gap="1.25rem">
      <Stack as="header" gap="0.5rem">
        <Inline gap="0.5rem" align="center">
          <h2 className="text-foreground text-xl font-semibold">{meta.name}</h2>
          <Badge tone="neutral">{meta.kind}</Badge>
          {meta.industries.map((i) => (
            <Badge key={i} tone="info">
              {i}
            </Badge>
          ))}
        </Inline>
        <p className="text-muted-foreground text-sm">{meta.description}</p>
      </Stack>

      <section
        aria-label={`Live preview of ${meta.name}`}
        className="border-border bg-background rounded-lg border p-6"
      >
        <Preview />
      </section>

      <Stack as="section" gap="0.5rem" aria-label="Pattern sources">
        <h3 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          Sources
        </h3>
        <Stack as="ul" gap="0.25rem" className="text-foreground text-sm">
          {meta.sources.map((source, index) => (
            <li key={`${source.system}-${index}`}>
              <Inline gap="0.5rem">
                <strong>{source.system}</strong>
                <span className="text-muted-foreground">({source.relationship})</span>
                {source.notes ? (
                  <span className="text-muted-foreground">— {source.notes}</span>
                ) : null}
              </Inline>
            </li>
          ))}
        </Stack>
      </Stack>

      <Stack as="section" gap="0.5rem" aria-label="Component dependencies">
        <h3 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          Depends on
        </h3>
        <Cluster gap="0.375rem">
          {meta.depends.map((dep) => (
            <code key={dep} className="bg-muted text-foreground rounded px-2 py-0.5 text-xs">
              {dep}
            </code>
          ))}
        </Cluster>
      </Stack>
    </Stack>
  );
}

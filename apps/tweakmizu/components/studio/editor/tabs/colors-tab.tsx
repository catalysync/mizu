'use client';

import type { ThemeStyleProps } from '@/types/theme';
import { Stack } from '@aspect/react';

interface Props {
  styles: ThemeStyleProps;
  onChange: (updates: Partial<ThemeStyleProps>) => void;
}

const GROUPS: Array<{
  label: string;
  tokens: Array<{ key: keyof ThemeStyleProps; label: string }>;
}> = [
  {
    label: 'Action',
    tokens: [
      { key: 'action-primary-default', label: 'Primary' },
      { key: 'action-primary-hover', label: 'Primary hover' },
      { key: 'action-destructive-default', label: 'Destructive' },
    ],
  },
  {
    label: 'Feedback',
    tokens: [
      { key: 'feedback-success-default', label: 'Success' },
      { key: 'feedback-warning-default', label: 'Warning' },
      { key: 'feedback-danger-default', label: 'Danger' },
    ],
  },
  {
    label: 'Surface',
    tokens: [
      { key: 'surface-default', label: 'Default' },
      { key: 'surface-secondary', label: 'Secondary' },
      { key: 'surface-inverse', label: 'Inverse' },
    ],
  },
  {
    label: 'Text',
    tokens: [
      { key: 'text-primary', label: 'Primary' },
      { key: 'text-secondary', label: 'Secondary' },
      { key: 'text-inverse', label: 'Inverse' },
    ],
  },
  {
    label: 'Border',
    tokens: [
      { key: 'border-default', label: 'Default' },
      { key: 'border-strong', label: 'Strong' },
    ],
  },
];

export function ColorsTab({ styles, onChange }: Props) {
  return (
    <Stack gap="1.25rem">
      {GROUPS.map((group) => (
        <Stack key={group.label} gap="0.5rem">
          <h3 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            {group.label}
          </h3>
          <Stack gap="0.5rem">
            {group.tokens.map((token) => (
              <ColorRow
                key={token.key}
                label={token.label}
                value={styles[token.key] ?? ''}
                onChange={(next) => onChange({ [token.key]: next } as Partial<ThemeStyleProps>)}
              />
            ))}
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}

function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <label className="flex items-center gap-3">
      <input
        type="color"
        value={normalizeHex(value)}
        onChange={(event) => onChange(event.target.value)}
        className="border-border h-8 w-10 cursor-pointer rounded border bg-transparent"
      />
      <span className="text-foreground min-w-[7rem] text-sm">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="border-border bg-background text-foreground focus:border-primary flex-1 rounded-md border px-2 py-1 font-mono text-xs focus:outline-none"
        spellCheck={false}
      />
    </label>
  );
}

function normalizeHex(value: string): string {
  if (!value) return '#000000';
  if (value.startsWith('#') && (value.length === 7 || value.length === 4)) return value;
  return '#000000';
}

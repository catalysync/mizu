'use client';

import type { ThemeStyleProps } from '@/types/theme';
import { Stack } from '@aspect/react';

interface Props {
  styles: ThemeStyleProps;
  onChange: (updates: Partial<ThemeStyleProps>) => void;
}

const SANS_FAMILIES = [
  "'Inter', system-ui, sans-serif",
  "'DM Sans', system-ui, sans-serif",
  "'IBM Plex Sans', system-ui, sans-serif",
  "'Space Grotesk', system-ui, sans-serif",
  "'Geist', system-ui, sans-serif",
  'system-ui, -apple-system, sans-serif',
];

const MONO_FAMILIES = [
  "'JetBrains Mono', monospace",
  "'Fira Code', monospace",
  "'IBM Plex Mono', monospace",
  "'Geist Mono', monospace",
  'ui-monospace, SFMono-Regular, monospace',
];

export function TypographyTab({ styles, onChange }: Props) {
  return (
    <Stack gap="1.25rem">
      <Stack gap="0.5rem">
        <h3 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          Sans family
        </h3>
        <FamilyPicker
          value={styles['font-family-sans'] ?? ''}
          options={SANS_FAMILIES}
          onChange={(next) => onChange({ 'font-family-sans': next })}
        />
      </Stack>
      <Stack gap="0.5rem">
        <h3 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          Mono family
        </h3>
        <FamilyPicker
          value={styles['font-family-mono'] ?? ''}
          options={MONO_FAMILIES}
          onChange={(next) => onChange({ 'font-family-mono': next })}
        />
      </Stack>
    </Stack>
  );
}

function FamilyPicker({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (next: string) => void;
}) {
  return (
    <Stack gap="0.375rem">
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={active}
            className={
              'rounded-md border px-3 py-2 text-left text-sm transition-colors ' +
              (active
                ? 'border-primary bg-primary/5 text-foreground'
                : 'border-border bg-background text-foreground hover:border-border-strong')
            }
            style={{ fontFamily: option }}
          >
            {option.split("'")[1] ?? option}
          </button>
        );
      })}
    </Stack>
  );
}

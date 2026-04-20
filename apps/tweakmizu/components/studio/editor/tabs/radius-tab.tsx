'use client';

import type { ThemeStyleProps } from '@/types/theme';
import { Stack } from '@aspect/react';

interface Props {
  styles: ThemeStyleProps;
  onChange: (updates: Partial<ThemeStyleProps>) => void;
}

const STEPS: Array<{
  key: keyof ThemeStyleProps;
  label: string;
  min: number;
  max: number;
}> = [
  { key: 'radius-sm', label: 'sm', min: 0, max: 16 },
  { key: 'radius-md', label: 'md', min: 0, max: 24 },
  { key: 'radius-lg', label: 'lg', min: 0, max: 32 },
  { key: 'radius-xl', label: 'xl', min: 0, max: 48 },
];

function remToPx(value: string): number {
  if (value.endsWith('rem')) return parseFloat(value) * 16;
  if (value.endsWith('px')) return parseFloat(value);
  return 0;
}

function pxToRem(px: number): string {
  return `${(px / 16).toFixed(3).replace(/\.?0+$/, '')}rem`;
}

export function RadiusTab({ styles, onChange }: Props) {
  return (
    <Stack gap="1rem">
      <p className="text-muted-foreground text-xs">
        Radius tokens applied to cards, buttons, inputs, and dialogs.
      </p>
      {STEPS.map((step) => {
        const value = styles[step.key] ?? '';
        const px = remToPx(value);
        return (
          <Stack key={step.key} gap="0.375rem">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground font-medium">{step.label}</span>
              <span className="text-muted-foreground font-mono text-xs">{value}</span>
            </div>
            <input
              type="range"
              min={step.min}
              max={step.max}
              step={1}
              value={px}
              onChange={(event) =>
                onChange({
                  [step.key]: pxToRem(parseInt(event.target.value, 10)),
                } as Partial<ThemeStyleProps>)
              }
              className="accent-primary w-full"
              aria-label={`radius ${step.label}`}
            />
            <div
              aria-hidden="true"
              style={{
                height: '2.5rem',
                width: '2.5rem',
                background: 'var(--mizu-action-primary-default)',
                borderRadius: value,
              }}
            />
          </Stack>
        );
      })}
    </Stack>
  );
}

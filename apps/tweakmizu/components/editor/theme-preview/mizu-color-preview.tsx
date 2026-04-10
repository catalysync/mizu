'use client';

import type { ThemeStyleProps } from '@/types/theme';

interface MizuColorPreviewProps {
  styles: ThemeStyleProps;
}

const COLOR_GROUPS: {
  title: string;
  items: { key: keyof ThemeStyleProps; label: string }[];
}[] = [
  {
    title: 'Action — Primary',
    items: [
      { key: 'action-primary-default', label: 'Default' },
      { key: 'action-primary-hover', label: 'Hover' },
      { key: 'action-primary-active', label: 'Active' },
      { key: 'action-primary-disabled', label: 'Disabled' },
    ],
  },
  {
    title: 'Action — Destructive',
    items: [
      { key: 'action-destructive-default', label: 'Default' },
      { key: 'action-destructive-hover', label: 'Hover' },
      { key: 'action-destructive-active', label: 'Active' },
      { key: 'action-destructive-disabled', label: 'Disabled' },
    ],
  },
  {
    title: 'Feedback',
    items: [
      { key: 'feedback-success-default', label: 'Success' },
      { key: 'feedback-success-subtle', label: 'Success Subtle' },
      { key: 'feedback-warning-default', label: 'Warning' },
      { key: 'feedback-warning-subtle', label: 'Warning Subtle' },
      { key: 'feedback-danger-default', label: 'Danger' },
      { key: 'feedback-danger-subtle', label: 'Danger Subtle' },
    ],
  },
  {
    title: 'Surfaces',
    items: [
      { key: 'surface-default', label: 'Default' },
      { key: 'surface-secondary', label: 'Secondary' },
      { key: 'surface-inverse', label: 'Inverse' },
    ],
  },
  {
    title: 'Text',
    items: [
      { key: 'text-primary', label: 'Primary' },
      { key: 'text-secondary', label: 'Secondary' },
      { key: 'text-inverse', label: 'Inverse' },
      { key: 'text-disabled', label: 'Disabled' },
    ],
  },
  {
    title: 'Border',
    items: [
      { key: 'border-default', label: 'Default' },
      { key: 'border-strong', label: 'Strong' },
    ],
  },
];

export default function MizuColorPreview({ styles }: MizuColorPreviewProps) {
  return (
    <div className="space-y-6">
      {COLOR_GROUPS.map((group) => (
        <div key={group.title}>
          <h3 className="text-foreground mb-2 text-sm font-medium">{group.title}</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {group.items.map(({ key, label }) => {
              const value = styles[key] ?? '';
              return (
                <div key={key} className="space-y-1">
                  <div
                    className="border-border h-12 rounded-md border"
                    style={{ backgroundColor: value }}
                  />
                  <div className="text-muted-foreground text-[10px]">
                    <div className="font-medium">{label}</div>
                    <div className="font-mono">{value}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

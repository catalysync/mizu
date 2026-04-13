'use client';

import React from 'react';
import { ScrollArea, Slider, Tabs, TabsContent, TabsList, TabsTrigger } from '@aspect/react';
import ControlSection from '@/components/editor/control-section';
import ThemePresetSelect from '@/components/editor/theme-preset-select';
import type { ThemeStyleProps } from '@/types/theme';
import { useQueryState } from 'nuqs';
import { ColorPicker } from './color-picker';

type ControlTab = 'colors' | 'typography' | 'other';

interface ThemeControlPanelProps {
  styles: ThemeStyleProps;
  onChange: (updates: Partial<ThemeStyleProps>) => void;
}

const parseRem = (v: string | undefined) => (v ? parseFloat(v.replace('rem', '')) : 0);
const parseMs = (v: string | undefined) => (v ? parseInt(v.replace('ms', ''), 10) : 0);

const ThemeControlPanel = ({ styles, onChange }: ThemeControlPanelProps) => {
  const [tab, setTab] = useQueryState<ControlTab>('tab', {
    defaultValue: 'colors',
    parse: (v) => (['colors', 'typography', 'other'].includes(v) ? (v as ControlTab) : 'colors'),
  });

  const update = React.useCallback(
    <K extends keyof ThemeStyleProps>(key: K, value: ThemeStyleProps[K]) => {
      onChange({ [key]: value } as Partial<ThemeStyleProps>);
    },
    [onChange],
  );

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border">
        <ThemePresetSelect />
      </div>
      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as ControlTab)}
        className="flex min-h-0 flex-1 flex-col"
      >
        <TabsList className="px-4 py-2">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="min-h-0 flex-1">
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-2 px-4 pb-4">
              <ControlSection title="Action — Primary" expanded>
                <ColorPicker
                  color={styles['action-primary-default']}
                  onChange={(c) => update('action-primary-default', c)}
                  label="Default"
                />
                <ColorPicker
                  color={styles['action-primary-hover']}
                  onChange={(c) => update('action-primary-hover', c)}
                  label="Hover"
                />
                <ColorPicker
                  color={styles['action-primary-active']}
                  onChange={(c) => update('action-primary-active', c)}
                  label="Active"
                />
                <ColorPicker
                  color={styles['action-primary-disabled']}
                  onChange={(c) => update('action-primary-disabled', c)}
                  label="Disabled"
                />
              </ControlSection>

              <ControlSection title="Action — Destructive">
                <ColorPicker
                  color={styles['action-destructive-default']}
                  onChange={(c) => update('action-destructive-default', c)}
                  label="Default"
                />
                <ColorPicker
                  color={styles['action-destructive-hover']}
                  onChange={(c) => update('action-destructive-hover', c)}
                  label="Hover"
                />
                <ColorPicker
                  color={styles['action-destructive-active']}
                  onChange={(c) => update('action-destructive-active', c)}
                  label="Active"
                />
              </ControlSection>

              <ControlSection title="Feedback">
                <ColorPicker
                  color={styles['feedback-success-default']}
                  onChange={(c) => update('feedback-success-default', c)}
                  label="Success"
                />
                <ColorPicker
                  color={styles['feedback-success-subtle']}
                  onChange={(c) => update('feedback-success-subtle', c)}
                  label="Success Subtle"
                />
                <ColorPicker
                  color={styles['feedback-warning-default']}
                  onChange={(c) => update('feedback-warning-default', c)}
                  label="Warning"
                />
                <ColorPicker
                  color={styles['feedback-warning-subtle']}
                  onChange={(c) => update('feedback-warning-subtle', c)}
                  label="Warning Subtle"
                />
                <ColorPicker
                  color={styles['feedback-danger-default']}
                  onChange={(c) => update('feedback-danger-default', c)}
                  label="Danger"
                />
                <ColorPicker
                  color={styles['feedback-danger-subtle']}
                  onChange={(c) => update('feedback-danger-subtle', c)}
                  label="Danger Subtle"
                />
              </ControlSection>

              <ControlSection title="Surfaces">
                <ColorPicker
                  color={styles['surface-default']}
                  onChange={(c) => update('surface-default', c)}
                  label="Default"
                />
                <ColorPicker
                  color={styles['surface-secondary']}
                  onChange={(c) => update('surface-secondary', c)}
                  label="Secondary"
                />
                <ColorPicker
                  color={styles['surface-inverse']}
                  onChange={(c) => update('surface-inverse', c)}
                  label="Inverse"
                />
              </ControlSection>

              <ControlSection title="Text">
                <ColorPicker
                  color={styles['text-primary']}
                  onChange={(c) => update('text-primary', c)}
                  label="Primary"
                />
                <ColorPicker
                  color={styles['text-secondary']}
                  onChange={(c) => update('text-secondary', c)}
                  label="Secondary"
                />
                <ColorPicker
                  color={styles['text-inverse']}
                  onChange={(c) => update('text-inverse', c)}
                  label="Inverse"
                />
                <ColorPicker
                  color={styles['text-disabled']}
                  onChange={(c) => update('text-disabled', c)}
                  label="Disabled"
                />
              </ControlSection>

              <ControlSection title="Borders">
                <ColorPicker
                  color={styles['border-default']}
                  onChange={(c) => update('border-default', c)}
                  label="Default"
                />
                <ColorPicker
                  color={styles['border-strong']}
                  onChange={(c) => update('border-strong', c)}
                  label="Strong"
                />
              </ControlSection>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="typography" className="min-h-0 flex-1">
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-2 px-4 pb-4">
              <ControlSection title="Font Family" expanded>
                <div className="flex flex-col gap-2">
                  <label className="block text-sm text-muted-foreground">
                    Sans
                    <input
                      type="text"
                      className="mizu-input mt-1 w-full"
                      value={styles['font-family-sans'] ?? ''}
                      onChange={(e) => update('font-family-sans', e.target.value)}
                    />
                  </label>
                  <label className="block text-sm text-muted-foreground">
                    Mono
                    <input
                      type="text"
                      className="mizu-input mt-1 w-full"
                      value={styles['font-family-mono'] ?? ''}
                      onChange={(e) => update('font-family-mono', e.target.value)}
                    />
                  </label>
                </div>
              </ControlSection>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="other" className="min-h-0 flex-1">
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-4 px-4 pb-4">
              <ControlSection title="Radius" expanded>
                <div className="flex flex-col gap-3">
                  {(['radius-sm', 'radius-md', 'radius-lg', 'radius-xl'] as const).map((key) => (
                    <div key={key}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="text-foreground">
                          {key.replace('radius-', '').toUpperCase()}
                        </span>
                        <span className="text-muted-foreground">{styles[key]}</span>
                      </div>
                      <Slider
                        aria-label={key}
                        value={[parseRem(styles[key])]}
                        min={0}
                        max={2}
                        step={0.025}
                        onValueChange={([v]) => update(key, `${v}rem`)}
                      />
                    </div>
                  ))}
                </div>
              </ControlSection>

              <ControlSection title="Motion">
                <div className="flex flex-col gap-3">
                  {(['duration-fast', 'duration-normal'] as const).map((key) => (
                    <div key={key}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="text-foreground">{key.replace('duration-', '')}</span>
                        <span className="text-muted-foreground">{styles[key]}</span>
                      </div>
                      <Slider
                        aria-label={key}
                        value={[parseMs(styles[key])]}
                        min={0}
                        max={key === 'duration-fast' ? 500 : 1000}
                        step={10}
                        onValueChange={([v]) => update(key, `${v}ms`)}
                      />
                    </div>
                  ))}
                </div>
              </ControlSection>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ThemeControlPanel;

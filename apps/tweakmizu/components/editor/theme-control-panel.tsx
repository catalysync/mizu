'use client';

import React from 'react';
import { ScrollArea, Slider, Stack, Tabs, TabsContent, TabsList, TabsTrigger } from '@aspect/react';
import ControlSection from '@/components/editor/control-section';
import ThemePresetSelect from '@/components/editor/theme-preset-select';
import { useControlsTabFromUrl, type ControlTab } from '@/hooks/use-controls-tab-from-url';
import type { ThemeStyleProps } from '@/types/theme';
import { ColorPicker } from './color-picker';

interface ThemeControlPanelProps {
  styles: ThemeStyleProps;
  onChange: (updates: Partial<ThemeStyleProps>) => void;
}

const parseRem = (v: string | undefined) => (v ? parseFloat(v.replace('rem', '')) : 0);
const parseMs = (v: string | undefined) => (v ? parseInt(v.replace('ms', ''), 10) : 0);

const ThemeControlPanel = ({ styles, onChange }: ThemeControlPanelProps) => {
  const { tab, handleSetTab } = useControlsTabFromUrl();

  const update = React.useCallback(
    <K extends keyof ThemeStyleProps>(key: K, value: ThemeStyleProps[K]) => {
      onChange({ [key]: value } as Partial<ThemeStyleProps>);
    },
    [onChange],
  );

  return (
    <Stack gap="0" style={{ height: '100%' }}>
      <div style={{ borderBottom: '1px solid var(--mizu-border-default)' }}>
        <ThemePresetSelect />
      </div>
      <Tabs
        value={tab}
        onValueChange={(v) => handleSetTab(v as ControlTab)}
        style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}
      >
        <TabsList style={{ padding: '0.5rem 1rem' }}>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>

        <TabsContent value="colors" style={{ flex: 1, minHeight: 0 }}>
          <ScrollArea style={{ height: '100%' }}>
            <Stack gap="0.5rem" style={{ padding: '0 1rem 1rem' }}>
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
            </Stack>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="typography" style={{ flex: 1, minHeight: 0 }}>
          <ScrollArea style={{ height: '100%' }}>
            <Stack gap="0.5rem" style={{ padding: '0 1rem 1rem' }}>
              <ControlSection title="Font Family" expanded>
                <Stack gap="0.5rem">
                  <label className="mizu-body--sm" style={{ display: 'block' }}>
                    Sans
                    <input
                      type="text"
                      className="mizu-input"
                      value={styles['font-family-sans'] ?? ''}
                      onChange={(e) => update('font-family-sans', e.target.value)}
                      style={{ width: '100%', marginTop: '0.25rem' }}
                    />
                  </label>
                  <label className="mizu-body--sm" style={{ display: 'block' }}>
                    Mono
                    <input
                      type="text"
                      className="mizu-input"
                      value={styles['font-family-mono'] ?? ''}
                      onChange={(e) => update('font-family-mono', e.target.value)}
                      style={{ width: '100%', marginTop: '0.25rem' }}
                    />
                  </label>
                </Stack>
              </ControlSection>
            </Stack>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="other" style={{ flex: 1, minHeight: 0 }}>
          <ScrollArea style={{ height: '100%' }}>
            <Stack gap="1rem" style={{ padding: '0 1rem 1rem' }}>
              <ControlSection title="Radius" expanded>
                <Stack gap="0.75rem">
                  {(['radius-sm', 'radius-md', 'radius-lg', 'radius-xl'] as const).map((key) => (
                    <div key={key}>
                      <div
                        className="mizu-body--sm"
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '0.25rem',
                        }}
                      >
                        <span>{key.replace('radius-', '').toUpperCase()}</span>
                        <span style={{ color: 'var(--mizu-text-secondary)' }}>{styles[key]}</span>
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
                </Stack>
              </ControlSection>

              <ControlSection title="Motion">
                <Stack gap="0.75rem">
                  {(['duration-fast', 'duration-normal'] as const).map((key) => (
                    <div key={key}>
                      <div
                        className="mizu-body--sm"
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '0.25rem',
                        }}
                      >
                        <span>{key.replace('duration-', '')}</span>
                        <span style={{ color: 'var(--mizu-text-secondary)' }}>{styles[key]}</span>
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
                </Stack>
              </ControlSection>
            </Stack>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Stack>
  );
};

export default ThemeControlPanel;

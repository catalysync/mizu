'use client';

import React from 'react';

import ControlSection from '@/components/editor/control-section';
import { FontPicker } from '@/components/editor/font-picker';
import { SliderWithInput } from '@/components/editor/slider-with-input';
import ThemePresetSelect from '@/components/editor/theme-preset-select';
import TabsTriggerPill from '@/components/editor/theme-preview/tabs-trigger-pill';
import { HorizontalScrollArea } from '@/components/horizontal-scroll-area';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import { useControlsTabFromUrl, type ControlTab } from '@/hooks/use-controls-tab-from-url';
import { ThemeStyleProps } from '@/types/theme';
import { type FontInfo } from '@/types/fonts';
import { buildFontFamily } from '@/utils/fonts';
import { ColorPicker } from './color-picker';

interface ThemeControlPanelProps {
  styles: ThemeStyleProps;
  onChange: (updates: Partial<ThemeStyleProps>) => void;
}

const ThemeControlPanel = ({ styles, onChange }: ThemeControlPanelProps) => {
  const { tab, handleSetTab } = useControlsTabFromUrl();

  const updateStyle = React.useCallback(
    <K extends keyof ThemeStyleProps>(key: K, value: ThemeStyleProps[K]) => {
      onChange({ [key]: value } as Partial<ThemeStyleProps>);
    },
    [onChange],
  );

  return (
    <>
      <div className="border-b">
        <ThemePresetSelect className="h-14 rounded-none" />
      </div>
      <div className="flex min-h-0 flex-1 flex-col space-y-4">
        <Tabs
          value={tab}
          onValueChange={(v) => handleSetTab(v as ControlTab)}
          className="flex min-h-0 w-full flex-1 flex-col"
        >
          <HorizontalScrollArea className="mt-2 mb-1 px-4">
            <TabsList className="bg-background text-muted-foreground inline-flex w-fit items-center justify-center rounded-full px-0">
              <TabsTriggerPill value="colors">Colors</TabsTriggerPill>
              <TabsTriggerPill value="typography">Typography</TabsTriggerPill>
              <TabsTriggerPill value="other">Other</TabsTriggerPill>
            </TabsList>
          </HorizontalScrollArea>

          <TabsContent value="colors" className="mt-1 size-full overflow-hidden">
            <ScrollArea className="h-full px-4">
              <ControlSection title="Action — Primary" expanded>
                <ColorPicker
                  color={styles['action-primary-default']}
                  onChange={(c) => updateStyle('action-primary-default', c)}
                  label="Default"
                />
                <ColorPicker
                  color={styles['action-primary-hover']}
                  onChange={(c) => updateStyle('action-primary-hover', c)}
                  label="Hover"
                />
                <ColorPicker
                  color={styles['action-primary-active']}
                  onChange={(c) => updateStyle('action-primary-active', c)}
                  label="Active"
                />
                <ColorPicker
                  color={styles['action-primary-disabled']}
                  onChange={(c) => updateStyle('action-primary-disabled', c)}
                  label="Disabled"
                />
              </ControlSection>

              <ControlSection title="Action — Destructive">
                <ColorPicker
                  color={styles['action-destructive-default']}
                  onChange={(c) => updateStyle('action-destructive-default', c)}
                  label="Default"
                />
                <ColorPicker
                  color={styles['action-destructive-hover']}
                  onChange={(c) => updateStyle('action-destructive-hover', c)}
                  label="Hover"
                />
                <ColorPicker
                  color={styles['action-destructive-active']}
                  onChange={(c) => updateStyle('action-destructive-active', c)}
                  label="Active"
                />
              </ControlSection>

              <ControlSection title="Feedback">
                <ColorPicker
                  color={styles['feedback-success-default']}
                  onChange={(c) => updateStyle('feedback-success-default', c)}
                  label="Success"
                />
                <ColorPicker
                  color={styles['feedback-success-subtle']}
                  onChange={(c) => updateStyle('feedback-success-subtle', c)}
                  label="Success Subtle"
                />
                <ColorPicker
                  color={styles['feedback-warning-default']}
                  onChange={(c) => updateStyle('feedback-warning-default', c)}
                  label="Warning"
                />
                <ColorPicker
                  color={styles['feedback-warning-subtle']}
                  onChange={(c) => updateStyle('feedback-warning-subtle', c)}
                  label="Warning Subtle"
                />
                <ColorPicker
                  color={styles['feedback-danger-default']}
                  onChange={(c) => updateStyle('feedback-danger-default', c)}
                  label="Danger"
                />
                <ColorPicker
                  color={styles['feedback-danger-subtle']}
                  onChange={(c) => updateStyle('feedback-danger-subtle', c)}
                  label="Danger Subtle"
                />
              </ControlSection>

              <ControlSection title="Surfaces">
                <ColorPicker
                  color={styles['surface-default']}
                  onChange={(c) => updateStyle('surface-default', c)}
                  label="Default"
                />
                <ColorPicker
                  color={styles['surface-secondary']}
                  onChange={(c) => updateStyle('surface-secondary', c)}
                  label="Secondary"
                />
                <ColorPicker
                  color={styles['surface-inverse']}
                  onChange={(c) => updateStyle('surface-inverse', c)}
                  label="Inverse"
                />
              </ControlSection>

              <ControlSection title="Text">
                <ColorPicker
                  color={styles['text-primary']}
                  onChange={(c) => updateStyle('text-primary', c)}
                  label="Primary"
                />
                <ColorPicker
                  color={styles['text-secondary']}
                  onChange={(c) => updateStyle('text-secondary', c)}
                  label="Secondary"
                />
                <ColorPicker
                  color={styles['text-inverse']}
                  onChange={(c) => updateStyle('text-inverse', c)}
                  label="Inverse"
                />
                <ColorPicker
                  color={styles['text-disabled']}
                  onChange={(c) => updateStyle('text-disabled', c)}
                  label="Disabled"
                />
              </ControlSection>

              <ControlSection title="Borders">
                <ColorPicker
                  color={styles['border-default']}
                  onChange={(c) => updateStyle('border-default', c)}
                  label="Default"
                />
                <ColorPicker
                  color={styles['border-strong']}
                  onChange={(c) => updateStyle('border-strong', c)}
                  label="Strong"
                />
              </ControlSection>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="typography" className="mt-1 size-full overflow-hidden">
            <ScrollArea className="h-full px-4">
              <ControlSection title="Font Family" expanded>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Label className="text-muted-foreground w-16 shrink-0 text-[11px] font-medium">
                      Sans
                    </Label>
                    <div className="min-w-0 flex-1">
                      <FontPicker
                        value={styles['font-family-sans']
                          ?.split(',')[0]
                          ?.replace(/['"]/g, '')
                          .trim()}
                        category="sans-serif"
                        placeholder="Sans-serif font..."
                        onSelect={(font: FontInfo) => {
                          const fontFamily = buildFontFamily(font.family, font.category);
                          updateStyle('font-family-sans', fontFamily);
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-muted-foreground w-16 shrink-0 text-[11px] font-medium">
                      Mono
                    </Label>
                    <div className="min-w-0 flex-1">
                      <FontPicker
                        value={styles['font-family-mono']
                          ?.split(',')[0]
                          ?.replace(/['"]/g, '')
                          .trim()}
                        category="monospace"
                        placeholder="Monospace font..."
                        onSelect={(font: FontInfo) => {
                          const fontFamily = buildFontFamily(font.family, font.category);
                          updateStyle('font-family-mono', fontFamily);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </ControlSection>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="other" className="mt-1 size-full overflow-hidden">
            <ScrollArea className="h-full px-4">
              <ControlSection title="Radius" expanded>
                <SliderWithInput
                  value={parseFloat(styles['radius-sm'].replace('rem', ''))}
                  onChange={(v) => updateStyle('radius-sm', `${v}rem`)}
                  min={0}
                  max={2}
                  step={0.025}
                  unit="rem"
                  label="SM"
                />
                <SliderWithInput
                  value={parseFloat(styles['radius-md'].replace('rem', ''))}
                  onChange={(v) => updateStyle('radius-md', `${v}rem`)}
                  min={0}
                  max={2}
                  step={0.025}
                  unit="rem"
                  label="MD"
                />
                <SliderWithInput
                  value={parseFloat(styles['radius-lg'].replace('rem', ''))}
                  onChange={(v) => updateStyle('radius-lg', `${v}rem`)}
                  min={0}
                  max={2}
                  step={0.025}
                  unit="rem"
                  label="LG"
                />
                <SliderWithInput
                  value={parseFloat(styles['radius-xl'].replace('rem', ''))}
                  onChange={(v) => updateStyle('radius-xl', `${v}rem`)}
                  min={0}
                  max={2}
                  step={0.025}
                  unit="rem"
                  label="XL"
                />
              </ControlSection>

              <ControlSection title="Motion">
                <SliderWithInput
                  value={parseInt(styles['duration-fast']?.replace('ms', '') ?? '150')}
                  onChange={(v) => updateStyle('duration-fast', `${v}ms`)}
                  min={0}
                  max={500}
                  step={10}
                  unit="ms"
                  label="Fast"
                />
                <SliderWithInput
                  value={parseInt(styles['duration-normal']?.replace('ms', '') ?? '250')}
                  onChange={(v) => updateStyle('duration-normal', `${v}ms`)}
                  min={0}
                  max={1000}
                  step={10}
                  unit="ms"
                  label="Normal"
                />
              </ControlSection>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ThemeControlPanel;

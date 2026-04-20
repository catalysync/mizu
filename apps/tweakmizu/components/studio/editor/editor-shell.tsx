'use client';

import { useStudioStore } from '@/store/studio-store';
import type { ThemeStyleProps } from '@/types/theme';
import { cn } from '@/utils/cn';
import { Badge, Button, Inline, Split, Stack } from '@aspect/react';
import { Palette, Redo2, RotateCcw, Ruler, Sparkles, Type, Undo2 } from 'lucide-react';
import { useState } from 'react';
import { CommandPalette } from './command-palette';
import { EditorPreviewPanel } from './preview-panel';
import { ColorsTab } from './tabs/colors-tab';
import { RadiusTab } from './tabs/radius-tab';
import { TypographyTab } from './tabs/typography-tab';

type TabId = 'colors' | 'typography' | 'radius';

const TABS: Array<{ id: TabId; label: string; icon: typeof Palette }> = [
  { id: 'colors', label: 'Colors', icon: Palette },
  { id: 'typography', label: 'Typography', icon: Type },
  { id: 'radius', label: 'Radius', icon: Ruler },
];

export function StudioEditorShell() {
  const styles = useStudioStore((state) => state.studioState.styles);
  const setStyles = useStudioStore((state) => state.setStyles);
  const undo = useStudioStore((state) => state.undo);
  const redo = useStudioStore((state) => state.redo);
  const canUndo = useStudioStore((state) => state.canUndo());
  const canRedo = useStudioStore((state) => state.canRedo());
  const resetExtensions = useStudioStore((state) => state.resetExtensions);

  const [activeTab, setActiveTab] = useState<TabId>('colors');

  const handleStylesChange = (updates: Partial<ThemeStyleProps>) => {
    setStyles(updates);
  };

  return (
    <Stack gap="1rem">
      <CommandPalette />
      <Inline gap="0.5rem" align="center" style={{ justifyContent: 'space-between' }}>
        <Inline gap="0.5rem" align="center">
          <Badge tone="info">Editor</Badge>
          <span className="text-muted-foreground text-sm">
            Press <kbd className="border-border rounded border px-1 py-0.5 text-xs">⌘K</kbd> to edit
            with AI.
          </span>
        </Inline>
        <Inline gap="0.375rem" align="center">
          <Button size="sm" variant="ghost" onClick={undo} disabled={!canUndo} aria-label="Undo">
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={redo} disabled={!canRedo} aria-label="Redo">
            <Redo2 className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={resetExtensions}>
            <RotateCcw className="mr-1 h-4 w-4" />
            Reset
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              const event = new KeyboardEvent('keydown', {
                key: 'k',
                metaKey: true,
                bubbles: true,
              });
              window.dispatchEvent(event);
            }}
          >
            <Sparkles className="mr-1 h-4 w-4" />
            AI edit
          </Button>
        </Inline>
      </Inline>

      {/* Mobile: stacked layout. Desktop: side-by-side via Split. */}
      <div className="flex flex-col gap-6 md:hidden">
        <Stack gap="0.75rem">
          <Stack as="nav" gap="0.25rem" aria-label="Editor tabs">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  aria-current={active ? 'true' : undefined}
                  className={cn(
                    'flex items-center gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors',
                    active
                      ? 'border-primary bg-primary/5 text-foreground'
                      : 'text-muted-foreground hover:border-border hover:bg-muted/60 border-transparent',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </Stack>
          <div className="border-border bg-background rounded-md border p-4">
            {activeTab === 'colors' ? (
              <ColorsTab styles={styles} onChange={handleStylesChange} />
            ) : null}
            {activeTab === 'typography' ? (
              <TypographyTab styles={styles} onChange={handleStylesChange} />
            ) : null}
            {activeTab === 'radius' ? (
              <RadiusTab styles={styles} onChange={handleStylesChange} />
            ) : null}
          </div>
        </Stack>
        <div>
          <EditorPreviewPanel styles={styles} />
        </div>
      </div>

      {/* Desktop: original Split layout */}
      <div className="hidden md:block">
        <Split fraction="260px 1fr" gap="1.5rem">
          <Stack gap="0.75rem">
            <Stack as="nav" gap="0.25rem" aria-label="Editor tabs">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const active = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    aria-current={active ? 'true' : undefined}
                    className={cn(
                      'flex items-center gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors',
                      active
                        ? 'border-primary bg-primary/5 text-foreground'
                        : 'text-muted-foreground hover:border-border hover:bg-muted/60 border-transparent',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </Stack>
            <div className="border-border bg-background rounded-md border p-4">
              {activeTab === 'colors' ? (
                <ColorsTab styles={styles} onChange={handleStylesChange} />
              ) : null}
              {activeTab === 'typography' ? (
                <TypographyTab styles={styles} onChange={handleStylesChange} />
              ) : null}
              {activeTab === 'radius' ? (
                <RadiusTab styles={styles} onChange={handleStylesChange} />
              ) : null}
            </div>
          </Stack>
          <div className="sticky top-4">
            <EditorPreviewPanel styles={styles} />
          </div>
        </Split>
      </div>
    </Stack>
  );
}

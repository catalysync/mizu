'use client';

import { useState } from 'react';
import { Badge, Button, Inline, Split, Stack } from '@aspect/react';
import { Palette, Ruler, RotateCcw, Type, Undo2, Redo2 } from 'lucide-react';
import { useStudioStore } from '@/store/studio-store';
import type { ThemeStyleProps } from '@/types/theme';
import { cn } from '@/utils/cn';
import { EditorPreviewPanel } from './preview-panel';
import { ColorsTab } from './tabs/colors-tab';
import { TypographyTab } from './tabs/typography-tab';
import { RadiusTab } from './tabs/radius-tab';

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
      <Inline gap="0.5rem" align="center" style={{ justifyContent: 'space-between' }}>
        <Inline gap="0.5rem" align="center">
          <Badge tone="info">Editor</Badge>
          <span className="text-sm text-muted-foreground">
            Live preview on the right reflects every token change.
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
        </Inline>
      </Inline>

      <Split fraction="260px" gap="1.5rem">
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
                      : 'border-transparent text-muted-foreground hover:border-border hover:bg-muted/60',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </Stack>
          <div className="rounded-md border border-border bg-background p-4">
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
    </Stack>
  );
}

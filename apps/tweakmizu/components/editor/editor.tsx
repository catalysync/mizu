'use client';

import {
  ResizableGroup,
  ResizablePanel,
  ResizableHandle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@aspect/react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useThemeFromUrl } from '@/hooks/use-theme-from-url';
import { useEditorStore } from '@/store/editor-store';
import type { ThemeStyleProps } from '@/types/theme';
import { Sliders } from 'lucide-react';
import React from 'react';
import { ActionBar } from './action-bar/action-bar';
import ThemeControlPanel from './theme-control-panel';
import ThemePreviewPanel from './theme-preview-panel';

const Editor: React.FC = () => {
  const themeState = useEditorStore((state) => state.themeState);
  const setThemeState = useEditorStore((state) => state.setThemeState);
  const isMobile = useIsMobile();

  useThemeFromUrl();

  const handleStyleChange = React.useCallback(
    (updates: Partial<ThemeStyleProps>) => {
      const prev = useEditorStore.getState().themeState;
      setThemeState({
        ...prev,
        styles: { ...prev.styles, ...updates },
      });
    },
    [setThemeState],
  );

  const styles = themeState.styles;

  if (isMobile) {
    return (
      <div className="relative flex flex-1 overflow-hidden">
        <div className="size-full flex-1 overflow-hidden">
          <Tabs defaultValue="controls" className="h-full">
            <TabsList className="w-full">
              <TabsTrigger value="controls" className="flex-1">
                <Sliders className="mr-2 h-4 w-4" />
                Controls
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex-1">
                Preview
              </TabsTrigger>
            </TabsList>
            <TabsContent value="controls" className="mt-0 h-[calc(100%-2.5rem)]">
              <div className="flex h-full flex-col">
                <ThemeControlPanel styles={styles} onChange={handleStyleChange} />
              </div>
            </TabsContent>
            <TabsContent value="preview" className="mt-0 h-[calc(100%-2.5rem)]">
              <div className="flex h-full flex-col">
                <ActionBar />
                <ThemePreviewPanel styles={styles} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 overflow-hidden">
      <div className="size-full">
        <ResizableGroup direction="horizontal">
          <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
            <div className="flex h-full flex-col overflow-hidden">
              <ThemeControlPanel styles={styles} onChange={handleStyleChange} />
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={70}>
            <div className="flex h-full flex-col">
              <div className="flex min-h-0 flex-1 flex-col">
                <ActionBar />
                <ThemePreviewPanel styles={styles} />
              </div>
            </div>
          </ResizablePanel>
        </ResizableGroup>
      </div>
    </div>
  );
};

export default Editor;

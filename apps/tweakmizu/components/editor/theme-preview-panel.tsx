'use client';

import { HorizontalScrollArea } from '@/components/horizontal-scroll-area';
import { TooltipWrapper } from '@/components/tooltip-wrapper';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import { useFullscreen } from '@/hooks/use-fullscreen';
import { cn } from '@/lib/utils';
import type { ThemeStyleProps } from '@/types/theme';
import { Maximize, Minimize } from 'lucide-react';
import { useQueryState } from 'nuqs';
import TabsTriggerPill from './theme-preview/tabs-trigger-pill';
import MizuComponentsPreview from './theme-preview/mizu-components-preview';
import MizuColorPreview from './theme-preview/mizu-color-preview';

interface ThemePreviewPanelProps {
  styles: ThemeStyleProps;
}

const ThemePreviewPanel = ({ styles }: ThemePreviewPanelProps) => {
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const [activeTab, setActiveTab] = useQueryState('p', {
    defaultValue: 'components',
  });

  return (
    <div
      className={cn(
        'flex min-h-0 flex-1 flex-col',
        isFullscreen && 'bg-background fixed inset-0 z-50',
      )}
    >
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <HorizontalScrollArea className="mt-2 mb-1 flex w-full items-center justify-between px-4">
          <TabsList className="bg-background text-muted-foreground inline-flex w-fit items-center justify-center rounded-full px-0">
            <TabsTriggerPill value="components">Components</TabsTriggerPill>
            <TabsTriggerPill value="colors">Color Palette</TabsTriggerPill>
          </TabsList>

          <div className="flex items-center gap-0.5">
            <TooltipWrapper
              label={isFullscreen ? 'Exit full screen' : 'Full screen'}
              className="hidden md:inline-flex"
              asChild
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullscreen}
                className="group size-8"
              >
                {isFullscreen ? (
                  <Minimize className="transition-all group-hover:scale-120" />
                ) : (
                  <Maximize className="transition-all group-hover:scale-120" />
                )}
              </Button>
            </TooltipWrapper>
          </div>
        </HorizontalScrollArea>

        <section className="relative size-full overflow-hidden p-4 pt-1">
          <div className="relative isolate size-full overflow-hidden rounded-lg">
            <TabsContent value="components" className="m-0 size-full">
              <ScrollArea className="size-full">
                <MizuComponentsPreview styles={styles} />
              </ScrollArea>
            </TabsContent>

            <TabsContent value="colors" className="m-0 size-full">
              <ScrollArea className="size-full">
                <div className="p-4">
                  <MizuColorPreview styles={styles} />
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </section>
      </Tabs>
    </div>
  );
};

export default ThemePreviewPanel;

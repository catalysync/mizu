'use client';

import { Button, ScrollArea, Tabs, TabsContent, TabsList, TabsTrigger } from '@aspect/react';
import { useFullscreen } from '@/hooks/use-fullscreen';
import type { ThemeStyleProps } from '@/types/theme';
import { Maximize, Minimize } from 'lucide-react';
import { useQueryState } from 'nuqs';
import MizuComponentsPreview from './theme-preview/mizu-components-preview';
import MizuColorPreview from './theme-preview/mizu-color-preview';

interface ThemePreviewPanelProps {
  styles: ThemeStyleProps;
}

const ThemePreviewPanel = ({ styles }: ThemePreviewPanelProps) => {
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const [activeTab, setActiveTab] = useQueryState('p', { defaultValue: 'components' });

  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        minHeight: 0,
        flexDirection: 'column',
        ...(isFullscreen && {
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          background: 'var(--mizu-surface-default)',
        }),
      }}
    >
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.5rem 1rem',
          }}
        >
          <TabsList>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="colors">Color Palette</TabsTrigger>
          </TabsList>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit full screen' : 'Full screen'}
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </Button>
        </div>

        <section style={{ position: 'relative', flex: 1, minHeight: 0, padding: '0 1rem 1rem' }}>
          <div
            style={{
              position: 'relative',
              height: '100%',
              overflow: 'hidden',
              borderRadius: 'var(--mizu-radius-lg)',
              border: '1px solid var(--mizu-border-default)',
            }}
          >
            <TabsContent value="components" style={{ height: '100%' }}>
              <ScrollArea style={{ height: '100%' }}>
                <MizuComponentsPreview styles={styles} />
              </ScrollArea>
            </TabsContent>
            <TabsContent value="colors" style={{ height: '100%' }}>
              <ScrollArea style={{ height: '100%' }}>
                <div style={{ padding: '1rem' }}>
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

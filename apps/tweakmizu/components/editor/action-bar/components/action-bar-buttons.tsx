'use client';

import { Separator } from '@aspect/react';
import { useEditorStore } from '@/store/editor-store';
import { ThemeToggle } from '@/components/theme-toggle';
import { CodeButton } from './code-button';
import { ImportButton } from './import-button';
import { ResetButton } from './reset-button';
import { ShareButton } from './share-button';
import { UndoRedoButtons } from './undo-redo-buttons';

export function ActionBarButtons() {
  const { resetToCurrentPreset, hasUnsavedChanges } = useEditorStore();

  return (
    <>
      <ThemeToggle />
      <Separator orientation="vertical" style={{ height: '1.5rem', margin: '0 0.25rem' }} />
      <UndoRedoButtons />
      <Separator orientation="vertical" style={{ height: '1.5rem', margin: '0 0.25rem' }} />
      <ResetButton onClick={resetToCurrentPreset} disabled={!hasUnsavedChanges()} />
      <Separator orientation="vertical" style={{ height: '1.5rem', margin: '0 0.25rem' }} />
      <ImportButton />
      <ShareButton />
      <CodeButton />
    </>
  );
}

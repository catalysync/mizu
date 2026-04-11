'use client';

import { Separator } from '@aspect/react';
import { useEditorStore } from '@/store/editor-store';
import { CodeButton } from './code-button';
import { ResetButton } from './reset-button';
import { UndoRedoButtons } from './undo-redo-buttons';

export function ActionBarButtons() {
  const { resetToCurrentPreset, hasUnsavedChanges } = useEditorStore();

  return (
    <>
      <UndoRedoButtons />
      <Separator orientation="vertical" style={{ height: '1.5rem', margin: '0 0.25rem' }} />
      <ResetButton onClick={resetToCurrentPreset} disabled={!hasUnsavedChanges()} />
      <Separator orientation="vertical" style={{ height: '1.5rem', margin: '0 0.25rem' }} />
      <CodeButton />
    </>
  );
}

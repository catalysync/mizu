'use client';

import { Separator } from '@/components/ui/separator';
import { useEditorStore } from '@/store/editor-store';
import { CodeButton } from './code-button';
import { ResetButton } from './reset-button';
import { UndoRedoButtons } from './undo-redo-buttons';

export function ActionBarButtons() {
  const { resetToCurrentPreset, hasUnsavedChanges } = useEditorStore();

  return (
    <div className="flex items-center gap-1">
      <UndoRedoButtons />
      <Separator orientation="vertical" className="mx-1 h-8" />
      <ResetButton onClick={resetToCurrentPreset} disabled={!hasUnsavedChanges()} />
      <Separator orientation="vertical" className="mx-1 h-8" />
      <CodeButton />
    </div>
  );
}

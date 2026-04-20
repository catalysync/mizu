'use client';

import { useEditorStore } from '@/store/editor-store';
import { Button } from '@aspect/react';
import { Redo, Undo } from 'lucide-react';

export function UndoRedoButtons() {
  const { undo, redo, canUndo, canRedo } = useEditorStore();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Button variant="ghost" size="icon" disabled={!canUndo()} onClick={undo} aria-label="Undo">
        <Undo size={16} />
      </Button>
      <Button variant="ghost" size="icon" disabled={!canRedo()} onClick={redo} aria-label="Redo">
        <Redo size={16} />
      </Button>
    </div>
  );
}

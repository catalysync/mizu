'use client';

import { createContext, type ReactNode, useContext, useState } from 'react';

interface DialogActionsContextType {
  codePanelOpen: boolean;
  setCodePanelOpen: (open: boolean) => void;
  handleSaveClick: (options?: { shareAfterSave?: boolean; openInV0AfterSave?: boolean }) => void;
}

export const DialogActionsContext = createContext<DialogActionsContextType | null>(null);

export function DialogActionsProvider({ children }: { children: ReactNode }) {
  const [codePanelOpen, setCodePanelOpen] = useState(false);

  const value: DialogActionsContextType = {
    codePanelOpen,
    setCodePanelOpen,
    handleSaveClick: () => {},
  };

  return <DialogActionsContext value={value}>{children}</DialogActionsContext>;
}

export function useDialogActions(): DialogActionsContextType {
  const context = useContext(DialogActionsContext);

  if (!context) {
    throw new Error('useDialogActions must be used within a DialogActionsProvider');
  }

  return context;
}

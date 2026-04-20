'use client';

import { ActionBarButtons } from './components/action-bar-buttons';

export function ActionBar() {
  return (
    <div className="border-border flex h-14 items-center justify-end gap-1 border-b px-4">
      <ActionBarButtons />
    </div>
  );
}

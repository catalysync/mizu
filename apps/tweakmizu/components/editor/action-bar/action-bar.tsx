'use client';

import { ActionBarButtons } from './components/action-bar-buttons';

export function ActionBar() {
  return (
    <div className="flex h-14 items-center justify-end gap-1 border-b border-border px-4">
      <ActionBarButtons />
    </div>
  );
}

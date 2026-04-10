'use client';

import { HorizontalScrollArea } from '@/components/horizontal-scroll-area';
import { ActionBarButtons } from './components/action-bar-buttons';

export function ActionBar() {
  return (
    <div className="border-b">
      <HorizontalScrollArea className="flex h-14 w-full items-center justify-end gap-4 px-4">
        <ActionBarButtons />
      </HorizontalScrollArea>
    </div>
  );
}

'use client';

import { Inline } from '@aspect/react';
import { ActionBarButtons } from './components/action-bar-buttons';

export function ActionBar() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: '3.5rem',
        padding: '0 1rem',
        borderBottom: '1px solid var(--mizu-border-default)',
      }}
    >
      <Inline gap="0.25rem">
        <ActionBarButtons />
      </Inline>
    </div>
  );
}

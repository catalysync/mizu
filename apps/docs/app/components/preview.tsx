'use client';

import type { ReactNode } from 'react';

export function Preview({ children }: { children: ReactNode }) {
  return (
    <div className="docs-preview">
      <div className="docs-preview__canvas">{children}</div>
    </div>
  );
}

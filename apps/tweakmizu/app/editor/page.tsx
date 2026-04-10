'use client';

import Editor from '@/components/editor/editor';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Suspense } from 'react';

export default function EditorPage() {
  return (
    <NuqsAdapter>
      <Suspense>
        <div className="flex h-[100dvh] flex-col">
          <Editor />
        </div>
      </Suspense>
    </NuqsAdapter>
  );
}

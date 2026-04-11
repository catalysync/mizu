'use client';

import './preview-app.css';
import { use, useMemo } from 'react';
import { useCraftStore } from '@/store/craft-store';
import { profileToCss } from '@/lib/craft/profile-to-css';
import { PreviewShell } from './preview-shell';
import { PageRenderer } from './page-renderer';
import { usePreviewBridge } from './preview-bridge';

interface PreviewAppProps {
  paramsPromise: Promise<{ path?: string[] }>;
}

export function PreviewApp({ paramsPromise }: PreviewAppProps) {
  const params = use(paramsPromise);
  const pathname = '/' + (params.path ?? []).join('/');

  // Listen to parent updates via BroadcastChannel so every profile mutation
  // in the craft shell shows up in the iframe within a frame.
  usePreviewBridge();

  const profile = useCraftStore((s) => s.profile);
  const vars = useMemo(() => profileToCss(profile), [profile]);

  const page =
    profile.app.pages.find((p) => p.path === pathname) ??
    profile.app.pages.find((p) => p.path === '/') ??
    profile.app.pages[0];

  return (
    <div className="craft-preview-root" style={vars as React.CSSProperties}>
      <PreviewShell profile={profile} currentPath={page?.path ?? '/'}>
        {page ? <PageRenderer page={page} profile={profile} /> : <EmptyPreview />}
      </PreviewShell>
    </div>
  );
}

function EmptyPreview() {
  return (
    <div className="craft-preview__empty">
      <p>This profile has no pages yet. Ask the AI to add one, or pick an archetype.</p>
    </div>
  );
}

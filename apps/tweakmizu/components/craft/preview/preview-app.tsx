'use client';

import './preview-app.css';
import { use, useMemo } from 'react';
import { useCraftStore } from '@/store/craft-store';
import { profileToCss } from '@/lib/craft/profile-to-css';
import { PreviewShell } from './preview-shell';
import { PageRenderer } from './page-renderer';
import { usePreviewBridge } from './preview-bridge';
import { PreviewToolbar } from './preview-toolbar';

interface PreviewAppProps {
  paramsPromise: Promise<{ path?: string[] }>;
}

export function PreviewApp({ paramsPromise }: PreviewAppProps) {
  const params = use(paramsPromise);
  const pathname = '/' + (params.path ?? []).join('/');

  // Listen to parent updates via BroadcastChannel so every profile mutation
  // in the craft shell shows up in the iframe within a frame.
  usePreviewBridge();

  const hasHydrated = useCraftStore((s) => s.hasHydrated);
  const profile = useCraftStore((s) => s.profile);
  const vars = useMemo(() => profileToCss(profile), [profile]);

  if (!hasHydrated) {
    return (
      <div className="craft-preview-root" style={{ background: '#f8fafc', minHeight: '100dvh' }} />
    );
  }

  const pages = profile.app?.pages ?? [];
  const page =
    pages.find((p) => p.path === pathname) ?? pages.find((p) => p.path === '/') ?? pages[0];

  if (!profile.app) {
    return (
      <div className="craft-preview-root" style={vars as React.CSSProperties}>
        <EmptyPreview />
      </div>
    );
  }

  const isStandalone = typeof window !== 'undefined' && window.self === window.top;

  return (
    <>
      {isStandalone ? <PreviewToolbar /> : null}
      <div className="craft-preview-root" style={vars as React.CSSProperties}>
        <PreviewShell profile={profile} currentPath={page?.path ?? '/'}>
          {page ? <PageRenderer page={page} profile={profile} /> : <EmptyPreview />}
        </PreviewShell>
      </div>
    </>
  );
}

function EmptyPreview() {
  return (
    <div className="craft-preview__empty">
      <p>This profile has no pages yet. Ask the AI to add one, or pick an archetype.</p>
    </div>
  );
}

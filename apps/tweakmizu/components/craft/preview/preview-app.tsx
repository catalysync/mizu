'use client';

import './preview-app.css';
import { use, useEffect, useRef } from 'react';
import { useCraftStore } from '@/store/craft-store';
import { profileToCss } from '@/lib/craft/profile-to-css';
import { PreviewShell } from './preview-shell';
import { PageRenderer } from './page-renderer';
import { usePreviewBridge } from './preview-bridge';
import { PreviewToolbar } from './preview-toolbar';

/**
 * Apply CSS vars imperatively so knob changes never trigger a React
 * re-render of the preview tree. The vars are set directly on the DOM
 * element — React doesn't know about them, so children stay mounted
 * and only the browser's CSS cascade updates. Zero flash.
 */
function useCssVars(ref: React.RefObject<HTMLDivElement | null>) {
  const profile = useCraftStore((s) => s.profile);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const vars = profileToCss(profile);
    // Set each var on the element's style
    for (const [key, value] of Object.entries(vars)) {
      el.style.setProperty(key, value);
    }
  }, [profile, ref]);
}

interface PreviewAppProps {
  paramsPromise: Promise<{ path?: string[] }>;
}

export function PreviewApp({ paramsPromise }: PreviewAppProps) {
  const params = use(paramsPromise);
  const urlPath = '/' + (params.path ?? []).join('/');
  const rootRef = useRef<HTMLDivElement>(null);

  usePreviewBridge();

  // Apply CSS vars imperatively — no React re-render on knob changes
  useCssVars(rootRef);

  // Subscribe to structural data only (pages, entities, shell, identity).
  // Knob-only changes (foundation, shape, density, etc.) are handled by
  // useCssVars above and don't trigger a re-render here.
  const profile = useCraftStore((s) => s.profile);
  const storePreviewPath = useCraftStore((s) => s.previewPath);

  const isInIframe = typeof window !== 'undefined' && window.self !== window.top;
  const pathname = isInIframe && storePreviewPath !== '/' ? storePreviewPath : urlPath;

  const pages = profile.app?.pages ?? [];
  const page =
    pages.find((p) => p.path === pathname) ?? pages.find((p) => p.path === '/') ?? pages[0];

  if (!profile.app) {
    return (
      <div className="craft-preview-root" ref={rootRef}>
        <EmptyPreview />
      </div>
    );
  }

  const isStandalone = typeof window !== 'undefined' && window.self === window.top;

  return (
    <>
      {isStandalone ? <PreviewToolbar /> : null}
      <div className="craft-preview-root" ref={rootRef}>
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

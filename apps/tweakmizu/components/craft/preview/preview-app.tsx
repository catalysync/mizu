'use client';

import './preview-app.css';
import { use, useEffect, useRef, useState } from 'react';
import { useCraftStore } from '@/store/craft-store';
import { profileToCss } from '@/lib/craft/profile-to-css';
import { PreviewShell } from './preview-shell';
import { PageRenderer } from './page-renderer';
import { usePreviewBridge } from './preview-bridge';
import { PreviewToolbar } from './preview-toolbar';

/**
 * Apply CSS vars imperatively so knob changes never trigger a React
 * re-render of the preview tree. Returns whether the first real profile
 * has been applied (so the UI can hide until ready).
 */
function useCssVars(ref: React.RefObject<HTMLDivElement | null>) {
  const profile = useCraftStore((s) => s.profile);
  const previewDark = useCraftStore((s) => s.previewDark);
  const [ready, setReady] = useState(false);
  const isInIframe = typeof window !== 'undefined' && window.self !== window.top;
  const appliedOnce = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const vars = profileToCss(profile, previewDark);
    for (const [key, value] of Object.entries(vars)) {
      el.style.setProperty(key, value);
    }
    el.style.setProperty('color-scheme', previewDark ? 'dark' : 'light');

    // In iframe: wait for BroadcastChannel to send real profile before showing.
    // The first store state is the default; the second is from the parent.
    if (!appliedOnce.current) {
      appliedOnce.current = true;
      if (!isInIframe) setReady(true); // standalone: show immediately
    } else {
      setReady(true);
    }
  }, [profile, previewDark, ref, isInIframe]);

  // Fallback: if BroadcastChannel never fires (no parent), show after 500ms
  useEffect(() => {
    if (ready) return;
    const timer = setTimeout(() => setReady(true), 500);
    return () => clearTimeout(timer);
  }, [ready]);

  return ready;
}

interface PreviewAppProps {
  paramsPromise: Promise<{ path?: string[] }>;
}

export function PreviewApp({ paramsPromise }: PreviewAppProps) {
  const params = use(paramsPromise);
  const urlPath = '/' + (params.path ?? []).join('/');
  const rootRef = useRef<HTMLDivElement>(null);

  usePreviewBridge();

  // Apply CSS vars imperatively — no React re-render on knob changes.
  // Returns false until the first real profile arrives via BroadcastChannel.
  const ready = useCssVars(rootRef);

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

  const rootStyle = ready ? undefined : { opacity: 0 };

  if (!profile.app) {
    return (
      <div className="craft-preview-root" ref={rootRef} style={rootStyle}>
        <EmptyPreview />
      </div>
    );
  }

  const isStandalone = typeof window !== 'undefined' && window.self === window.top;

  // Auth pages (login, signup) render as standalone centered layouts, not in the shell
  const nav = profile.app?.shell?.nav ?? [];
  const isAuthPage = nav.some((n) => n.pageId === page?.id && n.section === 'auth');

  if (isAuthPage && page) {
    return (
      <>
        {isStandalone ? <PreviewToolbar /> : null}
        <div className="craft-preview-root" ref={rootRef} style={rootStyle}>
          <div className="craft-preview-auth">
            <div className="craft-preview-auth__card">
              <div className="craft-preview-auth__logo">
                <span className="craft-preview-auth__logo-icon">
                  {profile.app?.identity?.logo ?? '✷'}
                </span>
                <span className="craft-preview-auth__logo-name">
                  {profile.app?.identity?.productName ?? profile.name}
                </span>
              </div>
              <PageRenderer page={page} profile={profile} />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {isStandalone ? <PreviewToolbar /> : null}
      <div className="craft-preview-root" ref={rootRef} style={rootStyle}>
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

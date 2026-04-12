'use client';

import { useEffect } from 'react';
import { useCraftStore } from '@/store/craft-store';
import { parseProfile, type DesignLanguageProfile } from '@/lib/craft/profile';

/**
 * preview-bridge — keeps the iframe preview in sync with the parent craft
 * studio via BroadcastChannel. The parent writes every profile mutation,
 * the iframe picks it up and replaces its local store state.
 *
 * BroadcastChannel works same-origin, which is what we have (both windows
 * are under tweakmizu). Uses the same channel name in both directions so
 * the parent can also respond to startup requests from the iframe.
 */

const CHANNEL = 'craft-profile';

type Message =
  | { type: 'update'; profile: DesignLanguageProfile; previewPath?: string; previewDark?: boolean }
  | { type: 'request' };

/** Parent-side: push profile updates whenever the store changes. */
export function installPreviewPublisher() {
  if (typeof window === 'undefined') return () => {};
  let channel: BroadcastChannel | null = null;
  try {
    channel = new BroadcastChannel(CHANNEL);
  } catch {
    channel = null;
  }

  const unsub = useCraftStore.subscribe((state, prev) => {
    if (
      state.profile === prev.profile &&
      state.previewPath === prev.previewPath &&
      state.previewDark === prev.previewDark
    )
      return;
    channel?.postMessage({
      type: 'update',
      profile: state.profile,
      previewPath: state.previewPath,
      previewDark: state.previewDark,
    } satisfies Message);
  });

  if (channel) {
    channel.onmessage = (ev: MessageEvent<Message>) => {
      if (ev.data?.type === 'request') {
        const s = useCraftStore.getState();
        channel?.postMessage({
          type: 'update',
          profile: s.profile,
          previewPath: s.previewPath,
          previewDark: s.previewDark,
        } satisfies Message);
      }
    };
  }

  return () => {
    unsub();
    channel?.close();
  };
}

/** Iframe-side hook: subscribe to parent messages and rehydrate the store. */
export function usePreviewBridge() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel(CHANNEL);
    } catch {
      channel = null;
    }
    if (!channel) return;

    const apply = (raw: unknown, path?: string, dark?: boolean) => {
      const patch: Partial<{
        profile: DesignLanguageProfile;
        previewPath: string;
        previewDark: boolean;
      }> = {};
      if (path) patch.previewPath = path;
      if (dark !== undefined) patch.previewDark = dark;
      try {
        patch.profile = parseProfile(raw);
      } catch {
        if (raw && typeof raw === 'object' && 'name' in raw) {
          patch.profile = raw as DesignLanguageProfile;
        }
      }
      if (Object.keys(patch).length > 0) useCraftStore.setState(patch);
    };

    channel.onmessage = (ev: MessageEvent<Message>) => {
      if (ev.data?.type === 'update')
        apply(ev.data.profile, ev.data.previewPath, ev.data.previewDark);
    };

    // Ask parent for the current snapshot on mount
    channel.postMessage({ type: 'request' } satisfies Message);

    return () => channel?.close();
  }, []);
}

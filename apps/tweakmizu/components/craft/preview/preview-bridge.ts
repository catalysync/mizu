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

type Message = { type: 'update'; profile: DesignLanguageProfile } | { type: 'request' };

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
    if (state.profile === prev.profile) return;
    channel?.postMessage({ type: 'update', profile: state.profile } satisfies Message);
  });

  // Respond to iframe startup requests with the current snapshot
  if (channel) {
    channel.onmessage = (ev: MessageEvent<Message>) => {
      if (ev.data?.type === 'request') {
        channel?.postMessage({
          type: 'update',
          profile: useCraftStore.getState().profile,
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

    const apply = (raw: unknown) => {
      try {
        // Try strict parse first, fall back to direct apply.
        // Structured clone can lose prototype info that Zod expects,
        // but the data is still valid — it came from the parent store.
        const profile = parseProfile(raw);
        useCraftStore.setState({ profile });
      } catch {
        // Fallback: apply directly if Zod rejects the cloned object.
        // This is safe because the data originated from a validated store.
        if (raw && typeof raw === 'object' && 'name' in raw) {
          useCraftStore.setState({ profile: raw as DesignLanguageProfile });
        }
      }
    };

    channel.onmessage = (ev: MessageEvent<Message>) => {
      if (ev.data?.type === 'update') apply(ev.data.profile);
    };

    // Ask parent for the current snapshot on mount
    channel.postMessage({ type: 'request' } satisfies Message);

    return () => channel?.close();
  }, []);
}

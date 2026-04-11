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
 * are under tweakmizu). If BroadcastChannel is missing (old browser, test
 * env), we also listen to `storage` events as a fallback.
 *
 * Uses the same channel name in both directions so the parent can also
 * request the current profile on startup via a {type:'request'} message.
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
        const profile = parseProfile(raw);
        useCraftStore.setState({ profile });
      } catch {
        // ignore invalid snapshots
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

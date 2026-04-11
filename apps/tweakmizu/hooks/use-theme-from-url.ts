'use client';

import { useEditorStore } from '@/store/editor-store';
import { decodeShareState } from '@/utils/share-url';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * If the URL carries a ?theme=<payload>, decode it into a ThemeEditorState
 * and apply it once on mount. Then strip the param so refreshes don't
 * re-clobber any edits the user has made since opening the link.
 */
export function useThemeFromUrl() {
  const searchParams = useSearchParams();
  const setThemeState = useEditorStore((s) => s.setThemeState);
  const applied = useRef(false);

  useEffect(() => {
    if (applied.current) return;
    const encoded = searchParams.get('theme');
    if (!encoded) return;

    const decoded = decodeShareState(encoded);
    if (decoded) {
      setThemeState(decoded);
    }

    applied.current = true;

    // Strip the theme param so reloads respect the user's current edits
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('theme');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams, setThemeState]);
}

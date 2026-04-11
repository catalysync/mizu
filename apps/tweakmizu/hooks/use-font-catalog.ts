'use client';

import { useEffect, useState } from 'react';
import type { CatalogResponse, CatalogEntry } from '@/app/api/fonts/route';
import { FONT_OPTIONS, type FontCategory } from '@/utils/fonts';

interface CatalogState {
  fonts: CatalogEntry[];
  source: 'google' | 'fallback' | 'loading';
  error: string | null;
}

const FALLBACK: CatalogEntry[] = FONT_OPTIONS.map((f) => ({
  family: f.family,
  category: f.category,
  weights: f.weights,
}));

let cache: CatalogState | null = null;

/**
 * Fetches the font catalog from /api/fonts once per session. Falls back
 * to the curated list immediately while the request is in flight, so the
 * picker is always usable.
 */
export function useFontCatalog(): CatalogState {
  const [state, setState] = useState<CatalogState>(
    () => cache ?? { fonts: FALLBACK, source: 'loading', error: null },
  );

  useEffect(() => {
    if (cache && cache.source !== 'loading') {
      setState(cache);
      return;
    }

    let cancelled = false;
    fetch('/api/fonts')
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.json() as Promise<CatalogResponse>;
      })
      .then((data) => {
        if (cancelled) return;
        const next: CatalogState = {
          fonts: data.fonts.length > 0 ? data.fonts : FALLBACK,
          source: data.source,
          error: null,
        };
        cache = next;
        setState(next);
      })
      .catch((err) => {
        if (cancelled) return;
        const next: CatalogState = {
          fonts: FALLBACK,
          source: 'fallback',
          error: err instanceof Error ? err.message : 'Failed to load fonts',
        };
        cache = next;
        setState(next);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

export function filterCatalog(
  fonts: CatalogEntry[],
  category: FontCategory,
  query: string,
): CatalogEntry[] {
  const q = query.trim().toLowerCase();
  const inCategory = fonts.filter((f) => f.category === category);
  if (!q) return inCategory;
  return inCategory.filter((f) => f.family.toLowerCase().includes(q));
}

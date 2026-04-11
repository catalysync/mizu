import { NextResponse } from 'next/server';
import { FONT_OPTIONS, type FontCategory } from '@/utils/fonts';

/**
 * Proxies the Google Fonts Developer API and caches the response for 24h.
 * If no GOOGLE_FONTS_API_KEY is configured, falls back to the 24-font
 * curated list — the app still works, you just don't get full search.
 *
 * The developer API is free; you get a key from Google Cloud Console.
 * See: https://developers.google.com/fonts/docs/developer_api
 */

type GoogleFontsCategory = 'sans-serif' | 'serif' | 'monospace' | 'display' | 'handwriting';

interface GoogleFontsItem {
  family: string;
  category: GoogleFontsCategory;
  variants: string[];
}

interface GoogleFontsResponse {
  items: GoogleFontsItem[];
}

export interface CatalogEntry {
  family: string;
  category: FontCategory;
  weights: string;
}

export interface CatalogResponse {
  source: 'google' | 'fallback';
  fonts: CatalogEntry[];
}

// Limit to a single weight pool for payload efficiency — we don't expose
// weight selection in the picker, just the family.
const DEFAULT_WEIGHTS = '400;500;600;700';

function mapCategory(cat: GoogleFontsCategory): FontCategory | null {
  switch (cat) {
    case 'sans-serif':
    case 'display':
    case 'handwriting':
      return 'sans';
    case 'serif':
      return 'serif';
    case 'monospace':
      return 'mono';
    default:
      return null;
  }
}

export const revalidate = 86400; // 24h

export async function GET() {
  const key = process.env.GOOGLE_FONTS_API_KEY;

  if (!key) {
    const fonts: CatalogEntry[] = FONT_OPTIONS.map((f) => ({
      family: f.family,
      category: f.category,
      weights: f.weights,
    }));
    return NextResponse.json<CatalogResponse>(
      { source: 'fallback', fonts },
      { headers: { 'cache-control': 'public, max-age=86400' } },
    );
  }

  try {
    const url = `https://www.googleapis.com/webfonts/v1/webfonts?key=${key}&sort=popularity`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) throw new Error(`Google Fonts API ${res.status}`);
    const data = (await res.json()) as GoogleFontsResponse;

    const fonts: CatalogEntry[] = [];
    for (const item of data.items) {
      const cat = mapCategory(item.category);
      if (!cat) continue;
      fonts.push({ family: item.family, category: cat, weights: DEFAULT_WEIGHTS });
    }

    return NextResponse.json<CatalogResponse>(
      { source: 'google', fonts },
      { headers: { 'cache-control': 'public, max-age=86400, s-maxage=86400' } },
    );
  } catch (error) {
    console.error('Google Fonts API failed, using fallback list:', error);
    const fonts: CatalogEntry[] = FONT_OPTIONS.map((f) => ({
      family: f.family,
      category: f.category,
      weights: f.weights,
    }));
    return NextResponse.json<CatalogResponse>({ source: 'fallback', fonts });
  }
}

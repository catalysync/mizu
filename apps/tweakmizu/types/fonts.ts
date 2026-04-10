export type FontCategory = 'sans-serif' | 'serif' | 'monospace' | 'display' | 'handwriting';

export interface FontInfo {
  family: string;
  category: FontCategory;
  variants: string[];
  variable: boolean;
}

export interface GoogleFont {
  family: string;
  category: FontCategory;
  variants: string[];
}

export interface GoogleFontsAPIResponse {
  items: GoogleFont[];
}

export interface PaginatedFontsResponse {
  fonts: FontInfo[];
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;
}

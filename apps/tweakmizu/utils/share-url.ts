import { defaultStyles } from '@/config/theme';
import type { ThemeEditorState } from '@/types/editor';
import type { ThemeStyleProps } from '@/types/theme';
import { getPresetThemeStyles } from '@/utils/theme-preset-helper';

type SharePayload = {
  preset?: string;
  overrides?: Partial<ThemeStyleProps>;
};

function toBase64Url(str: string) {
  const b64 =
    typeof btoa === 'function'
      ? btoa(unescape(encodeURIComponent(str)))
      : Buffer.from(str, 'utf-8').toString('base64');
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(b64url: string) {
  const pad = '='.repeat((4 - (b64url.length % 4)) % 4);
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/') + pad;
  const raw =
    typeof atob === 'function'
      ? decodeURIComponent(escape(atob(b64)))
      : Buffer.from(b64, 'base64').toString('utf-8');
  return raw;
}

function diffStyles(current: ThemeStyleProps, baseline: ThemeStyleProps): Partial<ThemeStyleProps> {
  const out: Partial<ThemeStyleProps> = {};
  for (const key of Object.keys(current) as (keyof ThemeStyleProps)[]) {
    if (current[key] !== baseline[key]) {
      (out as Record<string, string | undefined>)[key] = current[key];
    }
  }
  return out;
}

/**
 * Encode the current editor state into a compact base64url payload. Only the
 * difference from the selected preset is stored, so most shared links fit
 * comfortably under browser URL length limits.
 */
export function encodeShareState(state: ThemeEditorState): string {
  const baseline = state.preset ? getPresetThemeStyles(state.preset) : defaultStyles;
  const overrides = diffStyles(state.styles, baseline);

  const payload: SharePayload = {};
  if (state.preset && state.preset !== 'default') payload.preset = state.preset;
  if (Object.keys(overrides).length > 0) payload.overrides = overrides;

  return toBase64Url(JSON.stringify(payload));
}

/**
 * Parse a shared payload and reconstruct a full ThemeEditorState.
 * Returns null on any parse/decode failure (malformed or tampered URLs).
 */
export function decodeShareState(encoded: string): ThemeEditorState | null {
  try {
    const raw = fromBase64Url(encoded);
    const payload = JSON.parse(raw) as SharePayload;
    if (typeof payload !== 'object' || payload === null) return null;

    const baseline = payload.preset ? getPresetThemeStyles(payload.preset) : defaultStyles;
    const validKeys = new Set(Object.keys(defaultStyles));
    const safeOverrides: Partial<ThemeStyleProps> = {};
    if (payload.overrides && typeof payload.overrides === 'object') {
      for (const [key, value] of Object.entries(payload.overrides)) {
        if (validKeys.has(key) && typeof value === 'string') {
          (safeOverrides as Record<string, string>)[key] = value;
        }
      }
    }

    return {
      preset: payload.preset,
      currentMode: 'light',
      styles: { ...baseline, ...safeOverrides },
    };
  } catch {
    return null;
  }
}

/** Build a full shareable URL from the current state. */
export function buildShareUrl(state: ThemeEditorState): string {
  const payload = encodeShareState(state);
  const base =
    typeof window !== 'undefined'
      ? `${window.location.origin}/editor`
      : 'https://tweakmizu.mizu.design/editor';
  return `${base}?theme=${payload}`;
}

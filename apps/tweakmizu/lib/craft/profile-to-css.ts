import type { DesignLanguageProfile } from './profile';

/**
 * profile-to-css — deterministically translate a DesignLanguageProfile into
 * a map of mizu CSS variables. The preview canvas applies these to its root
 * element; the exporter serializes them to a CSS file.
 *
 * This is NOT a 1-to-1 knob mapping. Some knobs combine (hue + chroma →
 * action colors). Some knobs pick between preset scales (radius token set).
 * Each cluster has a dedicated section below.
 */

export type CssVarMap = Record<string, string>;

export function profileToCss(profile: DesignLanguageProfile): CssVarMap {
  return {
    ...foundationVars(profile.foundation),
    ...shapeVars(profile.shape),
    ...densityVars(profile.density),
    ...typeVars(profile.type),
    ...motionVars(profile.motion),
    ...depthVars(profile.depth),
    ...focusVars(profile.focus),
  };
}

// -- Foundation ------------------------------------------------------------

function foundationVars(f: DesignLanguageProfile['foundation']): CssVarMap {
  const { brandHue, chroma, contrast } = f;

  // Saturation percentages per chroma tier.
  const sat = chroma === 'muted' ? 24 : chroma === 'balanced' ? 60 : 84;

  // Contrast tier drives the default text + surface lightness.
  const surfaceL = contrast === 'editorial-high' ? 100 : 99;
  const textL = contrast === 'editorial-high' ? 6 : contrast === 'aaa-conservative' ? 10 : 14;
  const mutedL = contrast === 'editorial-high' ? 30 : contrast === 'aaa-conservative' ? 36 : 42;

  // Action primary: brand hue + chroma saturation + mid lightness.
  const actionL = 48;
  const actionHoverL = 42;
  const actionActiveL = 36;

  return {
    '--mizu-brand-hue': `${brandHue}`,
    '--mizu-action-primary-default': `hsl(${brandHue} ${sat}% ${actionL}%)`,
    '--mizu-action-primary-hover': `hsl(${brandHue} ${sat}% ${actionHoverL}%)`,
    '--mizu-action-primary-active': `hsl(${brandHue} ${sat}% ${actionActiveL}%)`,
    '--mizu-surface-default': `hsl(${brandHue} 12% ${surfaceL}%)`,
    '--mizu-surface-secondary': `hsl(${brandHue} 12% 96%)`,
    '--mizu-text-primary': `hsl(${brandHue} 18% ${textL}%)`,
    '--mizu-text-secondary': `hsl(${brandHue} 12% ${mutedL}%)`,
    '--mizu-text-tertiary': `hsl(${brandHue} 10% ${mutedL + 18}%)`,
    '--mizu-text-disabled': `hsl(${brandHue} 8% ${mutedL + 30}%)`,
    '--mizu-border-default': `hsl(${brandHue} 14% 90%)`,
    '--mizu-border-strong': `hsl(${brandHue} 14% 78%)`,
    '--mizu-border-subtle': `hsl(${brandHue} 14% 94%)`,
    '--mizu-feedback-success-default': `hsl(148 ${Math.min(sat + 10, 80)}% 38%)`,
    '--mizu-feedback-warning-default': `hsl(36 ${Math.min(sat + 20, 92)}% 48%)`,
    '--mizu-feedback-danger-default': `hsl(0 ${Math.min(sat + 14, 78)}% 48%)`,
  };
}

// -- Shape -----------------------------------------------------------------

function shapeVars(s: DesignLanguageProfile['shape']): CssVarMap {
  const radiusScale = {
    sharp: { sm: '0px', md: '2px', lg: '4px', xl: '6px' },
    soft: { sm: '4px', md: '6px', lg: '8px', xl: '12px' },
    pillowy: { sm: '8px', md: '12px', lg: '16px', xl: '24px' },
    pill: { sm: '999px', md: '999px', lg: '999px', xl: '999px' },
  }[s.radius];

  const borderWidth = {
    none: '0',
    thin: '1px',
    medium: '1.5px',
    thick: '2px',
  }[s.borderWeight];

  return {
    '--mizu-radius-sm': radiusScale.sm,
    '--mizu-radius-md': radiusScale.md,
    '--mizu-radius-lg': radiusScale.lg,
    '--mizu-radius-xl': radiusScale.xl,
    '--mizu-border-width-default': borderWidth,
  };
}

// -- Density ---------------------------------------------------------------

function densityVars(d: DesignLanguageProfile['density']): CssVarMap {
  const base = Number(d.spacingBase);
  const multiplier =
    d.density === 'data-dense'
      ? 0.75
      : d.density === 'compact'
        ? 0.875
        : d.density === 'comfortable'
          ? 1.125
          : 1;

  const step = (n: number) => `${((base * n) / 16) * multiplier}rem`;

  return {
    '--mizu-spacing-1': step(1),
    '--mizu-spacing-2': step(2),
    '--mizu-spacing-3': step(3),
    '--mizu-spacing-4': step(4),
    '--mizu-spacing-5': step(5),
    '--mizu-spacing-6': step(6),
    '--mizu-spacing-8': step(8),
    '--mizu-spacing-10': step(10),
  };
}

// -- Type ------------------------------------------------------------------

function typeVars(t: DesignLanguageProfile['type']): CssVarMap {
  const ratio = {
    'minor-second': 1.067,
    'major-second': 1.125,
    'minor-third': 1.2,
    'major-third': 1.25,
    'perfect-fourth': 1.333,
  }[t.scaleRatio];

  const baseRem = 1;
  const step = (n: number) => `${(baseRem * ratio ** n).toFixed(3)}rem`;

  return {
    '--mizu-font-family-sans': `'${t.sansFamily}', ui-sans-serif, system-ui, -apple-system, sans-serif`,
    '--mizu-font-family-mono': `'${t.monoFamily}', ui-monospace, SFMono-Regular, monospace`,
    '--mizu-font-size-xs': step(-2),
    '--mizu-font-size-sm': step(-1),
    '--mizu-font-size-base': step(0),
    '--mizu-font-size-md': step(1),
    '--mizu-font-size-lg': step(2),
    '--mizu-font-size-xl': step(3),
  };
}

// -- Motion ----------------------------------------------------------------

function motionVars(m: DesignLanguageProfile['motion']): CssVarMap {
  const easingCurve = {
    calm: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    balanced: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.5, 1.5, 0.6, 1)',
    snappy: 'cubic-bezier(0.2, 0, 0, 1)',
  }[m.easing];

  const durations = {
    tight: { fast: '80ms', normal: '140ms', slow: '220ms' },
    medium: { fast: '120ms', normal: '200ms', slow: '320ms' },
    relaxed: { fast: '160ms', normal: '280ms', slow: '440ms' },
  }[m.duration];

  return {
    '--mizu-easing-out': easingCurve,
    '--mizu-duration-fast': durations.fast,
    '--mizu-duration-normal': durations.normal,
    '--mizu-duration-slow': durations.slow,
  };
}

// -- Depth -----------------------------------------------------------------

function depthVars(d: DesignLanguageProfile['depth']): CssVarMap {
  if (d.recipe === 'flat' || d.shadowFlavor === 'none') {
    return {
      '--mizu-shadow-sm': 'none',
      '--mizu-shadow-md': 'none',
      '--mizu-shadow-lg': 'none',
    };
  }
  const flavor = {
    'sharp-near': {
      sm: '0 1px 0 rgb(0 0 0 / 0.06)',
      md: '0 2px 0 rgb(0 0 0 / 0.08)',
      lg: '0 4px 0 rgb(0 0 0 / 0.1)',
    },
    'soft-diffuse': {
      sm: '0 1px 2px rgb(0 0 0 / 0.06)',
      md: '0 4px 10px -4px rgb(0 0 0 / 0.1)',
      lg: '0 12px 28px -10px rgb(0 0 0 / 0.14)',
    },
    tinted: {
      sm: '0 1px 3px rgb(14 30 60 / 0.12)',
      md: '0 6px 16px -6px rgb(14 30 60 / 0.18)',
      lg: '0 20px 40px -16px rgb(14 30 60 / 0.22)',
    },
  }[d.shadowFlavor];

  return {
    '--mizu-shadow-sm': flavor.sm,
    '--mizu-shadow-md': flavor.md,
    '--mizu-shadow-lg': flavor.lg,
  };
}

// -- Focus -----------------------------------------------------------------

function focusVars(f: DesignLanguageProfile['focus']): CssVarMap {
  return {
    '--mizu-focus-width': f.width,
    '--mizu-focus-color':
      f.color === 'high-contrast' ? '#facc15' : 'var(--mizu-action-primary-default)',
  };
}

/**
 * Serialize a CssVarMap as a CSS rule body. Used by the exporter and by
 * server-side style generation.
 */
export function cssVarsToString(vars: CssVarMap, selector = ':root'): string {
  const body = Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');
  return `${selector} {\n${body}\n}`;
}

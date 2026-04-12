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

export function profileToCss(profile: DesignLanguageProfile, dark = false): CssVarMap {
  return {
    ...foundationVars(profile.foundation, dark),
    ...shapeVars(profile.shape),
    ...densityVars(profile.density),
    ...typeVars(profile.type),
    ...motionVars(profile.motion),
    ...depthVars(profile.depth),
    ...focusVars(profile.focus),
    ...iconVars(profile.iconography),
  };
}

// -- Foundation ------------------------------------------------------------

function foundationVars(f: DesignLanguageProfile['foundation'], dark = false): CssVarMap {
  const { brandHue, chroma, contrast, colorMood, contrastLevel, darkMode, extendedColors } = f;

  // Saturation percentages per chroma tier.
  const baseSat = chroma === 'muted' ? 24 : chroma === 'balanced' ? 60 : 84;

  // Color mood modifies saturation and secondary/tertiary hue offsets.
  const mood = colorMood ?? 'tonal';
  const moodSatMul =
    mood === 'vibrant'
      ? 1.3
      : mood === 'muted'
        ? 0.6
        : mood === 'monochrome'
          ? 0.3
          : mood === 'expressive'
            ? 1.15
            : 1;
  const sat = Math.min(Math.round(baseSat * moodSatMul), 100);

  // Secondary hue: tonal stays close, expressive goes wide, monochrome is same.
  const secondaryOffset =
    mood === 'expressive' ? 30 : mood === 'monochrome' ? 0 : mood === 'vibrant' ? 20 : 15;
  const tertiaryOffset =
    mood === 'expressive' ? 60 : mood === 'monochrome' ? 0 : mood === 'vibrant' ? 45 : 30;
  const secondaryHue = (brandHue + secondaryOffset) % 360;
  const tertiaryHue = (brandHue + tertiaryOffset) % 360;

  // Secondary/tertiary saturation is more muted than primary.
  const secondarySat = Math.round(sat * 0.6);
  const tertiarySat = Math.round(sat * 0.7);

  // Contrast tier drives ALL lightness values — text, surface, borders, actions.
  // The three tiers produce visibly different results.
  const cl = contrastLevel ?? 0;
  const contrastBoost = cl * 14;

  const tier = contrast === 'editorial-high' ? 2 : contrast === 'aaa-conservative' ? 1 : 0;

  // Dark mode philosophy shifts base darkness:
  // dim = lighter dark (GitHub dim), parallel = standard, inverted = deeper
  const dimShift = dark ? (darkMode === 'dim' ? 8 : darkMode === 'inverted' ? -4 : 0) : 0;

  // Dark mode: flip lightness.
  const surfaceL = dark ? [12, 8, 4][tier] + dimShift : [99, 100, 100][tier];
  const surfaceSecondaryL = dark ? [16, 12, 8][tier] + dimShift : [96, 97, 98][tier];
  const surfaceTertiaryL = dark ? [20, 16, 12][tier] + dimShift : [93, 95, 96][tier];

  const textL = dark
    ? Math.min(98, [88, 94, 98][tier] + contrastBoost)
    : Math.max(2, [18, 10, 4][tier] - contrastBoost);
  const mutedL = dark
    ? Math.min(86, [60, 70, 78][tier] + contrastBoost)
    : Math.max(14, [46, 36, 26][tier] - contrastBoost);

  const borderL = dark ? [26, 22, 18][tier] + dimShift : [88, 84, 78][tier];
  const borderStrongL = dark ? [36, 32, 28][tier] + dimShift : [76, 70, 62][tier];
  const borderSubtleL = dark ? [20, 16, 12][tier] + dimShift : [92, 90, 86][tier];

  // Action primary: adjusted per tier for proper contrast against surfaces.
  const actionL = dark ? [60, 64, 70][tier] : [50, 44, 38][tier];
  const actionHoverL = dark ? [66, 70, 76][tier] : [44, 38, 32][tier];
  const actionActiveL = dark ? [54, 58, 64][tier] : [38, 32, 26][tier];

  const vars: CssVarMap = {
    '--mizu-brand-hue': `${brandHue}`,
    '--mizu-action-primary-default': `hsl(${brandHue} ${sat}% ${actionL}%)`,
    '--mizu-action-primary-hover': `hsl(${brandHue} ${sat}% ${actionHoverL}%)`,
    '--mizu-action-primary-active': `hsl(${brandHue} ${sat}% ${actionActiveL}%)`,
    '--mizu-action-secondary-default': `hsl(${secondaryHue} ${secondarySat}% ${actionL + 4}%)`,
    '--mizu-action-secondary-hover': `hsl(${secondaryHue} ${secondarySat}% ${actionHoverL + 2}%)`,
    '--mizu-action-tertiary-default': `hsl(${tertiaryHue} ${tertiarySat}% ${actionL + 2}%)`,
    '--mizu-surface-default': `hsl(${brandHue} ${Math.round(sat * 0.2)}% ${surfaceL}%)`,
    '--mizu-surface-secondary': `hsl(${brandHue} ${Math.round(sat * 0.2)}% ${surfaceSecondaryL}%)`,
    '--mizu-surface-tertiary': `hsl(${brandHue} ${Math.round(sat * 0.15)}% ${surfaceTertiaryL}%)`,
    '--mizu-text-primary': `hsl(${brandHue} ${Math.round(sat * 0.3)}% ${textL}%)`,
    '--mizu-text-secondary': `hsl(${brandHue} ${Math.round(sat * 0.2)}% ${mutedL}%)`,
    '--mizu-text-tertiary': `hsl(${brandHue} ${Math.round(sat * 0.16)}% ${mutedL + (dark ? -12 : 18)}%)`,
    '--mizu-text-disabled': `hsl(${brandHue} ${Math.round(sat * 0.12)}% ${mutedL + (dark ? -20 : 30)}%)`,
    '--mizu-border-default': `hsl(${brandHue} ${Math.round(sat * 0.24)}% ${borderL}%)`,
    '--mizu-border-strong': `hsl(${brandHue} ${Math.round(sat * 0.24)}% ${borderStrongL}%)`,
    '--mizu-border-subtle': `hsl(${brandHue} ${Math.round(sat * 0.24)}% ${borderSubtleL}%)`,
    '--mizu-feedback-success-default': `hsl(148 ${Math.min(sat + 10, 80)}% 38%)`,
    '--mizu-feedback-warning-default': `hsl(36 ${Math.min(sat + 20, 92)}% 48%)`,
    '--mizu-feedback-danger-default': `hsl(0 ${Math.min(sat + 14, 78)}% 48%)`,
  };

  // Extended colors with optional harmonization.
  if (extendedColors?.length) {
    for (const ec of extendedColors) {
      const r = parseInt(ec.hex.slice(1, 3), 16) / 255;
      const g = parseInt(ec.hex.slice(3, 5), 16) / 255;
      const b = parseInt(ec.hex.slice(5, 7), 16) / 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const d = max - min;
      let h = 0;
      if (d > 0) {
        if (max === r) h = ((g - b) / d) % 6;
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
        h = Math.round(h * 60);
        if (h < 0) h += 360;
      }
      const ecSat = max === 0 ? 0 : Math.round(((max - min) / max) * 100);
      const ecL = Math.round(((max + min) / 2) * 100);

      // Harmonize: shift hue up to 15° toward brandHue.
      let finalH = h;
      if (ec.harmonize) {
        const diff = ((brandHue - h + 540) % 360) - 180;
        const rotation = Math.min(Math.abs(diff) * 0.5, 15) * Math.sign(diff);
        finalH = (h + rotation + 360) % 360;
      }

      const slug = ec.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      vars[`--mizu-color-${slug}`] = `hsl(${finalH} ${ecSat}% ${ecL}%)`;
      vars[`--mizu-color-${slug}-light`] = `hsl(${finalH} ${Math.round(ecSat * 0.4)}% 94%)`;
      vars[`--mizu-color-${slug}-dark`] = `hsl(${finalH} ${ecSat}% ${Math.max(ecL - 20, 15)}%)`;
    }
  }

  return vars;
}

// -- Shape -----------------------------------------------------------------

function shapeVars(s: DesignLanguageProfile['shape']): CssVarMap {
  const base = {
    sharp: { sm: 0, md: 2, lg: 4, xl: 6 },
    soft: { sm: 4, md: 6, lg: 8, xl: 12 },
    pillowy: { sm: 8, md: 12, lg: 16, xl: 24 },
    pill: { sm: 999, md: 999, lg: 999, xl: 999 },
  }[s.radius];

  // radiusUniform=true: same radius everywhere
  // radiusUniform=false: sm stays small, larger elements get progressively bigger radii
  const scale = s.radiusUniform
    ? base
    : {
        sm: base.sm,
        md: Math.round(base.md * 1.2),
        lg: Math.round(base.lg * 1.5),
        xl: Math.round(base.xl * 1.8),
      };

  const px = (v: number) => (v >= 999 ? '999px' : `${v}px`);

  const borderWidth = {
    none: '0',
    thin: '1px',
    medium: '1.5px',
    thick: '2px',
  }[s.borderWeight];

  // chrome: directly affects shadow and border appearance on cards/sections.
  // Instead of abstract tokens, override the shadow/border vars the preview uses.
  const chromeVars: CssVarMap =
    s.chrome === 'flat'
      ? {
          '--mizu-shadow-sm': 'none',
          '--mizu-shadow-md': 'none',
          '--mizu-shadow-lg': 'none',
          '--mizu-border-width-default': borderWidth === '0' ? '1px' : borderWidth,
        }
      : s.chrome === 'material'
        ? {
            '--mizu-shadow-sm': '0 1px 3px rgb(0 0 0 / 0.1), 0 1px 2px rgb(0 0 0 / 0.06)',
            '--mizu-shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            '--mizu-shadow-lg':
              '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
          }
        : s.chrome === 'paper'
          ? {
              '--mizu-shadow-sm': 'none',
              '--mizu-shadow-md': 'none',
              '--mizu-shadow-lg': 'none',
              '--mizu-surface-secondary': 'hsl(var(--mizu-brand-hue, 220) 8% 94%)',
              '--mizu-surface-tertiary': 'hsl(var(--mizu-brand-hue, 220) 6% 91%)',
            }
          : {}; // layered = default, don't override depth vars

  return {
    '--mizu-radius-sm': px(scale.sm),
    '--mizu-radius-md': px(scale.md),
    '--mizu-radius-lg': px(scale.lg),
    '--mizu-radius-xl': px(scale.xl),
    '--mizu-border-width-default': borderWidth,
    ...chromeVars,
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

  // airyType: adds extra vertical spacing around text blocks
  const airyMul = d.airyType ? 1.35 : 1;
  const textStep = (n: number) => `${(((base * n) / 16) * multiplier * airyMul).toFixed(4)}rem`;

  return {
    '--mizu-spacing-1': step(1),
    '--mizu-spacing-2': step(2),
    '--mizu-spacing-3': step(3),
    '--mizu-spacing-4': step(4),
    '--mizu-spacing-5': step(5),
    '--mizu-spacing-6': step(6),
    '--mizu-spacing-8': step(8),
    '--mizu-spacing-10': step(10),
    '--mizu-text-spacing-block': textStep(4),
    '--mizu-text-spacing-heading': textStep(6),
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

  // weights: generate weight token values
  const weightMap = {
    duo: { regular: '400', medium: '400', semibold: '700', bold: '700' },
    trio: { regular: '400', medium: '500', semibold: '600', bold: '600' },
    full: { regular: '300', medium: '400', semibold: '600', bold: '900' },
  }[t.weights];

  // trackingTight: tighten heading letter-spacing
  const headingTracking = t.trackingTight ? '-0.025em' : '-0.01em';
  const bodyTracking = t.trackingTight ? '-0.005em' : '0';

  return {
    '--mizu-font-family-sans': `'${t.sansFamily}', ui-sans-serif, system-ui, -apple-system, sans-serif`,
    '--mizu-font-family-mono': `'${t.monoFamily}', ui-monospace, SFMono-Regular, monospace`,
    '--mizu-font-size-xs': step(-2),
    '--mizu-font-size-sm': step(-1),
    '--mizu-font-size-base': step(0),
    '--mizu-font-size-md': step(1),
    '--mizu-font-size-lg': step(2),
    '--mizu-font-size-xl': step(3),
    '--mizu-font-weight-regular': weightMap.regular,
    '--mizu-font-weight-medium': weightMap.medium,
    '--mizu-font-weight-semibold': weightMap.semibold,
    '--mizu-font-weight-bold': weightMap.bold,
    '--mizu-tracking-heading': headingTracking,
    '--mizu-tracking-body': bodyTracking,
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

  // reducedMotion: output a flag the preview CSS can use
  const motionScale = m.reducedMotion === 'kill-all' ? '0' : '1';

  return {
    '--mizu-easing-out': easingCurve,
    '--mizu-duration-fast': durations.fast,
    '--mizu-duration-normal': durations.normal,
    '--mizu-duration-slow': durations.slow,
    '--mizu-motion-scale': motionScale,
  };
}

// -- Depth -----------------------------------------------------------------

function depthVars(d: DesignLanguageProfile['depth']): CssVarMap {
  // recipe=borders: use border-only separation, no shadows
  if (d.recipe === 'borders') {
    return {
      '--mizu-shadow-sm': 'none',
      '--mizu-shadow-md': 'none',
      '--mizu-shadow-lg': 'none',
      '--mizu-depth-border':
        'var(--mizu-border-width-default, 1px) solid var(--mizu-border-default)',
    };
  }

  // recipe=surfaces: use background shifts instead of shadows
  if (d.recipe === 'surfaces') {
    return {
      '--mizu-shadow-sm': 'none',
      '--mizu-shadow-md': 'none',
      '--mizu-shadow-lg': 'none',
      '--mizu-depth-border': 'none',
    };
  }

  if (d.recipe === 'flat' || d.shadowFlavor === 'none') {
    return {
      '--mizu-shadow-sm': 'none',
      '--mizu-shadow-md': 'none',
      '--mizu-shadow-lg': 'none',
      '--mizu-depth-border': 'none',
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
    '--mizu-depth-border': 'none',
  };
}

// -- Focus -----------------------------------------------------------------

function focusVars(f: DesignLanguageProfile['focus']): CssVarMap {
  const color =
    f.color === 'high-contrast'
      ? '#facc15'
      : f.color === 'dedicated'
        ? '#6366f1'
        : 'var(--mizu-action-primary-default)';

  // style: how focus is rendered
  const focusStyle =
    f.style === 'outline'
      ? `${f.width} solid ${color}`
      : f.style === 'shadow'
        ? `0 0 0 ${f.width} ${color}`
        : 'none';

  return {
    '--mizu-focus-width': f.width,
    '--mizu-focus-color': color,
    '--mizu-focus-outline': f.style === 'outline' ? focusStyle : 'none',
    '--mizu-focus-shadow': f.style === 'shadow' ? focusStyle : 'none',
    '--mizu-focus-bg':
      f.style === 'bg-shift' ? `color-mix(in srgb, ${color} 12%, transparent)` : 'transparent',
  };
}

// -- Iconography -----------------------------------------------------------

function iconVars(i: DesignLanguageProfile['iconography']): CssVarMap {
  const sizes = {
    '16-20-24': { sm: '16px', md: '20px', lg: '24px' },
    '14-18-22': { sm: '14px', md: '18px', lg: '22px' },
  }[i.sizeScale];

  return {
    '--mizu-icon-size-sm': sizes.sm,
    '--mizu-icon-size-md': sizes.md,
    '--mizu-icon-size-lg': sizes.lg,
    '--mizu-icon-stroke': i.strokeWeight,
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

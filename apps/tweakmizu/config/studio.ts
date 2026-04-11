import type { StudioThemeExtensions } from '@/types/studio';

export const defaultStudioExtensions: StudioThemeExtensions = {
  layout: {
    stack: { gap: '1rem', align: 'stretch' },
    cluster: { gap: '0.75rem', align: 'center', justify: 'start' },
    switcher: { threshold: '32rem', gap: '1rem' },
    center: { maxWidth: '64rem', gutter: '1rem' },
    sidebar: { sideMin: '14rem', contentMin: '50%', gap: '1rem' },
    cover: { minHeight: '100vh', contentPad: '1.5rem' },
    grid: { minItem: '16rem', gap: '1rem' },
    frame: { ratio: '16/9' },
    reel: { itemWidth: '16rem', gap: '1rem' },
    imposter: { offset: '0' },
  },
  density: {
    mode: 'default',
    spacingMultiplier: 1,
    typographyShift: 0,
    componentPadding: 'standard',
  },
  motion: {
    duration: {
      instant: '0ms',
      fast: '120ms',
      moderate: '200ms',
      slow: '320ms',
      slower: '480ms',
    },
    easing: {
      standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
      decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
      accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
      emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
    },
    reducedMotion: { duration: '0ms', easing: 'linear' },
  },
  a11y: {
    minTouchTarget: '44px',
    contrastLevel: 'AA',
    reducedMotionDefault: 'respect',
  },
  components: {
    button: {
      variants: {
        primary: { enabled: true },
        secondary: { enabled: true },
        ghost: { enabled: true },
        destructive: { enabled: true },
      },
    },
  },
  catalog: {
    selectedPatternIds: [],
  },
};

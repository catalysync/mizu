import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack, Inline, Heading } from '@aspect/react';

const SAMPLE = 'The quick brown fox jumps over the lazy dog';

const sizes: { token: string; label: string; value: string }[] = [
  { token: '--mizu-font-size-xs', label: 'xs', value: '0.75rem' },
  { token: '--mizu-font-size-sm', label: 'sm', value: '0.875rem' },
  { token: '--mizu-font-size-base', label: 'base', value: '1rem' },
  { token: '--mizu-font-size-lg', label: 'lg', value: '1.125rem' },
  { token: '--mizu-font-size-xl', label: 'xl', value: '1.25rem' },
  { token: '--mizu-font-size-2xl', label: '2xl', value: '1.5rem' },
  { token: '--mizu-font-size-3xl', label: '3xl', value: '1.875rem' },
  { token: '--mizu-font-size-4xl', label: '4xl', value: '2.25rem' },
];

const weights: { token: string; label: string; value: number }[] = [
  { token: '--mizu-font-weight-regular', label: 'regular', value: 400 },
  { token: '--mizu-font-weight-medium', label: 'medium', value: 500 },
  { token: '--mizu-font-weight-semibold', label: 'semibold', value: 600 },
  { token: '--mizu-font-weight-bold', label: 'bold', value: 700 },
];

const lineHeights: { token: string; label: string; value: string }[] = [
  { token: '--mizu-font-line-height-tight', label: 'tight', value: '1.25' },
  { token: '--mizu-font-line-height-normal', label: 'normal', value: '1.5' },
  { token: '--mizu-font-line-height-loose', label: 'loose', value: '1.75' },
];

const families: { token: string; label: string }[] = [
  { token: '--mizu-font-family-sans', label: 'sans' },
  { token: '--mizu-font-family-mono', label: 'mono' },
];

const utilities: string[] = [
  'mizu-body',
  'mizu-body--sm',
  'mizu-body--lg',
  'mizu-caption',
  'mizu-label',
];

const meta = {
  title: 'Foundations/Typography',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {
  render: () => (
    <Stack gap="2rem">
      <Stack gap="0.75rem">
        <Heading level={2} size="md" className="story-section-title">
          Type scale
        </Heading>
        <Stack gap="0.5rem">
          {sizes.map((s) => (
            <Inline key={s.token} gap="1rem" align="baseline">
              <code className="mizu-body--sm" style={{ width: '4rem' }}>
                {s.label}
              </code>
              <code className="mizu-body--sm" style={{ width: '3.5rem', opacity: 0.7 }}>
                {s.value}
              </code>
              <span style={{ fontSize: `var(${s.token})` }}>{SAMPLE}</span>
            </Inline>
          ))}
        </Stack>
      </Stack>

      <Stack gap="0.75rem">
        <Heading level={2} size="md" className="story-section-title">
          Weights
        </Heading>
        <Stack gap="0.5rem">
          {weights.map((w) => (
            <Inline key={w.token} gap="1rem" align="baseline">
              <code className="mizu-body--sm" style={{ width: '4rem' }}>
                {w.label}
              </code>
              <code className="mizu-body--sm" style={{ width: '3.5rem', opacity: 0.7 }}>
                {w.value}
              </code>
              <span style={{ fontWeight: `var(${w.token})` }}>{SAMPLE}</span>
            </Inline>
          ))}
        </Stack>
      </Stack>

      <Stack gap="0.75rem">
        <Heading level={2} size="md" className="story-section-title">
          Line heights
        </Heading>
        <Stack gap="0.5rem">
          {lineHeights.map((l) => (
            <Inline key={l.token} gap="1rem" align="start">
              <code className="mizu-body--sm" style={{ width: '4rem', paddingTop: '0.125rem' }}>
                {l.label}
              </code>
              <code
                className="mizu-body--sm"
                style={{ width: '3.5rem', opacity: 0.7, paddingTop: '0.125rem' }}
              >
                {l.value}
              </code>
              <span style={{ lineHeight: `var(${l.token})`, maxWidth: '32rem' }}>
                {SAMPLE} — the same sentence with {l.label} line height to show the vertical rhythm
                across multiple lines.
              </span>
            </Inline>
          ))}
        </Stack>
      </Stack>

      <Stack gap="0.75rem">
        <Heading level={2} size="md" className="story-section-title">
          Families
        </Heading>
        <Stack gap="0.5rem">
          {families.map((f) => (
            <Inline key={f.token} gap="1rem" align="baseline">
              <code className="mizu-body--sm" style={{ width: '4rem' }}>
                {f.label}
              </code>
              <span style={{ fontFamily: `var(${f.token})`, fontSize: 'var(--mizu-font-size-lg)' }}>
                {SAMPLE}
              </span>
            </Inline>
          ))}
        </Stack>
      </Stack>

      <Stack gap="0.75rem">
        <Heading level={2} size="md" className="story-section-title">
          Utility classes
        </Heading>
        <Stack gap="0.5rem">
          {utilities.map((cls) => (
            <Inline key={cls} gap="1rem" align="baseline">
              <code className="mizu-body--sm" style={{ width: '10rem' }}>
                .{cls}
              </code>
              <span className={cls}>{SAMPLE}</span>
            </Inline>
          ))}
        </Stack>
      </Stack>
    </Stack>
  ),
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack, Inline, Heading } from '@aspect/react';
import { tokensByPrefix, labelFromPrefix } from './tokens-helper';

const SAMPLE = 'The quick brown fox jumps over the lazy dog';

const sizes = tokensByPrefix(/^FontSize/);
const weights = tokensByPrefix(/^FontWeight/);
const lineHeights = tokensByPrefix(/^FontLineHeight/);
const families = tokensByPrefix(/^FontFamily/);

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
            <Inline key={s.name} gap="1rem" align="baseline">
              <code className="mizu-body--sm" style={{ width: '4rem' }}>
                {labelFromPrefix(s.name, 'FontSize')}
              </code>
              <code className="mizu-body--sm" style={{ width: '3.5rem', opacity: 0.7 }}>
                {s.value}
              </code>
              <span style={{ fontSize: `var(${s.cssVar})` }}>{SAMPLE}</span>
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
            <Inline key={w.name} gap="1rem" align="baseline">
              <code className="mizu-body--sm" style={{ width: '4rem' }}>
                {labelFromPrefix(w.name, 'FontWeight')}
              </code>
              <code className="mizu-body--sm" style={{ width: '3.5rem', opacity: 0.7 }}>
                {w.value}
              </code>
              <span style={{ fontWeight: `var(${w.cssVar})` }}>{SAMPLE}</span>
            </Inline>
          ))}
        </Stack>
      </Stack>

      <Stack gap="0.75rem">
        <Heading level={2} size="md" className="story-section-title">
          Line heights
        </Heading>
        <Stack gap="0.5rem">
          {lineHeights.map((l) => {
            const label = labelFromPrefix(l.name, 'FontLineHeight');
            return (
              <Inline key={l.name} gap="1rem" align="start">
                <code className="mizu-body--sm" style={{ width: '4rem', paddingTop: '0.125rem' }}>
                  {label}
                </code>
                <code
                  className="mizu-body--sm"
                  style={{ width: '3.5rem', opacity: 0.7, paddingTop: '0.125rem' }}
                >
                  {l.value}
                </code>
                <span style={{ lineHeight: `var(${l.cssVar})`, maxWidth: '32rem' }}>
                  {SAMPLE} — the same sentence with {label} line height to show the vertical rhythm
                  across multiple lines.
                </span>
              </Inline>
            );
          })}
        </Stack>
      </Stack>

      <Stack gap="0.75rem">
        <Heading level={2} size="md" className="story-section-title">
          Families
        </Heading>
        <Stack gap="0.5rem">
          {families.map((f) => (
            <Inline key={f.name} gap="1rem" align="baseline">
              <code className="mizu-body--sm" style={{ width: '4rem' }}>
                {labelFromPrefix(f.name, 'FontFamily')}
              </code>
              <span
                style={{ fontFamily: `var(${f.cssVar})`, fontSize: 'var(--mizu-font-size-lg)' }}
              >
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

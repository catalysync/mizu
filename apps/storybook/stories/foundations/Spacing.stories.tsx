import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack, Inline, Heading } from '@aspect/react';

const spacings: { token: string; step: string; value: string }[] = [
  { token: '--mizu-spacing-0', step: '0', value: '0' },
  { token: '--mizu-spacing-1', step: '1', value: '0.25rem' },
  { token: '--mizu-spacing-2', step: '2', value: '0.5rem' },
  { token: '--mizu-spacing-3', step: '3', value: '0.75rem' },
  { token: '--mizu-spacing-4', step: '4', value: '1rem' },
  { token: '--mizu-spacing-5', step: '5', value: '1.25rem' },
  { token: '--mizu-spacing-6', step: '6', value: '1.5rem' },
  { token: '--mizu-spacing-8', step: '8', value: '2rem' },
  { token: '--mizu-spacing-10', step: '10', value: '2.5rem' },
  { token: '--mizu-spacing-12', step: '12', value: '3rem' },
  { token: '--mizu-spacing-16', step: '16', value: '4rem' },
  { token: '--mizu-spacing-20', step: '20', value: '5rem' },
  { token: '--mizu-spacing-24', step: '24', value: '6rem' },
];

const radii: { token: string; step: string; value: string }[] = [
  { token: '--mizu-radius-none', step: 'none', value: '0' },
  { token: '--mizu-radius-sm', step: 'sm', value: '0.25rem' },
  { token: '--mizu-radius-md', step: 'md', value: '0.375rem' },
  { token: '--mizu-radius-lg', step: 'lg', value: '0.5rem' },
  { token: '--mizu-radius-xl', step: 'xl', value: '0.75rem' },
  { token: '--mizu-radius-2xl', step: '2xl', value: '1rem' },
  { token: '--mizu-radius-full', step: 'full', value: '9999px' },
];

const meta = {
  title: 'Foundations/Spacing',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {
  render: () => (
    <Stack gap="2rem">
      <Stack gap="0.75rem">
        <Heading level={2} size="md" className="story-section-title">
          Spacing scale
        </Heading>
        <Stack gap="0.5rem">
          {spacings.map((s) => (
            <Inline key={s.token} gap="1rem" align="center">
              <code className="mizu-body--sm" style={{ width: '3rem' }}>
                {s.step}
              </code>
              <code className="mizu-body--sm" style={{ width: '4rem', opacity: 0.7 }}>
                {s.value}
              </code>
              <div
                aria-label={`Spacing ${s.step}`}
                style={{
                  height: '1rem',
                  width: `var(${s.token})`,
                  background: 'var(--mizu-action-primary-default)',
                  borderRadius: 'var(--mizu-radius-sm)',
                }}
              />
            </Inline>
          ))}
        </Stack>
      </Stack>

      <Stack gap="0.75rem">
        <Heading level={2} size="md" className="story-section-title">
          Radius scale
        </Heading>
        <Inline gap="1.5rem" wrap>
          {radii.map((r) => (
            <Stack key={r.token} gap="0.5rem" align="center">
              <div
                aria-label={`Radius ${r.step}`}
                style={{
                  width: '4.5rem',
                  height: '4.5rem',
                  background: 'var(--mizu-surface-secondary)',
                  border: '1px solid var(--mizu-border-default)',
                  borderRadius: `var(${r.token})`,
                }}
              />
              <Stack gap="0.125rem" align="center">
                <code className="mizu-body--sm">{r.step}</code>
                <code className="mizu-body--sm" style={{ opacity: 0.7 }}>
                  {r.value}
                </code>
              </Stack>
            </Stack>
          ))}
        </Inline>
      </Stack>
    </Stack>
  ),
};

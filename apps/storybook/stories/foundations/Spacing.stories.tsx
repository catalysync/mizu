import { Heading, Inline, Stack } from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { labelFromPrefix, tokensByPrefix } from './tokens-helper';

const spacings = tokensByPrefix(/^Spacing\d+$/);
const radii = tokensByPrefix(/^Radius/);

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
            <Inline key={s.name} gap="1rem" align="center">
              <code className="mizu-body--sm" style={{ width: '3rem' }}>
                {labelFromPrefix(s.name, 'Spacing')}
              </code>
              <code className="mizu-body--sm" style={{ width: '4rem', opacity: 0.7 }}>
                {s.value}
              </code>
              <div
                aria-label={`Spacing ${s.name}`}
                style={{
                  height: '1rem',
                  width: `var(${s.cssVar})`,
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
          {radii.map((r) => {
            const label = labelFromPrefix(r.name, 'Radius');
            return (
              <Stack key={r.name} gap="0.5rem" align="center">
                <div
                  aria-label={`Radius ${label}`}
                  style={{
                    width: '4.5rem',
                    height: '4.5rem',
                    background: 'var(--mizu-surface-secondary)',
                    border: '1px solid var(--mizu-border-default)',
                    borderRadius: `var(${r.cssVar})`,
                  }}
                />
                <Stack gap="0.125rem" align="center">
                  <code className="mizu-body--sm">{label}</code>
                  <code className="mizu-body--sm" style={{ opacity: 0.7 }}>
                    {r.value}
                  </code>
                </Stack>
              </Stack>
            );
          })}
        </Inline>
      </Stack>
    </Stack>
  ),
};

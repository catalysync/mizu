import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack, Inline, Heading } from '@aspect/react';

const groups: { title: string; tokens: string[] }[] = [
  {
    title: 'Surface',
    tokens: ['--mizu-surface-default', '--mizu-surface-secondary', '--mizu-surface-inverse'],
  },
  {
    title: 'Text',
    tokens: [
      '--mizu-text-primary',
      '--mizu-text-secondary',
      '--mizu-text-inverse',
      '--mizu-text-disabled',
    ],
  },
  {
    title: 'Border',
    tokens: ['--mizu-border-default', '--mizu-border-strong'],
  },
  {
    title: 'Action — Primary',
    tokens: [
      '--mizu-action-primary-default',
      '--mizu-action-primary-hover',
      '--mizu-action-primary-active',
      '--mizu-action-primary-disabled',
    ],
  },
  {
    title: 'Action — Destructive',
    tokens: [
      '--mizu-action-destructive-default',
      '--mizu-action-destructive-hover',
      '--mizu-action-destructive-active',
      '--mizu-action-destructive-disabled',
    ],
  },
  {
    title: 'Feedback',
    tokens: [
      '--mizu-feedback-success-default',
      '--mizu-feedback-success-subtle',
      '--mizu-feedback-warning-default',
      '--mizu-feedback-warning-subtle',
      '--mizu-feedback-danger-default',
      '--mizu-feedback-danger-subtle',
    ],
  },
];

function Swatch({ token }: { token: string }) {
  return (
    <Inline gap="0.75rem" align="center">
      <div
        aria-label={`Swatch for ${token}`}
        className="story-color-swatch"
        style={{ background: `var(${token})` }}
      />
      <code className="mizu-body--sm">{token}</code>
    </Inline>
  );
}

const meta = {
  title: 'Foundations/Colors',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Palette: Story = {
  render: () => (
    <Stack gap="2rem">
      {groups.map((group) => (
        <Stack key={group.title} gap="0.75rem">
          <Heading level={2} size="md" className="story-section-title">
            {group.title}
          </Heading>
          <Stack gap="0.5rem">
            {group.tokens.map((token) => (
              <Swatch key={token} token={token} />
            ))}
          </Stack>
        </Stack>
      ))}
    </Stack>
  ),
};

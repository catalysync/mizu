import type { Meta, StoryObj } from '@storybook/react-vite';
import { HoverCard, HoverCardTrigger, HoverCardContent, Stack } from '@aspect/react';

const meta = {
  title: 'Components/Overlays/HoverCard',
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <a
          href="https://example.com"
          style={{
            fontFamily: 'var(--mizu-font-family-sans)',
            fontSize: 'var(--mizu-font-size-sm)',
            color: 'var(--mizu-action-primary-default)',
            textDecoration: 'underline',
          }}
        >
          @acme-corp
        </a>
      </HoverCardTrigger>
      <HoverCardContent showArrow>
        <Stack gap="0.5rem">
          <strong style={{ fontFamily: 'var(--mizu-font-family-sans)' }}>Acme Corporation</strong>
          <p className="mizu-body--sm" style={{ margin: 0, color: 'var(--mizu-text-secondary)' }}>
            Enterprise cloud platform with 50+ team members.
          </p>
        </Stack>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const WithoutArrow: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <a
          href="https://example.com"
          style={{
            fontFamily: 'var(--mizu-font-family-sans)',
            fontSize: 'var(--mizu-font-size-sm)',
            color: 'var(--mizu-action-primary-default)',
            textDecoration: 'underline',
          }}
        >
          View profile
        </a>
      </HoverCardTrigger>
      <HoverCardContent>
        <Stack gap="0.5rem">
          <strong style={{ fontFamily: 'var(--mizu-font-family-sans)' }}>Jane Doe</strong>
          <p className="mizu-body--sm" style={{ margin: 0, color: 'var(--mizu-text-secondary)' }}>
            Senior engineer on the platform team.
          </p>
        </Stack>
      </HoverCardContent>
    </HoverCard>
  ),
};

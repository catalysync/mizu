import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack, Inline, Heading } from '@aspect/react';
import { tokensByPrefix, type TokenEntry } from './tokens-helper';

const groups: { title: string; filter: RegExp }[] = [
  { title: 'Surface', filter: /^Surface/ },
  { title: 'Text', filter: /^Text/ },
  { title: 'Border', filter: /^Border/ },
  { title: 'Action — Primary', filter: /^ActionPrimary/ },
  { title: 'Action — Destructive', filter: /^ActionDestructive/ },
  { title: 'Feedback', filter: /^Feedback/ },
];

function Swatch({ entry }: { entry: TokenEntry }) {
  return (
    <Inline gap="0.75rem" align="center">
      <div
        aria-label={`Swatch for ${entry.cssVar}`}
        className="story-color-swatch"
        style={{ background: `var(${entry.cssVar})` }}
      />
      <code className="mizu-body--sm">{entry.cssVar}</code>
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
      {groups.map((group) => {
        const entries = tokensByPrefix(group.filter);
        if (entries.length === 0) return null;
        return (
          <Stack key={group.title} gap="0.75rem">
            <Heading level={2} size="md" className="story-section-title">
              {group.title}
            </Heading>
            <Stack gap="0.5rem">
              {entries.map((entry) => (
                <Swatch key={entry.name} entry={entry} />
              ))}
            </Stack>
          </Stack>
        );
      })}
    </Stack>
  ),
};

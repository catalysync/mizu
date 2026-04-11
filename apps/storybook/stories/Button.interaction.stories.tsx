import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within, expect, fn } from 'storybook/test';
import { Button } from '@aspect/react';
import { useState } from 'react';

// Interaction stories use `play()` functions to drive user-event against the
// rendered canvas. Storybook's test runner executes these headlessly in CI;
// they also run when you hover a story and click "Play" in the addon panel.
// Filename convention: `*.interaction.stories.tsx` — excluded from pure
// visual regression runs when IGNORE_TESTS=true (see .storybook/main.ts).

const meta = {
  title: 'Components/Button/Interactions',
  component: Button,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <Button onClick={() => setCount((c) => c + 1)} data-testid="counter">
      Clicked {count} times
    </Button>
  );
}

export const ClickIncreasesCount: Story = {
  render: () => <Counter />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId('counter');

    await expect(button).toHaveTextContent('Clicked 0 times');
    await userEvent.click(button);
    await expect(button).toHaveTextContent('Clicked 1 times');
    await userEvent.click(button);
    await userEvent.click(button);
    await expect(button).toHaveTextContent('Clicked 3 times');
  },
};

export const KeyboardActivation: Story = {
  render: () => <Counter />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId('counter');

    button.focus();
    await expect(button).toHaveFocus();

    // Space and Enter both activate a button — confirm both paths.
    await userEvent.keyboard(' ');
    await expect(button).toHaveTextContent('Clicked 1 times');
    await userEvent.keyboard('{Enter}');
    await expect(button).toHaveTextContent('Clicked 2 times');
  },
};

export const DisabledDoesNotFire: Story = {
  args: { disabled: true, children: 'Cannot click' },
  render: (args) => <Button {...args} onClick={fn()} data-testid="disabled" />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId('disabled');

    await userEvent.click(button);
    // Clicking a disabled button should not dispatch onClick.
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

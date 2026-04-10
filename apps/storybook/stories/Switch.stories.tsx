import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch, Inline } from '@aspect/react';

const meta = {
  title: 'Components/Atoms/Switch',
  component: Switch,
  parameters: { layout: 'centered' },
  args: { 'aria-label': 'Toggle' },
  argTypes: {
    disabled: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true } };

export const WithLabel: Story = {
  render: () => (
    <Inline gap="0.5rem" align="center">
      <Switch id="dark-mode" aria-label="Dark mode" />
      <label htmlFor="dark-mode" className="mizu-body--sm">
        Dark mode
      </label>
    </Inline>
  ),
};

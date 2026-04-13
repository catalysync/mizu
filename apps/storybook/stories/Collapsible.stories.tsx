import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent, Button } from '@aspect/react';

const meta = {
  title: 'Components/Data Display/Collapsible',
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Collapsible open={open} onOpenChange={setOpen} style={{ width: 320 }}>
        <CollapsibleTrigger asChild>
          <Button variant="secondary" style={{ width: '100%' }}>
            {open ? 'Hide' : 'Show'} details
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div style={{ padding: '0.75rem 0' }}>
            <p className="mizu-body--sm" style={{ margin: 0 }}>
              This content is revealed when the trigger is clicked. It animates its height for a
              smooth transition.
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  },
};

export const DefaultOpen: Story = {
  render: () => (
    <Collapsible defaultOpen style={{ width: 320 }}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" style={{ width: '100%' }}>
          Toggle section
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div style={{ padding: '0.75rem 0' }}>
          <p className="mizu-body--sm" style={{ margin: 0 }}>
            This section starts expanded.
          </p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
};

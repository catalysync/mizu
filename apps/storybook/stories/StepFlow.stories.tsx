import { Button, Field, Inline, Input, Stack, StepFlow } from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta = {
  title: 'Components/Atoms/StepFlow',
  component: StepFlow,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof StepFlow>;

export default meta;
type Story = StoryObj<typeof meta>;

const STEPS = [
  { id: 'customer', title: 'Customer', description: 'Who is this invoice for?' },
  { id: 'items', title: 'Line items', description: 'Products & services' },
  { id: 'totals', title: 'Totals', description: 'Tax & discounts' },
  { id: 'review', title: 'Review', description: 'Confirm & send' },
];

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState('customer');
    const index = STEPS.findIndex((s) => s.id === active);
    return (
      <StepFlow steps={STEPS} activeStep={active} onStepChange={setActive}>
        <Stack gap="1rem" style={{ maxWidth: 480 }}>
          <h3>{STEPS[index].title}</h3>
          <p>Step content for {STEPS[index].title}</p>
          <Inline gap="0.5rem">
            <Button
              variant="ghost"
              disabled={index === 0}
              onClick={() => setActive(STEPS[index - 1]?.id ?? active)}
            >
              Back
            </Button>
            <Button
              variant="primary"
              disabled={index === STEPS.length - 1}
              onClick={() => setActive(STEPS[index + 1]?.id ?? active)}
            >
              Next
            </Button>
          </Inline>
        </Stack>
      </StepFlow>
    );
  },
};

export const WithError: Story = {
  render: () => {
    const steps = [
      { id: 'a', title: 'Basics', status: 'complete' as const },
      { id: 'b', title: 'Billing', status: 'error' as const, description: 'Invalid VAT' },
      { id: 'c', title: 'Review' },
    ];
    return (
      <StepFlow steps={steps} activeStep="b">
        <p>Please fix the errors before continuing.</p>
      </StepFlow>
    );
  },
};

export const Vertical: Story = {
  render: () => {
    const [active, setActive] = useState('items');
    return (
      <StepFlow
        steps={STEPS}
        activeStep={active}
        onStepChange={setActive}
        orientation="vertical"
        style={{ maxWidth: 540 }}
      >
        <Stack gap="1rem">
          <h3>Line items</h3>
          <Field label="Product">
            <Input placeholder="Search catalogue…" />
          </Field>
        </Stack>
      </StepFlow>
    );
  },
};

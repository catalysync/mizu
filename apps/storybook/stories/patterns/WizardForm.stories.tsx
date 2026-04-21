import {
  Button,
  Field,
  Form,
  Inline,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Stack,
  StepFlow,
  Textarea,
} from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta = {
  title: 'Patterns/WizardForm',
  tags: ['autodocs', 'experimental'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const STEPS = [
  { id: 'details', title: 'Details', description: 'Company info' },
  { id: 'billing', title: 'Billing', description: 'Payment method' },
  { id: 'review', title: 'Review', description: 'Confirm and submit' },
];

function CompanyStep() {
  return (
    <Stack gap="1rem">
      <Field label="Company name" required>
        <Input placeholder="Acme Corp" />
      </Field>
      <Field label="Industry">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Pick one" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="saas">SaaS</SelectItem>
            <SelectItem value="retail">Retail</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Notes" description="Optional — any context you want to share.">
        <Textarea rows={3} placeholder="Tell us a bit about your use case." />
      </Field>
    </Stack>
  );
}

function BillingStep() {
  return (
    <Stack gap="1rem">
      <Field label="Card number" required>
        <Input inputMode="numeric" placeholder="4242 4242 4242 4242" />
      </Field>
      <Inline gap="1rem">
        <Field label="Expiry" required>
          <Input placeholder="MM/YY" />
        </Field>
        <Field label="CVC" required>
          <Input placeholder="123" />
        </Field>
      </Inline>
    </Stack>
  );
}

function ReviewStep() {
  return (
    <Stack gap="0.75rem">
      <p>Everything looks good. Review your details and submit.</p>
      <ul style={{ margin: 0, paddingInlineStart: '1.25rem' }}>
        <li>Company: Acme Corp</li>
        <li>Industry: SaaS</li>
        <li>Card ending in 4242</li>
      </ul>
    </Stack>
  );
}

export const ThreeStep: Story = {
  render: () => {
    const [active, setActive] = useState('details');
    const activeIndex = STEPS.findIndex((s) => s.id === active);
    const isLast = activeIndex === STEPS.length - 1;
    const isFirst = activeIndex === 0;

    return (
      <Stack gap="1.5rem">
        <StepFlow steps={STEPS} activeStep={active} onStepChange={setActive} allowSkip={false} />
        <Form
          title={STEPS[activeIndex].title}
          description={STEPS[activeIndex].description}
          footer={
            <Inline gap="0.5rem" justify="end">
              <Button
                variant="ghost"
                disabled={isFirst}
                onClick={() => setActive(STEPS[activeIndex - 1].id)}
              >
                Back
              </Button>
              {isLast ? (
                <Button variant="primary">Submit</Button>
              ) : (
                <Button variant="primary" onClick={() => setActive(STEPS[activeIndex + 1].id)}>
                  Continue
                </Button>
              )}
            </Inline>
          }
        >
          {active === 'details' && <CompanyStep />}
          {active === 'billing' && <BillingStep />}
          {active === 'review' && <ReviewStep />}
        </Form>
      </Stack>
    );
  },
};

import {
  Button,
  Field,
  Inline,
  Input,
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
  Stack,
  StepFlow,
  Textarea,
} from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta = {
  title: 'Patterns/SteppedDialog',
  tags: ['autodocs', 'experimental'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const STEPS = [
  { id: 'type', title: 'Type', description: 'Pick a report type' },
  { id: 'details', title: 'Details', description: 'Name and notes' },
];

export const CreateReportFlow: Story = {
  render: () => {
    const [active, setActive] = useState('type');
    const activeIndex = STEPS.findIndex((s) => s.id === active);
    const isLast = activeIndex === STEPS.length - 1;
    const isFirst = activeIndex === 0;

    return (
      <Modal>
        <ModalTrigger asChild>
          <Button variant="primary">Create report</Button>
        </ModalTrigger>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Create report</ModalTitle>
            <ModalDescription>Two quick steps.</ModalDescription>
          </ModalHeader>
          <ModalBody>
            <Stack gap="1.25rem">
              <StepFlow
                steps={STEPS}
                activeStep={active}
                onStepChange={setActive}
                allowSkip={false}
              />
              {active === 'type' && (
                <Stack gap="1rem">
                  <Field label="Report type" required>
                    <Inline gap="0.5rem">
                      <Button variant="secondary">Revenue</Button>
                      <Button variant="secondary">Costs</Button>
                      <Button variant="secondary">Margin</Button>
                    </Inline>
                  </Field>
                </Stack>
              )}
              {active === 'details' && (
                <Stack gap="1rem">
                  <Field label="Name" required>
                    <Input placeholder="Q2 revenue report" />
                  </Field>
                  <Field label="Notes">
                    <Textarea rows={3} placeholder="Optional context…" />
                  </Field>
                </Stack>
              )}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <ModalClose asChild>
              <Button variant="ghost">Cancel</Button>
            </ModalClose>
            {!isFirst && (
              <Button variant="ghost" onClick={() => setActive(STEPS[activeIndex - 1].id)}>
                Back
              </Button>
            )}
            {isLast ? (
              <Button variant="primary">Create</Button>
            ) : (
              <Button variant="primary" onClick={() => setActive(STEPS[activeIndex + 1].id)}>
                Continue
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  },
};

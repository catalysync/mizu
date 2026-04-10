import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  Button,
  Stack,
} from '@aspect/react';

const meta = {
  title: 'Components/Feedback/Toast',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <ToastProvider>
        <Button
          onClick={() => {
            setOpen(false);
            setTimeout(() => setOpen(true), 100);
          }}
        >
          Show toast
        </Button>
        <Toast open={open} onOpenChange={setOpen}>
          <div className="mizu-toast__content">
            <ToastTitle>Saved</ToastTitle>
            <ToastDescription>Your changes have been saved.</ToastDescription>
          </div>
          <ToastClose />
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
  },
};

export const Tones: Story = {
  render: () => (
    <ToastProvider>
      <Stack gap="0.5rem">
        <Toast open tone="success">
          <div className="mizu-toast__content">
            <ToastTitle>Deployed</ToastTitle>
            <ToastDescription>v1.4.2 is live.</ToastDescription>
          </div>
          <ToastClose />
        </Toast>
        <Toast open tone="warning">
          <div className="mizu-toast__content">
            <ToastTitle>Rate limit</ToastTitle>
            <ToastDescription>90% of quota used.</ToastDescription>
          </div>
          <ToastClose />
        </Toast>
        <Toast open tone="danger">
          <div className="mizu-toast__content">
            <ToastTitle>Build failed</ToastTitle>
            <ToastDescription>Exit code 1.</ToastDescription>
          </div>
          <ToastClose />
        </Toast>
        <Toast open tone="info">
          <div className="mizu-toast__content">
            <ToastTitle>Update available</ToastTitle>
            <ToastDescription>v2.0 is ready.</ToastDescription>
          </div>
          <ToastClose />
        </Toast>
      </Stack>
      <ToastViewport />
    </ToastProvider>
  ),
};

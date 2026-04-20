import { Field, FileInput, Stack } from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Atoms/FileInput',
  component: FileInput,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FileInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Field label="Attachment">
      <FileInput />
    </Field>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Field label="Documents" description="Upload up to 5 PDF files">
      <FileInput multiple accept="application/pdf" maxFiles={5} />
    </Field>
  ),
};

export const WithSizeLimit: Story = {
  render: () => (
    <Field label="Receipt" description="PDF or image up to 5 MB" required>
      <FileInput
        accept="application/pdf,image/*"
        maxSize={5 * 1024 * 1024}
        hint="PDF, PNG, JPG up to 5 MB"
      />
    </Field>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Field label="Attachment" description="Sign in to upload" disabled>
      <FileInput />
    </Field>
  ),
};

export const Examples: Story = {
  render: () => (
    <Stack gap="1.5rem" style={{ maxWidth: 480 }}>
      <Field label="Profile photo" description="Square image, at least 400×400">
        <FileInput accept="image/*" maxSize={2 * 1024 * 1024} hint="PNG or JPG up to 2 MB" />
      </Field>
      <Field label="Contract" description="Signed PDF" required>
        <FileInput accept="application/pdf" maxSize={10 * 1024 * 1024} />
      </Field>
      <Field label="Tax returns" description="Previous 3 years">
        <FileInput multiple maxFiles={3} accept="application/pdf" />
      </Field>
    </Stack>
  ),
};

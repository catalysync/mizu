import { Button, Field, Form, Inline, Input, NumberInput, PasswordInput } from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Atoms/Form',
  component: Form,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Form
      title="Create account"
      description="Enter your details to get started."
      actions={
        <Inline gap="0.5rem">
          <Button variant="ghost" type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Create account
          </Button>
        </Inline>
      }
      onSubmit={(e) => e.preventDefault()}
      style={{ maxWidth: 480 }}
    >
      <Field label="Full name" required>
        <Input autoComplete="name" />
      </Field>
      <Field label="Email" required description="We'll send a verification link">
        <Input type="email" autoComplete="email" />
      </Field>
      <Field label="Password" required>
        <PasswordInput autoComplete="new-password" />
      </Field>
    </Form>
  ),
};

export const GridLayout: Story = {
  render: () => (
    <Form
      title="Billing address"
      layout="grid"
      columns={2}
      actions={
        <Button variant="primary" type="submit">
          Save address
        </Button>
      }
      onSubmit={(e) => e.preventDefault()}
      style={{ maxWidth: 640 }}
    >
      <Field label="First name" required>
        <Input />
      </Field>
      <Field label="Last name" required>
        <Input />
      </Field>
      <Field label="Street" required style={{ gridColumn: '1 / -1' }}>
        <Input />
      </Field>
      <Field label="City" required>
        <Input />
      </Field>
      <Field label="Postal code" required>
        <Input />
      </Field>
    </Form>
  ),
};

export const WithErrorSummary: Story = {
  render: () => (
    <Form
      title="Invoice details"
      errorSummary="3 fields need your attention before you can save this invoice."
      actions={
        <Button variant="primary" type="submit">
          Save invoice
        </Button>
      }
      onSubmit={(e) => e.preventDefault()}
      style={{ maxWidth: 480 }}
    >
      <Field label="Customer" errorMessage="Select a customer" required>
        <Input />
      </Field>
      <Field label="Amount" errorMessage="Amount must be greater than zero" required>
        <NumberInput defaultValue={0} min={0} prefix="$" precision={2} />
      </Field>
      <Field label="Due date" errorMessage="Due date is required" required>
        <Input type="date" />
      </Field>
    </Form>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Form
      title="Read-only preview"
      description="Sign in to edit"
      disabled
      actions={
        <Button variant="primary" type="submit">
          Save
        </Button>
      }
      style={{ maxWidth: 480 }}
    >
      <Field label="Full name">
        <Input defaultValue="Ada Lovelace" />
      </Field>
      <Field label="Email">
        <Input defaultValue="ada@example.com" type="email" />
      </Field>
    </Form>
  ),
};

export const ActionsBetween: Story = {
  render: () => (
    <Form
      title="Danger zone"
      description="Delete this workspace permanently"
      actionsAlign="between"
      actions={
        <>
          <Button variant="ghost" type="button">
            Export data
          </Button>
          <Button variant="destructive" type="submit">
            Delete workspace
          </Button>
        </>
      }
      onSubmit={(e) => e.preventDefault()}
      style={{ maxWidth: 480 }}
    >
      <Field label="Type 'DELETE' to confirm" required description="This action cannot be undone.">
        <Input />
      </Field>
    </Form>
  ),
};

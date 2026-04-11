import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field, Stack, useFieldContext } from '@aspect/react';

// A thin wrapper that reads Field context and passes it to a raw input.
// Real usage will be `<Field><Input /></Field>` once Input is wired — this
// story exists to exercise the Field primitive directly.
function FieldInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const ctx = useFieldContext();
  return (
    <input
      {...props}
      id={props.id ?? ctx?.controlId}
      required={props.required ?? ctx?.required}
      disabled={props.disabled ?? ctx?.disabled}
      aria-invalid={props['aria-invalid'] ?? (ctx?.invalid || undefined)}
      aria-describedby={
        [ctx?.descriptionId, ctx?.errorId, props['aria-describedby']].filter(Boolean).join(' ') ||
        undefined
      }
      className="mizu-input"
    />
  );
}

const meta = {
  title: 'Components/Atoms/Field',
  component: Field,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Field label="Email">
      <FieldInput type="email" placeholder="you@example.com" />
    </Field>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <Field label="Email" description="We'll send your invoice receipts to this address.">
      <FieldInput type="email" placeholder="you@example.com" />
    </Field>
  ),
};

export const Required: Story = {
  render: () => (
    <Field label="Company name" required>
      <FieldInput placeholder="Acme Inc" />
    </Field>
  ),
};

export const OptionalHint: Story = {
  render: () => (
    <Field label="Phone number" showOptionalHint>
      <FieldInput type="tel" placeholder="+1 555 0100" />
    </Field>
  ),
};

export const WithError: Story = {
  render: () => (
    <Field
      label="Email"
      errorMessage="Enter a valid email address"
      description="We'll send your invoice receipts here"
    >
      <FieldInput type="email" defaultValue="not-an-email" />
    </Field>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Field label="Tax ID" description="Sign in to edit your tax information" disabled>
      <FieldInput placeholder="XX-XXXXXXX" />
    </Field>
  ),
};

export const WithInfoLink: Story = {
  render: () => (
    <Field label="VAT number" info="What is a VAT number?">
      <FieldInput placeholder="GB123456789" />
    </Field>
  ),
};

export const FormExample: Story = {
  render: () => (
    <Stack gap="1rem" style={{ maxWidth: 480 }}>
      <Field label="Full name" required>
        <FieldInput />
      </Field>
      <Field label="Email" description="We'll send your invoice receipts here" required>
        <FieldInput type="email" />
      </Field>
      <Field label="Company" showOptionalHint>
        <FieldInput />
      </Field>
      <Field label="Tax ID" errorMessage="Enter a valid 9-digit tax ID" required>
        <FieldInput defaultValue="12-345" />
      </Field>
    </Stack>
  ),
};

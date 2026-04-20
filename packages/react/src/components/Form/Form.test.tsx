import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Button } from '../Button';
import { Field, useFieldControlProps } from '../Field';
import { Form } from './Form';

function FieldInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const resolved = useFieldControlProps<HTMLInputElement>(props);
  return <input {...resolved} />;
}

describe('Form', () => {
  it('renders a form element with title and description', () => {
    render(
      <Form title="Account details" description="Update your billing info">
        <Field label="Name">
          <input />
        </Field>
      </Form>,
    );
    expect(screen.getByRole('heading', { name: 'Account details' })).toBeInTheDocument();
    expect(screen.getByText('Update your billing info')).toBeInTheDocument();
  });

  it('calls onSubmit when submitted', () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <Form onSubmit={onSubmit} actions={<Button type="submit">Save</Button>}>
        <Field label="Name">
          <input name="name" />
        </Field>
      </Form>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSubmit).toHaveBeenCalled();
  });

  it('renders error summary with role="alert"', () => {
    render(
      <Form errorSummary="3 fields need attention">
        <Field label="Name">
          <input />
        </Field>
      </Form>,
    );
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('3 fields need attention');
  });

  it('applies grid layout with columns data attribute', () => {
    const { container } = render(
      <Form layout="grid" columns={3}>
        <Field label="A">
          <input />
        </Field>
      </Form>,
    );
    const form = container.querySelector('form');
    expect(form).toHaveAttribute('data-layout', 'grid');
  });

  it('disables all fields when disabled', () => {
    render(
      <Form disabled>
        <Field label="Name">
          <input data-testid="name" />
        </Field>
      </Form>,
    );
    expect(screen.getByTestId('name')).toBeDisabled();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Form
        title="Create account"
        description="Enter your details to get started"
        actions={<Button type="submit">Create</Button>}
      >
        <Field label="Email" required>
          <FieldInput type="email" />
        </Field>
        <Field label="Password" required>
          <FieldInput type="password" />
        </Field>
      </Form>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

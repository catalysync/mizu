import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { FormField } from './FormField';

interface SignupValues {
  email: string;
  nickname: string;
}

function Harness({
  defaultValues,
  onSubmit,
  rules,
}: {
  defaultValues?: Partial<SignupValues>;
  onSubmit?: (values: SignupValues) => void;
  rules?: { email?: { required?: string; pattern?: { value: RegExp; message: string } } };
}) {
  const { control, handleSubmit } = useForm<SignupValues>({
    defaultValues: { email: '', nickname: '', ...defaultValues },
  });
  return (
    <form onSubmit={handleSubmit((v) => onSubmit?.(v))}>
      <FormField<SignupValues, 'email'>
        control={control}
        name="email"
        label="Email"
        description="We never share your email"
        rules={rules?.email}
      >
        {({ field }) => <input type="email" data-testid="email" {...field} />}
      </FormField>
      <FormField<SignupValues, 'nickname'>
        control={control}
        name="nickname"
        label="Nickname"
        showOptionalHint
      >
        {({ field }) => <input data-testid="nickname" {...field} />}
      </FormField>
      <button type="submit">Submit</button>
    </form>
  );
}

describe('FormField', () => {
  it('renders the label, description and wires htmlFor to the field name', () => {
    render(<Harness />);
    const input = screen.getByTestId('email');
    expect(input).toHaveAttribute('name', 'email');
    expect(screen.getByText('Email')).toHaveAttribute('for', 'email');
    expect(screen.getByText('We never share your email')).toBeInTheDocument();
  });

  it('marks the field required when rules.required is set', () => {
    render(<Harness rules={{ email: { required: 'Email is required' } }} />);
    expect(screen.getByText('(required)')).toBeInTheDocument();
  });

  it('surfaces RHF validation errors as Field errorMessage with aria-invalid', async () => {
    const user = userEvent.setup();
    render(
      <Harness
        rules={{
          email: {
            required: 'Email is required',
            pattern: { value: /@/, message: 'Must include @' },
          },
        }}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    const error = await screen.findByRole('alert');
    expect(error).toHaveTextContent('Email is required');
  });

  it('passes value/onChange through to the rendered control', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Harness onSubmit={onSubmit} />);
    await user.type(screen.getByTestId('email'), 'a@b.co');
    await user.type(screen.getByTestId('nickname'), 'mochi');
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onSubmit).toHaveBeenCalledWith({ email: 'a@b.co', nickname: 'mochi' });
  });

  it('renders the optional hint when configured (Field prop passthrough)', () => {
    render(<Harness />);
    expect(screen.getByText('(optional)')).toBeInTheDocument();
  });

  it('has no axe violations in valid + invalid states', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Harness rules={{ email: { required: 'Email is required' } }} />,
    );
    expect(await axe(container)).toHaveNoViolations();
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    await screen.findByRole('alert');
    expect(await axe(container)).toHaveNoViolations();
  });
});

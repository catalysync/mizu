import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm, type UseFormRegister } from 'react-hook-form';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Field } from '../components/Field';
import { useFormField, type FormFieldState } from './use-form-field';

function EmailForm() {
  const { register, handleSubmit, formState, getFieldState } = useForm<{ email: string }>({
    defaultValues: { email: '' },
  });
  const fieldState: FormFieldState = getFieldState('email', formState);
  const { controlProps, errorMessage, errorId } = useFormField<HTMLInputElement>({
    fieldState,
  });

  return (
    <form onSubmit={handleSubmit(() => {})} noValidate>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        {...register('email', { required: 'Email is required' })}
        {...controlProps}
      />
      {errorMessage ? (
        <p id={errorId} role="alert">
          {errorMessage}
        </p>
      ) : null}
      <button type="submit">Save</button>
    </form>
  );
}

describe('useFormField', () => {
  it('marks a required field aria-invalid after a failed submit', async () => {
    const user = userEvent.setup();
    render(<EmailForm />);
    const input = screen.getByLabelText('Email');

    expect(input).not.toHaveAttribute('aria-invalid');

    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(input).toHaveAttribute('aria-invalid', 'true'));
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Email is required');
    expect(input).toHaveAccessibleDescription('Email is required');
  });

  it('clears aria-invalid and the describedby error once the value is valid', async () => {
    const user = userEvent.setup();
    render(<EmailForm />);
    const input = screen.getByLabelText('Email');

    await user.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(input).toHaveAttribute('aria-invalid', 'true'));

    await user.type(input, 'a@example.com');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(input).not.toHaveAttribute('aria-invalid'));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(input).not.toHaveAttribute('aria-describedby');
  });

  it('keeps a caller-supplied aria-describedby alongside the error id', async () => {
    function Hinted() {
      const { register, handleSubmit, formState } = useForm<{ name: string }>();
      const { controlProps, errorId } = useFormField<HTMLInputElement>({
        fieldState: { error: formState.errors.name },
        'aria-describedby': 'name-hint',
      });
      return (
        <form onSubmit={handleSubmit(() => {})} noValidate>
          <span id="name-hint">Your legal name</span>
          <input
            aria-label="Name"
            {...register('name', { required: 'Name is required' })}
            {...controlProps}
          />
          {errorId ? <p id={errorId}>{formState.errors.name?.message}</p> : null}
          <button type="submit">Save</button>
        </form>
      );
    }
    const user = userEvent.setup();
    render(<Hinted />);
    await user.click(screen.getByRole('button', { name: 'Save' }));
    const input = screen.getByLabelText('Name');
    await waitFor(() => expect(input).toHaveAttribute('aria-invalid', 'true'));
    expect(input).toHaveAccessibleDescription('Your legal name Name is required');
  });

  it('has no axe violations in the invalid state', async () => {
    const user = userEvent.setup();
    const { container } = render(<EmailForm />);
    await user.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() =>
      expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true'),
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('inside Field, every describedby id resolves to an element', async () => {
    type Values = { email: string };
    function FieldControl({
      register,
      fieldState,
    }: {
      register: UseFormRegister<Values>;
      fieldState: FormFieldState;
    }) {
      const { controlProps } = useFormField<HTMLInputElement>({ fieldState });
      return <input {...register('email', { required: 'Email is required' })} {...controlProps} />;
    }
    function InField() {
      const { register, handleSubmit, formState, getFieldState } = useForm<Values>();
      return (
        <form onSubmit={handleSubmit(() => {})} noValidate>
          <Field label="Email" errorMessage={formState.errors.email?.message}>
            <FieldControl register={register} fieldState={getFieldState('email', formState)} />
          </Field>
          <button type="submit">Save</button>
        </form>
      );
    }
    const user = userEvent.setup();
    render(<InField />);
    await user.click(screen.getByRole('button', { name: 'Save' }));
    const input = screen.getByLabelText(/Email/);
    await waitFor(() => expect(input).toHaveAttribute('aria-invalid', 'true'));
    const ids = (input.getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean);
    expect(ids).toHaveLength(1);
    for (const id of ids) expect(document.getElementById(id)).not.toBeNull();
    expect(input).toHaveAccessibleDescription('Email is required');
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { IntentForm } from './intent-form';

describe('IntentForm', () => {
  it('renders with cloud selected and the first three industries visible', () => {
    render(<IntentForm />);

    expect(screen.getByRole('form', { name: /studio intent form/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/product name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/one-sentence description/i)).toBeInTheDocument();
    expect(screen.getByText(/cloud \/ paas/i)).toBeInTheDocument();
    expect(screen.getByText(/saas admin/i)).toBeInTheDocument();
    expect(screen.getByText(/e-commerce/i)).toBeInTheDocument();
  });

  it('submits with a valid spec and calls onSubmit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<IntentForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/product name/i), 'my-cloud-app');
    await user.type(
      screen.getByLabelText(/one-sentence description/i),
      'Heroku-style PaaS for Next.js',
    );
    await user.click(screen.getByRole('button', { name: /generate project/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const spec = onSubmit.mock.calls[0][0];
    expect(spec.productName).toBe('my-cloud-app');
    expect(spec.description).toBe('Heroku-style PaaS for Next.js');
    expect(spec.industry).toBe('cloud');
    expect(spec.tone).toBe('technical');
    expect(spec.stack).toBe('next-app-router');
    expect(spec.pages.length).toBeGreaterThan(0);
  });

  it('blocks submission when required fields are empty', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<IntentForm onSubmit={onSubmit} />);
    await user.click(screen.getByRole('button', { name: /generate project/i }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('lets the user switch to a pro industry and surfaces a status message', async () => {
    const user = userEvent.setup();
    render(<IntentForm />);

    const fintechRadio = screen.getByRole('radio', { name: /fintech/i });
    await user.click(fintechRadio);

    expect(screen.getByRole('status')).toHaveTextContent(/fintech is a pro industry/i);
  });

  it('passes vitest-axe with no violations', async () => {
    const { container } = render(<IntentForm />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CurrencyInput } from './CurrencyInput';

describe('CurrencyInput', () => {
  it('renders with a USD symbol prefix by default', () => {
    render(<CurrencyInput aria-label="Total" defaultValue={1200} />);
    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByRole('spinbutton')).toHaveValue('1200');
  });

  it('respects a custom currency', () => {
    render(<CurrencyInput aria-label="Total" currency="EUR" locale="de-DE" defaultValue={50} />);
    expect(screen.getByText('€')).toBeInTheDocument();
  });

  it('uses 0.01 step by default', () => {
    const onValueChange = vi.fn();
    render(<CurrencyInput aria-label="Total" defaultValue={0} onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Increment' }));
    expect(onValueChange).toHaveBeenLastCalledWith(0.01);
  });
});

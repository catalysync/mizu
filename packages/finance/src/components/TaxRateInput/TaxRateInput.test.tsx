import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TaxRateInput } from './TaxRateInput';

describe('TaxRateInput', () => {
  it('renders with a % suffix', () => {
    render(<TaxRateInput aria-label="VAT" defaultValue={20} />);
    expect(screen.getByText('%')).toBeInTheDocument();
    expect(screen.getByRole('spinbutton')).toHaveValue('20');
  });

  it('clamps to 0-100 by default', () => {
    const onValueChange = vi.fn();
    render(<TaxRateInput aria-label="VAT" defaultValue={50} onValueChange={onValueChange} />);
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '150' } });
    expect(onValueChange).toHaveBeenLastCalledWith(100);
    fireEvent.change(input, { target: { value: '-10' } });
    expect(onValueChange).toHaveBeenLastCalledWith(0);
  });
});

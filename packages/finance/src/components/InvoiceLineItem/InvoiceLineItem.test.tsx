import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { InvoiceLineItem, computeLineTotal } from './InvoiceLineItem';

const base = {
  id: '1',
  description: 'Consulting',
  quantity: 2,
  unitPrice: 100,
  taxRate: 20,
};

describe('computeLineTotal', () => {
  it('computes qty × price × (1 + tax)', () => {
    expect(computeLineTotal(base)).toBe(240);
  });

  it('handles zero quantity', () => {
    expect(computeLineTotal({ ...base, quantity: 0 })).toBe(0);
  });
});

describe('InvoiceLineItem', () => {
  it('renders the computed total', () => {
    render(<InvoiceLineItem value={base} />);
    expect(screen.getByText('$240.00')).toBeInTheDocument();
  });

  it('emits onChange when description changes', () => {
    const onChange = vi.fn();
    render(<InvoiceLineItem value={base} onChange={onChange} />);
    const description = screen.getByLabelText('Description');
    fireEvent.change(description, { target: { value: 'Strategy' } });
    expect(onChange).toHaveBeenCalledWith({ ...base, description: 'Strategy' });
  });

  it('calls onRemove with the id', () => {
    const onRemove = vi.fn();
    render(<InvoiceLineItem value={base} onRemove={onRemove} />);
    fireEvent.click(screen.getByRole('button', { name: /Remove Consulting/ }));
    expect(onRemove).toHaveBeenCalledWith('1');
  });

  it('hides the remove button in read-only mode', () => {
    render(<InvoiceLineItem value={base} readOnly />);
    expect(screen.queryByRole('button', { name: /Remove/ })).not.toBeInTheDocument();
  });

  it('renders a skeleton when loading', () => {
    render(<InvoiceLineItem value={base} loading />);
    expect(screen.queryByText('$240.00')).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('sets aria-busy and default loading label', () => {
    const { container } = render(<InvoiceLineItem value={base} loading />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveAttribute('aria-busy', 'true');
    expect(root).toHaveAttribute('aria-label', 'Loading invoice line item');
  });

  it('has no axe violations in loading state', async () => {
    const { container } = render(<InvoiceLineItem value={base} loading />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

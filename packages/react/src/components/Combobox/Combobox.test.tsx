import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Field } from '../Field';
import { Combobox } from './Combobox';

const OPTIONS = [
  { value: 'us', label: 'United States' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
];

describe('Combobox', () => {
  it('renders a trigger with placeholder', () => {
    render(<Combobox options={OPTIONS} placeholder="Pick a country" />);
    expect(screen.getByText('Pick a country')).toBeInTheDocument();
  });

  it('shows the selected label when a value is set', () => {
    render(<Combobox options={OPTIONS} value="gb" />);
    expect(screen.getByText('United Kingdom')).toBeInTheDocument();
  });

  it('opens the dropdown when clicked', () => {
    render(<Combobox options={OPTIONS} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByText('United States')).toBeInTheDocument();
  });

  it('filters options when typing in the search box', () => {
    render(<Combobox options={OPTIONS} />);
    fireEvent.click(screen.getByRole('button'));
    const search = screen.getByLabelText('Filter options');
    fireEvent.change(search, { target: { value: 'united' } });
    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByText('United Kingdom')).toBeInTheDocument();
    expect(screen.queryByText('Germany')).not.toBeInTheDocument();
  });

  it('calls onValueChange when an option is selected (single)', () => {
    const onValueChange = vi.fn();
    render(<Combobox options={OPTIONS} onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('France'));
    expect(onValueChange).toHaveBeenCalledWith('fr');
  });

  it('supports multi-select with pills', () => {
    const onValueChange = vi.fn();
    render(
      <Combobox options={OPTIONS} multiple value={['us', 'gb']} onValueChange={onValueChange} />,
    );
    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByText('United Kingdom')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Remove United States'));
    expect(onValueChange).toHaveBeenCalledWith(['gb']);
  });

  it('reads disabled from Field context', () => {
    render(
      <Field label="Country" disabled>
        <Combobox options={OPTIONS} />
      </Field>,
    );
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Field label="Country">
        <Combobox options={OPTIONS} value="de" />
      </Field>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

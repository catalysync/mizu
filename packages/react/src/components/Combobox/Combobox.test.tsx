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
  it('renders the input with placeholder', () => {
    render(<Combobox options={OPTIONS} placeholder="Pick a country" />);
    expect(screen.getByRole('combobox')).toHaveAttribute('placeholder', 'Pick a country');
  });

  it('shows the selected label when a value is set', () => {
    render(<Combobox options={OPTIONS} value="gb" />);
    expect(screen.getByRole('combobox')).toHaveValue('United Kingdom');
  });

  it('opens the listbox when the input is clicked', () => {
    render(<Combobox options={OPTIONS} />);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'United States' })).toBeInTheDocument();
  });

  it('filters options when typing in the input', () => {
    render(<Combobox options={OPTIONS} />);
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'united' } });
    expect(screen.getByRole('option', { name: 'United States' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'United Kingdom' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Germany' })).not.toBeInTheDocument();
  });

  it('moves the active option with the arrow keys', () => {
    render(<Combobox options={OPTIONS} />);
    const input = screen.getByRole('combobox');
    fireEvent.click(input);
    const first = screen.getByRole('option', { name: 'United States' });
    const second = screen.getByRole('option', { name: 'United Kingdom' });
    expect(input).toHaveAttribute('aria-activedescendant', first.id);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input).toHaveAttribute('aria-activedescendant', second.id);
    expect(second).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(input).toHaveAttribute('aria-activedescendant', first.id);
  });

  it('opens with ArrowDown when closed', () => {
    render(<Combobox options={OPTIONS} />);
    const input = screen.getByRole('combobox');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('selects the active option with Enter', () => {
    const onValueChange = vi.fn();
    render(<Combobox options={OPTIONS} onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox');
    fireEvent.click(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onValueChange).toHaveBeenCalledWith('de');
  });

  it('starts from the first option again after closing', () => {
    render(<Combobox options={OPTIONS} />);
    const input = screen.getByRole('combobox');
    fireEvent.click(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Escape' });
    fireEvent.click(input);
    expect(input).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'United States' }).id,
    );
  });

  it('keeps Home and End for the caret in the input', () => {
    render(<Combobox options={OPTIONS} />);
    const input = screen.getByRole('combobox');
    fireEvent.click(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    const second = screen.getByRole('option', { name: 'United Kingdom' });
    fireEvent.keyDown(input, { key: 'End' });
    fireEvent.keyDown(input, { key: 'Home' });
    expect(input).toHaveAttribute('aria-activedescendant', second.id);
  });

  it('does not select the highlighted option when Enter is pressed on a pill', () => {
    const onValueChange = vi.fn();
    render(<Combobox options={OPTIONS} multiple value={['us']} onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' });
    fireEvent.keyDown(screen.getByLabelText('Remove United States'), { key: 'Enter' });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('closes on Escape', () => {
    render(<Combobox options={OPTIONS} />);
    const input = screen.getByRole('combobox');
    fireEvent.click(input);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  it('calls onValueChange when an option is selected (single)', () => {
    const onValueChange = vi.fn();
    render(<Combobox options={OPTIONS} onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByRole('option', { name: 'France' }));
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

  it('keeps the list open after toggling in multi-select', () => {
    const onValueChange = vi.fn();
    render(<Combobox options={OPTIONS} multiple value={['us']} onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByRole('option', { name: 'Japan' }));
    expect(onValueChange).toHaveBeenCalledWith(['us', 'jp']);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'United States' })).toBeChecked();
  });

  it('reads disabled from Field context', () => {
    render(
      <Field label="Country" disabled>
        <Combobox options={OPTIONS} />
      </Field>,
    );
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('labels the input from Field', () => {
    render(
      <Field label="Country">
        <Combobox options={OPTIONS} />
      </Field>,
    );
    expect(screen.getByLabelText('Country')).toBe(screen.getByRole('combobox'));
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Field label="Country">
        <Combobox options={OPTIONS} value="de" />
      </Field>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations while the listbox is open', async () => {
    render(
      <Field label="Country">
        <Combobox options={OPTIONS} />
      </Field>,
    );
    fireEvent.click(screen.getByRole('combobox'));
    // The listbox is portalled to body, outside any landmark; region is a page-level rule.
    expect(
      await axe(document.body, { rules: { region: { enabled: false } } }),
    ).toHaveNoViolations();
  });
});

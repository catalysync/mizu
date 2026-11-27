import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Field } from '../Field';
import { Autocomplete } from './Autocomplete';

const OPTIONS = [
  { value: 'us', label: 'United States' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'de', label: 'Germany', description: 'Central Europe' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan', disabled: true },
];

describe('Autocomplete', () => {
  it('shows suggestions as the user types and filters them', () => {
    render(
      <Field label="Country">
        <Autocomplete options={OPTIONS} />
      </Field>,
    );
    const input = screen.getByRole('combobox', { name: 'Country' });
    fireEvent.change(input, { target: { value: 'united' } });
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('option', { name: 'United States' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'United Kingdom' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Germany' })).not.toBeInTheDocument();
  });

  it('matches the description as well as the label', () => {
    render(<Autocomplete options={OPTIONS} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'central' } });
    expect(screen.getByRole('option', { name: /Germany/ })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: /France/ })).not.toBeInTheDocument();
  });

  it('shows the empty message when nothing matches', () => {
    render(<Autocomplete options={OPTIONS} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'zzz' } });
    expect(screen.getByText('No matches.')).toBeInTheDocument();
  });

  it('selects the highlighted suggestion with Enter', () => {
    const onOptionSelect = vi.fn();
    const onValueChange = vi.fn();
    render(
      <Autocomplete
        options={OPTIONS}
        onOptionSelect={onOptionSelect}
        onValueChange={onValueChange}
      />,
    );
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'fr' } });
    expect(input).toHaveAttribute('aria-activedescendant', screen.getByRole('option').id);
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onOptionSelect).toHaveBeenCalledWith(OPTIONS[3]);
    expect(onValueChange).toHaveBeenLastCalledWith('France');
    expect(input).toHaveValue('France');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('moves the highlight with the arrow keys before Enter', () => {
    const onOptionSelect = vi.fn();
    render(<Autocomplete options={OPTIONS} onOptionSelect={onOptionSelect} />);
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'u' } });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onOptionSelect).toHaveBeenCalledWith(OPTIONS[1]);
  });

  it('lets Enter pass through when there is no suggestion to pick', () => {
    render(<Autocomplete options={OPTIONS} />);
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'zzz' } });
    expect(fireEvent.keyDown(input, { key: 'Enter' })).toBe(true);
  });

  it('keeps free text when nothing is selected', () => {
    const onValueChange = vi.fn();
    render(<Autocomplete options={OPTIONS} onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'Atlantis' } });
    expect(onValueChange).toHaveBeenLastCalledWith('Atlantis');
    expect(input).toHaveValue('Atlantis');
  });

  it('is controlled by value', () => {
    render(<Autocomplete options={OPTIONS} value="Japan" />);
    expect(screen.getByRole('combobox')).toHaveValue('Japan');
  });

  it('does not select disabled suggestions', () => {
    const onOptionSelect = vi.fn();
    render(<Autocomplete options={OPTIONS} onOptionSelect={onOptionSelect} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'jap' } });
    fireEvent.click(screen.getByRole('option', { name: 'Japan' }));
    expect(onOptionSelect).not.toHaveBeenCalled();
  });

  it('reads disabled from Field context', () => {
    render(
      <Field label="Country" disabled>
        <Autocomplete options={OPTIONS} />
      </Field>,
    );
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Field label="Country">
        <Autocomplete options={OPTIONS} defaultValue="Germany" />
      </Field>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations while suggestions are open', async () => {
    render(
      <Field label="Country">
        <Autocomplete options={OPTIONS} />
      </Field>,
    );
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'u' } });
    // The listbox is portalled to body, outside any landmark; region is a page-level rule.
    expect(
      await axe(document.body, { rules: { region: { enabled: false } } }),
    ).toHaveNoViolations();
  });
});

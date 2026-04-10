import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { RadioGroup, RadioItem } from './Radio';

describe('RadioGroup', () => {
  it('renders items with labels', () => {
    render(
      <RadioGroup aria-label="Size">
        <RadioItem value="sm" label="Small" />
        <RadioItem value="md" label="Medium" />
      </RadioGroup>,
    );
    expect(screen.getByText('Small')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('selects on click', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <RadioGroup aria-label="Size" onValueChange={onChange}>
        <RadioItem value="sm" label="Small" />
        <RadioItem value="md" label="Medium" />
      </RadioGroup>,
    );
    await user.click(screen.getByText('Medium'));
    expect(onChange).toHaveBeenCalledWith('md');
  });

  it('respects defaultValue', () => {
    render(
      <RadioGroup aria-label="Size" defaultValue="md">
        <RadioItem value="sm" label="Small" />
        <RadioItem value="md" label="Medium" />
      </RadioGroup>,
    );
    const radios = screen.getAllByRole('radio');
    expect(radios[1]).toHaveAttribute('data-state', 'checked');
  });

  it('respects disabled on items', () => {
    render(
      <RadioGroup aria-label="Size">
        <RadioItem value="sm" label="Small" />
        <RadioItem value="md" label="Medium" disabled />
      </RadioGroup>,
    );
    expect(screen.getAllByRole('radio')[1]).toBeDisabled();
  });

  it('only one item is checked at a time', async () => {
    const user = userEvent.setup();
    render(
      <RadioGroup aria-label="Size" defaultValue="sm">
        <RadioItem value="sm" label="Small" />
        <RadioItem value="md" label="Medium" />
      </RadioGroup>,
    );
    await user.click(screen.getByText('Medium'));
    const radios = screen.getAllByRole('radio');
    expect(radios[0]).toHaveAttribute('data-state', 'unchecked');
    expect(radios[1]).toHaveAttribute('data-state', 'checked');
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <RadioGroup aria-label="Size" defaultValue="sm">
        <RadioItem value="sm" label="Small" />
        <RadioItem value="md" label="Medium" />
      </RadioGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

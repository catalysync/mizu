import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { ToggleGroup, ToggleGroupItem } from './ToggleGroup';

describe('ToggleGroup', () => {
  it('renders items', () => {
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  it('applies root class', () => {
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(document.querySelector('.mizu-toggle-group')).toBeInTheDocument();
  });

  it('applies item class', () => {
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(document.querySelector('.mizu-toggle-group__item')).toBeInTheDocument();
  });

  it('selects item on click (single)', async () => {
    const onValueChange = vi.fn();
    render(
      <ToggleGroup type="single" onValueChange={onValueChange}>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>,
    );
    await userEvent.setup().click(screen.getByText('A'));
    expect(onValueChange).toHaveBeenCalledWith('a');
  });

  it('supports multiple selection', async () => {
    const onValueChange = vi.fn();
    render(
      <ToggleGroup type="multiple" onValueChange={onValueChange}>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>,
    );
    await userEvent.setup().click(screen.getByText('A'));
    expect(onValueChange).toHaveBeenCalledWith(['a']);
  });

  it('applies data-state on for active item', () => {
    render(
      <ToggleGroup type="single" value="a">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(screen.getByText('A')).toHaveAttribute('data-state', 'on');
    expect(screen.getByText('B')).toHaveAttribute('data-state', 'off');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <ToggleGroup type="single" aria-label="Options">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

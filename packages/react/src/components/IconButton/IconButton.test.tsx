import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('renders a button named by aria-label', () => {
    render(
      <IconButton aria-label="Close">
        <span aria-hidden="true">×</span>
      </IconButton>,
    );
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('uses the icon button class and the md size by default', () => {
    render(<IconButton aria-label="Close">×</IconButton>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('mizu-button--icon', 'mizu-icon-button', 'mizu-icon-button--md');
  });

  it.each(['sm', 'md', 'lg'] as const)('applies the %s size class', (size) => {
    render(
      <IconButton aria-label="Close" size={size}>
        ×
      </IconButton>,
    );
    expect(screen.getByRole('button')).toHaveClass(`mizu-icon-button--${size}`);
  });

  it('forwards ref and onClick', async () => {
    const ref = createRef<HTMLButtonElement>();
    const onClick = vi.fn();
    render(
      <IconButton ref={ref} aria-label="Close" onClick={onClick}>
        ×
      </IconButton>,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    await userEvent.setup().click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <IconButton aria-label="Close">
        <span aria-hidden="true">×</span>
      </IconButton>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('requires aria-label in its type', () => {
    // Compile-time check, enforced by `pnpm typecheck`: an icon button with no name is an error.
    // @ts-expect-error aria-label is required on IconButton
    const missingName = <IconButton>×</IconButton>; // eslint-disable-line mizu/icon-button-label -- the type error is the assertion; never rendered
    expect(missingName).toBeDefined();
  });
});

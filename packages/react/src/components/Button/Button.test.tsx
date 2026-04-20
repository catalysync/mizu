import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Button } from './Button';

describe('Button', () => {
  // -- Rendering --
  it('renders with the given children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('renders as a native button element', () => {
    render(<Button>Go</Button>);
    expect(screen.getByRole('button').tagName).toBe('BUTTON');
  });

  it('defaults to type="button"', () => {
    render(<Button>Go</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('allows type="submit"', () => {
    render(<Button type="submit">Save</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('sets data-component="mizu-button"', () => {
    render(<Button>Go</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-component', 'mizu-button');
  });

  // -- Variants --
  it('applies primary variant by default', () => {
    render(<Button>Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('mizu-button--primary');
  });

  it('applies secondary variant', () => {
    render(<Button variant="secondary">Sec</Button>);
    expect(screen.getByRole('button')).toHaveClass('mizu-button--secondary');
  });

  it('applies ghost variant', () => {
    render(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button')).toHaveClass('mizu-button--ghost');
  });

  it('applies destructive variant', () => {
    render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole('button')).toHaveClass('mizu-button--destructive');
  });

  // -- Sizes --
  it('applies sm size', () => {
    render(<Button size="sm">Sm</Button>);
    expect(screen.getByRole('button')).toHaveClass('mizu-button--sm');
  });

  it('applies md size by default', () => {
    render(<Button>Md</Button>);
    expect(screen.getByRole('button')).toHaveClass('mizu-button--md');
  });

  it('applies lg size', () => {
    render(<Button size="lg">Lg</Button>);
    expect(screen.getByRole('button')).toHaveClass('mizu-button--lg');
  });

  it('applies icon size', () => {
    render(
      <Button size="icon" aria-label="Close">
        ×
      </Button>,
    );
    expect(screen.getByRole('button')).toHaveClass('mizu-button--icon');
  });

  // -- className merging --
  it('merges custom className', () => {
    render(<Button className="extra">Go</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('mizu-button');
    expect(btn).toHaveClass('extra');
  });

  // -- Click --
  it('fires onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Submit</Button>);
    await userEvent.setup().click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not fire onClick when disabled', async () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        No
      </Button>,
    );
    await userEvent.setup().click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  // -- Keyboard --
  it('fires onClick on Enter', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick}>Go</Button>);
    screen.getByRole('button').focus();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('fires onClick on Space', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick}>Go</Button>);
    screen.getByRole('button').focus();
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not fire onClick on Enter when disabled', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button onClick={onClick} disabled>
        No
      </Button>,
    );
    screen.getByRole('button').focus();
    await user.keyboard('{Enter}');
    expect(onClick).not.toHaveBeenCalled();
  });

  // -- Disabled --
  it('sets the disabled attribute', () => {
    render(<Button disabled>Dis</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  // -- Loading --
  it('sets aria-busy when loading', () => {
    render(<Button loading>Save</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  it('sets data-loading when loading', () => {
    render(<Button loading>Save</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-loading', 'true');
  });

  it('disables the button when loading', () => {
    render(<Button loading>Save</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders a spinner when loading', () => {
    const { container } = render(<Button loading>Save</Button>);
    expect(container.querySelector('.mizu-button__spinner')).toBeInTheDocument();
  });

  it('wraps children in label span when loading', () => {
    const { container } = render(<Button loading>Save</Button>);
    expect(container.querySelector('.mizu-button__label')).toHaveTextContent('Save');
  });

  it('does not fire onClick when loading', async () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} loading>
        Save
      </Button>,
    );
    await userEvent.setup().click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not show spinner when not loading', () => {
    const { container } = render(<Button>Go</Button>);
    expect(container.querySelector('.mizu-button__spinner')).toBeNull();
  });

  // -- Ref --
  it('forwards ref to the button element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Go</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  // -- asChild --
  it('renders as child element when asChild', () => {
    render(
      <Button asChild>
        <a href="/home">Home</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Home' });
    expect(link).toHaveClass('mizu-button');
    expect(link).not.toHaveAttribute('type');
  });

  // -- Spread props --
  it('passes id', () => {
    render(<Button id="x">Go</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('id', 'x');
  });

  it('passes aria-label', () => {
    render(
      <Button size="icon" aria-label="Close">
        ×
      </Button>,
    );
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('passes data-testid', () => {
    render(<Button data-testid="cta">Go</Button>);
    expect(screen.getByTestId('cta')).toBeInTheDocument();
  });

  // -- a11y --
  it('has no axe violations', async () => {
    const { container } = render(<Button>Accessible</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations with aria-label', async () => {
    const { container } = render(
      <Button size="icon" aria-label="Close">
        ×
      </Button>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations when loading', async () => {
    const { container } = render(<Button loading>Saving</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations when disabled', async () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  // -- Inverse --
  it('sets data-inverse when inverse is true', () => {
    render(<Button inverse>Go</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-inverse', 'true');
  });

  it('does not set data-inverse by default', () => {
    render(<Button>Go</Button>);
    expect(screen.getByRole('button')).not.toHaveAttribute('data-inverse');
  });

  // -- fullWidth --
  it('sets data-full-width when fullWidth is true', () => {
    render(<Button fullWidth>Go</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-full-width', 'true');
  });

  // -- Async onClick auto-loading --
  it('auto-enters loading state when onClick returns a Promise', async () => {
    let resolve: () => void = () => {};
    const onClick = vi.fn(
      () =>
        new Promise<void>((r) => {
          resolve = r;
        }),
    );
    render(<Button onClick={onClick}>Save</Button>);
    const btn = screen.getByRole('button');
    await userEvent.setup().click(btn);
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(btn).toHaveAttribute('data-loading', 'true');
    expect(btn).toBeDisabled();
    resolve();
    await vi.waitFor(() => {
      expect(btn).not.toHaveAttribute('aria-busy');
    });
    expect(btn).not.toHaveAttribute('data-loading');
    expect(btn).not.toBeDisabled();
  });

  it('clears auto-loading when onClick rejects', async () => {
    let reject: (err: Error) => void = () => {};
    const pending = new Promise<void>((_res, r) => {
      reject = r;
    });
    // Swallow the rejection at the test boundary so the consumer-side promise
    // (which is what Button listens to) doesn't trigger an unhandled-rejection
    // warning. Production callers own their own error handling.
    pending.catch(() => {});
    const onClick = vi.fn(() => pending);
    render(<Button onClick={onClick}>Save</Button>);
    const btn = screen.getByRole('button');
    await userEvent.setup().click(btn);
    expect(btn).toHaveAttribute('aria-busy', 'true');
    reject(new Error('oops'));
    await vi.waitFor(() => {
      expect(btn).not.toHaveAttribute('aria-busy');
    });
  });

  it('does not auto-load when onClick returns undefined', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    const btn = screen.getByRole('button');
    await userEvent.setup().click(btn);
    expect(btn).not.toHaveAttribute('aria-busy');
    expect(btn).not.toBeDisabled();
  });

  // -- Gradient variant --
  it('applies the gradient variant', () => {
    render(<Button variant="gradient">AI magic</Button>);
    expect(screen.getByRole('button')).toHaveClass('mizu-button--gradient');
  });

  it('has no axe violations with gradient variant', async () => {
    const { container } = render(<Button variant="gradient">Generate</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

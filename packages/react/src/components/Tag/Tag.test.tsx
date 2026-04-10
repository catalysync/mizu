import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Tag } from './Tag';

describe('Tag', () => {
  it('renders label text', () => {
    render(<Tag>React</Tag>);
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it.each(['neutral', 'success', 'warning', 'danger', 'info'] as const)(
    'applies the %s tone class',
    (tone) => {
      const { container } = render(<Tag tone={tone}>Label</Tag>);
      expect(container.firstChild).toHaveClass(`mizu-tag--${tone}`);
    },
  );

  it('renders dismiss button when onDismiss is provided', () => {
    render(<Tag onDismiss={() => {}}>Remove me</Tag>);
    expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();
  });

  it('calls onDismiss when dismiss button is clicked', async () => {
    const onDismiss = vi.fn();
    render(<Tag onDismiss={onDismiss}>Tag</Tag>);
    await userEvent.click(screen.getByRole('button', { name: /remove/i }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Tag onDismiss={() => {}}>Accessible</Tag>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

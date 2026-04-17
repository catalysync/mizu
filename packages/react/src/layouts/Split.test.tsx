import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Split } from './Split';

describe('Split', () => {
  it('renders children', () => {
    render(
      <Split>
        <p>Child</p>
      </Split>,
    );
    expect(screen.getByText('Child')).toBeInTheDocument();
  });

  it('applies the mizu-split class', () => {
    const { container } = render(<Split>X</Split>);
    expect(container.firstChild).toHaveClass('mizu-split');
  });

  it('sets data-component', () => {
    const { container } = render(<Split>X</Split>);
    expect(container.firstChild).toHaveAttribute('data-component', 'mizu-split');
  });

  it('merges custom className', () => {
    const { container } = render(<Split className="custom">X</Split>);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Split ref={ref}>X</Split>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('accepts gap prop', () => {
    const { container } = render(<Split gap="1rem">X</Split>);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders as specified element when as prop is set', () => {
    const { container } = render(<Split as="section">X</Split>);
    expect(container.firstChild?.nodeName).toBe('SECTION');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Split>
        <p>Content</p>
      </Split>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

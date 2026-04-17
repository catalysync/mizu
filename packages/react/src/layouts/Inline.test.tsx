import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Inline } from './Inline';

describe('Inline', () => {
  it('renders children', () => {
    render(
      <Inline>
        <p>Child</p>
      </Inline>,
    );
    expect(screen.getByText('Child')).toBeInTheDocument();
  });

  it('applies the mizu-inline class', () => {
    const { container } = render(<Inline>X</Inline>);
    expect(container.firstChild).toHaveClass('mizu-inline');
  });

  it('sets data-component', () => {
    const { container } = render(<Inline>X</Inline>);
    expect(container.firstChild).toHaveAttribute('data-component', 'mizu-inline');
  });

  it('merges custom className', () => {
    const { container } = render(<Inline className="custom">X</Inline>);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Inline ref={ref}>X</Inline>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('accepts gap prop', () => {
    const { container } = render(<Inline gap="1rem">X</Inline>);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders as specified element when as prop is set', () => {
    const { container } = render(<Inline as="nav">X</Inline>);
    expect(container.firstChild?.nodeName).toBe('NAV');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Inline>
        <p>Content</p>
      </Inline>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
